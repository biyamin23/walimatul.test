"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  approvePaymentSchema,
  rejectPaymentSchema,
  type RejectPaymentInput,
} from "@/lib/validation/admin-payment";

export interface AdminPaymentActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Verify caller is an authenticated Admin.
 */
async function requireAdminAuth(): Promise<{ userId: string } | null> {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims?.sub) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return { userId };
}

/**
 * Admin action to atomically approve a payment order, publish invitation, and generate receipt.
 */
export async function approvePaymentAction(
  orderId: string
): Promise<AdminPaymentActionResponse<{ receiptNumber: string }>> {
  const parsed = approvePaymentSchema.safeParse({ orderId });
  if (!parsed.success) {
    return { success: false, error: "ID pesanan tidak sah." };
  }

  const admin = await requireAdminAuth();
  if (!admin) {
    return {
      success: false,
      error: "Akses dinafikan: Hanya pentadbir boleh mengesahkan pembayaran.",
    };
  }

  const supabase = await createClient();

  const { data: result, error: rpcError } = await supabase.rpc(
    "admin_approve_payment_order",
    {
      p_order_id: parsed.data.orderId,
    }
  );

  if (rpcError) {
    console.error("[WALIMATUL] admin_approve_payment_order error:", rpcError.message);
    return {
      success: false,
      error: rpcError.message || "Gagal mengesahkan pembayaran. Sila cuba lagi.",
    };
  }

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/payments/${orderId}`);
  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/invitations");

  return {
    success: true,
    data: { receiptNumber: result?.receipt_number },
  };
}

/**
 * Admin action to reject a payment order with reason.
 */
export async function rejectPaymentAction(
  rawInput: RejectPaymentInput
): Promise<AdminPaymentActionResponse> {
  const parsed = rejectPaymentSchema.safeParse(rawInput);
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
      error: "Sila lengkapkan maklumat penolakan.",
      fieldErrors,
    };
  }

  const admin = await requireAdminAuth();
  if (!admin) {
    return {
      success: false,
      error: "Akses dinafikan: Hanya pentadbir boleh menolak pembayaran.",
    };
  }

  const supabase = await createClient();

  const { error: rpcError } = await supabase.rpc(
    "admin_reject_payment_order",
    {
      p_order_id: parsed.data.orderId,
      p_reason: parsed.data.reason,
    }
  );

  if (rpcError) {
    console.error("[WALIMATUL] admin_reject_payment_order error:", rpcError.message);
    return {
      success: false,
      error: rpcError.message || "Gagal menolak pembayaran. Sila cuba lagi.",
    };
  }

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/payments/${parsed.data.orderId}`);
  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/invitations");

  return {
    success: true,
  };
}
