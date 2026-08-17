import React from "react";
import Link from "next/link";
import type { Order, PaymentProof } from "@/types/database";

export interface PaymentStatusCardProps {
  order: Order;
  proof?: PaymentProof | null;
  slug: string | null;
  onRetry?: () => void;
}

export function PaymentStatusCard({
  order,
  slug,
  onRetry,
}: PaymentStatusCardProps) {
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

  if (order.payment_status === "pending_verification") {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-amber-200 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 font-ui block">
            Status Pesanan
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Menunggu Pengesahan Pembayaran
          </h2>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-md mx-auto leading-relaxed pt-1">
            Bukti pembayaran anda telah selamat diterima dan sedang disemak secara manual oleh pasukan kami (biasanya dalam tempoh 24 jam).
          </p>
        </div>

        {/* Proof summary metadata */}
        <div className="p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] text-left text-xs font-ui text-[var(--text)] space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Masa Dihantar:</span>
            <span className="font-semibold">{formatDateTime(order.submitted_at)}</span>
          </div>
          {order.payment_reference && (
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">No. Rujukan:</span>
              <span className="font-semibold">{order.payment_reference}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Jumlah:</span>
            <span className="font-bold text-[var(--primary)]">RM {order.amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard/billing"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm text-center"
          >
            Lihat Status di Billing →
          </Link>
          <Link
            href="/dashboard/invitations"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors text-center"
          >
            Kembali ke Jemputan Saya
          </Link>
        </div>
      </div>
    );
  }

  if (order.payment_status === "paid") {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-emerald-200 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 font-ui block">
            Pembayaran Selesai
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Jemputan Telah Diaktifkan!
          </h2>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-md mx-auto leading-relaxed pt-1">
            Pembayaran anda telah disahkan. Jemputan perkahwinan digital anda kini aktif dan boleh diakses oleh tetamu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {slug && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm text-center"
            >
              Buka Jemputan Rasmi →
            </Link>
          )}
          <Link
            href="/dashboard/billing"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors text-center"
          >
            Lihat Resit di Billing
          </Link>
        </div>
      </div>
    );
  }

  if (order.payment_status === "payment_rejected") {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-red-200 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-red-700 font-ui block">
            Pengesahan Gagal
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Pembayaran Tidak Dapat Disahkan
          </h2>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-md mx-auto leading-relaxed pt-1">
            {order.rejection_reason ||
              "Bukti pembayaran yang dimuat naik tidak dapat dipadankan atau tidak jelas. Sila muat naik semula resit yang sah."}
          </p>
        </div>

        {onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
            >
              Muat Naik Semula Bukti Pembayaran →
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
