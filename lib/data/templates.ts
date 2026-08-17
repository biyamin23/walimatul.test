import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Template } from "@/types/database";

/**
 * WALIMATUL — Template Data Access Layer (Server-Only)
 *
 * Provides server-side access to template metadata.
 * Uses the authenticated (or anonymous) Supabase client.
 * RLS enforces: only active templates are readable by anyone.
 *
 * Template availability requires BOTH:
 *   1. DB: is_active = true
 *   2. Code: component_key exists in templates/registry.ts
 */

/**
 * Fetch all active templates, ordered by sort_order.
 * Used on the /templates page.
 */
export async function getActiveTemplates(): Promise<Template[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[WALIMATUL] getActiveTemplates error:", error.message);
    return [];
  }

  return (data as Template[]) ?? [];
}

/**
 * Fetch a single active template by its slug.
 * Returns null if not found or not active.
 */
export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116 = no rows found — not an error
      console.error("[WALIMATUL] getTemplateBySlug error:", error.message);
    }
    return null;
  }

  return (data as Template) ?? null;
}

/**
 * Fetch a template by ID (for order creation, admin use).
 * Returns null if not found regardless of is_active status.
 * This allows referencing archived templates in historical orders.
 */
export async function getTemplateById(id: string): Promise<Template | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[WALIMATUL] getTemplateById error:", error.message);
    }
    return null;
  }

  return (data as Template) ?? null;
}
