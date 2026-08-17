"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createPaymentOrderSchema,
  submitPaymentProofSchema,
  checkPaymentEligibility,
  type SubmitPaymentProofInput,
} from "@/lib/validation/payment";
import { PAYMENT_CONFIG } from "@/lib/constants/payment";

export interface PaymentActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Helper to get the authenticated user ID.
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
 * Create or resume an unpaid payment order for an invitation.
 *
 * Rules:
 * - Authenticated owner only.
 * - Invitation must satisfy minimum required details.
 * - Amount and validity are snapshotted from server/database configuration.
 * - Reuses existing pending order to avoid duplicates.
 */
export async function createOrGetPaymentOrderAction(
  invitationId: string
): Promise<PaymentActionResponse<{ orderId: string }>> {
  const parsed = createPaymentOrderSchema.safeParse({ invitationId });
  if (!parsed.success) {
    return { success: false, error: "ID jemputan tidak sah." };
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk untuk membuat pembayaran." };
  }

  const supabase = await createClient();

  // 1. Fetch invitation
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
    return { success: false, error: "Jemputan tidak dijumpai." };
  }

  // 2. Eligibility check
  const eligibility = checkPaymentEligibility(invitation);
  if (!eligibility.eligible) {
    return {
      success: false,
      error: `Sila lengkapkan maklumat berikut sebelum pembayaran: ${eligibility.missingFields.join(", ")}.`,
    };
  }

  const templateRaw = Array.isArray(invitation.template)
    ? invitation.template[0]
    : invitation.template;

  if (!templateRaw || !templateRaw.is_active) {
    return { success: false, error: "Templat jemputan tidak aktif atau tidak sah." };
  }

  // 3. Check for existing active unpaid order
  const { data: existingOrders } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("invitation_id", invitationId)
    .eq("user_id", userId)
    .in("payment_status", ["pending_payment", "pending_verification"])
    .order("created_at", { ascending: false })
    .limit(1);

  if (existingOrders && existingOrders.length > 0) {
    return {
      success: true,
      data: { orderId: existingOrders[0].id },
    };
  }

  // 4. Create new order snapshot
  const amount = templateRaw.price ?? PAYMENT_CONFIG.amount;
  const validityMonths = templateRaw.validity_months ?? PAYMENT_CONFIG.validityMonths;

  const { data: newOrder, error: insertError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      invitation_id: invitationId,
      template_id: templateRaw.id,
      amount,
      currency: PAYMENT_CONFIG.currency,
      payment_method: PAYMENT_CONFIG.method,
      validity_months: validityMonths,
      payment_status: "pending_payment",
    })
    .select("id")
    .single();

  if (insertError || !newOrder) {
    console.error("[WALIMATUL] Error creating order:", insertError?.message);
    return {
      success: false,
      error: "Gagal memulakan pesanan pembayaran. Sila cuba lagi.",
    };
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/payment`);
  revalidatePath("/dashboard/billing");

  return {
    success: true,
    data: { orderId: newOrder.id },
  };
}

/**
 * Submit payment proof for verification.
 *
 * Rules:
 * - Uses secure submit_payment_proof RPC function.
 * - Transitions order to 'pending_verification'.
 * - Client cannot forge 'paid' status.
 */
export async function submitPaymentProofAction(
  rawInput: SubmitPaymentProofInput
): Promise<PaymentActionResponse<{ proofId: string }>> {
  const parsed = submitPaymentProofSchema.safeParse(rawInput);
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
      error: "Maklumat bukti pembayaran tidak lengkap atau tidak sah.",
      fieldErrors,
    };
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk untuk menghantar bukti pembayaran." };
  }

  const supabase = await createClient();

  const { data: proofId, error: rpcError } = await supabase.rpc(
    "submit_payment_proof",
    {
      p_order_id: parsed.data.orderId,
      p_storage_path: parsed.data.storagePath,
      p_transaction_reference: parsed.data.transactionReference || null,
    }
  );

  if (rpcError) {
    console.error("[WALIMATUL] submit_payment_proof RPC error:", rpcError.message);
    return {
      success: false,
      error: rpcError.message || "Gagal menghantar bukti pembayaran. Sila cuba lagi.",
    };
  }

  // Revalidate paths for immediate consistency
  const { data: orderData } = await supabase
    .from("orders")
    .select("invitation_id")
    .eq("id", parsed.data.orderId)
    .single();

  if (orderData?.invitation_id) {
    revalidatePath(`/dashboard/invitations/${orderData.invitation_id}/payment`);
  }
  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/invitations");

  return {
    success: true,
    data: { proofId: proofId as string },
  };
}
