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

const STATIC_FALLBACK_TEMPLATES: Record<string, Template> = {
  "toile-royale": {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Toile Royale",
    slug: "toile-royale",
    description:
      "A vintage French Toile de Jouy wedding invitation featuring engraved burgundy botanicals, antique parchment, a Rococo cartouche frame, and double-sided ceremony stationery.",
    category: "Classic",
    component_key: "toile-royale",
    thumbnail_url: null,
    preview_url: null,
    price: 49,
    validity_months: 6,
    is_active: true,
    is_featured: true,
    sort_order: 3,
    status: "active",
    created_at: "2026-10-04T00:00:00Z",
    updated_at: "2026-10-04T00:00:00Z",
    design_config: {},
  },
};

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

  const templates: Template[] = (data as Template[]) ?? [];

  if (error) {
    console.error("[WALIMATUL] getActiveTemplates error:", error.message);
  }

  // Ensure coded templates exist even before DB migration is run
  for (const [slug, fallback] of Object.entries(STATIC_FALLBACK_TEMPLATES)) {
    if (!templates.some((t) => t.slug === slug)) {
      templates.push(fallback);
    }
  }

  return templates.sort((a, b) => a.sort_order - b.sort_order);
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
    return STATIC_FALLBACK_TEMPLATES[slug] ?? null;
  }

  return (data as Template) ?? STATIC_FALLBACK_TEMPLATES[slug] ?? null;
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
