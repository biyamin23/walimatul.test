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

  let invQuery = supabase
    .from("invitations")
    .select(
      "id, user_id, groom_name, bride_name, slug, wedding_date, status, published_at, expires_at, created_at, templates (name)"
    )
    .order("created_at", { ascending: false })
    .limit(10000);

  if (range.preset !== "all") {
    invQuery = invQuery.gte("created_at", startIso).lte("created_at", endIso);
  }

  const { data: invitations, error: invError } = await invQuery;

  if (invError || !invitations) {
    return new NextResponse("Gagal memuat turun data jemputan", { status: 500 });
  }

  const headers = [
    "invitation_id",
    "client_id",
    "groom_name",
    "bride_name",
    "slug",
    "template",
    "wedding_date",
    "status",
    "published_at",
    "expires_at",
    "created_at",
  ];

  const rows = invitations.map((inv) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tplName = (inv.templates as any)?.name || "Unknown";
    return [
      inv.id,
      inv.user_id,
      inv.groom_name || "",
      inv.bride_name || "",
      inv.slug || "",
      tplName,
      inv.wedding_date || "",
      inv.status,
      inv.published_at || "",
      inv.expires_at || "",
      inv.created_at,
    ];
  });

  const csv = generateCsvString(headers, rows);
  const filename = `walimatul-invitations-${range.fromStr}-to-${range.toStr}.csv`;

  await recordAdminAudit({
    adminId: admin.userId,
    action: "export.invitations",
    entityType: "report",
    entityId: "invitations",
    metadata: {
      range: range.preset,
      from: range.fromStr,
      to: range.toStr,
      rowCount: invitations.length,
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
