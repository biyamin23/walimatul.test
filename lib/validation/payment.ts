import { z } from "zod";
import type { Invitation } from "@/types/database";

export const createPaymentOrderSchema = z.object({
  invitationId: z.string().uuid({ message: "ID jemputan tidak sah." }),
});

export const submitPaymentProofSchema = z.object({
  orderId: z.string().uuid({ message: "ID pesanan tidak sah." }),
  storagePath: z
    .string()
    .trim()
    .min(1, { message: "Sila muat naik bukti pembayaran." })
    .max(500, { message: "Lokasi fail tidak sah." }),
  transactionReference: z
    .string()
    .trim()
    .max(100, { message: "Nombor rujukan transaksi tidak boleh melebihi 100 aksara." })
    .optional()
    .nullable(),
});

export type SubmitPaymentProofInput = z.infer<typeof submitPaymentProofSchema>;

export interface PaymentEligibilityResult {
  eligible: boolean;
  missingFields: string[];
}

/**
 * Check if an invitation has all required fields completed to proceed to payment.
 */
export function checkPaymentEligibility(
  invitation: Pick<
    Invitation,
    "groom_name" | "bride_name" | "wedding_date" | "venue_name" | "slug" | "status"
  >
): PaymentEligibilityResult {
  const missing: string[] = [];

  if (!invitation.groom_name?.trim()) {
    missing.push("Nama Pengantin Lelaki");
  }
  if (!invitation.bride_name?.trim()) {
    missing.push("Nama Pengantin Perempuan");
  }
  if (!invitation.wedding_date?.trim()) {
    missing.push("Tarikh Majlis");
  }
  if (!invitation.venue_name?.trim()) {
    missing.push("Nama Tempat / Lokasi Majlis");
  }
  if (!invitation.slug?.trim()) {
    missing.push("Pautan Jemputan Unik (URL)");
  }

  return {
    eligible: missing.length === 0,
    missingFields: missing,
  };
}
