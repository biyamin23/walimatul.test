import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AdminAuditAction } from "@/types/database";

export interface RecordAuditParams {
  adminId: string;
  action: AdminAuditAction | string;
  entityType: "settings" | "announcement" | "invitation" | "order" | "template" | string;
  entityId?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "jwt",
  "auth",
  "authorization",
  "access_token",
  "refresh_token",
  "service_role",
  "private_key",
  "api_key",
  "api_secret",
  "client_secret",
  "portal_key",
  "credit_card",
]);

/**
 * Recursively strip sensitive keys from any audit payload object.
 */
function sanitizeAuditPayload(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeAuditPayload);
  }

  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      clean[k] = "[REDACTED]";
    } else if (v && typeof v === "object") {
      clean[k] = sanitizeAuditPayload(v);
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

/**
 * Centralized server-side helper to record an append-only admin audit log.
 */
export async function recordAdminAudit({
  adminId,
  action,
  entityType,
  entityId = null,
  beforeData = null,
  afterData = null,
  metadata = null,
}: RecordAuditParams): Promise<boolean> {
  try {
    const supabase = await createClient();

    const cleanBefore = beforeData ? (sanitizeAuditPayload(beforeData) as Record<string, unknown>) : null;
    const cleanAfter = afterData ? (sanitizeAuditPayload(afterData) as Record<string, unknown>) : null;
    const cleanMeta = metadata ? (sanitizeAuditPayload(metadata) as Record<string, unknown>) : null;

    const { error } = await supabase.from("admin_audit_logs").insert({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      before_data: cleanBefore,
      after_data: cleanAfter,
      metadata: cleanMeta,
    });

    if (error) {
      console.error("[AdminAudit] Failed to persist audit log:", error.message);
      return false;
    }

    console.log(`[AdminAudit] ${action} on ${entityType}:${entityId || "global"} by ${adminId}`);
    return true;
  } catch (err) {
    console.error("[AdminAudit] Unexpected error recording audit:", err);
    return false;
  }
}
