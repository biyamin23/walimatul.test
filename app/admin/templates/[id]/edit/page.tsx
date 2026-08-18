import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminTemplateById } from "@/lib/data/admin-templates";
import { TemplateForm } from "@/components/admin/templates/TemplateForm";

export const metadata: Metadata = {
  title: "Kemaskini Rekaan Templat | WALIMATUL Admin",
};

interface EditTemplatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  await requireAdmin();
  const { id } = await params;

  const template = await getAdminTemplateById(id);
  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/templates"
            className="text-xs font-semibold font-ui text-[var(--gold)] hover:underline inline-flex items-center gap-1 mb-1 block"
          >
            ← Kembali ke Senarai Templat
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
              {template.name}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-ui border ${
                template.status === "active"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : template.status === "draft"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-stone-100 text-stone-600 border-stone-300"
              }`}
            >
              {template.status === "active" ? "Aktif" : template.status === "draft" ? "Draf" : "Diarkib"}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Enjin: <code className="font-mono">{template.component_key}</code> · Harga: RM{template.price} · Akses: {template.validity_months} Bulan
          </p>
        </div>

        <Link
          href={`/admin/templates/${template.id}/preview`}
          target="_blank"
          className="px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-warm)] text-xs font-semibold font-ui text-[var(--text)] hover:border-[var(--primary)] transition-colors inline-flex items-center gap-1.5"
        >
          <span>Pratonton Rekaan ↗</span>
        </Link>
      </div>

      {/* ── Form Component ── */}
      <TemplateForm initialTemplate={template} />
    </div>
  );
}
