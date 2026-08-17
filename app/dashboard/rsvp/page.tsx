import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/permissions";
import { getClientGlobalRsvpOverview } from "@/lib/data/rsvps";
import { RsvpSummaryCards } from "@/components/rsvp/RsvpSummaryCards";

export const metadata: Metadata = {
  title: "RSVP Tracker — WALIMATUL",
  description: "Pantau maklum balas kehadiran tetamu perkahwinan anda.",
};

export default async function GlobalRsvpTrackerPage() {
  await requireAuth();
  const invitations = await getClientGlobalRsvpOverview();

  // Aggregate overall metrics
  const totalSummary = invitations.reduce(
    (acc, item) => ({
      totalResponses: acc.totalResponses + item.summary.totalResponses,
      attendingCount: acc.attendingCount + item.summary.attendingCount,
      notAttendingCount: acc.notAttendingCount + item.summary.notAttendingCount,
      totalPax: acc.totalPax + item.summary.totalPax,
    }),
    {
      totalResponses: 0,
      attendingCount: 0,
      notAttendingCount: 0,
      totalPax: 0,
    }
  );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan Kehadiran
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            RSVP Tracker
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Pantau dan urus senarai kehadiran tetamu untuk setiap majlis perkahwinan anda.
          </p>
        </div>

        <Link
          href="/dashboard/invitations"
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] text-xs font-semibold font-ui text-[var(--text)] hover:border-[var(--primary)] transition-colors inline-flex items-center gap-1.5"
        >
          Lihat Semua Jemputan →
        </Link>
      </div>

      {/* ── Overall Aggregated Summary ── */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold font-ui text-[var(--text-subtle)] uppercase tracking-wider px-1">
          Ringkasan Keseluruhan
        </h2>
        <RsvpSummaryCards summary={totalSummary} />
      </div>

      {/* ── Invitations List ── */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold font-ui text-[var(--text-subtle)] uppercase tracking-wider px-1">
          Senarai Majlis ({invitations.length})
        </h2>

        {invitations.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-warm)] text-[var(--primary)] flex items-center justify-center mx-auto">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--text)]">
              Tiada Jemputan Dijumpai
            </h3>
            <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-sm mx-auto">
              Anda belum mempunyai jemputan perkahwinan. Cipta jemputan pertama anda untuk mula mengumpul maklum balas RSVP.
            </p>
            <div className="pt-2">
              <Link
                href="/templates"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
              >
                Pilih Templat &amp; Cipta Jemputan →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitations.map((inv) => {
              const groom = inv.groom_short_name || inv.groom_name || "Pengantin Lelaki";
              const bride = inv.bride_short_name || inv.bride_name || "Pengantin Perempuan";

              return (
                <div
                  key={inv.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between space-y-4 hover:border-[var(--primary)]/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          inv.status === "published"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {inv.status === "published" ? "Diterbitkan" : "Draf"}
                      </span>
                      <span className="text-[11px] font-ui text-[var(--text-subtle)]">
                        {inv.template_name}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[var(--text)]">
                      {groom} &amp; {bride}
                    </h3>

                    <p className="text-xs font-ui text-[var(--text-muted)]">
                      {inv.wedding_date
                        ? `Tarikh Majlis: ${inv.wedding_date}`
                        : "Tarikh majlis belum ditetapkan"}
                    </p>

                    {/* RSVP Status info */}
                    {!inv.rsvp_enabled ? (
                      <p className="text-[11px] font-ui text-stone-500 italic">
                        Borang RSVP dinyahaktifkan
                      </p>
                    ) : inv.rsvp_deadline ? (
                      <p className="text-[11px] font-ui text-[var(--text-subtle)]">
                        Tarikh Akhir: {inv.rsvp_deadline}
                      </p>
                    ) : null}
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[var(--text-subtle)] font-ui">
                        Respon
                      </p>
                      <p className="text-lg font-bold font-display text-[var(--text)]">
                        {inv.summary.totalResponses}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[var(--primary)] font-ui">
                        Hadir
                      </p>
                      <p className="text-lg font-bold font-display text-[var(--primary)]">
                        {inv.summary.attendingCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[var(--gold)] font-ui">
                        Pax
                      </p>
                      <p className="text-lg font-bold font-display text-[var(--gold)]">
                        {inv.summary.totalPax}
                      </p>
                    </div>
                  </div>

                  {/* Direct Link to Invitation RSVP detail */}
                  <div>
                    <Link
                      href={`/dashboard/invitations/${inv.id}/rsvp`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
                    >
                      <span>Urus &amp; Lihat Senarai Respon</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
