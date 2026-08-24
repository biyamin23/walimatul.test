"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AdminSearchInput } from "@/components/admin/shared/AdminSearchInput";

interface InvitationFilterBarProps {
  availableTemplates: Array<{ id: string; name: string }>;
  currentSearch?: string;
  currentStatus?: string;
  currentTemplateId?: string;
  currentPaymentStatus?: string;
}

export function InvitationFilterBar({
  availableTemplates,
  currentSearch = "",
  currentStatus = "all",
  currentTemplateId = "all",
  currentPaymentStatus = "all",
}: InvitationFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page to 1
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full">
      <AdminSearchInput
        placeholder="Cari pengantin atau slug URL..."
        initialValue={currentSearch}
      />

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Status filter */}
        <select
          value={currentStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          disabled={isPending}
          className="px-3 py-2 rounded-xl text-xs font-ui bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-xs"
          aria-label="Tapis mengikut status jemputan"
        >
          <option value="all">Semua Status</option>
          <option value="published">Diterbitkan</option>
          <option value="draft">Draf</option>
          <option value="expired">Tamat Tempoh</option>
        </select>

        {/* Template filter */}
        <select
          value={currentTemplateId}
          onChange={(e) => handleFilterChange("template", e.target.value)}
          disabled={isPending}
          className="px-3 py-2 rounded-xl text-xs font-ui bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-xs"
          aria-label="Tapis mengikut templat"
        >
          <option value="all">Semua Templat</option>
          {availableTemplates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Payment filter */}
        <select
          value={currentPaymentStatus}
          onChange={(e) => handleFilterChange("payment", e.target.value)}
          disabled={isPending}
          className="px-3 py-2 rounded-xl text-xs font-ui bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-xs"
          aria-label="Tapis mengikut status bayaran"
        >
          <option value="all">Semua Bayaran</option>
          <option value="paid">Telah Dibayar</option>
          <option value="pending_verification">Menunggu Semak</option>
          <option value="pending_payment">Belum Bayar</option>
          <option value="payment_rejected">Bayaran Ditolak</option>
          <option value="no_order">Tiada Pesanan</option>
        </select>
      </div>
    </div>
  );
}
