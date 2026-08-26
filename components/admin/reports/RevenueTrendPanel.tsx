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
import type { RevenueSeriesPoint, AdminReportSummary } from "@/types/reports";

interface Props {
  series: RevenueSeriesPoint[];
  summary: AdminReportSummary;
  rangeLabel: string;
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
  const dataPoint = payload[0].payload as RevenueSeriesPoint;
  return (
    <div
      className="rounded-2xl p-3 text-xs font-ui shadow-lg bg-white border border-[var(--border)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <p className="text-[var(--text-muted)] font-medium mb-1">{dataPoint.dateKey || label}</p>
      <p className="font-bold text-emerald-700 text-sm">
        {fmtMYRFull(dataPoint.revenue)}
      </p>
      <p className="text-gray-600 text-[11px] mt-0.5">
        {dataPoint.paidOrders} pesanan berbayar
      </p>
    </div>
  );
}

export function RevenueTrendPanel({ series, summary, rangeLabel }: Props) {
  const hasData = series.some((p) => p.revenue > 0);

  // Find peak interval
  let peakPoint: RevenueSeriesPoint | null = null;
  for (const pt of series) {
    if (!peakPoint || pt.revenue > peakPoint.revenue) {
      peakPoint = pt;
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-0.5">
            Analisis Kewangan
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
            Trend Pendapatan Berbayar
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
            Jumlah terkumpul pesanan disahkan ({rangeLabel})
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-bold font-display text-emerald-700">
            {fmtMYRFull(summary.revenue)}
          </div>
          <span className="text-[11px] font-ui text-[var(--text-muted)]">
            {summary.paidOrders} transaksi
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[var(--surface-warm)] border border-dashed border-[var(--border)]">
            <span className="text-2xl mb-1">📉</span>
            <p className="text-xs font-medium text-[var(--text-muted)] font-ui">
              Tiada data pembayaran berbayar direkodkan dalam tempoh {rangeLabel}.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueReportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-ui)" }}
                dy={8}
              />
              <YAxis
                tickFormatter={fmtMYRShort}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-ui)" }}
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Pendapatan"
                stroke="#15803d"
                strokeWidth={2.5}
                fill="url(#revenueReportGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#15803d", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue Summary Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-soft)]">
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Purata Pesanan (AOV)
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {fmtMYRFull(summary.averageOrderValue)}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Transaksi Disahkan
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {summary.paidOrders} pesanan
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Puncak Pendapatan
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {peakPoint && peakPoint.revenue > 0 ? fmtMYRFull(peakPoint.revenue) : "RM 0.00"}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Tarikh Puncak
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block truncate">
            {peakPoint && peakPoint.revenue > 0 ? peakPoint.label : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
