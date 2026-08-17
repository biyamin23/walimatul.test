"use client";

import React, { useState, useEffect, useTransition } from "react";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentQrCard } from "./PaymentQrCard";
import { PaymentProofUploader } from "./PaymentProofUploader";
import { PaymentStatusCard } from "./PaymentStatusCard";
import { createOrGetPaymentOrderAction } from "@/app/actions/payments";
import type { Invitation, Template, Order, PaymentProof } from "@/types/database";

export interface PaymentCheckoutClientProps {
  invitation: Invitation;
  template: Template;
  initialOrder: Order | null;
  initialProof: PaymentProof | null;
  userId: string;
}

export function PaymentCheckoutClient({
  invitation,
  template,
  initialOrder,
  initialProof,
  userId,
}: PaymentCheckoutClientProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [isRetryingRejected, setIsRetryingRejected] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [initError, setInitError] = useState<string | null>(null);

  // If no order exists yet, automatically create or resume order snapshot on mount
  useEffect(() => {
    if (!order && !isPending) {
      startTransition(async () => {
        const res = await createOrGetPaymentOrderAction(invitation.id);
        if (res.success && res.data?.orderId) {
          setOrder({
            id: res.data.orderId,
            user_id: userId,
            invitation_id: invitation.id,
            template_id: template.id,
            amount: template.price ?? 49.0,
            currency: "MYR",
            payment_method: "tng_ewallet_qr",
            payment_reference: null,
            payment_status: "pending_payment",
            validity_months: template.validity_months ?? 6,
            receipt_number: null,
            submitted_at: null,
            reviewed_at: null,
            reviewed_by: null,
            paid_at: null,
            rejection_reason: null,
            receipt_email_sent_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          setInitError(res.error || "Gagal memulakan pesanan bayaran.");
        }
      });
    }
  }, [invitation.id, order, isPending, template, userId]);

  function handleProofSubmitted(submittedData: {
    storagePath: string;
    transactionReference?: string | null;
  }) {
    setIsRetryingRejected(false);
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            payment_status: "pending_verification",
            submitted_at: new Date().toISOString(),
            payment_reference:
              submittedData.transactionReference || prev.payment_reference,
          }
        : null
    );
  }

  // If order is paid or pending verification, display the status card
  if (order && (order.payment_status === "pending_verification" || order.payment_status === "paid")) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <PaymentSummary invitation={invitation} template={template} />
        <PaymentStatusCard order={order} proof={initialProof} slug={invitation.slug} />
      </div>
    );
  }

  // If order is rejected and user has not clicked retry
  if (order && order.payment_status === "payment_rejected" && !isRetryingRejected) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <PaymentSummary invitation={invitation} template={template} />
        <PaymentStatusCard
          order={order}
          proof={initialProof}
          slug={invitation.slug}
          onRetry={() => setIsRetryingRejected(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {initError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui">
          {initError}
        </div>
      )}

      {/* 1. Order Details Summary */}
      <PaymentSummary invitation={invitation} template={template} />

      {/* 2. Touch 'n Go Payment QR Card */}
      <PaymentQrCard />

      {/* 3. Proof Uploader */}
      {order ? (
        <PaymentProofUploader
          orderId={order.id}
          userId={userId}
          onSuccess={handleProofSubmitted}
        />
      ) : (
        <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-ui text-[var(--text-muted)]">
            Memuatkan maklumat pesanan...
          </p>
        </div>
      )}
    </div>
  );
}
