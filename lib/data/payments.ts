import "server-only";

import { createClient } from "@/lib/supabase/server";
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
 */
export async function getOwnInvitationPaymentState(
  invitationId: string
): Promise<InvitationPaymentStateResult | null> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }
  const userId = claimsData.claims.sub;

  // 1. Fetch invitation with template
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select(`
      *,
      template:templates (*)
    `)
    .eq("id", invitationId)
    .eq("user_id", userId)
    .single();

  if (invError || !invitation) {
    return null;
  }

  const templateRaw = Array.isArray(invitation.template)
    ? invitation.template[0]
    : invitation.template;

  if (!templateRaw) {
    return null;
  }

  // 2. Fetch existing active or latest order
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("invitation_id", invitationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  const order = orders && orders.length > 0 ? orders[0] : null;

  // 3. Fetch latest proof if order exists
  let latestProof: PaymentProof | null = null;
  if (order) {
    const { data: proofs } = await supabase
      .from("payment_proofs")
      .select("*")
      .eq("order_id", order.id)
      .order("submitted_at", { ascending: false })
      .limit(1);

    if (proofs && proofs.length > 0) {
      latestProof = proofs[0];
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
