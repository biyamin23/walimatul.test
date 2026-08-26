"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getQrFilename } from "@/lib/invitations/share";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export interface InvitationQrCodeProps {
  publicUrl: string;
  slug: string;
  coupleDisplay?: string;
  size?: number;
  showDownloadButton?: boolean;
  className?: string;
}

export function InvitationQrCode({
  publicUrl,
  slug,
  coupleDisplay = "Jemputan Pengantin",
  size = 240,
  showDownloadButton = true,
  className = "",
}: InvitationQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !publicUrl) return;

    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#1A2E26",
        light: "#FFFFFF",
      },
    }).catch((err) => {
      console.error("[WALIMATUL] QR generation error:", err);
      setError("Gagal menjana imej QR Code.");
    });
  }, [publicUrl, size]);

  async function handleDownloadPng() {
    if (isGenerating || !publicUrl) return;

    try {
      setIsGenerating(true);
      setError(null);

      // Generate high-resolution 1024x1024 data URL
      const dataUrl = await QRCode.toDataURL(publicUrl, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
        color: {
          dark: "#1A2E26",
          light: "#FFFFFF",
        },
      });

      // Trigger client-side direct download
      const filename = getQrFilename(slug);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("[WALIMATUL] QR download error:", err);
      setError("QR tidak dapat dimuat turun. Sila cuba lagi.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* ── QR Canvas Container with Frame ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[var(--border)] shadow-xs flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-xl max-w-full h-auto"
          aria-label={`QR Code untuk jemputan ${coupleDisplay}`}
        />
        <span className="text-[11px] font-ui text-[var(--text-muted)] mt-2 font-mono truncate max-w-[240px]">
          {publicUrl.replace(/^https?:\/\//, "")}
        </span>
      </div>

      {error && (
        <p className="text-xs font-ui text-red-600 text-center" role="alert">
          {error}
        </p>
      )}

      {/* ── Download High-Res PNG Button ── */}
      {showDownloadButton && (
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isGenerating}
          aria-busy={isGenerating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)] text-xs font-semibold font-ui hover:text-[var(--primary)] transition-all shadow-2xs disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="xs" />
              <span>Menjana PNG (1024px)...</span>
            </>
          ) : (
            <>
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Muat Turun QR PNG</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
