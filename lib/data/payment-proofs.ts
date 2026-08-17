import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PaymentProof } from "@/types/database";

/**
 * WALIMATUL — Payment Proofs Data Access Layer (Server-Only)
 *
 * Payment proofs are immutable after submission.
 * Clients can read their own proofs (via own order).
 * No client UPDATE or DELETE.
 *
 * Storage bucket: 'payment-proofs' (PRIVATE)
 * Path: {user_id}/{order_id}/{filename}
 *
 * IMPORTANT: Do not confuse with invitation gallery (bucket: invitation-gallery)
 * or with the invitation QR code. This is specifically for Touch 'n Go
 * payment evidence submitted during the manual payment verification workflow.
 */

/**
 * Fetch all payment proofs for a given order.
 * Verifies that the caller owns the parent order.
 */
export async function getPaymentProofsForOrder(
  orderId: string,
): Promise<PaymentProof[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return [];
  }
  const userId = claimsData.claims.sub;

  // 1. Verify caller owns the parent order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (orderError || !order) {
    return [];
  }

  // 2. Fetch proofs
  const { data, error } = await supabase
    .from("payment_proofs")
    .select("*")
    .eq("order_id", orderId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[WALIMATUL] getPaymentProofsForOrder error:", error.message);
    return [];
  }

  return (data as PaymentProof[]) ?? [];
}
