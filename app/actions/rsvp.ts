"use server";

import { createClient } from "@/lib/supabase/server";
import { guestRsvpSchema, type GuestRsvpInput } from "@/lib/validation/rsvp";

export interface RsvpActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Submit Guest RSVP Action
 *
 * Rules:
 * - Unauthenticated guest safe.
 * - Server validates schema and parent invitation constraints.
 * - Disallows expired, draft, or past-deadline submissions.
 */
export async function submitGuestRsvpAction(
  rawInput: GuestRsvpInput
): Promise<RsvpActionResult> {
  const parsed = guestRsvpSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      if (errors && errors.length > 0) {
        fieldErrors[field] = errors;
      }
    }
    return {
      success: false,
      error: "Maklumat yang dimasukkan tidak lengkap atau tidak sah.",
      fieldErrors,
    };
  }

  const { invitationId, guestName, attendance, pax, message } = parsed.data;
  const supabase = await createClient();

  // Call the secure RPC function
  const { error } = await supabase.rpc("submit_rsvp", {
    p_invitation_id: invitationId,
    p_guest_name: guestName,
    p_attendance: attendance,
    p_pax: pax,
    p_message: message || null,
  });

  if (error) {
    console.error("[WALIMATUL] submit_rsvp error:", error.message);
    return {
      success: false,
      error: error.message || "Maklum balas tidak dapat dihantar. Sila cuba lagi.",
    };
  }

  return {
    success: true,
    message: "Terima kasih! Maklum balas kehadiran anda telah berjaya direkodkan.",
  };
}
