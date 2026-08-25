import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminAnnouncementsPage } from "@/lib/data/admin-announcements";
import { AdminSearchInput } from "@/components/admin/shared/AdminSearchInput";
import { AdminPagination } from "@/components/admin/shared/AdminPagination";

export const metadata: Metadata = {
  title: "Admin — Pengumuman | WALIMATUL",
  description: "Pengurusan pengumuman dan notis papan pemuka pelanggan.",
};

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function AnnouncementStatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
        Aktif
      </span>
    );
  }
  if (status === "archived") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
        Diarkib
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
      Draf
    </span>
  );
}

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;
  const search = typeof sp.q === "string" ? sp.q : "";
  const status = typeof sp.status === "string" ? sp.status : "all";

  const result = await getAdminAnnouncementsPage({ page, pageSize: 20, search, status });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Komunikasi Pelanggan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Pengumuman
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Cipta, jadualkan, dan urus pengumuman yang dipaparkan di papan pemuka pelanggan.
          </p>
        </div>

        <Link
          href="/admin/announcements/new"
          className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors shrink-0"
        >
          + Cipta Pengumuman
        </Link>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <AdminSearchInput
          placeholder="Cari tajuk atau mesej pengumuman..."
          initialValue={search}
        />

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          {[
            { value: "all", label: "Semua" },
            { value: "active", label: "Aktif" },
            { value: "draft", label: "Draf" },
            { value: "archived", label: "Diarkib" },
          ].map((item) => {
            const isActive = status === item.value;
            return (
              <Link
                key={item.value}
                href={`/admin/announcements?status=${item.value}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-ui font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Announcements Content ── */}
      {result.announcements.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center text-xl">
            📢
          </div>
          <h3 className="font-display font-bold text-base text-[var(--text)]">
            Tiada Pengumuman Ditemui
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] max-w-sm mx-auto">
            {search || status !== "all"
              ? "Tiada pengumuman yang sepadan dengan tapisan semasa."
              : "Belum ada pengumuman dicipta. Klik butang di atas untuk mencipta pengumuman baharu."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[10px] font-ui font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3.5 px-5">Tajuk &amp; Mesej</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tarikh Mula</th>
                  <th className="py-3.5 px-4">Tarikh Tamat</th>
                  <th className="py-3.5 px-4">Dikemas Kini</th>
                  <th className="py-3.5 px-5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-xs font-ui">
                {result.announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface-warm)]/60 transition-colors">
                    <td className="py-4 px-5 max-w-md">
                      <Link
                        href={`/admin/announcements/${item.id}/edit`}
                        className="font-semibold text-[var(--text)] hover:text-[var(--primary)] hover:underline block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {item.message}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <AnnouncementStatusBadge status={item.status} />
                    </td>

                    <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDateTime(item.starts_at)}
                    </td>

                    <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDateTime(item.ends_at)}
                    </td>

                    <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                      {formatDateTime(item.updated_at)}
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/announcements/${item.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-xs font-semibold font-ui transition-colors"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-3">
            {result.announcements.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--text)]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] font-ui line-clamp-2 mt-1">
                      {item.message}
                    </p>
                  </div>
                  <AnnouncementStatusBadge status={item.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--surface-warm)] text-xs font-ui">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Mula
                    </span>
                    <span className="text-[var(--text)]">{formatDateTime(item.starts_at)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Tamat
                    </span>
                    <span className="text-[var(--text)]">{formatDateTime(item.ends_at)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <Link
                    href={`/admin/announcements/${item.id}/edit`}
                    className="px-4 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Edit Pengumuman →
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
