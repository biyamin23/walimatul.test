import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getRuntimePlatformSetting } from "@/lib/data/platform-settings";
import { TemplateForm } from "@/components/admin/templates/TemplateForm";

export const metadata: Metadata = {
  title: "Cipta Templat Baharu | WALIMATUL Admin",
  description: "Cipta dan konfigurasikan templat Hybrid perkahwinan baharu.",
};

export default async function NewTemplatePage() {
  await requireAdmin();
  const defaultValidity = await getRuntimePlatformSetting("default_invitation_validity_months");

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/templates"
            className="text-xs font-semibold font-ui text-[var(--gold)] hover:underline inline-flex items-center gap-1 mb-1 block"
          >
            ← Kembali ke Senarai Templat
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Cipta Templat Baharu
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Konfigurasikan maklumat produk, palet warna, tipografi, dan muat naik aset grafik tersuai.
          </p>
        </div>
      </div>

      {/* ── Form Component ── */}
      <TemplateForm defaultValidityMonths={defaultValidity} />
    </div>
  );
}
