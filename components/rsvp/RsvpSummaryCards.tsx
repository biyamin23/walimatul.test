import React from "react";
import type { RsvpSummaryMetrics } from "@/lib/data/rsvps";

export interface RsvpSummaryCardsProps {
  summary: RsvpSummaryMetrics;
}

export function RsvpSummaryCards({ summary }: RsvpSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      {/* 1. Total Responses */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-1">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] font-ui">
          Jumlah Respon
        </span>
        <p className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
          {summary.totalResponses}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] font-ui">
          Borang dihantar
        </p>
      </div>

      {/* 2. Attending */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-1">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--primary)] font-ui">
          Hadir
        </span>
        <p className="text-2xl sm:text-3xl font-bold font-display text-[var(--primary)]">
          {summary.attendingCount}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] font-ui">
          Respon hadir
        </p>
      </div>

      {/* 3. Not Attending */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-1">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-ui">
          Tidak Hadir
        </span>
        <p className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-muted)]">
          {summary.notAttendingCount}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] font-ui">
          Respon berhalangan
        </p>
      </div>

      {/* 4. Total Pax */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-1">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--gold)] font-ui">
          Jumlah Tetamu (Pax)
        </span>
        <p className="text-2xl sm:text-3xl font-bold font-display text-[var(--gold)]">
          {summary.totalPax}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] font-ui">
          Anggaran keseluruhan
        </p>
      </div>
    </div>
  );
}
