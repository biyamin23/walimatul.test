import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminInvitationsPage } from "@/lib/data/admin-invitations";
import { InvitationFilterBar } from "@/components/admin/invitations/InvitationFilterBar";
import { AdminPagination } from "@/components/admin/shared/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/shared/AdminStatusBadge";

export const metadata: Metadata = {
  title: "Admin — Jemputan | WALIMATUL",
  description: "Pengurusan dan semakan semua jemputan pelanggan.",
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

export default async function AdminInvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;
  const search = typeof sp.q === "string" ? sp.q : "";
  const status = typeof sp.status === "string" ? sp.status : "all";
  const templateId = typeof sp.template === "string" ? sp.template : "all";
  const paymentStatus = typeof sp.payment === "string" ? sp.payment : "all";

  const result = await getAdminInvitationsPage({
    page,
    pageSize: 20,
    search,
    status,
    templateId,
    paymentStatus,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan Operasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Jemputan
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Semak dan urus semua jemputan pelanggan, status penerbitan, dan tempoh sah.
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <InvitationFilterBar
        availableTemplates={result.availableTemplates}
        currentSearch={search}
        currentStatus={status}
        currentTemplateId={templateId}
        currentPaymentStatus={paymentStatus}
      />

      {/* ── Invitations List ── */}
      {result.invitations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center text-xl">
            💌
          </div>
          <h3 className="font-display font-bold text-base text-[var(--text)]">
            Tiada Jemputan Ditemui
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] max-w-sm mx-auto">
            {search || status !== "all" || templateId !== "all" || paymentStatus !== "all"
              ? "Tiada jemputan yang sepadan dengan kriteria carian atau tapisan anda. Sila tetapkan semula tapisan."
              : "Belum ada jemputan didaftarkan dalam sistem."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[10px] font-ui font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-3.5 px-5">Pasangan</th>
                    <th className="py-3.5 px-4">Pelanggan</th>
                    <th className="py-3.5 px-4">Templat</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tarikh Majlis</th>
                    <th className="py-3.5 px-4">Tamat Tempoh</th>
                    <th className="py-3.5 px-4">Bayaran</th>
                    <th className="py-3.5 px-5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs font-ui">
                  {result.invitations.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-[var(--surface-warm)]/60 transition-colors"
                    >
                      {/* Couple & Slug */}
                      <td className="py-4 px-5 font-semibold text-[var(--text)]">
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

                      {/* Client */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/users/${inv.user.id}`}
                          className="font-medium text-[var(--text)] hover:text-[var(--primary)] hover:underline block"
                        >
                          {inv.user.full_name || "Pelanggan"}
                        </Link>
                        {inv.user.phone && (
                          <span className="text-[10px] text-[var(--text-muted)] block">
                            {inv.user.phone}
                          </span>
                        )}
                      </td>

                      {/* Template */}
                      <td className="py-4 px-4 text-[var(--text-muted)]">
                        {inv.template.name}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <AdminStatusBadge
                          type="invitation"
                          status={inv.status}
                          expiresAt={inv.expires_at}
                        />
                      </td>

                      {/* Wedding Date */}
                      <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                        {formatDate(inv.wedding_date)}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-4 text-[var(--text-muted)] whitespace-nowrap">
                        {formatDate(inv.expires_at)}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {inv.latestOrder ? (
                          <div>
                            <AdminStatusBadge
                              type="payment"
                              status={inv.latestOrder.payment_status}
                            />
                            <span className="text-[10px] font-semibold text-[var(--text-muted)] block mt-0.5">
                              {fmtMYR(inv.latestOrder.amount)}
                            </span>
                          </div>
                        ) : (
                          <AdminStatusBadge type="payment" status="no_order" />
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                        {inv.slug && inv.status === "published" && (
                          <a
                            href={`/${inv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-stone-600 hover:border-stone-400 text-xs font-semibold font-ui transition-colors"
                          >
                            Buka ↗
                          </a>
                        )}
                        <Link
                          href={`/admin/invitations/${inv.id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          Urus →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden space-y-3">
            {result.invitations.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--text)]">
                      {inv.groom_short_name || inv.groom_name || "Pengantin"} &amp;{" "}
                      {inv.bride_short_name || inv.bride_name || "Pengantin"}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] font-ui mt-0.5">
                      Templat: {inv.template.name}
                    </p>
                    {inv.slug && (
                      <span className="text-[10px] text-stone-400 font-mono block">
                        /{inv.slug}
                      </span>
                    )}
                  </div>
                  <AdminStatusBadge
                    type="invitation"
                    status={inv.status}
                    expiresAt={inv.expires_at}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--surface-warm)] text-xs font-ui">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Pelanggan
                    </span>
                    <Link
                      href={`/admin/users/${inv.user.id}`}
                      className="font-semibold text-[var(--primary)] hover:underline"
                    >
                      {inv.user.full_name || "Pelanggan"}
                    </Link>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Bayaran
                    </span>
                    {inv.latestOrder ? (
                      <span className="font-semibold text-emerald-800">
                        {fmtMYR(inv.latestOrder.amount)}
                      </span>
                    ) : (
                      <span className="text-stone-400 font-medium">Tiada Pesanan</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Tarikh Majlis
                    </span>
                    <span className="text-[var(--text)]">{formatDate(inv.wedding_date)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase font-medium">
                      Tamat Tempoh
                    </span>
                    <span className="text-[var(--text)]">{formatDate(inv.expires_at)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {inv.slug && inv.status === "published" && (
                    <a
                      href={`/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-stone-600 text-xs font-semibold font-ui hover:border-stone-400 transition-colors"
                    >
                      Buka ↗
                    </a>
                  )}
                  <Link
                    href={`/admin/invitations/${inv.id}`}
                    className="px-4 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Urus Butiran →
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
