import React from "react";
import Link from "next/link";
import { requireClient } from "@/lib/auth/permissions";
import { getOwnInvitations } from "@/lib/data/invitations";
import { InvitationCard } from "@/components/invitations/InvitationCard";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Invitations — WALIMATUL",
  description: "Manage your digital wedding invitations and drafts.",
};

export default async function DashboardInvitationsPage() {
  await requireClient();
  const invitations = await getOwnInvitations();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-[var(--text)] font-semibold">
            My Invitations
          </h1>
          <p className="text-sm font-ui text-[var(--text-muted)] mt-1">
            Create, edit, and preview your digital wedding invitations.
          </p>
        </div>

        <Link
          href="/templates"
          id="btn-create-invitation"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Invitation</span>
        </Link>
      </div>

      {/* Invitations List / Empty State */}
      {invitations.length === 0 ? (
        <Card variant="elevated" padding="lg" className="text-center py-16 px-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            aria-hidden="true"
          >
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
              <path d="M21 5H3a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2z" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
          </div>

          <h2 className="font-display text-xl text-[var(--text)] font-semibold mb-2">
            You haven&apos;t created an invitation yet
          </h2>
          <p className="text-sm font-ui text-[var(--text-muted)] max-w-md mx-auto mb-6">
            Choose a beautiful template to get started with your digital wedding invitation.
          </p>

          <Link
            href="/templates"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--primary)] text-white text-sm font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            Browse Templates →
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} />
          ))}
        </div>
      )}
    </div>
  );
}
