"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { DashboardRange } from "@/lib/data/admin-dashboard";

interface Props {
  currentRange: DashboardRange;
}

const RANGES: { value: DashboardRange; label: string }[] = [
  { value: "30d", label: "30 Hari" },
  { value: "90d", label: "90 Hari" },
  { value: "12m", label: "12 Bulan" },
  { value: "all", label: "Semua Masa" },
];

/**
 * DashboardRangeSelector
 *
 * Client component — updates the URL via useRouter().push() which causes the
 * server page to re-render with the new range from searchParams.
 * Does NOT store analytics state locally.
 */
export function DashboardRangeSelector({ currentRange }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(range: DashboardRange) {
    router.push(`${pathname}?range=${range}`);
  }

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{
        background: "var(--surface-warm)",
        border: "1px solid var(--border)",
      }}
      role="group"
      aria-label="Pilih tempoh papan pemuka"
    >
      {RANGES.map(({ value, label }) => {
        const isActive = currentRange === value;
        return (
          <button
            key={value}
            id={`admin-range-${value}`}
            onClick={() => handleSelect(value)}
            className="px-3 py-1.5 rounded-lg text-xs font-ui font-semibold transition-all duration-150"
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
  );
}
