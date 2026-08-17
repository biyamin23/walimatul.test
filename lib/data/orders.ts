import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Order, OrderWithInvitation } from "@/types/database";

/**
 * WALIMATUL — Orders Data Access Layer (Server-Only)
 *
 * Clients can read their own orders. All admin mutations
 * (payment_status, reviewed_by, paid_at, etc.) are protected
 * by column-level REVOKE + trigger and must go through Admin server actions.
 *
 * Payment method: tng_ewallet_qr (Touch 'n Go eWallet QR — manual verification)
 */

/**
 * Fetch all orders for the currently authenticated user.
 * Ordered by created_at descending.
 */
export async function getOwnOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return [];
  }
  const userId = claimsData.claims.sub;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[WALIMATUL] getOwnOrders error:", error.message);
    return [];
  }

  return (data as Order[]) ?? [];
}

/**
 * Fetch a single order by ID, with linked invitation data.
 * Returns null if not found or not owned by the current user.
 */
export async function getOwnOrderById(
  id: string,
): Promise<OrderWithInvitation | null> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }
  const userId = claimsData.claims.sub;

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      invitation:invitations (id, slug, groom_name, bride_name, status)
    `)
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[WALIMATUL] getOwnOrderById error:", error.message);
    }
    return null;
  }

  return (data as OrderWithInvitation) ?? null;
}
