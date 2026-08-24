import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminUsersPage } from "@/lib/data/admin-users";
import { AdminSearchInput } from "@/components/admin/shared/AdminSearchInput";
import { AdminPagination } from "@/components/admin/shared/AdminPagination";

export const metadata: Metadata = {
  title: "Admin — Pengguna | WALIMATUL",
  description: "Pengurusan dan semakan akaun pelanggan WALIMATUL.",
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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;
  const search = typeof sp.q === "string" ? sp.q : "";

  const result = await getAdminUsersPage({ page, pageSize: 20, search });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan Pelanggan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Pengguna
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Urus dan semak akaun pelanggan WALIMATUL serta ringkasan aktiviti mereka.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <AdminSearchInput
            placeholder="Cari nama atau no. telefon..."
            initialValue={search}
          />
        </div>
      </div>

      {/* ── Users Content ── */}
      {result.users.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center text-xl">
            👤
          </div>
          <h3 className="font-display font-bold text-base text-[var(--text)]">
            Tiada Pengguna Ditemui
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] max-w-sm mx-auto">
            {search
              ? `Tiada rekod pelanggan yang sepadan dengan carian "${search}". Sila cuba kata kunci lain.`
              : "Belum ada pelanggan berdaftar dalam sistem."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[10px] font-ui font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-3.5 px-5">Pelanggan</th>
                    <th className="py-3.5 px-4">Telefon</th>
                    <th className="py-3.5 px-4">Tarikh Daftar</th>
                    <th className="py-3.5 px-4 text-center">Jemputan</th>
                    <th className="py-3.5 px-4 text-center">Pesanan Berbayar</th>
                    <th className="py-3.5 px-4 text-right">Jumlah Belanja</th>
                    <th className="py-3.5 px-4">Aktiviti Terakhir</th>
                    <th className="py-3.5 px-5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs font-ui">
                  {result.users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[var(--surface-warm)]/60 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors hover:underline block"
                            >
                              {user.full_name || "Pelanggan Tanpa Nama"}
                            </Link>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {user.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-[var(--text-muted)]">
                        {user.phone || "—"}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Invitation count */}
                      <td className="py-4 px-4 text-center font-semibold text-[var(--text)]">
                        {user.invitationCount}
                      </td>

                      {/* Paid orders count */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {user.paidOrderCount}
                        </span>
                      </td>

                      {/* Lifetime spend */}
                      <td className="py-4 px-4 text-right font-semibold text-[var(--primary)] whitespace-nowrap">
                        {fmtMYR(user.lifetimeSpend)}
                      </td>

                      {/* Latest Activity */}
                      <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                        {formatDate(user.latestActivity)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-xs font-semibold font-ui transition-all"
                        >
                          Lihat →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-3">
            {result.users.map((user) => (
              <div
                key={user.id}
                className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--text)]">
                        {user.full_name || "Pelanggan Tanpa Nama"}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] font-ui">
                        {user.phone || "Tiada nombor telefon"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {user.id.slice(0, 8)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--surface-warm)] text-center text-xs font-ui">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Jemputan
                    </span>
                    <span className="font-bold text-[var(--text)]">
                      {user.invitationCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Berbayar
                    </span>
                    <span className="font-bold text-emerald-800">
                      {user.paidOrderCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Belanja
                    </span>
                    <span className="font-bold text-[var(--primary)]">
                      {fmtMYR(user.lifetimeSpend)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-ui text-[var(--text-muted)]">
                    Daftar: {formatDate(user.created_at)}
                  </span>
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="px-4 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Lihat Profil →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={result.page}
            totalPages={result.totalPages}
            totalCount={result.totalCount}
            pageSize={result.pageSize}
          />
        </div>
      )}
    </div>
  );
}
