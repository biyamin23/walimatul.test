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
import type { CustomerAnalyticsMetrics } from "@/types/reports";

interface Props {
  metrics: CustomerAnalyticsMetrics;
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
      <p className="font-bold text-indigo-700 text-sm">
        {payload[0].value} pengguna baharu
      </p>
    </div>
  );
}

export function CustomerAnalyticsPanel({ metrics, rangeLabel }: Props) {
  const hasData = metrics.series.some((p) => p.count > 0);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-0.5">
            Pertumbuhan Pelanggan
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
            Pendaftaran &amp; Pelanggan Berbayar
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
            Pertumbuhan pendaftaran akaun klien ({rangeLabel})
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Pengguna Baharu
          </span>
          <span className="text-xl font-bold font-display text-indigo-700">
            {metrics.periodNewUsers}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[var(--surface-warm)] border border-dashed border-[var(--border)]">
            <span className="text-2xl mb-1">👥</span>
            <p className="text-xs font-medium text-[var(--text-muted)] font-ui">
              Tiada pendaftaran pengguna baharu dalam tempoh {rangeLabel}.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.series} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="customerReportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
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
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-ui)" }}
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                name="Pengguna Baharu"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#customerReportGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Commercial Customer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-soft)]">
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Pelanggan Berbayar (Tempoh)
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {metrics.periodPaidCustomers} pengguna
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Pembeli Berulang (Tempoh)
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {metrics.periodRepeatCustomers} pengguna
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Jumlah Pelanggan Berbayar
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {metrics.lifetimePaidClients} / {metrics.lifetimeTotalClients}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-ui block">
            Kadar Pembeli Berulang (All)
          </span>
          <span className="text-sm font-bold font-ui text-[var(--text)] mt-0.5 block">
            {metrics.lifetimePaidClients > 0
              ? `${((metrics.lifetimeRepeatClients / metrics.lifetimePaidClients) * 100).toFixed(1)}%`
              : "0.0%"}
          </span>
        </div>
      </div>
    </div>
  );
}
