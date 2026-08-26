"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { PendingLink } from "@/components/ui/PendingLink";
import { formatWeddingDate } from "@/lib/templates/formatters";
import { deleteOwnDraftAction } from "@/app/actions/invitations";
import { InvitationLifecycleTimeline } from "@/components/dashboard/InvitationLifecycleTimeline";
import type { ClientInvitationWithDetails } from "@/types/client-lifecycle";

interface Props {
  data: ClientInvitationWithDetails;
  supportWhatsappUrl?: string;
}

export function ClientInvitationCard({ data, supportWhatsappUrl = "https://wa.me/601156281691" }: Props) {
  const { invitation, template, latestOrder, lifecycle } = data;
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const groom = invitation.groom_short_name || invitation.groom_name;
  const bride = invitation.bride_short_name || invitation.bride_name;
  const coupleDisplay =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Jemputan Pengantin";

  const weddingDateDisplay = invitation.wedding_date
    ? formatWeddingDate(invitation.wedding_date)
    : "Tarikh belum ditetapkan";

  const templateName = template?.name || "Blush Garden";

  function handleDeleteDraft() {
    startTransition(async () => {
      setIsDeleting(true);
      await deleteOwnDraftAction(invitation.id);
      setIsDeleting(false);
      setShowConfirm(false);
    });
  }

  // Badge Color Style Map
  const badgeStyles: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    gold: "bg-amber-50 text-amber-900 border-amber-300",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      {/* ── Top Section ── */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Header: Badge & Template */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold font-ui uppercase border ${
              badgeStyles[lifecycle.badgeVariant] || badgeStyles.default
            }`}
          >
            {lifecycle.badgeLabel}
          </span>
          <span className="text-xs font-semibold font-ui text-[var(--gold)] uppercase tracking-wide truncate">
            {templateName}
          </span>
        </div>

        {/* Couple Title */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] truncate">
            {coupleDisplay}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs font-ui text-[var(--text-muted)] mt-1.5">
            <span className="inline-flex items-center gap-1">
              📅 {weddingDateDisplay}
            </span>
            {invitation.slug && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-subtle)]">
                🔗 walimatul.my/{invitation.slug}
              </span>
            )}
          </div>
        </div>

        {/* Expiry / Stage Notice Alert */}
        {lifecycle.expiry.warningLevel === "urgent" && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-ui flex items-center justify-between gap-2">
            <span className="font-semibold">⚠️ {lifecycle.expiry.message}</span>
            <a
              href={supportWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-rose-700 hover:underline shrink-0"
            >
              Lanjutkan →
            </a>
          </div>
        )}

        {lifecycle.expiry.warningLevel === "subtle" && (
          <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] font-ui flex items-center justify-between gap-2">
            <span>ℹ️ {lifecycle.expiry.message}</span>
          </div>
        )}

        {lifecycle.stage === "payment_rejected" && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-ui space-y-1">
            <span className="font-bold block">Bayaran Ditolak:</span>
            <p className="text-[11px] leading-relaxed">
              {latestOrder?.rejection_reason ||
                "Bukti bayaran tidak dapat disahkan. Sila muat naik resit yang sah."}
            </p>
          </div>
        )}

        {lifecycle.stage === "under_review" && (
          <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-ui">
            ⏳ Resit pembayaran sedang disemak oleh Admin.
          </div>
        )}

        {/* Lifecycle Progress Timeline */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] font-ui font-semibold text-[var(--text-muted)] mb-2">
            <span>Kemajuan Jemputan</span>
            <span>
              Langkah {lifecycle.progressStep} daripada {lifecycle.totalSteps}
            </span>
          </div>
          <InvitationLifecycleTimeline timeline={lifecycle.timeline} compact />
        </div>
      </div>

      {/* ── Footer Actions ── */}
      <div className="px-5 py-3.5 bg-[var(--surface-warm)] border-t border-[var(--border-soft)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {lifecycle.isPublished ? (
            <>
              <Link
                href={`/${invitation.slug || ""}`}
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
              >
                Lihat Jemputan ↗
              </Link>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors"
              >
                Edit
              </PendingLink>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/rsvp`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
              >
                RSVP
              </PendingLink>
            </>
          ) : lifecycle.isExpired ? (
            <>
              <a
                href={supportWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold font-ui hover:bg-amber-700 transition-colors shadow-2xs"
              >
                Hubungi Sokongan ↗
              </a>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors"
              >
                Lihat Draf
              </PendingLink>
            </>
          ) : lifecycle.stage === "awaiting_payment" || lifecycle.stage === "payment_rejected" ? (
            <>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/payment`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
              >
                Buat Bayaran
              </PendingLink>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors"
              >
                Edit
              </PendingLink>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit?mode=preview`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors"
              >
                Preview
              </PendingLink>
            </>
          ) : lifecycle.stage === "under_review" ? (
            <>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/payment`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold font-ui hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Semak Status Bayaran
              </PendingLink>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors"
              >
                Edit
              </PendingLink>
            </>
          ) : (
            <>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
              >
                Edit Jemputan
              </PendingLink>
              <PendingLink
                href={`/dashboard/invitations/${invitation.id}/edit?mode=preview`}
                pendingText="Membuka..."
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors"
              >
                Preview
              </PendingLink>
            </>
          )}
        </div>

        {/* Draft Delete Action */}
        {!lifecycle.isPublished && !lifecycle.isExpired && lifecycle.stage !== "under_review" && (
          <div>
            {showConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDeleteDraft}
                  disabled={isPending || isDeleting}
                  className="text-[11px] text-rose-600 font-bold px-2 py-1 hover:underline"
                >
                  {isDeleting ? "Memadam..." : "Sahkan Padam"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending || isDeleting}
                  className="text-[11px] text-[var(--text-muted)] px-1.5 py-1 hover:underline"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="text-[11px] text-gray-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg"
                title="Padam draf ini"
                aria-label="Padam draf"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
