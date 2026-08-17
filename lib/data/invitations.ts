import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Invitation, InvitationWithTemplate } from "@/types/database";

/**
 * WALIMATUL — Invitation Data Access Layer (Server-Only)
 *
 * All queries enforce ownership via RLS (user_id = auth.uid()).
 * Do not pass user_id explicitly — it is derived from the session.
 */

/**
 * Fetch all invitations belonging to the currently authenticated user.
 * Ordered by created_at descending (newest first).
 */
export async function getOwnInvitations(): Promise<Invitation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[WALIMATUL] getOwnInvitations error:", error.message);
    return [];
  }

  return (data as Invitation[]) ?? [];
}

/**
 * Fetch a single invitation by ID, with its template details joined.
 * Returns null if not found or not owned by the current user (RLS enforces ownership).
 */
export async function getOwnInvitationById(
  id: string,
): Promise<InvitationWithTemplate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select(`
      *,
      template:templates (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[WALIMATUL] getOwnInvitationById error:", error.message);
    }
    return null;
  }

  return (data as InvitationWithTemplate) ?? null;
}

/**
 * Create a new draft invitation for the currently authenticated user.
 *
 * Minimal creation: only user_id + template_id are required.
 * All wedding content is filled in via the editor (Phase 5).
 *
 * Returns the created invitation or null on error.
 */
export async function createDraftInvitation(
  templateId: string,
): Promise<Invitation | null> {
  const supabase = await createClient();

  // Verify the user is authenticated
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[WALIMATUL] createDraftInvitation: unauthenticated");
    return null;
  }

  const userId = claimsData.claims.sub;

  // Verify the template is active before creating a draft
  const { data: templateData, error: templateError } = await supabase
    .from("templates")
    .select("id")
    .eq("id", templateId)
    .eq("is_active", true)
    .single();

  if (templateError || !templateData) {
    console.error(
      "[WALIMATUL] createDraftInvitation: template not found or inactive",
      templateId,
    );
    return null;
  }

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      user_id: userId,
      template_id: templateId,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    console.error("[WALIMATUL] createDraftInvitation error:", error.message);
    return null;
  }

  return (data as Invitation) ?? null;
}
