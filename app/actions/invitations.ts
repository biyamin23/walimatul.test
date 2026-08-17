"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateInvitationSchema, slugSchema } from "@/lib/validation/invitation";
import { isTemplateComponentAvailable } from "@/templates/registry";
import { isReservedSlug } from "@/lib/constants/reserved-slugs";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Helper to get the authenticated user's ID securely via cryptographically verified claims.
 */
async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    return null;
  }
  return data.claims.sub;
}

/**
 * Create a new draft invitation by template slug.
 *
 * Rules:
 * - Authenticated client only (derived from session).
 * - Template must be active in DB and registered in component registry.
 * - Created with status = 'draft'.
 */
export async function createDraftInvitationAction(
  templateSlug: string = "blush-garden"
): Promise<ActionResponse<{ invitationId: string }>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to create an invitation draft.",
    };
  }

  const supabase = await createClient();

  // 1. Fetch template from DB
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("id, slug, component_key, is_active")
    .eq("slug", templateSlug)
    .eq("is_active", true)
    .single();

  if (templateError || !template) {
    return {
      success: false,
      error: "Selected template is not available or inactive.",
    };
  }

  // 2. Verify component is registered in code
  if (!isTemplateComponentAvailable(template.component_key)) {
    return {
      success: false,
      error: "Template renderer is not currently available.",
    };
  }

  // 3. Create the draft invitation
  const { data: invitation, error: insertError } = await supabase
    .from("invitations")
    .insert({
      user_id: userId,
      template_id: template.id,
      status: "draft",
      rsvp_enabled: true,
      max_pax: 5,
      allow_guest_message: true,
      music_enabled: false,
    })
    .select("id")
    .single();

  if (insertError || !invitation) {
    console.error("[WALIMATUL] createDraftInvitation error:", insertError?.message);
    return {
      success: false,
      error: "Could not create invitation draft. Please try again.",
    };
  }

  revalidatePath("/dashboard/invitations");
  return {
    success: true,
    data: { invitationId: invitation.id },
  };
}

/**
 * Server Action to create draft and directly redirect (for form actions)
 */
export async function createDraftAndRedirect(templateSlug: string = "blush-garden") {
  const result = await createDraftInvitationAction(templateSlug);
  if (result.success && result.data?.invitationId) {
    redirect(`/dashboard/invitations/${result.data.invitationId}/edit`);
  }
  return result;
}

/**
 * Update an existing invitation draft owned by the authenticated user.
 *
 * Rules:
 * - Only owner can update (user_id = auth.uid()).
 * - Validated with Zod.
 * - Whitelists editable fields only.
 * - Never allows mutating user_id, status, published_at, expires_at, or payment columns.
 */
export async function updateOwnInvitationAction(
  invitationId: string,
  rawValues: unknown
): Promise<ActionResponse<{ updatedAt: string }>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to save changes.",
    };
  }

  // 1. Zod Validation
  const validation = updateInvitationSchema.safeParse(rawValues);
  if (!validation.success) {
    return {
      success: false,
      error: "Please correct the highlighted errors in the form.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const values = validation.data;
  const supabase = await createClient();

  // 2. If slug is present, check uniqueness against other invitations
  if (values.slug) {
    if (isReservedSlug(values.slug)) {
      return {
        success: false,
        error: "The chosen invitation URL is reserved. Please pick another URL.",
        fieldErrors: { slug: ["This URL is reserved"] },
      };
    }

    const { data: existingSlug } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", values.slug)
      .neq("id", invitationId)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "This invitation URL is already in use by another invitation.",
        fieldErrors: { slug: ["This URL is already taken"] },
      };
    }
  }

  // 3. Prepare strictly whitelisted DB update payload
  const updatePayload = {
    slug: values.slug || null,
    groom_name: values.groomName || null,
    groom_short_name: values.groomShortName || null,
    bride_name: values.brideName || null,
    bride_short_name: values.brideShortName || null,
    wedding_date: values.weddingDate || null,
    start_time: values.startTime || null,
    end_time: values.endTime || null,
    venue_name: values.venueName || null,
    venue_address: values.venueAddress || null,
    google_maps_url: values.googleMapsUrl || null,
    waze_url: values.wazeUrl || null,
    opening_message: values.openingMessage || null,
    invitation_message: values.invitationMessage || null,
    closing_message: values.closingMessage || null,
    rsvp_enabled: values.rsvpEnabled,
    rsvp_deadline: values.rsvpDeadline || null,
    max_pax: values.maxPax,
    allow_guest_message: values.allowGuestMessage,
  };

  // 4. Update row where ID matches and user is the owner
  const { data: updated, error: updateError } = await supabase
    .from("invitations")
    .update(updatePayload)
    .eq("id", invitationId)
    .eq("user_id", userId)
    .select("updated_at")
    .single();

  if (updateError || !updated) {
    console.error("[WALIMATUL] updateOwnInvitation error:", updateError?.message);
    return {
      success: false,
      error: "Could not save changes. Please try again.",
    };
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/edit`);
  revalidatePath("/dashboard/invitations");

  return {
    success: true,
    data: { updatedAt: updated.updated_at },
  };
}

/**
 * Check if a candidate slug is available.
 */
export async function checkSlugAvailabilityAction(
  slug: string,
  currentInvitationId?: string
): Promise<{ available: boolean; error?: string }> {
  const normalized = slug.trim().toLowerCase();

  // Validate format
  const parseResult = slugSchema.safeParse(normalized);
  if (!parseResult.success) {
    return {
      available: false,
      error: parseResult.error.issues[0]?.message || "Invalid URL format",
    };
  }

  // Check reserved list
  if (isReservedSlug(normalized)) {
    return {
      available: false,
      error: "This URL is reserved by the system",
    };
  }

  const supabase = await createClient();

  let query = supabase.from("invitations").select("id").eq("slug", normalized);

  if (currentInvitationId) {
    query = query.neq("id", currentInvitationId);
  }

  const { data: existing, error } = await query.maybeSingle();

  if (error) {
    console.error("[WALIMATUL] checkSlugAvailability error:", error.message);
    return { available: false, error: "Could not verify URL availability" };
  }

  if (existing) {
    return {
      available: false,
      error: "This invitation URL is already taken",
    };
  }

  return { available: true };
}

/**
 * Delete a draft invitation owned by the authenticated user.
 */
export async function deleteOwnDraftAction(
  invitationId: string
): Promise<ActionResponse> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", invitationId)
    .eq("user_id", userId)
    .eq("status", "draft");

  if (error) {
    console.error("[WALIMATUL] deleteOwnDraft error:", error.message);
    return { success: false, error: "Could not delete draft invitation." };
  }

  revalidatePath("/dashboard/invitations");
  return { success: true };
}
