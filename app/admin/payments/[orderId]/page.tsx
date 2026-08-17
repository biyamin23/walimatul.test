import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminPaymentById } from "@/lib/data/admin-payments";
import { PaymentProofPreview } from "@/components/admin/payments/PaymentProofPreview";
import { PaymentReviewActions } from "@/components/admin/payments/PaymentReviewActions";

export const metadata: Metadata = {
  title: "Admin — Semakan Terperinci Pembayaran | WALIMATUL",
};

interface AdminPaymentReviewPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function AdminPaymentReviewPage({
  params,
}: AdminPaymentReviewPageProps) {
  await requireAdmin();
  const { orderId } = await params;

  const data = await getAdminPaymentById(orderId);
  if (!data) {
    notFound();
  }

  const { order, proofs } = data;
  const groom = order.invitation.groom_short_name || order.invitation.groom_name || "Pengantin Lelaki";
  const bride = order.invitation.bride_short_name || order.invitation.bride_name || "Pengantin Perempuan";

  function formatDateTime(dateStr: string | null) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-ui text-[var(--primary)] hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Senarai Pembayaran
        </Link>

        {order.invitation.slug && (
          <Link
            href={`/${order.invitation.slug}`}
            target="_blank"
            className="text-xs font-semibold font-ui text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            Pratonton Jemputan ↗
          </Link>
        )}
      </div>

      {/* ── Order Detail Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Order & Client Details + Decision Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Order Details Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Maklumat Majlis &amp; Klien
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                {groom} &amp; {bride}
              </h2>
              <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
                Klien: <strong>{order.client.full_name}</strong>
              </p>
            </div>

            <div className="divide-y divide-[var(--border-soft)] border-y border-[var(--border-soft)] py-1 font-ui text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--text-muted)]">ID Pesanan:</span>
                <span className="font-mono text-[11px] text-[var(--text-subtle)]">{order.id}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Templat:</span>
                <span className="font-semibold text-[var(--text)]">{order.template.name}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Tempoh Sah:</span>
                <span className="font-semibold text-[var(--text)]">{order.validity_months} bulan</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Kaedah Bayaran:</span>
                <span className="font-semibold text-[var(--primary)]">Touch ’n Go eWallet</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Tarikh Dihantar:</span>
                <span className="text-[var(--text-subtle)]">{formatDateTime(order.submitted_at || order.created_at)}</span>
              </div>
              {order.receipt_number && (
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">No. Resit:</span>
                  <span className="font-mono font-bold text-emerald-800">{order.receipt_number}</span>
                </div>
              )}
              {order.reviewer && (
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Disemak Oleh:</span>
                  <span className="font-semibold text-[var(--text)]">{order.reviewer.full_name}</span>
                </div>
              )}
              <div className="py-3 flex items-center justify-between text-sm">
                <span className="font-bold text-[var(--text)]">Jumlah Perlu Dibayar:</span>
                <span className="font-bold text-lg font-display text-[var(--primary)]">
                  RM {order.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Decision Actions Card */}
          <PaymentReviewActions order={order} />
        </div>

        {/* Right Column: Payment Proof Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <PaymentProofPreview
            proofs={proofs}
            paymentReference={order.payment_reference}
          />
        </div>
      </div>
    </div>
  );
}
