"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize?: number;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 20,
}: AdminPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1 && totalCount <= pageSize) {
    return null;
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const startRecord = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs font-ui text-[var(--text-muted)]">
      <div>
        Menunjukkan{" "}
        <span className="font-semibold text-[var(--text)]">
          {totalCount > 0 ? `${startRecord}–${endRecord}` : "0"}
        </span>{" "}
        daripada <span className="font-semibold text-[var(--text)]">{totalCount}</span> rekod
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-warm)] text-[var(--text)] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Sebelum
        </button>

        <span className="px-3 py-1.5 font-semibold text-[var(--text)]">
          Halaman {currentPage} / {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-warm)] text-[var(--text)] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Seterusnya →
        </button>
      </div>
    </div>
  );
}
