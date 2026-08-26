import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { parseReportRange } from "@/lib/data/admin-reports";
import { generateCsvString } from "@/lib/admin/csv";
import { recordAdminAudit } from "@/lib/admin/audit";

export async function GET(request: Request) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = parseReportRange(
    searchParams.get("range") || undefined,
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined
  );

  const supabase = await createClient();
  const startIso = range.startDate.toISOString();
  const endIso = range.endDate.toISOString();

  // Fetch client profiles joined within range (or all if range=all)
  let userQuery = supabase
    .from("profiles")
    .select("id, full_name, phone, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false })
    .limit(10000);

  if (range.preset !== "all") {
    userQuery = userQuery.gte("created_at", startIso).lte("created_at", endIso);
  }

  const { data: users, error: userError } = await userQuery;

  if (userError || !users) {
    return new NextResponse("Gagal memuat turun data pengguna", { status: 500 });
  }

  // Fetch lifetime aggregate counts for these users
  const userIds = users.map((u) => u.id);
  const [invRes, orderRes] = await Promise.all([
    userIds.length > 0
      ? supabase.from("invitations").select("id, user_id").in("user_id", userIds)
      : { data: [] },
    userIds.length > 0
      ? supabase.from("orders").select("id, user_id, amount, payment_status").in("user_id", userIds)
      : { data: [] },
  ]);

  const userInvCountMap: Record<string, number> = {};
  for (const inv of invRes.data || []) {
    userInvCountMap[inv.user_id] = (userInvCountMap[inv.user_id] || 0) + 1;
  }

  const userPaidOrdersMap: Record<string, { count: number; spend: number }> = {};
  for (const ord of orderRes.data || []) {
    if (ord.payment_status === "paid") {
      if (!userPaidOrdersMap[ord.user_id]) {
        userPaidOrdersMap[ord.user_id] = { count: 0, spend: 0 };
      }
      userPaidOrdersMap[ord.user_id].count += 1;
      userPaidOrdersMap[ord.user_id].spend += Number(ord.amount) || 0;
    }
  }

  const headers = [
    "client_id",
    "full_name",
    "phone",
    "joined_at",
    "invitation_count",
    "paid_order_count",
    "lifetime_spend",
  ];

  const rows = users.map((u) => [
    u.id,
    u.full_name || "",
    u.phone || "",
    u.created_at,
    userInvCountMap[u.id] || 0,
    userPaidOrdersMap[u.id]?.count || 0,
    (userPaidOrdersMap[u.id]?.spend || 0).toFixed(2),
  ]);

  const csv = generateCsvString(headers, rows);
  const filename = `walimatul-users-${range.fromStr}-to-${range.toStr}.csv`;

  // Record audit log
  await recordAdminAudit({
    adminId: admin.userId,
    action: "export.users",
    entityType: "report",
    entityId: "users",
    metadata: {
      range: range.preset,
      from: range.fromStr,
      to: range.toStr,
      rowCount: users.length,
    },
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
