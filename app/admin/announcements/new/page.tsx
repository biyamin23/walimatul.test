import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";

export const metadata: Metadata = {
  title: "Admin — Cipta Pengumuman | WALIMATUL",
  description: "Cipta pengumuman baharu untuk pelanggan WALIMATUL.",
};

export default async function NewAnnouncementPage() {
  await requireAdmin();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-xs font-ui font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-2"
        >
          ← Kembali ke Senarai Pengumuman
        </Link>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
          Pengumuman Baharu
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] mt-1">
          Cipta Pengumuman
        </h1>
        <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] mt-1">
          Tulis makluman sistem, penambahbaikan ciri, atau notis operasi untuk pelanggan anda.
        </p>
      </div>

      <AnnouncementForm />
    </div>
  );
}
