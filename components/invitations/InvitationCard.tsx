"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatWeddingDate } from "@/lib/templates/formatters";
import { deleteOwnDraftAction } from "@/app/actions/invitations";
import type { Invitation } from "@/types/database";

interface InvitationCardProps {
  invitation: Invitation & {
    template?: {
      name: string;
      slug: string;
    };
  };
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const groom = invitation.groom_short_name || invitation.groom_name;
  const bride = invitation.bride_short_name || invitation.bride_name;
  const coupleDisplay =
    groom && bride
      ? `${groom} & ${bride}`
      : groom || bride || "Untitled Invitation";

  const weddingDateDisplay = invitation.wedding_date
    ? formatWeddingDate(invitation.wedding_date)
    : "Date not set";

  const templateName = invitation.template?.name || "Blush Garden";

  const statusBadgeVariant = {
    draft: "default" as const,
    published: "success" as const,
    archived: "default" as const,
    expired: "danger" as const,
  }[invitation.status] || "default";

  const statusLabel = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    expired: "Expired",
  }[invitation.status] || invitation.status;

  const formattedUpdatedAt = new Date(invitation.updated_at).toLocaleDateString(
    "en-MY",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  function handleDelete() {
    startTransition(async () => {
      setIsDeleting(true);
      await deleteOwnDraftAction(invitation.id);
      setIsDeleting(false);
      setShowConfirm(false);
    });
  }

  return (
    <Card
      variant="default"
      padding="none"
      className="overflow-hidden flex flex-col justify-between hover:shadow-[var(--shadow-elevated)] transition-all"
    >
      <div className="p-4 sm:p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={statusBadgeVariant}>{statusLabel}</Badge>
          <span className="text-[11px] font-ui text-[var(--text-subtle)]">
            Updated {formattedUpdatedAt}
          </span>
        </div>

        {/* Couple Title */}
        <h3 className="font-display text-xl sm:text-2xl text-[var(--text)] font-semibold mb-1 truncate">
          {coupleDisplay}
        </h3>

        {/* Template & Date Details */}
        <p className="text-xs text-[var(--gold)] font-semibold tracking-wide uppercase font-ui mb-2">
          {templateName}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-ui mb-4">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{weddingDateDisplay}</span>
        </div>

        {/* Slug info */}
        {invitation.slug ? (
          <p className="text-[11px] text-[var(--text-subtle)] font-mono truncate">
            walimatul.my/{invitation.slug}
          </p>
        ) : (
          <p className="text-[11px] text-[var(--text-subtle)] italic font-ui">
            URL not chosen yet
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[var(--surface-warm)] border-t border-[var(--border-soft)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/invitations/${invitation.id}/edit`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            Edit Draft
          </Link>
          <Link
            href={`/dashboard/invitations/${invitation.id}/edit?mode=preview`}
            className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs font-medium font-ui hover:bg-[var(--surface-warm)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            Preview
          </Link>
        </div>

        {invitation.status === "draft" && (
          <div>
            {showConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending || isDeleting}
                  className="text-[11px] text-red-600 font-semibold px-2 py-1 hover:underline"
                >
                  {isDeleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending || isDeleting}
                  className="text-[11px] text-[var(--text-muted)] px-1.5 py-1 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="text-[11px] text-[var(--text-subtle)] hover:text-red-600 transition-colors p-1.5 rounded"
                title="Delete this draft"
                aria-label="Delete draft invitation"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
