import React from "react";
import type { Invitation, Template } from "@/types/database";
import { PAYMENT_CONFIG } from "@/lib/constants/payment";

export interface PaymentSummaryProps {
  invitation: Invitation;
  template: Template;
}

export function PaymentSummary({ invitation, template }: PaymentSummaryProps) {
  const groom = invitation.groom_short_name || invitation.groom_name || "Pengantin Lelaki";
  const bride = invitation.bride_short_name || invitation.bride_name || "Pengantin Perempuan";
  const amountFormatted = `RM ${(template.price ?? PAYMENT_CONFIG.amount).toFixed(2)}`;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
          Ringkasan Pesanan
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
          {groom} &amp; {bride}
        </h2>
        <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
          Pautan: walimatul.my/{invitation.slug || "—"}
        </p>
      </div>

      <div className="divide-y divide-[var(--border-soft)] border-y border-[var(--border-soft)] py-1 font-ui text-sm">
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-[var(--text-muted)]">Templat Jemputan</span>
          <span className="font-semibold text-[var(--text)]">{template.name}</span>
        </div>
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-[var(--text-muted)]">Tempoh Sah Laman</span>
          <span className="font-semibold text-[var(--text)]">{PAYMENT_CONFIG.validityLabel}</span>
        </div>
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-[var(--text-muted)]">Kaedah Pembayaran</span>
          <span className="font-semibold text-[var(--primary)]">{PAYMENT_CONFIG.methodLabel}</span>
        </div>
        <div className="py-3 flex items-center justify-between text-base">
          <span className="font-bold text-[var(--text)]">Jumlah Bayaran</span>
          <span className="font-bold text-xl font-display text-[var(--primary)]">
            {amountFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
