import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/permissions";
import { getOwnBillingOrders } from "@/lib/data/payments";

export const metadata: Metadata = {
  title: "Billing & Langganan — WALIMATUL",
  description: "Sejarah pesanan dan status pengesahan bayaran jemputan perkahwinan anda.",
};

export default async function BillingPage() {
  await requireAuth();
  const orders = await getOwnBillingOrders();

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

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending_payment":
        return {
          label: "Menunggu Bayaran",
          className: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "pending_verification":
        return {
          label: "Menunggu Pengesahan",
          className: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "paid":
        return {
          label: "Telah Dibayar",
          className: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "payment_rejected":
        return {
          label: "Bayaran Ditolak",
          className: "bg-red-50 text-red-800 border-red-200",
        };
      case "cancelled":
        return {
          label: "Dibatalkan",
          className: "bg-stone-100 text-stone-600 border-stone-200",
        };
      case "refunded":
        return {
          label: "Dipulangkan",
          className: "bg-purple-50 text-purple-800 border-purple-200",
        };
      default:
        return {
          label: status,
          className: "bg-stone-100 text-stone-600 border-stone-200",
        };
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan Pembayaran
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Billing &amp; Sejarah Pesanan
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Pantau status bayaran Touch ’n Go eWallet dan pengesahan jemputan perkahwinan anda.
          </p>
        </div>

        <Link
          href="/dashboard/invitations"
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] text-xs font-semibold font-ui text-[var(--text)] hover:border-[var(--primary)] transition-colors inline-flex items-center gap-1.5"
        >
          Jemputan Saya →
        </Link>
      </div>

      {/* ── Orders Content ── */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold font-ui text-[var(--text-subtle)] uppercase tracking-wider px-1">
          Senarai Transaksi ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-warm)] text-[var(--primary)] flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--text)]">
              Tiada Rekod Pembayaran
            </h3>
            <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-sm mx-auto">
              Anda belum mempunyai sebarang transaksi pembayaran. Pembayaran Touch ’n Go eWallet dibuat apabila anda mengaktifkan draf jemputan.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/invitations"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
              >
                Ke Jemputan Saya →
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── Mobile Order Cards (Hidden on Desktop) ── */}
            <div className="space-y-3 sm:hidden">
              {orders.map((order) => {
                const badge = getStatusBadge(order.payment_status);
                const groom = order.invitation.groom_short_name || order.invitation.groom_name || "Pengantin Lelaki";
                const bride = order.invitation.bride_short_name || order.invitation.bride_name || "Pengantin Perempuan";

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold text-[var(--text)]">
                          {groom} &amp; {bride}
                        </h3>
                        <p className="text-xs font-ui text-[var(--text-subtle)] mt-0.5">
                          {order.template.name} · {order.validity_months} bulan akses
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-ui font-semibold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="divide-y divide-[var(--border-soft)] py-1 text-xs font-ui">
                      <div className="py-1.5 flex justify-between">
                        <span className="text-[var(--text-muted)]">Jumlah:</span>
                        <span className="font-bold text-[var(--primary)]">
                          RM {order.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-[var(--text-muted)]">Kaedah:</span>
                        <span className="font-medium text-[var(--text)]">Touch ’n Go eWallet</span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-[var(--text-muted)]">Tarikh Dihantar:</span>
                        <span className="text-[var(--text-subtle)]">
                          {formatDateTime(order.submitted_at || order.created_at)}
                        </span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-[var(--text-muted)]">Resit:</span>
                        <span className={`text-[var(--text-subtle)] ${order.receipt_number ? "font-mono font-bold text-emerald-800" : "italic"}`}>
                          {order.receipt_number || "Tersedia selepas pengesahan"}
                        </span>
                      </div>
                    </div>

                    {order.payment_status === "payment_rejected" && order.rejection_reason && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-ui text-red-800 leading-relaxed">
                        <span className="font-bold">Sebab Penolakan:</span> {order.rejection_reason}
                      </div>
                    )}

                    <div>
                      {order.payment_status === "payment_rejected" ? (
                        <Link
                          href={`/dashboard/invitations/${order.invitation.id}/payment`}
                          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          Muat Naik Semula Bukti →
                        </Link>
                      ) : order.payment_status === "pending_payment" ? (
                        <Link
                          href={`/dashboard/invitations/${order.invitation.id}/payment`}
                          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          Lengkapkan Bayaran →
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/invitations/${order.invitation.id}/payment`}
                          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:border-[var(--primary)] transition-colors"
                        >
                          Lihat Butiran Bayaran
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop Order Table (Hidden on Mobile) ── */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <table className="w-full text-left border-collapse font-ui text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[var(--text-subtle)] text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Jemputan &amp; Templat</th>
                    <th className="py-3.5 px-4">Jumlah</th>
                    <th className="py-3.5 px-4">Kaedah</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tarikh</th>
                    <th className="py-3.5 px-4">Resit</th>
                    <th className="py-3.5 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-soft)]">
                  {orders.map((order) => {
                    const badge = getStatusBadge(order.payment_status);
                    const groom = order.invitation.groom_short_name || order.invitation.groom_name || "Pengantin Lelaki";
                    const bride = order.invitation.bride_short_name || order.invitation.bride_name || "Pengantin Perempuan";

                    return (
                      <tr key={order.id} className="hover:bg-[var(--surface-warm)]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[var(--text)]">
                            {groom} &amp; {bride}
                          </p>
                          <p className="text-xs text-[var(--text-subtle)]">
                            {order.template.name} ({order.validity_months} bulan)
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[var(--primary)]">
                          RM {order.amount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[var(--text-muted)]">
                          Touch ’n Go eWallet
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)] whitespace-nowrap">
                          {formatDateTime(order.submitted_at || order.created_at)}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)] italic">
                          {order.receipt_number || "Tersedia selepas pengesahan"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/dashboard/invitations/${order.invitation.id}/payment`}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-[var(--surface-warm)] border border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                          >
                            {order.payment_status === "pending_payment" ? "Bayar" : "Lihat"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
