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

export interface ClientInvitationRsvpOverviewItem {
  id: string;
  groom_name: string | null;
  groom_short_name: string | null;
  bride_name: string | null;
  bride_short_name: string | null;
  wedding_date: string | null;
  status: string;
  slug: string | null;
  rsvp_enabled: boolean;
  rsvp_deadline: string | null;
  template_name?: string;
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

/**
 * Fetch overview of all invitations owned by the user with their respective RSVP metrics.
 */
export async function getClientGlobalRsvpOverview(): Promise<
  ClientInvitationRsvpOverviewItem[]
> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return [];
  }
  const userId = claimsData.claims.sub;

  // 1. Fetch all user invitations
  const { data: invitations, error: invError } = await supabase
    .from("invitations")
    .select(`
      id,
      groom_name,
      groom_short_name,
      bride_name,
      bride_short_name,
      wedding_date,
      status,
      slug,
      rsvp_enabled,
      rsvp_deadline,
      template:templates(name)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (invError || !invitations || invitations.length === 0) {
    return [];
  }

  const invitationIds = invitations.map((inv) => inv.id);

  // 2. Fetch all RSVPs for these invitations
  const { data: allRsvps, error: rsvpsError } = await supabase
    .from("rsvps")
    .select("invitation_id, attendance, pax")
    .in("invitation_id", invitationIds);

  const rsvpMap: Record<string, RsvpSummaryMetrics> = {};
  for (const id of invitationIds) {
    rsvpMap[id] = {
      totalResponses: 0,
      attendingCount: 0,
      notAttendingCount: 0,
      totalPax: 0,
    };
  }

  if (!rsvpsError && allRsvps) {
    for (const r of allRsvps) {
      if (rsvpMap[r.invitation_id]) {
        rsvpMap[r.invitation_id].totalResponses += 1;
        if (r.attendance === "attending") {
          rsvpMap[r.invitation_id].attendingCount += 1;
          rsvpMap[r.invitation_id].totalPax += r.pax || 0;
        } else {
          rsvpMap[r.invitation_id].notAttendingCount += 1;
        }
      }
    }
  }

  return invitations.map((inv) => {
    const templateRaw = Array.isArray(inv.template)
      ? inv.template[0]
      : inv.template;
    return {
      id: inv.id,
      groom_name: inv.groom_name,
      groom_short_name: inv.groom_short_name,
      bride_name: inv.bride_name,
      bride_short_name: inv.bride_short_name,
      wedding_date: inv.wedding_date,
      status: inv.status,
      slug: inv.slug,
      rsvp_enabled: inv.rsvp_enabled,
      rsvp_deadline: inv.rsvp_deadline,
      template_name: templateRaw?.name || "Blush Garden",
      summary: rsvpMap[inv.id],
    };
  });
}
