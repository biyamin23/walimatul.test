import React from "react";
import type { ClientNextActionItem } from "@/types/client-lifecycle";
import { PendingLink } from "@/components/ui/PendingLink";

interface Props {
  action: ClientNextActionItem;
}

export function ClientNextAction({ action }: Props) {
  const isExternal = action.ctaHref.startsWith("http");

  let bannerBg = "linear-gradient(135deg, var(--primary-soft) 0%, #fff 100%)";
  let borderColor = "var(--border)";
  let badgeColor = "bg-[var(--primary)] text-white";

  if (action.stage === "payment_rejected") {
    bannerBg = "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)";
    borderColor = "#fecdd3";
    badgeColor = "bg-rose-600 text-white";
  } else if (action.stage === "awaiting_payment") {
    bannerBg = "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)";
    borderColor = "#fef3c7";
    badgeColor = "bg-amber-600 text-white";
  } else if (action.stage === "under_review") {
    bannerBg = "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)";
    borderColor = "#dbeafe";
    badgeColor = "bg-blue-600 text-white";
  } else if (action.stage === "published") {
    bannerBg = "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)";
    borderColor = "#bbf7d0";
    badgeColor = "bg-emerald-700 text-white";
  } else if (action.stage === "expired") {
    bannerBg = "linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)";
    borderColor = "#fee2e2";
    badgeColor = "bg-gray-700 text-white";
  }

  return (
    <div
      className="p-6 sm:p-7 rounded-3xl border shadow-xs relative overflow-hidden transition-all"
      style={{
        background: bannerBg,
        borderColor: borderColor,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          {/* Top meta tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest font-ui text-[var(--gold)]">
              Tindakan Seterusnya
            </span>
            <span className="text-[var(--text-muted)] text-xs">•</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-ui uppercase ${badgeColor}`}>
              {action.badgeLabel}
            </span>
            <span className="text-xs font-medium font-ui text-[var(--text-muted)] truncate">
              {action.coupleDisplay} ({action.templateName})
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
            {action.title}
          </h2>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {action.description}
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isExternal ? (
            <a
              id="btn-next-action"
              href={action.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold font-ui hover:bg-[var(--primary-hover)] transition-all shadow-xs"
            >
              <span>{action.ctaText}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : (
            <PendingLink
              id="btn-next-action"
              href={action.ctaHref}
              pendingText="Membuka..."
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold font-ui hover:bg-[var(--primary-hover)] transition-all shadow-xs"
            >
              <span>{action.ctaText}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </PendingLink>
          )}

          {action.stage !== "published" && (
            <PendingLink
              href={`/dashboard/invitations/${action.invitationId}/edit`}
              pendingText="Membuka Editor..."
              className="inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-white/80 border border-[var(--border)] text-[var(--text)] text-xs sm:text-sm font-semibold font-ui hover:bg-white transition-colors"
            >
              Buka Editor
            </PendingLink>
          )}
        </div>
      </div>
    </div>
  );
}
