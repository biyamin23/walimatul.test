import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminAnnouncementById } from "@/lib/data/admin-announcements";
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";

export const metadata: Metadata = {
  title: "Admin — Kemaskini Pengumuman | WALIMATUL",
  description: "Kemaskini pengumuman dan tetapan jadual.",
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const announcement = await getAdminAnnouncementById(id);

  if (!announcement) {
    notFound();
  }

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
          Urus Pengumuman
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] mt-1">
          {announcement.title}
        </h1>
        <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] mt-1">
          Kemaskini teks, status pengumuman, atau jadual tarikh paparan.
        </p>
      </div>

      <AnnouncementForm initialData={announcement} />
    </div>
  );
}
