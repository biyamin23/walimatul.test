"use client";

import React from "react";
import type { InvitationTemplateData } from "@/templates/types";
import { parseInvitationDate } from "@/lib/templates/formatters";
import { ToileMonogram } from "./ToileMonogram";
import {
  ToileCartoucheFrame,
  ToileFloralBorder,
  ToileFloralCorner,
  ToileDiamondDivider,
} from "./ToileOrnaments";

const MALAY_DAYS = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
const MALAY_MONTHS = [
  "Januari",
  "Februari",
  "Mac",
  "April",
  "Mei",
  "Jun",
  "Julai",
  "Ogos",
  "September",
  "Oktober",
  "November",
  "Disember",
];

interface ToileCoverCardProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

/**
 * ToileCoverCard
 *
 * Direct recreation of Page 1 from the reference invitation:
 * - Warm antique parchment ivory backdrop (#FAF7F2)
 * - Fine-etched Toile de Jouy botanical rose borders in deep royal wine (#581825)
 * - Handcrafted Rococo cartouche frame
 * - Intertwined royal serif couple monogram
 * - Widely tracked French classical serif typography
 */
export function ToileCoverCard({ data }: ToileCoverCardProps) {
  const groom = data.groomShortName || data.groomName || "Wan Irsyaduddin";
  const bride = data.brideShortName || data.brideName || "Nurhidayah";

  // Formatted date in Malay: SABTU | 12 DISEMBER 2026
  let formattedDateMalay = "SABTU | 12 DISEMBER 2026";
  if (data.weddingDate) {
    const parsed = parseInvitationDate(data.weddingDate);
    if (parsed) {
      const match = data.weddingDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const year = match[1];
        const monthIdx = parseInt(match[2], 10) - 1;
        const dayNum = parseInt(match[3], 10);
        const dateObj = new Date(Date.UTC(parseInt(year, 10), monthIdx, dayNum));
        const dayMalay = MALAY_DAYS[dateObj.getUTCDay()].toUpperCase();
        const monthMalay = MALAY_MONTHS[monthIdx].toUpperCase();
        formattedDateMalay = `${dayMalay} | ${dayNum} ${monthMalay} ${year}`;
      }
    }
  }

  // Location display
  const locationText = data.venueAddress || data.venueName || "LOT 417D KG PASIR PEKAN WAKAF BHARU, KELANTAN";

  return (
    <div className="relative w-full min-h-[92svh] flex flex-col items-center justify-between p-4 sm:p-8 bg-[#FAF7F2] text-[#581825] overflow-hidden select-none border-b border-[#E8D9D2]">
      {/* Delicate vintage paper texture & subtle warm radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.9) 0%, rgba(245, 237, 228, 0.6) 70%, rgba(235, 222, 210, 0.4) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Top Rose Engraving Garland */}
      <div className="relative z-10 w-full max-w-md -mt-2">
        <ToileFloralBorder position="top" color="#581825" />
      </div>

      {/* Outer Double Hairline Frame with Rosette Corners */}
      <div
        className="absolute inset-3 sm:inset-5 border border-[#581825]/35 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-1.5 border border-[#581825]/20" />
      </div>

      {/* Corner Botanical Etchings */}
      <ToileFloralCorner position="top-left" className="absolute top-4 left-4" color="#581825" />
      <ToileFloralCorner position="top-right" className="absolute top-4 right-4" color="#581825" />
      <ToileFloralCorner position="bottom-left" className="absolute bottom-4 left-4" color="#581825" />
      <ToileFloralCorner position="bottom-right" className="absolute bottom-4 right-4" color="#581825" />

      {/* Central Cartouche Enclosure */}
      <div className="relative z-20 w-full max-w-sm sm:max-w-md my-auto py-6 px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Decorative Cartouche Frame Background */}
        <div className="absolute inset-0 -top-2 -bottom-2 -left-2 -right-2 pointer-events-none opacity-85">
          <ToileCartoucheFrame color="#581825" />
        </div>

        {/* Content within Cartouche */}
        <div className="relative z-10 py-6 px-3 flex flex-col items-center">
          {/* Eyebrow Header */}
          <div className="space-y-1 mb-5 sm:mb-6">
            <p className="font-toile-serif text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#581825]">
              Majlis Kesyukuran
            </p>
            <p className="font-toile-serif text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#6E2835]/90">
              Sempena Perkahwinan
            </p>
          </div>

          {/* Interwoven Royal Monogram */}
          <div className="my-2 sm:my-3">
            <ToileMonogram
              groomName={groom}
              brideName={bride}
              size="lg"
              color="#581825"
            />
          </div>

          {/* Couple Names */}
          <div className="mt-4 mb-3 max-w-[280px] sm:max-w-xs">
            <h1 className="font-toile-serif text-sm sm:text-base font-bold tracking-[0.20em] uppercase text-[#581825] leading-relaxed">
              {bride} &amp; {groom}
            </h1>
          </div>

          <ToileDiamondDivider className="my-2 opacity-70 w-32" color="#581825" />

          {/* Date Block */}
          <div className="my-2">
            <p className="font-toile-serif text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#581825]">
              {formattedDateMalay}
            </p>
          </div>

          {/* Location Block */}
          <div className="my-2 max-w-[260px]">
            <p className="font-toile-serif text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#6E2835] leading-normal whitespace-pre-line">
              {locationText}
            </p>
          </div>

          {/* Wedding Hashtag */}
          <div className="mt-4 pt-1">
            <span className="font-toile-heading italic text-xs tracking-wider text-[#581825]/85">
              #WanDaytillforever
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Rose Engraving Garland */}
      <div className="relative z-10 w-full max-w-md -mb-2">
        <ToileFloralBorder position="bottom" color="#581825" />
      </div>

      {/* Gentle Floating Scroll Cue */}
      <div className="relative z-20 pb-2 text-center flex flex-col items-center gap-1.5 opacity-80 transition-opacity hover:opacity-100">
        <span className="font-toile-serif text-[9px] tracking-[0.25em] uppercase text-[#581825]">
          Sila Skrol Ke Bawah
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#581825"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
