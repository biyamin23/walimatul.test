"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    return null;
  }
  return data.claims.sub;
}

/**
 * Toggle whether a guest's RSVP message is displayed publicly on the invitation.
 *
 * Privacy & Security:
 * - Strictly restricted to the owner of the parent invitation.
 * - RSVP must have a non-empty message.
 */
export async function toggleRsvpWishPublicAction(
  invitationId: string,
  rsvpId: string,
  showOnInvitation: boolean
): Promise<ActionResponse<{ showOnInvitation: boolean }>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk." };
  }

  const supabase = await createClient();

  // 1. Verify caller owns the parent invitation
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", invitationId)
    .eq("user_id", userId)
    .single();

  if (invError || !invitation) {
    return { success: false, error: "Jemputan tidak dijumpai atau tiada akses." };
  }

  // 2. Update show_on_invitation on the target RSVP row
  const { data: updated, error: updateError } = await supabase
    .from("rsvps")
    .update({ show_on_invitation: showOnInvitation })
    .eq("id", rsvpId)
    .eq("invitation_id", invitationId)
    .select("id, show_on_invitation")
    .single();

  if (updateError || !updated) {
    console.error("[WALIMATUL] toggleRsvpWishPublicAction error:", updateError?.message);
    return { success: false, error: "Gagal mengemaskini status ucapan tetamu." };
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/rsvp`);
  return {
    success: true,
    data: { showOnInvitation: updated.show_on_invitation },
  };
}
