import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { checkPaymentEligibility, type PaymentEligibilityResult } from "@/lib/validation/payment";
import type { Invitation, Order, PaymentProof, Template } from "@/types/database";

export interface InvitationPaymentStateResult {
  invitation: Invitation;
  template: Template;
  order: Order | null;
  latestProof: PaymentProof | null;
  eligibility: PaymentEligibilityResult;
}

export interface BillingOrderItem extends Order {
  invitation: Pick<
    Invitation,
    "id" | "groom_name" | "groom_short_name" | "bride_name" | "bride_short_name" | "slug" | "status"
  >;
  template: Pick<Template, "id" | "name" | "slug">;
  latest_proof?: Pick<PaymentProof, "id" | "storage_path" | "transaction_reference" | "submitted_at"> | null;
}

/**
 * Fetch the payment state, template, and existing order/proof for a specific invitation.
 * Parallelized to avoid sequential waterfall round trips.
 */
export async function getOwnInvitationPaymentState(
  invitationId: string
): Promise<InvitationPaymentStateResult | null> {
  const authData = await getAuthenticatedUser();
  if (!authData?.userId) {
    return null;
  }
  const userId = authData.userId;

  const supabase = await createClient();

  // 1 & 2. Fetch invitation with template and existing active/latest order in parallel
  const [invRes, ordersRes] = await Promise.all([
    supabase
      .from("invitations")
      .select(`
        *,
        template:templates (*)
      `)
      .eq("id", invitationId)
      .eq("user_id", userId)
      .single(),
    supabase
      .from("orders")
      .select(`
        *,
        proofs:payment_proofs (*)
      `)
      .eq("invitation_id", invitationId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  if (invRes.error || !invRes.data) {
    return null;
  }
  const invitation = invRes.data;

  const templateRaw = Array.isArray(invitation.template)
    ? invitation.template[0]
    : invitation.template;

  if (!templateRaw) {
    return null;
  }

  const rawOrder = ordersRes.data && ordersRes.data.length > 0 ? ordersRes.data[0] : null;
  let order: Order | null = null;
  let latestProof: PaymentProof | null = null;

  if (rawOrder) {
    const { proofs, ...orderFields } = rawOrder as typeof rawOrder & { proofs?: PaymentProof[] };
    order = orderFields as Order;
    if (proofs && proofs.length > 0) {
      const sortedProofs = [...proofs].sort(
        (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      );
      latestProof = sortedProofs[0];
    }
  }

  const eligibility = checkPaymentEligibility(invitation);

  return {
    invitation,
    template: templateRaw,
    order,
    latestProof,
    eligibility,
  };
}

/**
 * Fetch all billing orders for the authenticated user.
 */
export async function getOwnBillingOrders(): Promise<BillingOrderItem[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return [];
  }
  const userId = claimsData.claims.sub;

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      invitation:invitations (
        id,
        groom_name,
        groom_short_name,
        bride_name,
        bride_short_name,
        slug,
        status
      ),
      template:templates (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError || !orders) {
    console.error("[WALIMATUL] getOwnBillingOrders error:", ordersError?.message);
    return [];
  }

  return orders.map((o) => {
    const inv = Array.isArray(o.invitation) ? o.invitation[0] : o.invitation;
    const tpl = Array.isArray(o.template) ? o.template[0] : o.template;
    return {
      ...o,
      invitation: inv,
      template: tpl,
    };
  });
}
