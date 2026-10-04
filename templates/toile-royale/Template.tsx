import React from "react";
import type { TemplateComponentProps } from "../types";
import { cinzel, cormorantGaramond, greatVibes, inter } from "./fonts";
import { ToileCoverCard } from "./components/ToileCoverCard";
import { ToileCountdown } from "./components/ToileCountdown";
import { ToileCeremonyCard } from "./components/ToileCeremonyCard";
import { ToileGallery } from "./components/ToileGallery";
import { ToileRsvp } from "./components/ToileRsvp";
import { ToileClosing } from "./components/ToileClosing";
import { GuestWishesSection } from "@/components/wishes/GuestWishesSection";

/**
 * WALIMATUL — Toile Royale Invitation Template
 *
 * Design Signature:
 * - Vintage French Toile de Jouy & Victorian Botanical Engraving
 * - Double-sided card structure:
 *     Page 1 (Front): Antique parchment cream (#FAF7F2), deep wine ink (#581825),
 *                     Rococo cartouche frame, and royal interlaced monogram.
 *     Page 2 (Ceremony): Velvety deep wine (#3D0C16), pale blush line-art (#E8C4C8),
 *                        parents greeting, calligraphy couple names, aturcara with QR code,
 *                        turut mengundang, and contact persons.
 * - Classical Roman serif (Cinzel) + French literary serif (Cormorant Garamond) + Calligraphy script (Great Vibes).
 */
export function ToileRoyaleTemplate({ data, mode = "live" }: TemplateComponentProps) {
  return (
    <div
      className={`min-h-screen bg-[#F0EAE1] sm:bg-[#E5DDD2] flex flex-col items-center justify-start ${cinzel.variable} ${cormorantGaramond.variable} ${greatVibes.variable} ${inter.variable}`}
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Outer Invitation Container (Centered mobile editorial canvas) */}
      <div className="w-full max-w-lg sm:max-w-xl min-h-screen bg-[#FAF7F2] shadow-2xl relative flex flex-col overflow-x-hidden border-x border-[#D8C7BC]">
        {/* Preview Mode Badge */}
        {mode === "preview" && (
          <aside
            aria-label="Preview notice"
            className="sticky top-0 z-50 bg-[#581825] text-white text-[11px] font-toile-serif font-bold py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8C4C8] animate-pulse" aria-hidden="true" />
            <span>Toile Royale · Preview Mode</span>
          </aside>
        )}

        <main className="flex-1 flex flex-col justify-start">
          {/* 1. Page 1: Light Parchment Cover Card with Cartouche & Monogram */}
          <ToileCoverCard data={data} mode={mode} />

          {/* 2. Live Countdown (if enabled) */}
          {data.countdownEnabled && data.weddingDate && (
            <ToileCountdown weddingDate={data.weddingDate} startTime={data.startTime} />
          )}

          {/* 3. Page 2: Deep Velvet Burgundy Ceremony Card with Parents, Couple Script & Aturcara */}
          <ToileCeremonyCard data={data} mode={mode} />

          {/* 4. Photo Gallery (if enabled & images exist) */}
          <ToileGallery data={data} />

          {/* 5. Guest Wishes Section (if enabled & wishes exist) */}
          {data.guestWishesEnabled && data.guestWishes && data.guestWishes.length > 0 && (
            <section aria-label="Ucapan Tetamu" className="w-full py-8 px-4 bg-[#FAF7F2] border-b border-[#E8D9D2]">
              <GuestWishesSection
                wishes={data.guestWishes}
                theme={{
                  accentColor: "#581825",
                  surfaceColor: "#FFFFFF",
                  textColor: "#581825",
                  secondaryTextColor: "#6E2835",
                  borderColor: "#E8D9D2",
                }}
              />
            </section>
          )}

          {/* 6. RSVP Preview Section (if enabled) */}
          <ToileRsvp data={data} mode={mode} />

          {/* 7. Closing Blessing & Royal Attribution */}
          <ToileClosing data={data} />
        </main>
      </div>
    </div>
  );
}
