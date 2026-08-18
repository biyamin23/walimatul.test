import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Template } from "@/types/database";

export interface AdminTemplateListItem extends Template {
  usedByCount: number;
  orderCount: number;
}

export interface AdminTemplateDetail extends Template {
  usedByCount: number;
  orderCount: number;
  canDelete: boolean;
}

/**
 * Fetch all templates for the Admin management view with usage counts.
 */
export async function getAdminTemplatesList(): Promise<AdminTemplateListItem[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return [];
  }

  // 1. Fetch all templates
  const { data: templates, error: tplError } = await supabase
    .from("templates")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (tplError || !templates) {
    console.error("[WALIMATUL] getAdminTemplatesList error:", tplError?.message);
    return [];
  }

  // 2. Fetch usage counts across invitations
  const { data: invRows } = await supabase
    .from("invitations")
    .select("template_id");

  const invCountMap = new Map<string, number>();
  if (invRows) {
    for (const row of invRows) {
      if (row.template_id) {
        invCountMap.set(
          row.template_id,
          (invCountMap.get(row.template_id) || 0) + 1
        );
      }
    }
  }

  // 3. Fetch usage counts across orders
  const { data: orderRows } = await supabase
    .from("orders")
    .select("template_id");

  const orderCountMap = new Map<string, number>();
  if (orderRows) {
    for (const row of orderRows) {
      if (row.template_id) {
        orderCountMap.set(
          row.template_id,
          (orderCountMap.get(row.template_id) || 0) + 1
        );
      }
    }
  }

  return templates.map((t) => ({
    ...t,
    status: (t.status || (t.is_active ? "active" : "draft")) as Template["status"],
    usedByCount: invCountMap.get(t.id) || 0,
    orderCount: orderCountMap.get(t.id) || 0,
  }));
}

/**
 * Fetch detailed template info by ID with safe delete check.
 */
export async function getAdminTemplateById(
  id: string
): Promise<AdminTemplateDetail | null> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }

  const { data: template, error: tplError } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  if (tplError || !template) {
    console.error("[WALIMATUL] getAdminTemplateById error:", tplError?.message);
    return null;
  }

  // Check invitation references
  const { count: invCount } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true })
    .eq("template_id", id);

  // Check order references
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("template_id", id);

  const usedByCount = invCount || 0;
  const totalOrders = orderCount || 0;
  const status = (template.status || (template.is_active ? "active" : "draft")) as Template["status"];

  return {
    ...template,
    status,
    usedByCount,
    orderCount: totalOrders,
    canDelete: usedByCount === 0 && totalOrders === 0,
  };
}
