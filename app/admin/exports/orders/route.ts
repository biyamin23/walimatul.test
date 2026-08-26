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

  let orderQuery = supabase
    .from("orders")
    .select(
      "id, user_id, invitation_id, template_id, amount, validity_months, payment_status, receipt_number, created_at, paid_at, reviewed_at, templates (name)"
    )
    .order("created_at", { ascending: false })
    .limit(10000);

  if (range.preset !== "all") {
    orderQuery = orderQuery.gte("created_at", startIso).lte("created_at", endIso);
  }

  const { data: orders, error: orderError } = await orderQuery;

  if (orderError || !orders) {
    return new NextResponse("Gagal memuat turun data pesanan", { status: 500 });
  }

  const headers = [
    "order_id",
    "client_id",
    "invitation_id",
    "template",
    "amount",
    "validity_months",
    "payment_status",
    "receipt_number",
    "created_at",
    "paid_at",
    "reviewed_at",
  ];

  const rows = orders.map((ord) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tplName = (ord.templates as any)?.name || "Unknown";
    return [
      ord.id,
      ord.user_id,
      ord.invitation_id,
      tplName,
      Number(ord.amount || 0).toFixed(2),
      ord.validity_months || "",
      ord.payment_status,
      ord.receipt_number || "",
      ord.created_at,
      ord.paid_at || "",
      ord.reviewed_at || "",
    ];
  });

  const csv = generateCsvString(headers, rows);
  const filename = `walimatul-orders-${range.fromStr}-to-${range.toStr}.csv`;

  await recordAdminAudit({
    adminId: admin.userId,
    action: "export.orders",
    entityType: "report",
    entityId: "orders",
    metadata: {
      range: range.preset,
      from: range.fromStr,
      to: range.toStr,
      rowCount: orders.length,
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
