import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireClient } from "@/lib/auth/permissions";
import { getClientDashboardData } from "@/lib/data/client-dashboard";
import { DashboardSummaryCards } from "@/components/dashboard/DashboardSummaryCards";
import { ClientInvitationCard } from "@/components/dashboard/ClientInvitationCard";
import { ClientNewUserOnboarding } from "@/components/dashboard/ClientNewUserOnboarding";

import { PendingLink } from "@/components/ui/PendingLink";

export const metadata: Metadata = {
  title: "Jemputan Saya — WALIMATUL",
  description: "Urus, edit, dan pantau status pengaktifan kad jemputan perkahwinan anda.",
};

export default async function DashboardInvitationsPage() {
  await requireClient();
  const data = await getClientDashboardData();

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="text-xs font-semibold font-ui text-[var(--gold)] hover:underline inline-flex items-center gap-1"
            >
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Senarai Jemputan Saya
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Semua draf dan jemputan perkahwinan digital yang telah anda cipta.
          </p>
        </div>

        <PendingLink
          id="btn-create-invitation-list"
          href="/templates"
          pendingText="Membuka..."
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold font-ui hover:bg-[var(--primary-hover)] transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Cipta Jemputan Baharu</span>
        </PendingLink>
      </div>

      {/* ── Summary Metric Cards ── */}
      <DashboardSummaryCards summary={data.summary} />

      {/* ── Grid or Empty State ── */}
      {data.invitations.length === 0 ? (
        <ClientNewUserOnboarding clientName={data.clientName} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.invitations.map((item) => (
            <ClientInvitationCard
              key={item.invitation.id}
              data={item}
              supportWhatsappUrl={data.supportWhatsappUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
