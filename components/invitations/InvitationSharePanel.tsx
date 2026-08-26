"use client";

import React, { useState } from "react";
import {
  getPublicInvitationUrl,
  buildInvitationShareMessage,
  buildWhatsAppShareUrl,
  resolveCoupleDisplayNames,
} from "@/lib/invitations/share";
import { InvitationQrModal } from "./InvitationQrModal";

export interface InvitationSharePanelProps {
  slug: string;
  groomName?: string | null;
  groomShortName?: string | null;
  brideName?: string | null;
  brideShortName?: string | null;
  className?: string;
}

export function InvitationSharePanel({
  slug,
  groomName,
  groomShortName,
  brideName,
  brideShortName,
  className = "",
}: InvitationSharePanelProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showMessagePreview, setShowMessagePreview] = useState(false);

  const { coupleDisplay } = resolveCoupleDisplayNames({
    groomName,
    groomShortName,
    brideName,
    brideShortName,
  });

  const publicUrl = getPublicInvitationUrl(slug);
  const whatsappUrl = buildWhatsAppShareUrl({
    slug,
    groomName,
    groomShortName,
    brideName,
    brideShortName,
  });
  const shareMessage = buildInvitationShareMessage({
    slug,
    groomName,
    groomShortName,
    brideName,
    brideShortName,
  });

  async function handleCopyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = publicUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error("[WALIMATUL] Copy link error:", err);
    }
  }

  async function handleCopyMessage() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareMessage);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareMessage;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch (err) {
      console.error("[WALIMATUL] Copy message error:", err);
    }
  }

  return (
    <>
      <div
        className={`p-6 sm:p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6 ${className}`}
      >
        {/* ── Top Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
                Pusat Perkongsian
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-ui uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Aktif &amp; Boleh Dikongsi 🎉
              </span>
            </div>
            <h3 className="text-xl font-bold font-display text-[var(--text)] mt-1">
              Kongsi Kad Jemputan Digital
            </h3>
            <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
              Jemputan anda sudah diterbitkan. Kongsikan pautan rasmi ini kepada sanak saudara dan tetamu.
            </p>
          </div>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors shrink-0"
          >
            <span>Buka Laman Web</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* ── Main Action Buttons Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold font-ui transition-all shadow-xs"
          >
            <span className="text-base">💬</span>
            <span>Kongsi ke WhatsApp</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold font-ui transition-all shadow-xs ${
              copiedLink
                ? "bg-emerald-800 text-white"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            }`}
          >
            <span>🔗</span>
            <span>{copiedLink ? "Pautan Disalin ✓" : "Salin Pautan"}</span>
          </button>

          {/* Show QR Code */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)] text-xs sm:text-sm font-bold font-ui hover:text-[var(--primary)] transition-all shadow-2xs"
          >
            <span>📱</span>
            <span>Papar Kod QR</span>
          </button>
        </div>

        {/* ── Message Preview Toggle ── */}
        <div className="pt-2 border-t border-[var(--border-soft)]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowMessagePreview((prev) => !prev)}
              className="text-xs font-semibold font-ui text-[var(--gold)] hover:underline inline-flex items-center gap-1.5"
            >
              <span>{showMessagePreview ? "Sembunyikan Draf Mesej WhatsApp" : "Lihat Draf Mesej WhatsApp"}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${showMessagePreview ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showMessagePreview && (
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs font-semibold font-ui text-[var(--primary)] hover:underline"
              >
                {copiedMessage ? "Mesej Disalin ✓" : "Salin Teks Mesej"}
              </button>
            )}
          </div>

          {showMessagePreview && (
            <div className="mt-3 p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)] text-xs font-ui text-[var(--text)] whitespace-pre-line leading-relaxed">
              {shareMessage}
            </div>
          )}
        </div>
      </div>

      {/* ── QR Modal ── */}
      <InvitationQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        slug={slug}
        coupleDisplay={coupleDisplay}
      />
    </>
  );
}
