import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AdminAuditLog } from "@/types/database";

export interface AdminAuditLogListItem extends AdminAuditLog {
  adminName: string;
}

export interface AdminAuditLogsPageResult {
  logs: AdminAuditLogListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch paginated audit log entries with filter support and batched admin profile resolution.
 */
export async function getAdminAuditLogsPage(params: {
  page?: number;
  pageSize?: number;
  action?: string;
  entityType?: string;
}): Promise<AdminAuditLogsPageResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 20, 100));
  const action = params.action || "all";
  const entityType = params.entityType || "all";

  let query = supabase
    .from("admin_audit_logs")
    .select("*", { count: "exact" });

  if (action && action !== "all") {
    query = query.eq("action", action);
  }

  if (entityType && entityType !== "all") {
    query = query.eq("entity_type", entityType);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: rawLogs, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !rawLogs) {
    console.error("[AdminAuditLogs] Query error:", error?.message);
    return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Batch resolve admin names
  const adminIds = [...new Set(rawLogs.map((l) => l.admin_id).filter(Boolean))];
  const profileMap = new Map<string, string>();
  if (adminIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", adminIds);

    for (const p of profiles || []) {
      if (p.full_name) profileMap.set(p.id, p.full_name);
    }
  }

  const logs: AdminAuditLogListItem[] = rawLogs.map((l) => ({
    ...l,
    adminName: profileMap.get(l.admin_id) || "Admin",
  }));

  return {
    logs,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}
