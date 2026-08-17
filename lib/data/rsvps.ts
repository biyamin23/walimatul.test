import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Invitation, RSVP } from "@/types/database";

export interface RsvpSummaryMetrics {
  totalResponses: number;
  attendingCount: number;
  notAttendingCount: number;
  totalPax: number;
}

export interface OwnInvitationRsvpsResult {
  invitation: Pick<
    Invitation,
    | "id"
    | "groom_name"
    | "groom_short_name"
    | "bride_name"
    | "bride_short_name"
    | "wedding_date"
    | "status"
    | "slug"
    | "max_pax"
    | "rsvp_deadline"
    | "rsvp_enabled"
  >;
  rsvps: RSVP[];
  summary: RsvpSummaryMetrics;
}

/**
 * Fetch RSVPs for an invitation owned by the authenticated caller.
 *
 * Rules:
 * - Authenticated owner only (enforced by auth session & user_id filter).
 * - Returns detailed responses and aggregated summary metrics.
 * - Guest messages are kept private to the invitation owner.
 */
export async function getOwnInvitationRsvps(
  invitationId: string
): Promise<OwnInvitationRsvpsResult | null> {
  const supabase = await createClient();

  // 1. Get authenticated user ID from cryptographically verified claims
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }
  const userId = claimsData.claims.sub;

  // 2. Fetch invitation verifying owner
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select(
      "id, groom_name, groom_short_name, bride_name, bride_short_name, wedding_date, status, slug, max_pax, rsvp_deadline, rsvp_enabled"
    )
    .eq("id", invitationId)
    .eq("user_id", userId)
    .single();

  if (invError || !invitation) {
    return null;
  }

  // 3. Fetch RSVP responses
  const { data: rsvps, error: rsvpsError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("invitation_id", invitationId)
    .order("created_at", { ascending: false });

  if (rsvpsError) {
    console.error("[WALIMATUL] Error fetching RSVPs:", rsvpsError.message);
    return null;
  }

  const list = rsvps || [];

  // 4. Calculate summary metrics
  const totalResponses = list.length;
  let attendingCount = 0;
  let notAttendingCount = 0;
  let totalPax = 0;

  for (const r of list) {
    if (r.attendance === "attending") {
      attendingCount += 1;
      totalPax += r.pax || 0;
    } else {
      notAttendingCount += 1;
    }
  }

  return {
    invitation,
    rsvps: list,
    summary: {
      totalResponses,
      attendingCount,
      notAttendingCount,
      totalPax,
    },
  };
}
