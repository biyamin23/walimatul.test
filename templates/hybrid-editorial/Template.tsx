"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { TemplateComponentProps } from "../types";
import {
  APPROVED_FONTS,
  normalizeTemplateDesignConfig,
} from "@/lib/templates/template-design";
import { fontVariablesClass } from "./fonts";
import { OverlayAnimation } from "./OverlayAnimation";
import { GuestRsvpModal } from "@/components/rsvp/GuestRsvpModal";
import { MotionReveal, MotionStagger, MotionHero } from "./motion";
import { LiveCountdown } from "@/components/countdown/LiveCountdown";
import { GuestWishesSection } from "@/components/wishes/GuestWishesSection";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

export function HybridEditorialTemplate({
  data,
  mode = "live",
  designConfig,
}: TemplateComponentProps) {
  const config = normalizeTemplateDesignConfig(designConfig);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Formatted date
  const formattedDate = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString("ms-MY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tarikh Majlis Belum Ditetapkan";

  const groomName = data.groomShortName || data.groomName || "Pengantin Lelaki";
  const brideName = data.brideShortName || data.brideName || "Pengantin Perempuan";

  // Google Calendar URL generator
  function getGoogleCalendarUrl() {
    if (!data.weddingDate) return "#";
    const title = encodeURIComponent(`Walimatulurus ${groomName} & ${brideName}`);
    const details = encodeURIComponent(data.venueAddress || data.venueName || "Majlis Perkahwinan");
    const location = encodeURIComponent(data.venueAddress || data.venueName || "");
    const dateClean = data.weddingDate.replace(/-/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateClean}/${dateClean}&details=${details}&location=${location}`;
  }

  const headingFont = APPROVED_FONTS[config.typography.headingFont]?.cssVariable || "serif";
  const scriptFont = APPROVED_FONTS[config.typography.scriptFont]?.cssVariable || "cursive";
  const bodyFont = APPROVED_FONTS[config.typography.bodyFont]?.cssVariable || "sans-serif";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${fontVariablesClass}`}
      style={
        {
          backgroundColor: config.colors.background,
          "--template-bg": config.colors.background,
          "--template-surface": config.colors.surface,
          "--template-surface-card": config.colors.surfaceCard,
          "--template-text-primary": config.colors.primaryText,
          "--template-text-secondary": config.colors.secondaryText,
          "--template-accent": config.colors.accent,
          "--template-border": config.colors.border,
          "--template-btn-bg": config.colors.buttonBg,
          "--template-btn-text": config.colors.buttonText,
          "--template-font-heading": headingFont,
          "--template-font-script": scriptFont,
          "--template-font-body": bodyFont,
          fontFamily: "var(--template-font-body)",
          color: "var(--template-text-primary)",
        } as React.CSSProperties
      }
    >
      {/* ── Main Invitation Column (Mobile-first viewport) ── */}
      <div
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl min-h-screen relative flex flex-col overflow-x-hidden shadow-2xl border-x"
        style={{
          backgroundColor: config.colors.surface,
          borderColor: config.colors.border,
        }}
      >
        {/* Responsive Background Image Layers */}
        {/* Mobile Background (Portrait: < 640px) */}
        {config.background.mobileImageUrl && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0 sm:hidden"
            style={{
              backgroundImage: `url(${config.background.mobileImageUrl})`,
              backgroundSize: config.background.size,
              backgroundRepeat: config.background.repeat,
              backgroundPosition: "center top",
            }}
          >
            {config.background.overlayOpacity > 0 && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: config.colors.background,
                  opacity: config.background.overlayOpacity,
                }}
              />
            )}
          </div>
        )}

        {/* Desktop / Tablet Background (Landscape: >= 640px) */}
        {config.background.desktopImageUrl && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0 hidden sm:block"
            style={{
              backgroundImage: `url(${config.background.desktopImageUrl})`,
              backgroundSize: config.background.size,
              backgroundRepeat: config.background.repeat,
              backgroundPosition: "center top",
            }}
          >
            {config.background.overlayOpacity > 0 && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: config.colors.background,
                  opacity: config.background.overlayOpacity,
                }}
              />
            )}
          </div>
        )}

        {/* Dynamic Overlay Animation Layer */}
        <OverlayAnimation config={config.overlay} />

        {/* Preview Mode Sticky Notice */}
        {mode === "preview" && (
          <aside
            aria-label="Preview notice"
            className="sticky top-0 z-50 py-2 px-4 text-center tracking-wider uppercase text-[11px] font-semibold flex items-center justify-center gap-2 shadow-sm"
            style={{
              backgroundColor: config.colors.buttonBg,
              color: config.colors.buttonText,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
            <span>Pratonton Rekaan · Hybrid Editorial</span>
          </aside>
        )}

        {/* Content Flow */}
        <main className="relative z-10 flex-1 flex flex-col justify-start pb-16">
          {/* Top Decorative Ornament */}
          {config.ornaments.topOrnamentUrl && (
            <div className="w-full flex justify-center pt-8 px-6 pointer-events-none">
              <Image
                src={config.ornaments.topOrnamentUrl}
                alt=""
                width={280}
                height={80}
                className="max-h-20 w-auto object-contain"
                unoptimized
              />
            </div>
          )}

          {/* 1. Cover / Hero Section */}
          <section className="px-6 py-12 text-center">
            <MotionHero
              preset={config.animation.cardPreset}
              duration={config.animation.duration}
              className="space-y-6 flex flex-col items-center justify-center"
            >
              <span
                className="text-[11px] uppercase tracking-[0.25em] font-semibold block"
                style={{ color: config.colors.accent }}
              >
                Walimatulurus
              </span>

              <div className="space-y-3">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl leading-tight font-normal"
                  style={{
                    fontFamily: "var(--template-font-script)",
                    color: config.colors.primaryText,
                  }}
                >
                  {groomName}
                </h1>

                <span
                  className="text-xl sm:text-2xl font-light italic block"
                  style={{
                    fontFamily: "var(--template-font-heading)",
                    color: config.colors.accent,
                  }}
                >
                  &amp;
                </span>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl leading-tight font-normal"
                  style={{
                    fontFamily: "var(--template-font-script)",
                    color: config.colors.primaryText,
                  }}
                >
                  {brideName}
                </h1>
              </div>

              <div
                className="inline-block py-2 px-6 rounded-full border text-xs sm:text-sm font-medium tracking-wide shadow-2xs"
                style={{
                  backgroundColor: config.colors.surfaceCard,
                  borderColor: config.colors.border,
                  color: config.colors.secondaryText,
                }}
              >
                {formattedDate}
              </div>

              {/* Live Countdown if enabled */}
              {data.countdownEnabled && data.weddingDate && (
                <div className="pt-2 w-full">
                  <LiveCountdown
                    weddingDate={data.weddingDate}
                    startTime={data.startTime}
                    theme={{
                      accentColor: config.colors.accent,
                      surfaceColor: config.colors.surfaceCard,
                      textColor: config.colors.primaryText,
                      secondaryTextColor: config.colors.secondaryText,
                      borderColor: config.colors.border,
                    }}
                  />
                </div>
              )}
            </MotionHero>
          </section>

          {/* Divider */}
          <div className="flex items-center justify-center my-4 px-12">
            <div className="h-px flex-1" style={{ backgroundColor: config.colors.border }} />
            <span className="px-3 text-xs" style={{ color: config.colors.accent }}>✦</span>
            <div className="h-px flex-1" style={{ backgroundColor: config.colors.border }} />
          </div>

          {/* 2. Opening & Greeting Section */}
          <section className="px-6 sm:px-10 py-8 text-center">
            <MotionReveal
              preset={config.animation.cardPreset}
              duration={config.animation.duration}
              triggerOnce={config.animation.triggerOnce}
              className="space-y-4"
            >
              <h2
                className="text-2xl sm:text-3xl font-normal"
                style={{
                  fontFamily: "var(--template-font-heading)",
                  color: config.colors.primaryText,
                }}
              >
                Undangan Majlis
              </h2>

              {data.openingMessage ? (
                <p
                  className="text-xs sm:text-sm leading-relaxed max-w-md mx-auto whitespace-pre-line"
                  style={{ color: config.colors.secondaryText }}
                >
                  {data.openingMessage}
                </p>
              ) : (
                <p
                  className="text-xs sm:text-sm leading-relaxed max-w-md mx-auto italic"
                  style={{ color: config.colors.secondaryText }}
                >
                  &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
                  <br />
                  <span className="text-[11px] font-semibold not-italic block mt-1">
                    (Surah Ar-Rum: 21)
                  </span>
                </p>
              )}
            </MotionReveal>
          </section>

          {/* 3. Formal Couple Presentation */}
          <section className="px-6 sm:px-10 py-6">
            <MotionReveal
              preset={config.animation.cardPreset}
              duration={config.animation.duration}
              triggerOnce={config.animation.triggerOnce}
            >
              <div
                className="p-6 sm:p-8 rounded-3xl border shadow-sm text-center space-y-6"
                style={{
                  backgroundColor: config.colors.surfaceCard,
                  borderColor: config.colors.border,
                }}
              >
                {/* Groom */}
                <div className="space-y-1">
                  <h3
                    className="text-xl sm:text-2xl font-bold"
                    style={{
                      fontFamily: "var(--template-font-heading)",
                      color: config.colors.primaryText,
                    }}
                  >
                    {data.groomName || "Nama Penuh Pengantin Lelaki"}
                  </h3>
                  {data.invitationMessage && (
                    <p
                      className="text-xs leading-relaxed max-w-sm mx-auto"
                      style={{ color: config.colors.secondaryText }}
                    >
                      {data.invitationMessage}
                    </p>
                  )}
                </div>

                <span className="text-sm font-semibold" style={{ color: config.colors.accent }}>
                  DENGAN
                </span>

                {/* Bride */}
                <div className="space-y-1">
                  <h3
                    className="text-xl sm:text-2xl font-bold"
                    style={{
                      fontFamily: "var(--template-font-heading)",
                      color: config.colors.primaryText,
                    }}
                  >
                    {data.brideName || "Nama Penuh Pengantin Perempuan"}
                  </h3>
                </div>
              </div>
            </MotionReveal>
          </section>

          {/* 4. Event Schedule & Venue */}
          <section className="px-6 sm:px-10 py-8 space-y-6">
            <MotionReveal
              preset={config.animation.cardPreset}
              duration={config.animation.duration}
              triggerOnce={config.animation.triggerOnce}
              className="text-center space-y-1"
            >
              <span
                className="text-[10px] uppercase tracking-widest font-bold block"
                style={{ color: config.colors.accent }}
              >
                Lokasi &amp; Masa
              </span>
              <h2
                className="text-2xl sm:text-3xl font-normal"
                style={{
                  fontFamily: "var(--template-font-heading)",
                  color: config.colors.primaryText,
                }}
              >
                Butiran Majlis
              </h2>
            </MotionReveal>

            <MotionStagger
              preset={config.animation.cardPreset}
              duration={config.animation.duration}
              triggerOnce={config.animation.triggerOnce}
              className="p-6 sm:p-8 rounded-3xl border shadow-sm text-center space-y-5"
              style={{
                backgroundColor: config.colors.surfaceCard,
                borderColor: config.colors.border,
              }}
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: config.colors.accent }}>
                  Tarikh
                </p>
                <p className="text-base sm:text-lg font-bold" style={{ color: config.colors.primaryText }}>
                  {formattedDate}
                </p>
              </div>

              {(data.startTime || data.endTime) && (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: config.colors.accent }}>
                    Masa Majlis
                  </p>
                  <p className="text-sm sm:text-base font-semibold" style={{ color: config.colors.primaryText }}>
                    {data.startTime || "—"} {data.endTime ? `hingga ${data.endTime}` : ""}
                  </p>
                </div>
              )}

              {data.venueName && (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: config.colors.accent }}>
                    Tempat
                  </p>
                  <p className="text-base sm:text-lg font-bold" style={{ color: config.colors.primaryText }}>
                    {data.venueName}
                  </p>
                  {data.venueAddress && (
                    <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: config.colors.secondaryText }}>
                      {data.venueAddress}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons: Maps / Waze / Calendar */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                {data.googleMapsUrl && (
                  <a
                    href={data.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer hover:opacity-90"
                    style={{
                      backgroundColor: config.colors.buttonBg,
                      color: config.colors.buttonText,
                    }}
                  >
                    <span>Google Maps ↗</span>
                  </a>
                )}

                {data.wazeUrl && (
                  <a
                    href={data.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer hover:bg-[var(--surface-warm)]"
                    style={{
                      backgroundColor: config.colors.surface,
                      borderColor: config.colors.border,
                      color: config.colors.primaryText,
                    }}
                  >
                    <span>Waze ↗</span>
                  </a>
                )}

                {data.weddingDate && (
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer hover:bg-[var(--surface-warm)]"
                    style={{
                      backgroundColor: config.colors.surface,
                      borderColor: config.colors.border,
                      color: config.colors.primaryText,
                    }}
                  >
                    <span>+ Kalendar</span>
                  </a>
                )}
              </div>
            </MotionStagger>
          </section>

          {/* 5. Photo Gallery (if items present) */}
          {data.gallery && data.gallery.length > 0 && (
            <section className="px-6 sm:px-10 py-8 space-y-4">
              <MotionReveal
                preset={config.animation.cardPreset}
                duration={config.animation.duration}
                triggerOnce={config.animation.triggerOnce}
                className="text-center space-y-1"
              >
                <span
                  className="text-[10px] uppercase tracking-widest font-bold block"
                  style={{ color: config.colors.accent }}
                >
                  Galeri Foto
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-normal"
                  style={{
                    fontFamily: "var(--template-font-heading)",
                    color: config.colors.primaryText,
                  }}
                >
                  Kenangan Manis
                </h2>
              </MotionReveal>

              <MotionReveal
                preset={config.animation.cardPreset}
                duration={config.animation.duration}
                triggerOnce={config.animation.triggerOnce}
                className="grid grid-cols-2 gap-3 pt-2"
              >
                {data.gallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedGalleryImage(item.storagePath)}
                    className="relative aspect-4/5 rounded-2xl overflow-hidden border shadow-xs cursor-pointer group"
                    style={{ borderColor: config.colors.border }}
                  >
                    <Image
                      src={item.storagePath}
                      alt="Galeri perkahwinan"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full backdrop-blur-xs transition-opacity">
                        🔍 Lihat
                      </span>
                    </div>
                  </div>
                ))}
              </MotionReveal>
            </section>
          )}

          {/* 6. Guest Wishes Section (Phase 10B) */}
          {data.guestWishesEnabled && data.guestWishes && data.guestWishes.length > 0 && (
            <section className="px-6 sm:px-10 py-8">
              <MotionReveal
                preset={config.animation.cardPreset}
                duration={config.animation.duration}
                triggerOnce={config.animation.triggerOnce}
              >
                <GuestWishesSection
                  wishes={data.guestWishes}
                  theme={{
                    accentColor: config.colors.accent,
                    surfaceColor: config.colors.surfaceCard,
                    textColor: config.colors.primaryText,
                    secondaryTextColor: config.colors.secondaryText,
                    borderColor: config.colors.border,
                  }}
                />
              </MotionReveal>
            </section>
          )}

          {/* 7. RSVP Section */}
          {data.rsvpEnabled && (
            <section className="px-6 sm:px-10 py-8">
              <MotionReveal
                preset={config.animation.cardPreset}
                duration={config.animation.duration}
                triggerOnce={config.animation.triggerOnce}
              >
                <div
                  className="p-6 sm:p-8 rounded-3xl border shadow-sm text-center space-y-4"
                  style={{
                    backgroundColor: config.colors.surfaceCard,
                    borderColor: config.colors.border,
                  }}
                >
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold block"
                    style={{ color: config.colors.accent }}
                  >
                    Kehadiran
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-normal"
                    style={{
                      fontFamily: "var(--template-font-heading)",
                      color: config.colors.primaryText,
                    }}
                  >
                    Sahkan Kehadiran Anda
                  </h2>

                  <p
                    className="text-xs leading-relaxed max-w-sm mx-auto"
                    style={{ color: config.colors.secondaryText }}
                  >
                    {data.rsvpDeadline
                      ? `Sila sahkan kehadiran anda sebelum ${new Date(
                          data.rsvpDeadline
                        ).toLocaleDateString("ms-MY", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}.`
                      : "Sila buat pengesahan kehadiran awal bagi memudahkan penyusunan majlis."}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (mode === "live") {
                          setIsRsvpModalOpen(true);
                        }
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: config.colors.buttonBg,
                        color: config.colors.buttonText,
                      }}
                    >
                      Hantar Maklum Balas RSVP
                    </button>
                  </div>
                </div>
              </MotionReveal>
            </section>
          )}

          {/* Bottom Decorative Ornament */}
          {config.ornaments.bottomOrnamentUrl && (
            <div className="w-full flex justify-center py-6 px-6 pointer-events-none">
              <Image
                src={config.ornaments.bottomOrnamentUrl}
                alt=""
                width={280}
                height={80}
                className="max-h-20 w-auto object-contain"
                unoptimized
              />
            </div>
          )}

          {/* 8. Closing Blessing & Attribution */}
          <section className="px-6 py-8 text-center space-y-4 mt-auto">
            <MotionReveal
              preset={config.animation.cardPreset}
              duration={config.animation.duration}
              triggerOnce={config.animation.triggerOnce}
              className="space-y-4"
            >
              {data.closingMessage ? (
                <p
                  className="text-xs leading-relaxed max-w-md mx-auto whitespace-pre-line"
                  style={{ color: config.colors.secondaryText }}
                >
                  {data.closingMessage}
                </p>
              ) : (
                <p
                  className="text-xs leading-relaxed max-w-md mx-auto"
                  style={{ color: config.colors.secondaryText }}
                >
                  Semoga kehadiran dan doa restu para hadirin sekalian memeriahkan lagi majlis kami serta diberkati Allah SWT.
                </p>
              )}

              <div className="pt-4 text-[10px] uppercase tracking-widest font-semibold opacity-60">
                WALIMATUL by nasuhalias
              </div>
            </MotionReveal>
          </section>
        </main>
      </div>

      {/* Gallery Lightbox Modal */}
      <GalleryLightbox
        isOpen={Boolean(selectedGalleryImage)}
        imageUrl={selectedGalleryImage || ""}
        onClose={() => setSelectedGalleryImage(null)}
      />



      {/* Guest RSVP Modal in live mode */}
      {mode === "live" && (
        <GuestRsvpModal
          isOpen={isRsvpModalOpen}
          onClose={() => setIsRsvpModalOpen(false)}
          invitationId={data.id}
          maxPax={data.maxPax}
          allowGuestMessage={data.allowGuestMessage}
        />
      )}
    </div>
  );
}
