import React from "react";
import type { InvitationTemplateData } from "../../types";
import { formatWeddingDate } from "@/lib/templates/formatters";

interface RsvpPreviewSectionProps {
  data: InvitationTemplateData;
}

export function RsvpPreviewSection({ data }: RsvpPreviewSectionProps) {
  if (!data.rsvpEnabled) {
    return null;
  }

  const deadlineFormatted = data.rsvpDeadline ? formatWeddingDate(data.rsvpDeadline) : null;

  return (
    <section
      aria-label="RSVP Preview"
      className="relative px-4 sm:px-6 py-10 sm:py-14 max-w-xl mx-auto text-center"
    >
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#FCF1EE] via-[#FCF8F3] to-[#FCF1EE] border border-[#B8955A]/35 shadow-sm">
        <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-2">
          Kehadiran
        </p>
        <h3 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#174F3A] mb-3">
          Pengesahan Kehadiran (RSVP)
        </h3>

        <p className="font-inter text-xs sm:text-sm text-[#746F6B] leading-relaxed max-w-sm mx-auto mb-6">
          Sila lengkapkan borang kehadiran bagi memudahkan pihak kami membuat persiapan jamuan.
        </p>

        {deadlineFormatted && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FCF8F3] border border-[#B8955A]/40 text-xs font-inter text-[#174F3A] font-medium mb-6">
            Mohon sahkan sebelum{" "}
            <span className="font-semibold text-[#B8955A]">{deadlineFormatted}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-inter text-[#746F6B] mb-8">
          <span className="inline-flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#B8955A]"
              aria-hidden="true"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Maksimum {data.maxPax} orang
          </span>
          {data.allowGuestMessage && (
            <>
              <span className="hidden sm:inline text-[#B8955A]/50">·</span>
              <span className="inline-flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#B8955A]"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Ucapan tetamu dibolehkan
              </span>
            </>
          )}
        </div>

        {/* Presentation RSVP CTA (Non-submitting preview state) */}
        <button
          type="button"
          disabled
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#174F3A] text-white font-inter text-sm font-semibold tracking-wide shadow-md opacity-90 cursor-not-allowed select-none"
          title="RSVP function is enabled for guests in published invitations"
        >
          Sahkan Kehadiran (RSVP)
        </button>
        <p className="font-inter text-[11px] text-[#746F6B]/80 mt-2.5">
          (Borang interaktif aktif pada pautan jemputan rasmi)
        </p>
      </div>
    </section>
  );
}
