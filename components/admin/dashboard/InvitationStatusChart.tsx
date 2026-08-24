"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { InvitationStatusBreakdown } from "@/lib/data/admin-dashboard";

interface Props {
  data: InvitationStatusBreakdown;
}

const SEGMENTS = [
  { key: "published" as const, label: "Diterbitkan", color: "#15803d" },
  { key: "draft" as const, label: "Draf", color: "#b8955a" },
  { key: "expired" as const, label: "Tamat Tempoh", color: "#b95454" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs font-ui shadow-lg"
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <p className="font-semibold" style={{ color: entry.payload.color }}>
        {entry.name}
      </p>
      <p style={{ color: "var(--text-muted)" }}>{entry.value} jemputan</p>
    </div>
  );
}

/**
 * InvitationStatusChart
 *
 * Recharts PieChart (donut) with centre label showing total invitations.
 * Includes text legend so data is not colour-only.
 * Shows empty state if total is 0.
 */
export function InvitationStatusChart({ data }: Props) {
  const isEmpty = data.total === 0;

  const chartData = SEGMENTS.map((s) => ({
    name: s.label,
    value: data[s.key],
    color: s.color,
  })).filter((d) => d.value > 0);

  // Fallback single segment when all are 0 (prevents blank chart)
  const displayData =
    chartData.length === 0
      ? [{ name: "Tiada", value: 1, color: "#e8ddd5" }]
      : chartData;

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div>
        <p
          className="text-[10px] font-ui font-bold uppercase tracking-widest"
          style={{ color: "var(--text-subtle)" }}
        >
          Status Jemputan
        </p>
        <p
          className="text-xl font-display font-bold mt-0.5"
          style={{ color: "var(--text)" }}
        >
          {data.total} Jemputan
        </p>
      </div>

      {isEmpty ? (
        <div
          className="flex items-center justify-center rounded-xl min-h-[120px]"
          style={{ background: "var(--surface-warm)" }}
          role="status"
        >
          <p
            className="text-xs font-ui text-center px-4"
            style={{ color: "var(--text-muted)" }}
          >
            Belum ada jemputan.
          </p>
        </div>
      ) : (
        <>
          {/* Screen-reader summary */}
          <p className="sr-only">
            Status jemputan: {data.published} diterbitkan, {data.draft} draf,{" "}
            {data.expired} tamat tempoh.
          </p>

          {/* Donut chart */}
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {displayData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                {!isEmpty && <Tooltip content={<CustomTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Text legend — accessibility requirement */}
          <ul
            className="space-y-2"
            role="list"
            aria-label="Pecahan status jemputan"
          >
            {SEGMENTS.map((s) => {
              const count = data[s.key];
              const pct =
                data.total > 0
                  ? Math.round((count / data.total) * 100)
                  : 0;
              return (
                <li
                  key={s.key}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: s.color }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-xs font-ui"
                      style={{ color: "var(--text)" }}
                    >
                      {s.label}
                    </span>
                  </span>
                  <span
                    className="text-xs font-ui font-semibold tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {count}
                    <span className="text-[10px] ml-1" style={{ color: "var(--text-subtle)" }}>
                      ({pct}%)
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
