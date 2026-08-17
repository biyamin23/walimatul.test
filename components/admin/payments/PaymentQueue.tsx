"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminPaymentQueueItem, AdminPaymentStats } from "@/lib/data/admin-payments";

export interface PaymentQueueProps {
  initialOrders: AdminPaymentQueueItem[];
  stats: AdminPaymentStats;
}

export function PaymentQueue({ initialOrders, stats }: PaymentQueueProps) {
  const [activeFilter, setActiveFilter] = useState<string>("pending_verification");

  const filteredOrders = initialOrders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.payment_status === activeFilter;
  });

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
      case "pending_payment":
        return {
          label: "Menunggu Bayaran",
          className: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: status,
          className: "bg-stone-100 text-stone-600 border-stone-200",
        };
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Summary Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveFilter("pending_verification")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeFilter === "pending_verification"
              ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20"
              : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 font-ui block">
            Menunggu Pengesahan
          </span>
          <p className="text-2xl sm:text-3xl font-display font-bold text-blue-900 mt-1">
            {stats.pendingVerificationCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("paid")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeFilter === "paid"
              ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20"
              : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 font-ui block">
            Telah Dibayar (Aktif)
          </span>
          <p className="text-2xl sm:text-3xl font-display font-bold text-emerald-900 mt-1">
            {stats.paidCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("payment_rejected")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeFilter === "payment_rejected"
              ? "bg-red-50/80 border-red-300 ring-2 ring-red-500/20"
              : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-700 font-ui block">
            Bayaran Ditolak
          </span>
          <p className="text-2xl sm:text-3xl font-display font-bold text-red-900 mt-1">
            {stats.rejectedCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeFilter === "all"
              ? "bg-[var(--surface-warm)] border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
              : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-subtle)] font-ui block">
            Jumlah Semua Pesanan
          </span>
          <p className="text-2xl sm:text-3xl font-display font-bold text-[var(--text)] mt-1">
            {stats.totalCount}
          </p>
        </button>
      </div>

      {/* ── Filter Tab Selector ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--border-soft)]">
        {[
          { id: "pending_verification", label: `Menunggu (${stats.pendingVerificationCount})` },
          { id: "paid", label: `Telah Dibayar (${stats.paidCount})` },
          { id: "payment_rejected", label: `Ditolak (${stats.rejectedCount})` },
          { id: "all", label: `Semua (${stats.totalCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold font-ui whitespace-nowrap transition-colors ${
              activeFilter === tab.id
                ? "bg-[var(--primary)] text-white shadow-xs"
                : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Orders List ── */}
      {filteredOrders.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-3">
          <p className="text-base font-display font-bold text-[var(--text)]">
            Tiada pesanan dalam kategori ini.
          </p>
          <p className="text-xs font-ui text-[var(--text-muted)]">
            Semua permohonan pembayaran yang dihantar oleh klien akan muncul di sini.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 sm:hidden">
            {filteredOrders.map((order) => {
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
                      <h4 className="font-display text-base font-bold text-[var(--text)]">
                        {groom} &amp; {bride}
                      </h4>
                      <p className="text-xs font-ui text-[var(--text-subtle)] mt-0.5">
                        Klien: {order.client.full_name}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-ui font-semibold border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="divide-y divide-[var(--border-soft)] py-1 text-xs font-ui">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-[var(--text-muted)]">Jumlah:</span>
                      <span className="font-bold text-[var(--primary)]">RM {order.amount.toFixed(2)}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-[var(--text-muted)]">Dihantar:</span>
                      <span className="text-[var(--text-subtle)]">{formatDateTime(order.submitted_at || order.created_at)}</span>
                    </div>
                    {order.receipt_number && (
                      <div className="py-1.5 flex justify-between">
                        <span className="text-[var(--text-muted)]">No. Resit:</span>
                        <span className="font-mono font-semibold">{order.receipt_number}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/admin/payments/${order.id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                    >
                      Semak Bukti Pembayaran →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <table className="w-full text-left border-collapse font-ui text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[var(--text-subtle)] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Jemputan &amp; Klien</th>
                  <th className="py-3.5 px-4">Jumlah</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Masa Dihantar</th>
                  <th className="py-3.5 px-4">No. Resit</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-soft)]">
                {filteredOrders.map((order) => {
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
                          {order.client.full_name} · {order.template.name}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[var(--primary)]">
                        RM {order.amount.toFixed(2)}
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
                      <td className="py-3.5 px-4 text-xs font-mono text-[var(--text-subtle)]">
                        {order.receipt_number || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/payments/${order.id}`}
                          className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-xs"
                        >
                          Semak
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
  );
}
