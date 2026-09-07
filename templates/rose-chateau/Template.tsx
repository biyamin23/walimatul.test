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
import { ChateauCountdown } from "./components/ChateauCountdown";
import { GuestWishesSection } from "@/components/wishes/GuestWishesSection";
import { ChateauSection } from "./components/ChateauCard";
import { ChateauReveal } from "./components/ChateauReveal";

/**
 * WALIMATUL — Rose Chateau Invitation Template
 *
 * Production-ready React renderer for the Rose Chateau premium design.
 *
 * Visual System:
 * - Romantic French chateau stationery aesthetic
 * - Deep burgundy / wine (#6B2333), dusty rose (#C98B97), and antique gold (#B58A4A)
 * - Warm ivory (#FFF8F5) and soft blush (#FBEDEA) surfaces
 * - Mobile-first layout with smooth vertical storytelling and centered desktop card
 * - Scoped typography: Great Vibes, Cormorant Garamond, Inter
 * - Cinematic motion language: coordinated stagger, wax seal tactile depression,
 *   subtle floral entrance, and progressive viewport reveals.
 */
export function RoseChateauTemplate({ data, mode = "live" }: TemplateComponentProps) {
  const isEditor = mode === "editor";

  return (
    <div
      className={`min-h-screen bg-[#F5EBE6] sm:bg-[#EFE2DC] flex flex-col items-center justify-start ${greatVibes.variable} ${cormorantGaramond.variable} ${inter.variable}`}
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Outer Invitation Container (Centered mobile/editorial viewport) */}
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl min-h-screen bg-[#FFF8F5] shadow-2xl relative flex flex-col overflow-x-hidden border-x border-[#EAD6D8]/60">
        {/* Editor or Preview Mode Banner */}
        {mode === "preview" && (
          <aside
            aria-label="Preview notice"
            className="sticky top-0 z-50 bg-[#6B2333] text-white text-[11px] font-chateau-body font-medium py-2 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#B58A4A] animate-pulse" aria-hidden="true" />
            <span>Rose Chateau · Preview Mode</span>
          </aside>
        )}

        <main className="flex-1 flex flex-col justify-start">
          {/* 1. Cover / Hero Section with cinematic entrance sequence */}
          <CoverSection data={data} mode={mode} />

          {/* Live Countdown (if enabled) with staggered counter reveal */}
          {data.countdownEnabled && data.weddingDate && (
            <div className="px-4 sm:px-6 py-4 max-w-lg mx-auto w-full">
              <ChateauCountdown
                weddingDate={data.weddingDate}
                startTime={data.startTime}
                mode={mode}
              />
            </div>
          )}

          {/* 2. Opening Greetings & Quotation */}
          <OpeningSection data={data} mode={mode} />

          {/* 3. Formal Couple Presentation with left/right ceremonial reveal */}
          <CoupleSection data={data} mode={mode} />

          {/* 4. Event Schedule, Date & Venue */}
          <EventDetailsSection data={data} mode={mode} />

          {/* 5. Photo Gallery (if enabled & images exist) with staggered scale cards */}
          <GallerySection data={data} mode={mode} />

          {/* 6. Public Guest Wishes Section (if enabled & wishes exist) */}
          {data.guestWishesEnabled && data.guestWishes && data.guestWishes.length > 0 && (
            <ChateauSection ariaLabel="Ucapan Tetamu">
              <ChateauReveal variant="fade-up" duration={700} disabled={isEditor}>
                <GuestWishesSection
                  wishes={data.guestWishes}
                  theme={{
                    accentColor: "#B58A4A",
                    surfaceColor: "#FFFFFF",
                    textColor: "#6B2333",
                    secondaryTextColor: "#766467",
                    borderColor: "#EAD6D8",
                  }}
                />
              </ChateauReveal>
            </ChateauSection>
          )}

          {/* 7. RSVP Preview Section (if enabled) */}
          <RsvpPreviewSection data={data} mode={mode} />

          {/* 8. Closing Blessing & Attribution */}
          <ClosingSection data={data} mode={mode} />
        </main>
      </div>
    </div>
  );
}

