import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/permissions";
import { getOwnInvitationRsvps } from "@/lib/data/rsvps";
import { RsvpSummaryCards } from "@/components/rsvp/RsvpSummaryCards";
import { RsvpResponseList } from "@/components/rsvp/RsvpResponseList";

export const metadata: Metadata = {
  title: "Pengurusan RSVP — WALIMATUL",
  description: "Senarai maklum balas kehadiran tetamu perkahwinan.",
};

interface RsvpDashboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RsvpDashboardPage({
  params,
}: RsvpDashboardPageProps) {
  await requireAuth();
  const { id } = await params;

  const data = await getOwnInvitationRsvps(id);
  if (!data) {
    notFound();
  }

  const { invitation, rsvps, summary } = data;
  const groom = invitation.groom_short_name || invitation.groom_name || "Pengantin Lelaki";
  const bride = invitation.bride_short_name || invitation.bride_name || "Pengantin Perempuan";

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* ── Top Breadcrumb / Back Navigation ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/invitations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-ui text-[var(--primary)] hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Jemputan Saya
        </Link>

        {invitation.slug && (
          <Link
            href={`/${invitation.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold font-ui text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            Lihat Jemputan Rasmi
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        )}
      </div>

      {/* ── Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan RSVP
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            {groom} &amp; {bride}
          </h1>
          <p className="text-xs font-ui text-[var(--text-muted)]">
            {invitation.wedding_date
              ? `Tarikh Majlis: ${invitation.wedding_date}`
              : "Tarikh majlis belum ditetapkan"}
            {invitation.rsvp_deadline && ` · Tarikh Akhir RSVP: ${invitation.rsvp_deadline}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/invitations/${invitation.id}/edit`}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] text-xs font-semibold font-ui text-[var(--text)] hover:border-[var(--primary)] transition-colors"
          >
            Edit Jemputan
          </Link>
        </div>
      </div>

      {/* ── Summary Metrics ── */}
      <RsvpSummaryCards summary={summary} />

      {/* ── Responses List ── */}
      <RsvpResponseList rsvps={rsvps} />
    </div>
  );
}
