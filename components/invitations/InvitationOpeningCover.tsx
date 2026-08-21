"use client";

import React, { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BotanicalCorner, BotanicalDivider } from "@/templates/blush-garden/components/BotanicalOrnaments";
import { greatVibes, cormorantGaramond, inter } from "@/templates/blush-garden/fonts";

export interface OpeningCoverTheme {
  templateKey?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  accentColor?: string;
  secondaryTextColor?: string;
  buttonBg?: string;
  buttonText?: string;
  borderColor?: string;
  fontScript?: string;
  fontHeading?: string;
  fontBody?: string;
}

export interface InvitationOpeningCoverProps {
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  onOpen: () => void;
  theme?: OpeningCoverTheme;
}

export function InvitationOpeningCover({
  groomName,
  brideName,
  weddingDate,
  onOpen,
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

  // Format date in Malay (e.g. Sabtu, 28 November 2026)
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("ms-MY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const isBlushGarden = !theme?.templateKey || theme?.templateKey === "blush-garden";

  // If Blush Garden: use authentic Blush Garden visual identity
  if (isBlushGarden) {
    return (
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Skrin Pembukaan Jemputan"
        initial={{ opacity: 1, scale: 1 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 1.015, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
        }
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden min-h-dvh h-dvh bg-gradient-to-b from-[#FCF8F3] via-[#FCF1EE] to-[#FCF8F3] ${greatVibes.variable} ${cormorantGaramond.variable} ${inter.variable}`}
        style={{
          WebkitTransform: "translateZ(0)",
        }}
      >
        {/* Botanical Corners */}
        <BotanicalCorner position="top-left" className="absolute top-3 left-3 sm:top-6 sm:left-6" />
        <BotanicalCorner position="top-right" className="absolute top-3 right-3 sm:top-6 sm:right-6" />
        <BotanicalCorner position="bottom-left" className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6" />
        <BotanicalCorner position="bottom-right" className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6" />

        {/* Outer Frame Arch Line */}
        <div
          className="absolute inset-4 sm:inset-6 rounded-3xl border border-[#B8955A]/25 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-5 sm:inset-7 rounded-3xl border border-[#F5DDD6]/40 pointer-events-none"
          aria-hidden="true"
        />

        {/* Center Card Container */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto py-10 px-6 sm:px-8 rounded-3xl flex flex-col items-center justify-between min-h-[440px] sm:min-h-[480px]">
          {/* Top Eyebrow */}
          <div className="pt-2">
            <span className="font-cormorant text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#B8955A] block">
              Walimatulurus
            </span>
          </div>

          {/* Couple Names */}
          <div className="my-auto py-6 flex flex-col items-center w-full">
            <h1
              className="font-great-vibes text-[#174F3A] leading-[1.2] text-center select-none"
              style={{
                fontSize: "clamp(2.5rem, 9vw, 4.25rem)",
                textShadow: "0 1px 2px rgba(23, 79, 58, 0.05)",
              }}
            >
              <span className="inline-block max-w-full break-words px-2">{groomName}</span>
              <span
                className="block my-1 font-cormorant italic text-[#B8955A] text-xl sm:text-2xl font-light"
                aria-hidden="true"
              >
                &amp;
              </span>
              <span className="inline-block max-w-full break-words px-2">{brideName}</span>
            </h1>

            <BotanicalDivider className="my-4" />

            {formattedDate && (
              <p className="font-cormorant text-xs sm:text-sm font-semibold tracking-wider text-[#174F3A]/90 uppercase">
                {formattedDate}
              </p>
            )}
          </div>

          {/* CTA Button: Buka Jemputan */}
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={onOpen}
              aria-label="Buka jemputan perkahwinan"
              className="w-full sm:w-auto min-w-[200px] min-h-[48px] px-8 py-3.5 rounded-full font-inter text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto bg-[#174F3A] text-white hover:bg-[#123E2E] border border-[#B8955A]/40 focus:outline-none focus:ring-2 focus:ring-[#B8955A] focus:ring-offset-2"
            >
              <span>✉ Buka Jemputan</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Hybrid Editorial & Custom Template Design
  const bg = theme?.backgroundColor || "#FAF7F2";
  const surface = theme?.surfaceColor || "#FFFFFF";
  const text = theme?.textColor || "#1C1917";
  const accent = theme?.accentColor || "#92400E";
  const subText = theme?.secondaryTextColor || "#78716C";
  const buttonBg = theme?.buttonBg || "#1C1917";
  const buttonText = theme?.buttonText || "#FFFFFF";
  const border = theme?.borderColor || "#E7E5E4";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Skrin Pembukaan Jemputan"
      initial={{ opacity: 1, scale: 1 }}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.015, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
      }
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden min-h-dvh h-dvh"
      style={{
        backgroundColor: bg,
        WebkitTransform: "translateZ(0)",
      }}
    >
      <div
        className="w-full max-w-sm sm:max-w-md mx-auto py-10 px-6 sm:px-8 rounded-3xl border shadow-xl flex flex-col items-center justify-between min-h-[440px] sm:min-h-[480px] relative overflow-hidden backdrop-blur-xs"
        style={{
          borderColor: border,
          backgroundColor: surface,
        }}
      >
        {/* Top Header */}
        <div className="space-y-2 pt-2">
          <span
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold block"
            style={{
              color: accent,
              fontFamily: theme?.fontHeading || "inherit",
            }}
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
        <div className="my-auto py-6 space-y-3 w-full">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight tracking-tight break-words"
            style={{
              color: text,
              fontFamily: theme?.fontScript || "inherit",
            }}
          >
            {groomName}
          </h1>

          <span
            className="text-lg sm:text-xl italic block opacity-75"
            style={{
              color: accent,
              fontFamily: theme?.fontHeading || "inherit",
            }}
          >
            &amp;
          </span>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight tracking-tight break-words"
            style={{
              color: text,
              fontFamily: theme?.fontScript || "inherit",
            }}
          >
            {brideName}
          </h1>

          {formattedDate && (
            <p
              className="text-xs sm:text-sm tracking-wide pt-2 opacity-90 font-medium"
              style={{
                color: subText,
                fontFamily: theme?.fontHeading || "inherit",
              }}
            >
              {formattedDate}
            </p>
          )}
        </div>

        {/* Bottom CTA Action: Buka Jemputan */}
        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onOpen}
            aria-label="Buka jemputan perkahwinan"
            className="w-full sm:w-auto min-w-[200px] min-h-[48px] px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: buttonBg,
              color: buttonText,
            }}
          >
            <span>✉ Buka Jemputan</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
