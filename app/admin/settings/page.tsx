import React from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminPlatformSettings } from "@/lib/data/admin-settings";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Admin — Tetapan Platform | WALIMATUL",
  description: "Pengurusan tetapan operasi dan konfigurasi platform WALIMATUL.",
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getAdminPlatformSettings();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
          Konfigurasi Sistem
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] mt-1">
          Tetapan Platform
        </h1>
        <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] mt-1">
          Urus tetapan sokongan WhatsApp, tempoh sah lalai, had foto galeri, arahan bayaran, dan notis sistem.
        </p>
      </div>

      {/* ── Settings Form ── */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
