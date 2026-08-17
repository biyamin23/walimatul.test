import React from "react";
import type { TemplateComponentProps } from "../types";
import { greatVibes, cormorantGaramond, inter } from "./fonts";
import { CoverSection } from "./components/CoverSection";
import { OpeningSection } from "./components/OpeningSection";
import { CoupleSection } from "./components/CoupleSection";
import { EventDetailsSection } from "./components/EventDetailsSection";
import { GallerySection } from "./components/GallerySection";
import { RsvpPreviewSection } from "./components/RsvpPreviewSection";
import { ClosingSection } from "./components/ClosingSection";

/**
 * WALIMATUL — Blush Garden Invitation Template
 *
 * Production-ready React renderer for the Blush Garden design.
 *
 * Design characteristics:
 * - Romantic floral aesthetic with ivory (#FCF8F3), soft blush (#F5DDD6), deep green (#174F3A), and muted gold (#B8955A).
 * - Typography: Great Vibes (script names), Cormorant Garamond (ceremonial titles & dates), Inter (functional text).
 * - Mobile-first layout with smooth editorial rhythm and max-width desktop centering.
 *
 * Architectural purity:
 * - Receives normalized InvitationTemplateData only.
 * - Zero database access or session dependencies inside this component.
 */
export function BlushGardenTemplate({ data, mode = "live" }: TemplateComponentProps) {
  return (
    <div
      className={`min-h-screen bg-[#F5EDE6] sm:bg-[#EFE6DC] flex flex-col items-center justify-start ${greatVibes.variable} ${cormorantGaramond.variable} ${inter.variable}`}
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Outer Invitation Container (Intimate mobile/editorial viewport) */}
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl min-h-screen bg-[#FCF8F3] shadow-2xl relative flex flex-col overflow-x-hidden border-x border-[#E8DDD5]/60">
        {/* Editor or Preview Mode Banner */}
        {mode === "preview" && (
          <aside
            aria-label="Preview notice"
            className="sticky top-0 z-50 bg-[#174F3A] text-white text-[11px] font-inter font-medium py-2 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#B8955A] animate-pulse" aria-hidden="true" />
            <span>Blush Garden · Preview Mode</span>
          </aside>
        )}

        <main className="flex-1 flex flex-col justify-start">
          {/* 1. Cover / Hero Section */}
          <CoverSection data={data} />

          {/* 2. Opening Greetings & Quotation */}
          <OpeningSection data={data} />

          {/* 3. Formal Couple Presentation */}
          <CoupleSection data={data} />

          {/* 4. Event Schedule, Date & Venue */}
          <EventDetailsSection data={data} />

          {/* 5. Photo Gallery */}
          <GallerySection data={data} />

          {/* 6. RSVP Preview Section */}
          <RsvpPreviewSection data={data} />

          {/* 7. Closing Blessing & Attribution */}
          <ClosingSection data={data} />
        </main>
      </div>
    </div>
  );
}
