"use client";

import React, { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface InvitationOpeningCoverProps {
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  onOpen: () => void;
  musicEnabled?: boolean;
  theme?: {
    surfaceColor?: string;
    textColor?: string;
    accentColor?: string;
    secondaryTextColor?: string;
    buttonBg?: string;
    buttonText?: string;
    borderColor?: string;
  };
}

export function InvitationOpeningCover({
  groomName,
  brideName,
  weddingDate,
  onOpen,
  musicEnabled = false,
  theme,
}: InvitationOpeningCoverProps) {
  const shouldReduceMotion = useReducedMotion();

  // 1. Lock background page scroll while cover is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Format date in Malay
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("ms-MY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Theme tokens fallback (Warm elegant ivory / emerald / gold)
  const surface = theme?.surfaceColor || "#FCF8F3";
  const text = theme?.textColor || "#174F3A";
  const accent = theme?.accentColor || "#B8955A";
  const subText = theme?.secondaryTextColor || "#6B5E59";
  const buttonBg = theme?.buttonBg || "#174F3A";
  const buttonText = theme?.buttonText || "#FFFFFF";
  const border = theme?.borderColor || "#E8DDD5";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Skrin Pembukaan Jemputan"
      initial={{ opacity: 1, scale: 1 }}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
      }
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none"
      style={{
        backgroundColor: surface,
        WebkitTransform: "translateZ(0)",
      }}
    >
      {/* Decorative Outer Border Box */}
      <div
        className="w-full max-w-sm sm:max-w-md mx-auto py-12 px-6 sm:px-10 rounded-3xl border shadow-xl flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden backdrop-blur-xs"
        style={{
          borderColor: border,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {/* Top Header / Eyebrow */}
        <div className="space-y-2">
          <span
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold block"
            style={{ color: accent }}
          >
            Walimatulurus
          </span>
          <div className="flex items-center justify-center gap-2" style={{ color: accent }}>
            <span className="h-px w-6 bg-current opacity-40" />
            <span className="text-xs">✦</span>
            <span className="h-px w-6 bg-current opacity-40" />
          </div>
        </div>

        {/* Center: Couple Names */}
        <div className="my-auto py-6 space-y-3">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight font-serif tracking-tight"
            style={{ color: text }}
          >
            {groomName || "Pengantin Lelaki"}
          </h1>

          <span
            className="text-lg sm:text-xl italic font-serif block opacity-75"
            style={{ color: accent }}
          >
            &amp;
          </span>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight font-serif tracking-tight"
            style={{ color: text }}
          >
            {brideName || "Pengantin Perempuan"}
          </h1>

          {formattedDate && (
            <p
              className="text-xs sm:text-sm font-sans tracking-wide pt-2 opacity-90 font-medium"
              style={{ color: subText }}
            >
              {formattedDate}
            </p>
          )}
        </div>

        {/* Bottom CTA Action: Buka Jemputan */}
        <div className="w-full space-y-3 pt-2">
          <button
            type="button"
            onClick={onOpen}
            aria-label="Buka jemputan perkahwinan"
            className="w-full sm:w-auto min-w-[200px] min-h-[48px] px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: buttonBg,
              color: buttonText,
            }}
          >
            <span>✉ Buka Jemputan</span>
          </button>

          {musicEnabled && (
            <p
              className="text-[11px] font-sans flex items-center justify-center gap-1 opacity-70 animate-pulse"
              style={{ color: subText }}
            >
              <span>🎵</span>
              <span>Dilengkapi muzik latar</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
