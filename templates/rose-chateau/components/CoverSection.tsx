"use client";

import React, { useEffect, useState } from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauRoseCorner, ChateauFloralDivider, ChateauArchFrame } from "./ChateauOrnaments";
import { parseInvitationDate } from "@/lib/templates/formatters";

interface CoverSectionProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

export function CoverSection({ data, mode = "live" }: CoverSectionProps) {
  const groom = data.groomShortName || data.groomName || "Pengantin Lelaki";
  const bride = data.brideShortName || data.brideName || "Pengantin Perempuan";
  const parsedDate = parseInvitationDate(data.weddingDate);

  const isEditor = mode === "editor";
  const [hasRevealed, setHasRevealed] = useState(isEditor);

  useEffect(() => {
    if (isEditor) {
      return;
    }
    // Trigger entrance stagger shortly after mount
    const timer = setTimeout(() => {
      setHasRevealed(true);
    }, 60);
    return () => clearTimeout(timer);
  }, [isEditor]);

  // If editor, elements are immediately visible with 0s transition
  const getStaggerStyle = (delayMs: number, extraTransform = ""): React.CSSProperties => {
    if (isEditor) {
      return {};
    }
    return {
      opacity: hasRevealed ? 1 : 0,
      transform: hasRevealed ? "none" : `translateY(16px) ${extraTransform}`,
      transitionProperty: "opacity, transform",
      transitionDuration: "800ms",
      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      transitionDelay: `${delayMs}ms`,
      willChange: hasRevealed ? "auto" : "opacity, transform",
    };
  };

  return (
    <header className="relative min-h-[88svh] sm:min-h-screen flex flex-col items-center justify-between px-4 py-8 sm:py-12 text-center overflow-hidden bg-gradient-to-b from-[#FFF8F5] via-[#FBEDEA] to-[#FFF8F5]">
      {/* Luxury Layered Background Glow & Watermark */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(201, 139, 151, 0.22) 0%, rgba(251, 237, 234, 0.5) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative Corner Flourishes with coordinated reveal */}
      <div
        className="transition-all duration-1000"
        style={{
          opacity: hasRevealed || isEditor ? 1 : 0,
          transform: hasRevealed || isEditor ? "scale(1)" : "scale(0.92)",
        }}
      >
        <ChateauRoseCorner position="top-left" className="absolute top-3 left-3 sm:top-6 sm:left-6" animated={!isEditor} />
        <ChateauRoseCorner position="top-right" className="absolute top-3 right-3 sm:top-6 sm:right-6" animated={!isEditor} />
        <ChateauRoseCorner position="bottom-left" className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6" animated={!isEditor} />
        <ChateauRoseCorner position="bottom-right" className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6" animated={!isEditor} />
      </div>

      {/* Decorative Inner Arch Frame Lines */}
      <div
        className="transition-opacity duration-1000"
        style={{ opacity: hasRevealed || isEditor ? 1 : 0 }}
      >
        <ChateauArchFrame />
      </div>

      {/* 1. Top Ceremonial Eyebrow (150ms delay) */}
      <div className="pt-8 sm:pt-12 z-10" style={getStaggerStyle(150)}>
        <p className="font-chateau-heading text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-[#B58A4A]">
          Walimatulurus
        </p>
      </div>

      {/* Center Couple Focal Point */}
      <div className="my-auto py-6 sm:py-8 z-10 max-w-xl mx-auto px-4 w-full flex flex-col items-center">
        {/* Soft radial glow behind names */}
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#EAD6D8]/45 blur-2xl pointer-events-none -z-10 transition-opacity duration-1000"
          style={{ opacity: hasRevealed || isEditor ? 1 : 0 }}
          aria-hidden="true"
        />

        {/* 2. Groom Name (280ms delay) */}
        <h1
          className="font-chateau-script text-[#6B2333] leading-[1.15] text-center select-none"
          style={{
            fontSize: "clamp(2.75rem, 11vw, 5.25rem)",
            textShadow: "0 1px 2px rgba(107, 35, 51, 0.08)",
          }}
        >
          <span
            className="inline-block max-w-full break-words px-2"
            style={getStaggerStyle(280, "scale(0.97)")}
          >
            {groom}
          </span>

          {/* 3. Ampersand (420ms delay) */}
          <span
            className="block my-1 sm:my-2 font-chateau-heading italic text-[#B58A4A] text-2xl sm:text-3xl font-light"
            aria-hidden="true"
            style={getStaggerStyle(420, "scale(0.8)")}
          >
            &amp;
          </span>

          {/* 4. Bride Name (540ms delay) */}
          <span
            className="inline-block max-w-full break-words px-2"
            style={getStaggerStyle(540, "scale(0.97)")}
          >
            {bride}
          </span>
        </h1>

        {/* 5. Floral Divider (680ms delay) */}
        <div style={getStaggerStyle(680)}>
          <ChateauFloralDivider className="my-4 sm:my-6" animated={hasRevealed && !isEditor} />
        </div>

        {/* 6. Date Display (800ms delay) */}
        {parsedDate ? (
          <div className="font-chateau-heading text-[#6B2333] flex flex-col items-center" style={getStaggerStyle(800)}>
            <time
              dateTime={data.weddingDate || ""}
              className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#6B2333]/90"
            >
              {parsedDate.dayOfWeek}
            </time>
            <div className="flex items-center gap-3 my-1">
              <span className="h-px w-6 bg-[#B58A4A]/40" />
              <span className="text-2xl sm:text-3xl font-bold tracking-wider text-[#B58A4A]">
                {parsedDate.dayNumber}
              </span>
              <span className="text-sm sm:text-base tracking-[0.15em] uppercase font-semibold text-[#6B2333]/90">
                {parsedDate.monthName}
              </span>
              <span className="h-px w-6 bg-[#B58A4A]/40" />
            </div>
            <span className="text-xs sm:text-sm font-medium tracking-[0.25em] text-[#766467]">
              {parsedDate.year}
            </span>
          </div>
        ) : null}
      </div>

      {/* 7. Bottom Scroll Cue (1000ms delay) with gentle repeating float */}
      <div
        className="pb-6 sm:pb-8 z-10 flex flex-col items-center text-[#B58A4A]/80 text-xs font-chateau-body tracking-widest uppercase"
        style={getStaggerStyle(1000)}
      >
        <span className="text-[10px] mb-1.5 opacity-90">Sila skrol ke bawah</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[chateau-bob_2s_ease-in-out_infinite]"
          aria-hidden="true"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>

      <style>{`
        @keyframes chateau-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </header>
  );
}
