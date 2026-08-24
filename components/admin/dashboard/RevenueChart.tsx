"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/lib/data/admin-dashboard";

interface Props {
  data: ChartDataPoint[];
  rangeLabel: string;
  rangeRevenue: number;
}

function fmtMYRShort(val: number): string {
  if (val >= 1000) return `RM${(val / 1000).toFixed(1)}k`;
  return `RM${val.toFixed(0)}`;
}

function fmtMYRFull(val: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs font-ui shadow-lg"
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-semibold mt-0.5" style={{ color: "#15803d" }}>
        {fmtMYRFull(payload[0].value)}
      </p>
    </div>
  );
}

/**
 * RevenueChart
 *
 * Recharts AreaChart with emerald palette.
 * Always uses ResponsiveContainer for mobile safety.
 * Shows empty state if no data.
 */
export function RevenueChart({ data, rangeLabel, rangeRevenue }: Props) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4 h-full"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="text-[10px] font-ui font-bold uppercase tracking-widest"
            style={{ color: "var(--text-subtle)" }}
          >
            Pendapatan · {rangeLabel}
          </p>
          <p
            className="text-xl font-display font-bold mt-0.5"
            style={{ color: "var(--primary)" }}
          >
            {fmtMYRFull(rangeRevenue)}
          </p>
        </div>
        <span
          className="text-[10px] font-ui px-2 py-0.5 rounded-full"
          style={{ background: "#d1fae5", color: "#065f46" }}
        >
          Hanya Dibayar
        </span>
      </div>

      {/* Chart or empty state */}
      {!hasData ? (
        <div
          className="flex-1 flex items-center justify-center rounded-xl min-h-[160px]"
          style={{ background: "var(--surface-warm)" }}
          role="status"
          aria-live="polite"
        >
          <p
            className="text-xs font-ui text-center px-4"
            style={{ color: "var(--text-muted)" }}
          >
            Belum ada data pendapatan untuk tempoh ini.
          </p>
        </div>
      ) : (
        <>
          {/* Screen-reader summary */}
          <p className="sr-only">
            Carta pendapatan untuk {rangeLabel}. Jumlah:{" "}
            {fmtMYRFull(rangeRevenue)}.
          </p>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-soft)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--text-subtle)", fontFamily: "inherit" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={fmtMYRShort}
                  tick={{ fontSize: 10, fill: "var(--text-subtle)", fontFamily: "inherit" }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#15803d"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#15803d", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
