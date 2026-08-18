import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getAdminPaymentStats } from "@/lib/data/admin-payments";

export const metadata: Metadata = {
  title: "Admin Dashboard — WALIMATUL",
};

export default async function AdminPage() {
  const stats = await getAdminPaymentStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-[var(--text)] font-semibold mb-1">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-ui">
          Urus semakan pembayaran, pengaktifan jemputan, dan pangkalan data WALIMATUL.
        </p>
      </div>

      {/* ── Pending Verification Alert Banner ── */}
      {stats.pendingVerificationCount > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
              🔔
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-blue-950">
                {stats.pendingVerificationCount} Pembayaran Menunggu Pengesahan
              </h3>
              <p className="text-xs font-ui text-blue-800 mt-0.5">
                Klien telah memuat naik resit pemindahan Touch ’n Go eWallet dan menunggu semakan anda.
              </p>
            </div>
          </div>

          <Link
            href="/admin/payments"
            className="px-5 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold font-ui transition-colors shadow-xs whitespace-nowrap"
          >
            Semak Sekarang ({stats.pendingVerificationCount}) →
          </Link>
        </div>
      )}

      {/* ── Metric Summary Panels ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-[var(--border)] shadow-xs"
        >
          <div className="text-2xl mb-2" aria-hidden="true">
            ⏳
          </div>
          <p className="text-3xl font-display font-bold text-blue-700 mb-1">
            {stats.pendingVerificationCount}
          </p>
          <p className="text-xs text-[var(--text-muted)] font-ui font-medium uppercase tracking-wider">
            Menunggu Pengesahan
          </p>
        </div>

        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-[var(--border)] shadow-xs"
        >
          <div className="text-2xl mb-2" aria-hidden="true">
            💌
          </div>
          <p className="text-3xl font-display font-bold text-emerald-700 mb-1">
            {stats.paidCount}
          </p>
          <p className="text-xs text-[var(--text-muted)] font-ui font-medium uppercase tracking-wider">
            Jemputan Aktif (Dibayar)
          </p>
        </div>

        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-[var(--border)] shadow-xs"
        >
          <div className="text-2xl mb-2" aria-hidden="true">
            ✕
          </div>
          <p className="text-3xl font-display font-bold text-red-700 mb-1">
            {stats.rejectedCount}
          </p>
          <p className="text-xs text-[var(--text-muted)] font-ui font-medium uppercase tracking-wider">
            Bayaran Ditolak
          </p>
        </div>

        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-[var(--border)] shadow-xs"
        >
          <div className="text-2xl mb-2" aria-hidden="true">
            💳
          </div>
          <p className="text-3xl font-display font-bold text-[var(--primary)] mb-1">
            RM {(stats.paidCount * 49).toFixed(2)}
          </p>
          <p className="text-xs text-[var(--text-muted)] font-ui font-medium uppercase tracking-wider">
            Jumlah Kutipan (MYR)
          </p>
        </div>
      </div>

      {/* ── Quick Links Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-1">
              Pengurusan Templat &amp; Rekaan
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-ui leading-relaxed">
              Cipta templat Hybrid baharu, muat naik latar belakang tersuai, tetapkan harga, dan konfigurasikan animasi overlay.
            </p>
          </div>
          <Link
            href="/admin/templates"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
          >
            Urus Templat &amp; Rekaan →
          </Link>
        </div>

        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-1">
              Pengurusan Pembayaran Klien
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-ui leading-relaxed">
              Lihat senarai penuh pesanan, semak gambar resit pemindahan Touch ’n Go eWallet, sahkan pembayaran, dan aktifkan jemputan.
            </p>
          </div>
          <Link
            href="/admin/payments"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:border-[var(--primary)] transition-colors"
          >
            Buka Senarai Pembayaran →
          </Link>
        </div>

        <div
          className="rounded-[var(--radius-lg)] p-6 bg-[var(--surface)] border border-dashed border-[var(--border)] flex flex-col justify-between space-y-4"
        >
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-1">
              Supabase Dashboard
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-ui leading-relaxed">
              Akses terus pangkalan data PostgreSQL, RLS policies, logs, dan storage buckets melalui konsol rasmi Supabase.
            </p>
          </div>
          <a
            id="admin-link-supabase"
            href="https://supabase.com/dashboard/project/xjaclwiilmmzjiftnnob"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:border-[var(--primary)] transition-colors"
          >
            Buka Konsol Supabase ↗
          </a>
        </div>
      </div>
    </div>
  );
}
