import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminReportsData } from "@/lib/data/admin-reports";
import { ReportRangeSelector } from "@/components/admin/reports/ReportRangeSelector";
import { ReportSummaryKpis } from "@/components/admin/reports/ReportSummaryKpis";
import { RevenueTrendPanel } from "@/components/admin/reports/RevenueTrendPanel";
import { PaymentAnalyticsPanel } from "@/components/admin/reports/PaymentAnalyticsPanel";
import { InvitationGrowthPanel } from "@/components/admin/reports/InvitationGrowthPanel";
import { CustomerAnalyticsPanel } from "@/components/admin/reports/CustomerAnalyticsPanel";
import { TemplatePerformanceTable } from "@/components/admin/reports/TemplatePerformanceTable";

export const metadata: Metadata = {
  title: "Laporan & Analitik | WALIMATUL Admin",
  description: "Laporan prestasi komersial, trend kewangan, pertumbuhan jemputan dan pelanggan.",
};

interface Props {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminReportsPage({ searchParams }: Props) {
  await requireAdmin();
  const { range, from, to } = await searchParams;

  const data = await getAdminReportsData(range, from, to);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-semibold font-ui text-[var(--gold)] hover:underline inline-flex items-center gap-1"
            >
              ← Dashboard
            </Link>
            <span className="text-[var(--text-muted)] text-xs">•</span>
            <span className="text-xs font-medium font-ui text-[var(--text-muted)]">
              {data.range.label}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Laporan Prestasi Platform
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Analisis data operasi sebenar merangkumi kewangan, jemputan, pelanggan, dan templat.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="w-full md:w-auto">
          <ReportRangeSelector currentRange={data.range} />
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <ReportSummaryKpis summary={data.summary} rangeLabel={data.range.label} />

      {/* ── Financial & Payment Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendPanel
          series={data.revenueSeries}
          summary={data.summary}
          rangeLabel={data.range.label}
        />
        <PaymentAnalyticsPanel
          metrics={data.paymentMetrics}
          rangeLabel={data.range.label}
        />
      </div>

      {/* ── Growth Analytics Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvitationGrowthPanel
          metrics={data.invitationMetrics}
          rangeLabel={data.range.label}
        />
        <CustomerAnalyticsPanel
          metrics={data.customerMetrics}
          rangeLabel={data.range.label}
        />
      </div>

      {/* ── Template Performance Table ── */}
      <TemplatePerformanceTable
        templates={data.templatePerformance}
        rangeLabel={data.range.label}
      />
    </div>
  );
}
