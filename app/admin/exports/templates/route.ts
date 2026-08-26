import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { parseReportRange, getAdminReportsData } from "@/lib/data/admin-reports";
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

  const reportData = await getAdminReportsData(
    searchParams.get("range") || undefined,
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined
  );

  const headers = [
    "template_id",
    "template_name",
    "status",
    "invitation_count",
    "paid_order_count",
    "revenue",
    "revenue_share",
  ];

  const rows = reportData.templatePerformance.map((tpl) => [
    tpl.id,
    tpl.name,
    tpl.status,
    tpl.invitationsCount,
    tpl.paidOrdersCount,
    tpl.revenue.toFixed(2),
    `${(tpl.revenueShare * 100).toFixed(1)}%`,
  ]);

  const csv = generateCsvString(headers, rows);
  const filename = `walimatul-template-performance-${range.fromStr}-to-${range.toStr}.csv`;

  await recordAdminAudit({
    adminId: admin.userId,
    action: "export.template_performance",
    entityType: "report",
    entityId: "template_performance",
    metadata: {
      range: range.preset,
      from: range.fromStr,
      to: range.toStr,
      rowCount: reportData.templatePerformance.length,
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
