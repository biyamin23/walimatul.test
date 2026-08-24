import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAdminDashboardStats,
  getAdminAnalytics,
  parseRange,
} from "@/lib/data/admin-dashboard";
import { DashboardRangeSelector } from "@/components/admin/dashboard/DashboardRangeSelector";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { InvitationStatusChart } from "@/components/admin/dashboard/InvitationStatusChart";
import { TopTemplates } from "@/components/admin/dashboard/TopTemplates";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";
import type { OrderPaymentStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Admin Dashboard — WALIMATUL",
  description: "Operations overview for WALIMATUL platform.",
};

// ─── Shared helpers ────────────────────────────────────────────────────────────

function fmtMYR(amount: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(iso));
}

function StatusBadge({ status }: { status: OrderPaymentStatus }) {
  const map: Record<OrderPaymentStatus, { label: string; bg: string; text: string }> = {
    pending_payment: { label: "Belum Bayar", bg: "#f3f4f6", text: "#374151" },
    pending_verification: { label: "Menunggu Semak", bg: "#fef3c7", text: "#92400e" },
    paid: { label: "Dibayar", bg: "#d1fae5", text: "#065f46" },
    payment_rejected: { label: "Ditolak", bg: "#fee2e2", text: "#991b1b" },
    cancelled: { label: "Dibatal", bg: "#f3f4f6", text: "#6b7280" },
    refunded: { label: "Dikembalikan", bg: "#ede9fe", text: "#5b21b6" },
  };
  const s = map[status] ?? { label: status, bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wide"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  accent: string;
  accentBg: string;
  icon: React.ReactNode;
  subtext?: string;
}

function KpiCard({ label, value, accent, accentBg, icon, subtext }: KpiCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accentBg }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold leading-tight" style={{ color: accent }}>
          {value}
        </p>
        <p className="text-[11px] font-ui font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        {subtext && (
          <p className="text-[10px] font-ui mt-1" style={{ color: "var(--text-subtle)" }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Next.js 16: searchParams is a Promise — must await
  const sp = await searchParams;
  const range = parseRange(sp.range);

  const [stats, analytics] = await Promise.all([
    getAdminDashboardStats(),
    getAdminAnalytics(range),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ── Page Header + Range Selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span
            className="text-[10px] font-ui font-bold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            Operasi Platform
          </span>
          <h1
            className="mt-1 font-display text-2xl sm:text-3xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-ui" style={{ color: "var(--text-muted)" }}>
            Gambaran keseluruhan platform WALIMATUL — pengguna, jemputan, dan kutipan hasil.
          </p>
        </div>
        <DashboardRangeSelector currentRange={range} />
      </div>

      {/* ── Pending Verification Alert ── */}
      {stats.pendingVerificationCount > 0 && (
        <div
          className="p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
              style={{ background: "#fef3c7" }}
              aria-hidden="true"
            >
              🔔
            </div>
            <div>
              <h2 className="font-display text-base font-bold" style={{ color: "#78350f" }}>
                {stats.pendingVerificationCount} Pembayaran Menunggu Pengesahan
              </h2>
              <p className="text-xs font-ui mt-0.5" style={{ color: "#92400e" }}>
                Klien telah memuat naik resit dan menunggu semakan anda.
              </p>
            </div>
          </div>
          <Link
            href="/admin/payments"
            className="shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold font-ui transition-colors"
            style={{ background: "#d97706", color: "#ffffff" }}
          >
            Semak Sekarang ({stats.pendingVerificationCount}) →
          </Link>
        </div>
      )}

      {/* ── KPI Grid — Lifetime metrics ── */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Metrik Platform (Semua Masa)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          <KpiCard
            label="Jumlah Pengguna"
            value={stats.totalUsers}
            accent="#065f46"
            accentBg="#d1fae5"
            subtext="Semua masa"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" stroke="#065f46" strokeWidth="1.4" />
                <path d="M3 15c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />

          <KpiCard
            label="Jumlah Jemputan"
            value={stats.totalInvitations}
            accent="#0c4a6e"
            accentBg="#e0f2fe"
            subtext="Semua masa"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="3" width="14" height="12" rx="2" stroke="#0369a1" strokeWidth="1.4" />
                <path d="M2 7h14M6 3v4M12 3v4" stroke="#0369a1" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />

          <KpiCard
            label="Jemputan Aktif"
            value={stats.publishedInvitations}
            accent="#14532d"
            accentBg="#dcfce7"
            subtext={`${stats.draftInvitations} draf`}
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9l4 4 6-6" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />

          <KpiCard
            label="Menunggu Semak"
            value={stats.pendingVerificationCount}
            accent="#78350f"
            accentBg="#fef3c7"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="#d97706" strokeWidth="1.4" />
                <path d="M9 5.5v4l2.5 2" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />

          <KpiCard
            label="Jemputan Dibayar"
            value={stats.paidCount}
            accent="#134e4a"
            accentBg="#ccfbf1"
            subtext="Semua masa"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="5" width="14" height="9" rx="1.5" stroke="#0f766e" strokeWidth="1.4" />
                <path d="M2 8.5h14" stroke="#0f766e" strokeWidth="1.4" />
                <path d="M5 12h3" stroke="#0f766e" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />

          <KpiCard
            label="Bayaran Ditolak"
            value={stats.rejectedCount}
            accent="#7f1d1d"
            accentBg="#fee2e2"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="#dc2626" strokeWidth="1.4" />
                <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />

          <KpiCard
            label="Jumlah Hasil (MYR)"
            value={fmtMYR(stats.totalRevenuePaid)}
            accent="var(--primary)"
            accentBg="var(--primary-soft)"
            subtext="Semua masa · orders.amount"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2v14M12.5 5H7.25A2.25 2.25 0 0 0 7.25 9.5h3.5A2.25 2.25 0 0 1 10.75 14H5.5" stroke="#174f3a" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />

          <KpiCard
            label="Hasil Bulan Ini"
            value={fmtMYR(stats.monthlyRevenuePaid)}
            accent="#713f12"
            accentBg="#fef9c3"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 13l4-4 3 3 4-5 3 3" stroke="#ca8a04" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── Analytics Row: Revenue Chart + Status Donut ── */}
      <section aria-labelledby="analytics-heading">
        <h2 id="analytics-heading" className="sr-only">Analitik Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue chart — 2/3 width on desktop */}
          <div className="lg:col-span-2 min-h-[280px] flex flex-col">
            <RevenueChart
              data={analytics.revenueSeries}
              rangeLabel={analytics.rangeLabel}
              rangeRevenue={analytics.rangeRevenue}
            />
          </div>

          {/* Invitation status donut — 1/3 width */}
          <div>
            <InvitationStatusChart data={analytics.invitationStatus} />
          </div>
        </div>
      </section>

      {/* ── Side-by-side: Top Templates + Recent Activity ── */}
      <section aria-labelledby="insights-heading">
        <h2 id="insights-heading" className="sr-only">Maklumat Lanjut</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopTemplates
            items={analytics.topTemplates}
            totalInvitations={stats.totalInvitations}
          />
          <RecentActivity items={analytics.recentActivity} />
        </div>
      </section>

      {/* ── Recent Payments (existing — full width) ── */}
      <section aria-labelledby="recent-payments-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="recent-payments-heading"
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text)" }}
          >
            Pesanan Terkini
          </h2>
          <Link
            href="/admin/payments"
            className="text-xs font-ui font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            Lihat Semua →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-ui" style={{ color: "var(--text-muted)" }}>
              Tiada pesanan lagi.
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-[10px] font-ui font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}
            >
              <span>Jemputan</span>
              <span>Templat</span>
              <span>Amaun</span>
              <span>Status</span>
            </div>
            <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
              {stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/payments/${order.id}`}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-[var(--surface-warm)] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-ui font-medium" style={{ color: "var(--text)" }}>
                        {order.invitation_name}
                      </p>
                      <p className="text-[11px] font-ui mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {fmtDate(order.created_at)}
                      </p>
                    </div>
                    <span className="text-xs font-ui hidden sm:block" style={{ color: "var(--text-muted)" }}>
                      {order.template_name}
                    </span>
                    <span className="text-sm font-ui font-semibold" style={{ color: "var(--text)" }}>
                      {fmtMYR(order.amount)}
                    </span>
                    <StatusBadge status={order.payment_status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Quick Navigation ── */}
      <section aria-labelledby="quick-nav-heading">
        <h2
          id="quick-nav-heading"
          className="font-display text-lg font-semibold mb-4"
          style={{ color: "var(--text)" }}
        >
          Navigasi Pantas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div
            className="rounded-2xl p-6 flex flex-col justify-between gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div>
              <h3 className="font-display text-base font-bold mb-1" style={{ color: "var(--text)" }}>
                Templat &amp; Rekaan
              </h3>
              <p className="text-xs font-ui leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Cipta templat Hybrid baharu, muat naik latar belakang, tetapkan harga, dan konfigurasi animasi.
              </p>
            </div>
            <Link
              id="admin-link-templates"
              href="/admin/templates"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold font-ui transition-colors"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Urus Templat →
            </Link>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col justify-between gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div>
              <h3 className="font-display text-base font-bold mb-1" style={{ color: "var(--text)" }}>
                Pembayaran Klien
              </h3>
              <p className="text-xs font-ui leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Lihat semua pesanan, semak resit Touch &apos;n Go eWallet, dan aktifkan jemputan yang telah dibayar.
              </p>
            </div>
            <Link
              id="admin-link-payments"
              href="/admin/payments"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold font-ui transition-colors"
              style={{ background: "var(--surface-warm)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Buka Senarai Pembayaran →
            </Link>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col justify-between gap-4"
            style={{ background: "var(--surface)", border: "1px dashed var(--border)" }}
          >
            <div>
              <h3 className="font-display text-base font-bold mb-1" style={{ color: "var(--text)" }}>
                Supabase Dashboard
              </h3>
              <p className="text-xs font-ui leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Akses terus pangkalan data PostgreSQL, RLS policies, logs, dan storage buckets.
              </p>
            </div>
            <a
              id="admin-link-supabase"
              href="https://supabase.com/dashboard/project/xjaclwiilmmzjiftnnob"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold font-ui transition-colors"
              style={{ background: "var(--surface-warm)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Buka Konsol Supabase ↗
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
