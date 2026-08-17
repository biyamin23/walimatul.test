import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/permissions";
import { getOwnInvitationPaymentState } from "@/lib/data/payments";
import { PaymentCheckoutClient } from "@/components/payment/PaymentCheckoutClient";

export const metadata: Metadata = {
  title: "Pembayaran Jemputan — WALIMATUL",
  description: "Pembayaran Touch 'n Go eWallet untuk pengaktifan jemputan perkahwinan.",
};

interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvitationPaymentPage({
  params,
}: PaymentPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const data = await getOwnInvitationPaymentState(id);
  if (!data) {
    notFound();
  }

  const { invitation, template, order, latestProof, eligibility } = data;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* ── Top Navigation / Breadcrumb ── */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/invitations/${invitation.id}/edit`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-ui text-[var(--primary)] hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Editor Jemputan
        </Link>

        <Link
          href="/dashboard/billing"
          className="text-xs font-semibold font-ui text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
        >
          Sejarah Billing →
        </Link>
      </div>

      {/* ── Ineligible State Notice ── */}
      {!eligibility.eligible ? (
        <div className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-amber-200 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-[var(--text)]">
              Lengkapkan Butiran Majlis Terlebih Dahulu
            </h2>
            <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              Sebelum meneruskan pembayaran dan pengaktifan, sila pastikan ruangan wajib berikut telah diisi pada borang jemputan anda:
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 max-w-md mx-auto text-left">
            <ul className="text-xs font-ui text-amber-900 space-y-1.5 list-disc list-inside font-medium">
              {eligibility.missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href={`/dashboard/invitations/${invitation.id}/edit`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
            >
              Kembali &amp; Lengkapkan Butiran →
            </Link>
          </div>
        </div>
      ) : (
        /* ── Payment Flow ── */
        <PaymentCheckoutClient
          invitation={invitation}
          template={template}
          initialOrder={order}
          initialProof={latestProof}
          userId={user.userId}
        />
      )}
    </div>
  );
}
