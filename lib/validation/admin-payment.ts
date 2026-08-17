import { z } from "zod";

export const approvePaymentSchema = z.object({
  orderId: z.string().uuid({ message: "ID pesanan tidak sah." }),
});

export const rejectPaymentSchema = z.object({
  orderId: z.string().uuid({ message: "ID pesanan tidak sah." }),
  reason: z
    .string()
    .trim()
    .min(5, { message: "Sebab penolakan mestilah sekurang-kurangnya 5 aksara." })
    .max(500, { message: "Sebab penolakan tidak boleh melebihi 500 aksara." }),
});

export type ApprovePaymentInput = z.infer<typeof approvePaymentSchema>;
export type RejectPaymentInput = z.infer<typeof rejectPaymentSchema>;
