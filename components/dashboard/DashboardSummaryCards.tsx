import React from "react";
import type { ClientDashboardSummary } from "@/types/client-lifecycle";

interface Props {
  summary: ClientDashboardSummary;
}

export function DashboardSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Jumlah Jemputan",
      value: summary.totalInvitations,
      icon: "💌",
      color: "var(--primary)",
      bg: "bg-[var(--surface-warm)]",
      desc: "Semua jemputan anda",
    },
    {
      label: "Jemputan Aktif",
      value: summary.activeInvitations,
      icon: "✨",
      color: "#15803d",
      bg: "bg-emerald-50/70",
      desc: "Diterbitkan & boleh diakses",
    },
    {
      label: "Draf / Dalam Proses",
      value: summary.draftInvitations,
      icon: "📝",
      color: "#d97706",
      bg: "bg-amber-50/70",
      desc: summary.underReviewCount > 0
        ? `${summary.underReviewCount} dalam semakan Admin`
        : "Perlu dilengkapkan / dibayar",
      badge: summary.underReviewCount > 0 ? `${summary.underReviewCount} Semakan` : null,
    },
    {
      label: "Tamat Tempoh",
      value: summary.expiredInvitations,
      icon: "⌛",
      color: "#b91c1c",
      bg: "bg-rose-50/60",
      desc: "Perlu lanjutan sokongan",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-ui block truncate">
              {c.label}
            </span>
            <span
              className={`w-8 h-8 rounded-2xl flex items-center justify-center text-sm shrink-0 border border-[var(--border-soft)] ${c.bg}`}
              aria-hidden="true"
            >
              {c.icon}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
              {c.value}
            </div>
            <div className="flex items-center justify-between gap-1.5 mt-1">
              <span className="text-[11px] font-ui text-[var(--text-muted)] truncate">
                {c.desc}
              </span>
              {c.badge && (
                <span className="text-[10px] font-bold font-ui px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                  {c.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
