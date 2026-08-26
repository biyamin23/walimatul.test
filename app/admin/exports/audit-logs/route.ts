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

  let logQuery = supabase
    .from("admin_audit_logs")
    .select("id, admin_id, action, entity_type, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(10000);

  if (range.preset !== "all") {
    logQuery = logQuery.gte("created_at", startIso).lte("created_at", endIso);
  }

  const { data: logs, error: logError } = await logQuery;

  if (logError || !logs) {
    return new NextResponse("Gagal memuat turun data log audit", { status: 500 });
  }

  const headers = [
    "timestamp",
    "admin_id",
    "action",
    "entity_type",
    "entity_id",
  ];

  const rows = logs.map((log) => [
    log.created_at,
    log.admin_id,
    log.action,
    log.entity_type,
    log.entity_id || "",
  ]);

  const csv = generateCsvString(headers, rows);
  const filename = `walimatul-audit-logs-${range.fromStr}-to-${range.toStr}.csv`;

  await recordAdminAudit({
    adminId: admin.userId,
    action: "export.audit_logs",
    entityType: "report",
    entityId: "audit_logs",
    metadata: {
      range: range.preset,
      from: range.fromStr,
      to: range.toStr,
      rowCount: logs.length,
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
