"use client";

import React, { useEffect, useState } from "react";
import { InvitationQrCode } from "./InvitationQrCode";
import { getPublicInvitationUrl } from "@/lib/invitations/share";

export interface InvitationQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  coupleDisplay: string;
}

export function InvitationQrModal({
  isOpen,
  onClose,
  slug,
  coupleDisplay,
}: InvitationQrModalProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = getPublicInvitationUrl(slug);

  // Handle escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleCopyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        // Fallback for non-secure contexts
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("[WALIMATUL] Copy link error:", err);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-0.5">
              Kod QR Rasmi
            </span>
            <h3 id="qr-modal-title" className="text-xl font-bold font-display text-[var(--text)]">
              {coupleDisplay}
            </h3>
            <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
              Imbas untuk membuka pautan kad jemputan digital.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog QR"
            className="w-8 h-8 rounded-full bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── QR Code Canvas & PNG Downloader ── */}
        <InvitationQrCode
          publicUrl={publicUrl}
          slug={slug}
          coupleDisplay={coupleDisplay}
          size={220}
          showDownloadButton={true}
        />

        {/* ── Quick URL & Copy Action ── */}
        <div className="pt-2 border-t border-[var(--border-soft)] space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)] text-xs font-mono text-[var(--text)]">
            <span className="truncate flex-1 px-2">{publicUrl}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-xl font-ui text-xs font-semibold transition-all shrink-0 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
              }`}
            >
              {copied ? "Disalin ✓" : "Salin"}
            </button>
          </div>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:bg-[var(--surface-warm)] hover:text-[var(--primary)] transition-colors"
          >
            <span>Buka Jemputan Web ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
