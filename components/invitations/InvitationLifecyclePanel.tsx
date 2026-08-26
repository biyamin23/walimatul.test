import React from "react";
import Link from "next/link";
import { PendingLink } from "@/components/ui/PendingLink";
import { InvitationLifecycleTimeline } from "@/components/dashboard/InvitationLifecycleTimeline";
import { InvitationSharePanel } from "@/components/invitations/InvitationSharePanel";
import type { ClientInvitationLifecycle } from "@/types/client-lifecycle";

interface Props {
  lifecycle: ClientInvitationLifecycle;
  invitationId: string;
  slug: string | null;
  groomName?: string | null;
  groomShortName?: string | null;
  brideName?: string | null;
  brideShortName?: string | null;
  supportWhatsappUrl?: string;
}

export function InvitationLifecyclePanel({
  lifecycle,
  invitationId,
  slug,
  groomName,
  groomShortName,
  brideName,
  brideShortName,
  supportWhatsappUrl = "https://wa.me/601156281691",
}: Props) {
  const badgeStyles: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    gold: "bg-amber-50 text-amber-900 border-amber-300",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="space-y-6 mb-6">
      {/* ── Status & Timeline Panel ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-ui uppercase border ${
                  badgeStyles[lifecycle.badgeVariant] || badgeStyles.default
                }`}
              >
                {lifecycle.badgeLabel}
              </span>
              {slug && (
                <span className="text-xs font-mono text-[var(--text-subtle)]">
                  walimatul.my/{slug}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold font-display text-[var(--text)]">
              {lifecycle.title}
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)] max-w-xl">
              {lifecycle.description}
            </p>
          </div>

          {/* Quick Context CTAs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {lifecycle.isPublished && slug && (
              <Link
                href={`/${slug}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
              >
                <span>Lihat Jemputan</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Link>
            )}

            {lifecycle.stage === "awaiting_payment" || lifecycle.stage === "payment_rejected" ? (
              <PendingLink
                href={`/dashboard/invitations/${invitationId}/payment`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
              >
                <span>{lifecycle.nextAction.ctaText}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </PendingLink>
            ) : lifecycle.isExpired ? (
              <a
                href={supportWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold font-ui hover:bg-amber-700 transition-colors shadow-2xs"
              >
                <span>Hubungi Sokongan</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ) : (
              <PendingLink
                href={`/dashboard/invitations/${invitationId}/rsvp`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:border-[var(--primary)] transition-colors"
              >
                RSVP Tracker
              </PendingLink>
            )}
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="pt-3 border-t border-[var(--border-soft)]">
          <div className="flex items-center justify-between text-[11px] font-ui font-semibold text-[var(--text-muted)] mb-2.5">
            <span>Status Kemajuan</span>
            <span>
              Langkah {lifecycle.progressStep} daripada {lifecycle.totalSteps}
            </span>
          </div>
          <InvitationLifecycleTimeline timeline={lifecycle.timeline} />
        </div>
      </div>

      {/* ── Full Share Panel when Published & Active ── */}
      {lifecycle.isPublished && slug && !lifecycle.isExpired && (
        <div id="share">
          <InvitationSharePanel
            slug={slug}
            groomName={groomName}
            groomShortName={groomShortName}
            brideName={brideName}
            brideShortName={brideShortName}
          />
        </div>
      )}
    </div>
  );
}
