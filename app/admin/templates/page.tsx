import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminTemplatesList } from "@/lib/data/admin-templates";
import { TemplateList } from "@/components/admin/templates/TemplateList";

export const metadata: Metadata = {
  title: "Admin — Pengurusan Templat | WALIMATUL",
  description: "Cipta, kemaskini, dan urus rekaan templat perkahwinan digital.",
};

export default async function AdminTemplatesPage() {
  await requireAdmin();

  const templates = await getAdminTemplatesList();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan Produk &amp; Rekaan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Katalog &amp; Templat Rekaan
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Urus templat Hybrid, tetapan harga, aset grafik latar belakang, dan animasi overlay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates/new"
            className="px-5 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-md transition-colors inline-flex items-center gap-2"
          >
            <span>+ Cipta Templat Baharu</span>
          </Link>
        </div>
      </div>

      {/* ── Templates List Component ── */}
      <TemplateList initialTemplates={templates} />
    </div>
  );
}
