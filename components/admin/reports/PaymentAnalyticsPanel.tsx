import React from "react";
import type { PaymentStatusMetrics } from "@/types/reports";

interface Props {
  metrics: PaymentStatusMetrics;
  rangeLabel: string;
}

export function PaymentAnalyticsPanel({ metrics, rangeLabel }: Props) {
  const statuses = [
    {
      label: "Berbayar",
      key: "paid",
      count: metrics.paid,
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "✓",
    },
    {
      label: "Menunggu Pengesahan",
      key: "pending_verification",
      count: metrics.pending_verification,
      color: "bg-amber-100 text-amber-800 border-amber-300",
      icon: "⏳",
    },
    {
      label: "Menunggu Pembayaran",
      key: "pending_payment",
      count: metrics.pending_payment,
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "🕒",
    },
    {
      label: "Ditolak",
      key: "payment_rejected",
      count: metrics.payment_rejected,
      color: "bg-rose-100 text-rose-800 border-rose-300",
      icon: "✕",
    },
    {
      label: "Dibatalkan",
      key: "cancelled",
      count: metrics.cancelled,
      color: "bg-gray-100 text-gray-700 border-gray-300",
      icon: "⊘",
    },
    {
      label: "Refunded",
      key: "refunded",
      count: metrics.refunded,
      color: "bg-purple-100 text-purple-800 border-purple-300",
      icon: "↺",
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-0.5">
            Analisis Transaksi
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
            Pecahan Status Pesanan
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
            Pecahan status pesanan dicipta dalam tempoh {rangeLabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
              Kadar Kejayaan (Paid)
            </span>
            <span className="text-xl font-bold font-display text-emerald-700">
              {metrics.conversionRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Status Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statuses.map((st) => {
          const share =
            metrics.totalOrdersInPeriod > 0
              ? ((st.count / metrics.totalOrdersInPeriod) * 100).toFixed(0)
              : "0";
          return (
            <div
              key={st.key}
              className="p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${st.color}`}>
                  {st.icon}
                </span>
                <span className="text-[10px] font-bold font-ui text-[var(--text-muted)]">
                  {share}%
                </span>
              </div>
              <div>
                <div className="text-xl font-bold font-display text-[var(--text)]">
                  {st.count}
                </div>
                <div className="text-[11px] font-medium text-[var(--text-muted)] font-ui truncate mt-0.5">
                  {st.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Funnel Representation */}
      <div className="p-4 rounded-2xl bg-white border border-[var(--border-soft)] space-y-3">
        <div className="flex items-center justify-between text-xs font-ui font-semibold text-[var(--text)]">
          <span>Corong Pengaktifan Pesanan (Funnel)</span>
          <span className="text-[var(--text-muted)]">
            Jumlah Dicipta: {metrics.totalOrdersInPeriod}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
          <div
            style={{
              width: `${
                metrics.totalOrdersInPeriod > 0
                  ? (metrics.paid / metrics.totalOrdersInPeriod) * 100
                  : 0
              }%`,
            }}
            className="bg-emerald-600 h-full transition-all duration-300"
            title={`Berbayar: ${metrics.paid}`}
          />
          <div
            style={{
              width: `${
                metrics.totalOrdersInPeriod > 0
                  ? (metrics.pending_verification / metrics.totalOrdersInPeriod) * 100
                  : 0
              }%`,
            }}
            className="bg-amber-500 h-full transition-all duration-300"
            title={`Menunggu Semakan: ${metrics.pending_verification}`}
          />
          <div
            style={{
              width: `${
                metrics.totalOrdersInPeriod > 0
                  ? (metrics.pending_payment / metrics.totalOrdersInPeriod) * 100
                  : 0
              }%`,
            }}
            className="bg-blue-400 h-full transition-all duration-300"
            title={`Menunggu Bayaran: ${metrics.pending_payment}`}
          />
          <div
            style={{
              width: `${
                metrics.totalOrdersInPeriod > 0
                  ? (metrics.payment_rejected / metrics.totalOrdersInPeriod) * 100
                  : 0
              }%`,
            }}
            className="bg-rose-400 h-full transition-all duration-300"
            title={`Ditolak: ${metrics.payment_rejected}`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-ui text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Berbayar ({metrics.paid})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Semakan ({metrics.pending_verification})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Menunggu Bayaran ({metrics.pending_payment})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Ditolak ({metrics.payment_rejected})
          </span>
        </div>
      </div>
    </div>
  );
}
