"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  type ReportRangePreset,
  type ParsedReportRange,
  REPORT_PRESET_LABELS,
} from "@/types/reports";

interface Props {
  currentRange: ParsedReportRange;
}

const PRESETS: { value: ReportRangePreset; label: string }[] = [
  { value: "7d", label: REPORT_PRESET_LABELS["7d"] },
  { value: "30d", label: REPORT_PRESET_LABELS["30d"] },
  { value: "90d", label: REPORT_PRESET_LABELS["90d"] },
  { value: "12m", label: REPORT_PRESET_LABELS["12m"] },
  { value: "all", label: REPORT_PRESET_LABELS["all"] },
  { value: "custom", label: REPORT_PRESET_LABELS["custom"] },
];

export function ReportRangeSelector({ currentRange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showCustomModal, setShowCustomModal] = useState(currentRange.preset === "custom");
  const [fromDate, setFromDate] = useState(currentRange.fromStr || "");
  const [toDate, setToDate] = useState(currentRange.toStr || "");

  function handleSelectPreset(preset: ReportRangePreset) {
    if (preset === "custom") {
      setShowCustomModal(true);
      return;
    }
    setShowCustomModal(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", preset);
    params.delete("from");
    params.delete("to");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleApplyCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!fromDate || !toDate || fromDate > toDate) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "custom");
    params.set("from", fromDate);
    params.set("to", toDate);
    router.push(`${pathname}?${params.toString()}`);
  }

  // Export link params matching current view
  const exportUrl =
    currentRange.preset === "custom"
      ? `/admin/exports?range=custom&from=${currentRange.fromStr}&to=${currentRange.toStr}`
      : `/admin/exports?range=${currentRange.preset}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Preset Button Group */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)]"
          role="group"
          aria-label="Pilih julat tarikh laporan"
        >
          {PRESETS.map(({ value, label }) => {
            const isActive = currentRange.preset === value;
            return (
              <button
                key={value}
                id={`report-range-${value}`}
                onClick={() => handleSelectPreset(value)}
                className="px-3 py-1.5 rounded-xl text-xs font-ui font-semibold transition-all duration-150"
                style={{
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                  boxShadow: isActive ? "0 1px 3px rgba(23,79,58,0.25)" : "none",
                }}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Action Link to Exports */}
        <Link
          href={exportUrl}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[var(--border)] hover:bg-[var(--surface-warm)] text-xs font-semibold text-[var(--text)] font-ui transition-all shadow-2xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Eksport Paparan Ini
        </Link>
      </div>

      {/* Custom Range Drawer / Bar */}
      {showCustomModal && (
        <form
          onSubmit={handleApplyCustom}
          className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-xs flex flex-wrap items-center gap-3 text-xs font-ui animate-in fade-in duration-200"
        >
          <span className="font-semibold text-[var(--text)]">Julat Tersuai (MYT):</span>
          <div className="flex items-center gap-2">
            <label htmlFor="report-from-date" className="text-[var(--text-muted)]">
              Dari:
            </label>
            <input
              id="report-from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-ui"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="report-to-date" className="text-[var(--text-muted)]">
              Hingga:
            </label>
            <input
              id="report-to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-ui"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
          >
            Terapkan Tarikh
          </button>
        </form>
      )}
    </div>
  );
}
