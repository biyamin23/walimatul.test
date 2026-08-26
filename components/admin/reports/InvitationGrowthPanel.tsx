"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { InvitationAnalyticsMetrics } from "@/types/reports";

interface Props {
  metrics: InvitationAnalyticsMetrics;
  rangeLabel: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl p-3 text-xs font-ui shadow-lg bg-white border border-[var(--border)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <p className="text-[var(--text-muted)] font-medium mb-1">{label}</p>
      {payload.map((item: { name: string; value: number; fill: string }, idx: number) => (
        <p key={idx} className="font-semibold text-[11px]" style={{ color: item.fill }}>
          {item.name}: {item.value} jemputan
        </p>
      ))}
    </div>
  );
}

export function InvitationGrowthPanel({ metrics, rangeLabel }: Props) {
  const hasData = metrics.series.some((p) => p.created > 0 || p.published > 0);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-0.5">
            Pertumbuhan Produk
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
            Trend Jemputan (Dicipta vs Diterbitkan)
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
            Perbandingan aktiviti draf baharu dan jemputan diaktifkan ({rangeLabel})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
              Diterbitkan
            </span>
            <span className="text-xl font-bold font-display text-emerald-700">
              {metrics.periodPublished}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[var(--surface-warm)] border border-dashed border-[var(--border)]">
            <span className="text-2xl mb-1">💌</span>
            <p className="text-xs font-medium text-[var(--text-muted)] font-ui">
              Tiada aktiviti penciptaan atau penerbitan jemputan dalam tempoh {rangeLabel}.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.series} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-ui)" }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-ui)" }}
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "8px", fontSize: "11px", fontFamily: "var(--font-ui)" }}
              />
              <Bar dataKey="created" name="Dicipta" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="published" name="Diterbitkan" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Lifetime Status Snapshot */}
      <div className="pt-2 border-t border-[var(--border-soft)] space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-ui block">
          Snapshot Status Sepanjang Masa (Mutually Exclusive)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
            <span className="text-[10px] uppercase font-bold text-gray-500 font-ui block">Draf</span>
            <span className="text-base font-bold font-ui text-[var(--text)] mt-0.5 block">
              {metrics.currentStatus.draft}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-[10px] uppercase font-bold text-emerald-700 font-ui block">Diterbitkan</span>
            <span className="text-base font-bold font-ui text-emerald-800 mt-0.5 block">
              {metrics.currentStatus.published}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 font-ui block">Tamat Tempoh</span>
            <span className="text-base font-bold font-ui text-amber-800 mt-0.5 block">
              {metrics.currentStatus.expired}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
            <span className="text-[10px] uppercase font-bold text-gray-500 font-ui block">Jumlah Jemputan</span>
            <span className="text-base font-bold font-ui text-[var(--text)] mt-0.5 block">
              {metrics.currentStatus.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
