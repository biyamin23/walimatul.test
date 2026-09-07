import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauRoseCorner, ChateauFloralDivider, ChateauArchFrame } from "./ChateauOrnaments";
import { parseInvitationDate } from "@/lib/templates/formatters";

interface CoverSectionProps {
  data: InvitationTemplateData;
}

export function CoverSection({ data }: CoverSectionProps) {
  const groom = data.groomShortName || data.groomName || "Pengantin Lelaki";
  const bride = data.brideShortName || data.brideName || "Pengantin Perempuan";
  const parsedDate = parseInvitationDate(data.weddingDate);

  return (
    <header className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between px-4 py-8 sm:py-12 text-center overflow-hidden bg-gradient-to-b from-[#FFF8F5] via-[#FBEDEA] to-[#FFF8F5]">
      {/* Decorative Corner Flourishes */}
      <ChateauRoseCorner position="top-left" className="absolute top-3 left-3 sm:top-6 sm:left-6" />
      <ChateauRoseCorner position="top-right" className="absolute top-3 right-3 sm:top-6 sm:right-6" />
      <ChateauRoseCorner position="bottom-left" className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6" />
      <ChateauRoseCorner position="bottom-right" className="absolute bottom-3 right-3 sm:bottom-6 sm:left-6" />

      {/* Decorative Inner Arch Frame Lines */}
      <ChateauArchFrame />

      {/* Top Ceremonial Eyebrow */}
      <div className="pt-8 sm:pt-12 z-10">
        <p className="font-chateau-heading text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-[#B58A4A]">
          Walimatulurus
        </p>
      </div>

      {/* Center Couple Focal Point */}
      <div className="my-auto py-8 z-10 max-w-xl mx-auto px-4 w-full flex flex-col items-center">
        {/* Soft radial glow behind names */}
        <div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#EAD6D8]/40 blur-2xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <h1
          className="font-chateau-script text-[#6B2333] leading-[1.15] text-center select-none"
          style={{
            fontSize: "clamp(2.75rem, 11vw, 5.25rem)",
            textShadow: "0 1px 2px rgba(107, 35, 51, 0.08)",
          }}
        >
          <span className="inline-block max-w-full break-words px-2">{groom}</span>
          <span
            className="block my-1 sm:my-2 font-chateau-heading italic text-[#B58A4A] text-2xl sm:text-3xl font-light"
            aria-hidden="true"
          >
            &amp;
          </span>
          <span className="inline-block max-w-full break-words px-2">{bride}</span>
        </h1>

        <ChateauFloralDivider className="my-4 sm:my-6" />

        {/* Date Display */}
        {parsedDate ? (
          <div className="font-chateau-heading text-[#6B2333] flex flex-col items-center">
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

      {/* Bottom Scroll Cue */}
      <div className="pb-6 sm:pb-8 z-10 flex flex-col items-center text-[#B58A4A]/80 text-xs font-chateau-body tracking-widest uppercase">
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
          className="animate-bounce"
          aria-hidden="true"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </header>
  );
}
