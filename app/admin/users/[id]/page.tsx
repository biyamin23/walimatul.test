import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminUserDetail } from "@/lib/data/admin-users";
import { AdminStatusBadge } from "@/components/admin/shared/AdminStatusBadge";

export const metadata: Metadata = {
  title: "Admin — Butiran Pelanggan | WALIMATUL",
  description: "Butiran lengkap akaun pelanggan, jemputan, dan pembayaran.",
};

function fmtMYR(amount: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const userDetail = await getAdminUserDetail(id);

  if (!userDetail) {
    notFound();
  }

  const { profile, metrics, invitations, orders } = userDetail;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Breadcrumb & Back Navigation ── */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-ui font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-2"
        >
          ← Kembali ke Senarai Pengguna
        </Link>
      </div>

      {/* ── Profile Header Card ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xl shrink-0">
            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                {profile.full_name || "Pelanggan Tanpa Nama"}
              </h1>
              <AdminStatusBadge type="role" status={profile.role} />
            </div>
            <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] mt-0.5">
              {profile.phone || "Tiada nombor telefon"} · Mendaftar pada {formatDate(profile.created_at)}
            </p>
            <span className="text-[11px] font-mono text-stone-400 block mt-1">
              ID: {profile.id}
            </span>
          </div>
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] font-ui block">
            Jumlah Jemputan
          </span>
          <p className="text-3xl font-display font-bold text-[var(--text)] mt-1">
            {metrics.invitationCount}
          </p>
          <span className="text-xs text-[var(--text-muted)] font-ui mt-0.5 block">
            Jemputan dicipta oleh pelanggan
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 font-ui block">
            Pesanan Berbayar
          </span>
          <p className="text-3xl font-display font-bold text-emerald-800 mt-1">
            {metrics.paidOrderCount}
          </p>
          <span className="text-xs text-[var(--text-muted)] font-ui mt-0.5 block">
            Transaksi disahkan
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary)] font-ui block">
            Jumlah Belanja
          </span>
          <p className="text-3xl font-display font-bold text-[var(--primary)] mt-1">
            {fmtMYR(metrics.lifetimeSpend)}
          </p>
          <span className="text-xs text-[var(--text-muted)] font-ui mt-0.5 block">
            Nilai seumur hidup (LTV)
          </span>
        </div>
      </div>

      {/* ── Section: Client Invitations ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--text)]">
              Senarai Jemputan ({invitations.length})
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)]">
              Semua draf dan jemputan aktif yang dicipta oleh pelanggan ini.
            </p>
          </div>
        </div>

        {invitations.length === 0 ? (
          <div className="py-8 text-center text-xs font-ui text-[var(--text-muted)] bg-[var(--surface-warm)] rounded-2xl">
            Pelanggan ini belum mencipta sebarang jemputan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] font-ui font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-3">Pasangan</th>
                  <th className="py-3 px-3">Templat</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Tarikh Majlis</th>
                  <th className="py-3 px-3">Tamat Tempoh</th>
                  <th className="py-3 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs font-ui">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--surface-warm)]/50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[var(--text)]">
                      <div>
                        {inv.groom_short_name || inv.groom_name || "Pengantin"} &amp;{" "}
                        {inv.bride_short_name || inv.bride_name || "Pengantin"}
                      </div>
                      {inv.slug && (
                        <span className="text-[10px] text-stone-400 font-mono block">
                          /{inv.slug}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-muted)]">
                      {inv.template.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <AdminStatusBadge
                        type="invitation"
                        status={inv.status}
                        expiresAt={inv.expires_at}
                      />
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDate(inv.wedding_date)}
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDate(inv.expires_at)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-2">
                      {inv.slug && inv.status === "published" && (
                        <a
                          href={`/${inv.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1 rounded-lg border border-[var(--border)] text-[11px] font-ui font-semibold text-stone-600 hover:border-stone-400 transition-colors"
                        >
                          Buka ↗
                        </a>
                      )}
                      <Link
                        href={`/admin/invitations/${inv.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-[var(--primary)] text-white text-[11px] font-ui font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                      >
                        Urus →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section: Client Payment & Order History ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--text)]">
              Sejarah Pembayaran ({orders.length})
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)]">
              Rekod transaksi Touch ’n Go eWallet bagi pelanggan ini.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs font-ui text-[var(--text-muted)] bg-[var(--surface-warm)] rounded-2xl">
            Tiada rekod pesanan atau pembayaran.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] font-ui font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-3">Pesanan / Resit</th>
                  <th className="py-3 px-3">Jemputan</th>
                  <th className="py-3 px-3">Amaun</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Tarikh Pesanan</th>
                  <th className="py-3 px-3">Tarikh Pengesahan</th>
                  <th className="py-3 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs font-ui">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[var(--surface-warm)]/50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[var(--text)]">
                      <div>{ord.receipt_number || `ORD-${ord.id.slice(0, 8).toUpperCase()}`}</div>
                      <span className="text-[10px] text-stone-400 font-mono block">
                        {ord.template.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-muted)]">
                      {ord.invitation.groom_short_name || "Pengantin"} &amp;{" "}
                      {ord.invitation.bride_short_name || "Pengantin"}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[var(--primary)] whitespace-nowrap">
                      {fmtMYR(ord.amount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <AdminStatusBadge type="payment" status={ord.payment_status} />
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDate(ord.created_at)}
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDate(ord.paid_at || ord.reviewed_at)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/payments/${ord.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[11px] font-ui font-semibold transition-colors"
                      >
                        Semak Resit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
