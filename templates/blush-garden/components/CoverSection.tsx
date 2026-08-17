import React from "react";
import type { InvitationTemplateData } from "../../types";
import { BotanicalCorner, BotanicalDivider } from "./BotanicalOrnaments";
import { parseInvitationDate } from "@/lib/templates/formatters";

interface CoverSectionProps {
  data: InvitationTemplateData;
}

export function CoverSection({ data }: CoverSectionProps) {
  const groom = data.groomShortName || data.groomName || "Groom";
  const bride = data.brideShortName || data.brideName || "Bride";
  const parsedDate = parseInvitationDate(data.weddingDate);

  return (
    <header className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between px-4 py-8 sm:py-12 text-center overflow-hidden bg-gradient-to-b from-[#FCF8F3] via-[#FCF1EE] to-[#FCF8F3]">
      {/* Decorative Corner Flourishes */}
      <BotanicalCorner position="top-left" className="absolute top-3 left-3 sm:top-6 sm:left-6" />
      <BotanicalCorner position="top-right" className="absolute top-3 right-3 sm:top-6 sm:right-6" />
      <BotanicalCorner position="bottom-left" className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6" />
      <BotanicalCorner position="bottom-right" className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6" />

      {/* Decorative Inner Arch Frame Line */}
      <div
        className="absolute inset-4 sm:inset-6 rounded-3xl border border-[#B8955A]/25 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-5 sm:inset-7 rounded-3xl border border-[#F5DDD6]/40 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Ceremonial Eyebrow */}
      <div className="pt-8 sm:pt-12 z-10">
        <p className="font-cormorant text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#B8955A]">
          The Wedding Of
        </p>
      </div>

      {/* Center Couple Focal Point */}
      <div className="my-auto py-8 z-10 max-w-xl mx-auto px-4 w-full flex flex-col items-center">
        {/* Soft radial glow behind names */}
        <div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#F5DDD6]/30 blur-2xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <h1
          className="font-great-vibes text-[#174F3A] leading-[1.15] text-center select-none"
          style={{
            fontSize: "clamp(2.75rem, 11vw, 5.25rem)",
            textShadow: "0 1px 2px rgba(23, 79, 58, 0.05)",
          }}
        >
          <span className="inline-block max-w-full break-words px-2">{groom}</span>
          <span
            className="block my-1 sm:my-2 font-cormorant italic text-[#B8955A] text-2xl sm:text-3xl font-light"
            aria-hidden="true"
          >
            &amp;
          </span>
          <span className="inline-block max-w-full break-words px-2">{bride}</span>
        </h1>

        <BotanicalDivider className="my-4 sm:my-6" />

        {/* Date Display */}
        {parsedDate ? (
          <div className="font-cormorant text-[#174F3A] flex flex-col items-center">
            <time
              dateTime={data.weddingDate || ""}
              className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#174F3A]/90"
            >
              {parsedDate.dayOfWeek}
            </time>
            <div className="flex items-center gap-3 my-1">
              <span className="h-px w-6 bg-[#B8955A]/40" />
              <span className="text-2xl sm:text-3xl font-bold tracking-wider text-[#B8955A]">
                {parsedDate.dayNumber}
              </span>
              <span className="text-sm sm:text-base tracking-[0.15em] uppercase font-semibold text-[#174F3A]/90">
                {parsedDate.monthName}
              </span>
              <span className="h-px w-6 bg-[#B8955A]/40" />
            </div>
            <span className="text-xs sm:text-sm font-medium tracking-[0.25em] text-[#746F6B]">
              {parsedDate.year}
            </span>
          </div>
        ) : null}
      </div>

      {/* Bottom Scroll Cue */}
      <div className="pb-6 sm:pb-8 z-10 flex flex-col items-center text-[#B8955A]/70 text-xs font-inter tracking-widest uppercase">
        <span className="text-[10px] mb-1.5 opacity-80">Scroll to celebrate</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce opacity-70"
          aria-hidden="true"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </header>
  );
}
