import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminAuditLogsPage } from "@/lib/data/admin-audit-logs";
import { AuditLogTable } from "@/components/admin/audit/AuditLogTable";
import { AdminPagination } from "@/components/admin/shared/AdminPagination";

export const metadata: Metadata = {
  title: "Admin — Log Audit | WALIMATUL",
  description: "Jejak dan semak rekod aktiviti operasi pentadbir WALIMATUL.",
};

const ENTITY_FILTERS = [
  { value: "all", label: "Semua Entiti" },
  { value: "settings", label: "Tetapan" },
  { value: "announcement", label: "Pengumuman" },
  { value: "invitation", label: "Jemputan" },
  { value: "order", label: "Pembayaran" },
  { value: "template", label: "Templat" },
];

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;
  const entityType = typeof sp.entity === "string" ? sp.entity : "all";
  const action = typeof sp.action === "string" ? sp.action : "all";

  const result = await getAdminAuditLogsPage({ page, pageSize: 20, entityType, action });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
          Ketelusan &amp; Keselamatan
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] mt-1">
          Log Audit Pentadbir
        </h1>
        <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] mt-1">
          Rekod jejak audit operasi pentadbir yang tidak boleh diubah (append-only) untuk ketelusan tindakan sistem.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface)] border border-[var(--border)] w-fit">
        {ENTITY_FILTERS.map((f) => {
          const isActive = entityType === f.value;
          return (
            <Link
              key={f.value}
              href={`/admin/audit-logs?entity=${f.value}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-ui font-semibold transition-all ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-warm)]"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* ── Content ── */}
      {result.logs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center text-xl">
            📋
          </div>
          <h3 className="font-display font-bold text-base text-[var(--text)]">
            Belum ada rekod aktiviti Admin.
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] max-w-sm mx-auto">
            {entityType !== "all"
              ? "Tiada rekod log audit untuk entiti ini."
              : "Semua tindakan operasi pentadbir akan direkodkan di sini secara automatik."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AuditLogTable logs={result.logs} />

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
