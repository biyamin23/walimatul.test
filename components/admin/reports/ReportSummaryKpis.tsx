import React from "react";
import type { AdminReportSummary } from "@/types/reports";

interface Props {
  summary: AdminReportSummary;
  rangeLabel: string;
}

function fmtMYR(val: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(val);
}

function renderDiffBadge(diffPct: number | null) {
  if (diffPct === null) {
    return (
      <span className="text-[11px] font-ui text-[var(--text-muted)] bg-[var(--surface-warm)] px-2 py-0.5 rounded-full">
        — <span className="opacity-75 text-[10px]">tiada perbandingan</span>
      </span>
    );
  }

  const isPositive = diffPct > 0;
  const isZero = diffPct === 0;

  if (isZero) {
    return (
      <span className="text-[11px] font-semibold font-ui text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
        0.0%
      </span>
    );
  }

  return (
    <span
      className={`text-[11px] font-bold font-ui px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${
        isPositive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
      }`}
    >
      {isPositive ? "↑ +" : "↓ "}
      {diffPct.toFixed(1)}%
    </span>
  );
}

export function ReportSummaryKpis({ summary, rangeLabel }: Props) {
  const cards = [
    {
      title: "Jumlah Pendapatan",
      value: fmtMYR(summary.revenue),
      diff: summary.revenueDiffPct,
      subtitle: `Berdasarkan ${rangeLabel}`,
      icon: "💰",
      color: "var(--primary)",
    },
    {
      title: "Pesanan Berbayar",
      value: summary.paidOrders.toLocaleString("ms-MY"),
      diff: summary.paidOrdersDiffPct,
      subtitle: "Transaksi disahkan",
      icon: "🧾",
      color: "var(--gold)",
    },
    {
      title: "Purata Nilai Pesanan (AOV)",
      value: fmtMYR(summary.averageOrderValue),
      diff: summary.averageOrderValueDiffPct,
      subtitle: "Pendapatan / pesanan berbayar",
      icon: "📊",
      color: "#0284c7",
    },
    {
      title: "Pengguna Baharu",
      value: summary.newUsers.toLocaleString("ms-MY"),
      diff: summary.newUsersDiffPct,
      subtitle: "Pendaftaran akaun klien",
      icon: "👥",
      color: "#8b5cf6",
    },
    {
      title: "Jemputan Baharu",
      value: summary.newInvitations.toLocaleString("ms-MY"),
      diff: summary.newInvitationsDiffPct,
      subtitle: "Dicipta dalam tempoh",
      icon: "💌",
      color: "#ec4899",
    },
    {
      title: "Jemputan Diterbitkan",
      value: summary.publishedInvitations.toLocaleString("ms-MY"),
      diff: summary.publishedInvitationsDiffPct,
      subtitle: "Diaktifkan dalam tempoh",
      icon: "✨",
      color: "#10b981",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-ui block">
                {card.title}
              </span>
              <div className="text-2xl font-bold font-display text-[var(--text)]">
                {card.value}
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-base shrink-0 bg-[var(--surface-warm)] border border-[var(--border-soft)]"
              aria-hidden="true"
            >
              {card.icon}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-soft)] flex items-center justify-between gap-2">
            <span className="text-[11px] font-ui text-[var(--text-muted)] truncate">
              {card.subtitle}
            </span>
            {renderDiffBadge(card.diff)}
          </div>
        </div>
      ))}
    </div>
  );
}
