"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { approvePaymentAction, rejectPaymentAction } from "@/app/actions/admin-payments";
import type { AdminPaymentDetail } from "@/lib/data/admin-payments";

export interface PaymentReviewActionsProps {
  order: AdminPaymentDetail;
}

const QUICK_REJECTION_REASONS = [
  "Tangkap layar / resit transaksi tidak jelas atau tidak lengkap.",
  "Jumlah bayaran tidak sepadan dengan harga pesanan (RM49.00).",
  "Tidak dapat memadankan nombor rujukan transaksi Touch 'n Go.",
  "Resit transaksi telah digunakan untuk pesanan lain.",
];

export function PaymentReviewActions({ order }: PaymentReviewActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    receiptNumber?: string;
    publishedSlug?: string;
  } | null>(null);

  function handleApprove() {
    setActionError(null);
    startTransition(async () => {
      const res = await approvePaymentAction(order.id);
      if (res.success) {
        setShowApproveConfirm(false);
        setSuccessInfo({
          receiptNumber: res.data?.receiptNumber,
          publishedSlug: order.invitation.slug || undefined,
        });
        router.refresh();
      } else {
        setActionError(res.error || "Gagal mengesahkan pembayaran.");
      }
    });
  }

  function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectionReason.trim() || rejectionReason.trim().length < 5) {
      setActionError("Sila nyatakan sebab penolakan (minimum 5 aksara).");
      return;
    }

    setActionError(null);
    startTransition(async () => {
      const res = await rejectPaymentAction({
        orderId: order.id,
        reason: rejectionReason.trim(),
      });
      if (res.success) {
        setShowRejectModal(false);
        router.refresh();
      } else {
        setActionError(res.error || "Gagal menolak pembayaran.");
      }
    });
  }

  // If already paid
  if (order.payment_status === "paid" || successInfo) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-emerald-950">
              Pembayaran Telah Disahkan &amp; Diterbitkan
            </h3>
            <p className="text-xs font-ui text-emerald-700">
              No. Resit: <strong className="font-mono">{order.receipt_number || successInfo?.receiptNumber}</strong>
            </p>
          </div>
        </div>

        {order.invitation.slug && (
          <div className="pt-2">
            <Link
              href={`/${order.invitation.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-semibold font-ui hover:bg-emerald-900 transition-colors shadow-xs"
            >
              <span>Buka Jemputan Rasmi (walimatul.my/{order.invitation.slug})</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // If already rejected
  if (order.payment_status === "payment_rejected") {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-red-50 border border-red-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold">
            ✕
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-red-950">
              Pembayaran Telah Ditolak
            </h3>
            <p className="text-xs font-ui text-red-700">
              Menunggu klien memuat naik semula bukti pembayaran yang baharu.
            </p>
          </div>
        </div>

        {order.rejection_reason && (
          <div className="p-3.5 rounded-xl bg-white border border-red-100 text-xs font-ui text-red-900 leading-relaxed">
            <strong>Sebab Penolakan:</strong> {order.rejection_reason}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
          Tindakan Pentadbir
        </span>
        <h3 className="text-xl font-bold font-display text-[var(--text)]">
          Keputusan Semakan Bayaran
        </h3>
        <p className="text-xs font-ui text-[var(--text-muted)] mt-1">
          Sahkan jika resit sah dan padan, atau tolak dengan menyatakan sebab yang jelas.
        </p>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui">
          {actionError}
        </div>
      )}

      {/* ── Main Decision Action Buttons ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowApproveConfirm(true)}
          disabled={isPending}
          className="w-full sm:flex-1 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-ui text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>✓ Sahkan Pembayaran &amp; Terbitkan</span>
        </button>

        <button
          type="button"
          onClick={() => setShowRejectModal(true)}
          disabled={isPending}
          className="w-full sm:flex-1 py-3.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-ui text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>✕ Tolak Pembayaran</span>
        </button>
      </div>

      {/* ── Approve Confirmation Modal ── */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <div className="text-center space-y-2">
              <h4 className="font-display text-xl font-bold text-[var(--text)]">
                Sahkan Pengesahan Bayaran?
              </h4>
              <p className="text-xs font-ui text-[var(--text-muted)] leading-relaxed">
                Tindakan ini akan menjana nombor resit rasmi, mengaktifkan tempoh sah {order.validity_months} bulan, dan <strong>menerbitkan jemputan perkahwinan ini secara rasmi</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] text-xs font-ui text-[var(--text)] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Jumlah:</span>
                <span className="font-bold text-emerald-800">RM {order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Pautan Jemputan:</span>
                <span className="font-mono">walimatul.my/{order.invitation.slug || "—"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveConfirm(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold font-ui text-[var(--text)] hover:bg-[var(--surface-warm)] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold font-ui transition-colors shadow-sm disabled:opacity-50"
              >
                {isPending ? "Mengesahkan..." : "Ya, Sahkan & Terbit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal with Reason Form ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleReject}
            className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-700 font-ui block mb-0.5">
                  Tolak Pembayaran
                </span>
                <h4 className="font-display text-xl font-bold text-[var(--text)]">
                  Nyatakan Sebab Penolakan
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-ui text-[var(--text-muted)] leading-relaxed">
              Sebab penolakan ini akan dipaparkan kepada klien dalam Billing dan mereka akan dibenarkan memuat naik semula resit yang baharu.
            </p>

            {/* Quick Reason Buttons */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold font-ui text-[var(--text-subtle)] uppercase tracking-wider">
                Pilihan Sebab Pantas:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REJECTION_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectionReason(reason)}
                    className="text-[11px] font-ui px-2.5 py-1 rounded-full bg-[var(--surface-warm)] border border-[var(--border-soft)] text-[var(--text)] hover:border-[var(--primary)] text-left transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="rejection-reason" className="block text-xs font-semibold font-ui text-[var(--text)]">
                Sebab Penolakan Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                maxLength={500}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="cth. Tangkap layar resit kabur dan tidak memaparkan jumlah bayaran..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
              />
              <p className="text-[10px] font-ui text-[var(--text-subtle)] text-right">
                {rejectionReason.length} / 500 aksara
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold font-ui text-[var(--text)] hover:bg-[var(--surface-warm)] transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending || rejectionReason.trim().length < 5}
                className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold font-ui transition-colors shadow-sm disabled:opacity-50"
              >
                {isPending ? "Menolak..." : "Sahkan Penolakan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
