"use client";

import React, { useState } from "react";
import type { InvitationTemplateData } from "../../types";
import { formatWeddingDate } from "@/lib/templates/formatters";
import { GuestRsvpModal } from "@/components/rsvp/GuestRsvpModal";
import { BlushCard, BlushSection } from "./BlushCard";

interface RsvpPreviewSectionProps {
  data: InvitationTemplateData;
  mode?: "preview" | "live" | "editor";
}

export function RsvpPreviewSection({ data, mode = "live" }: RsvpPreviewSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data.rsvpEnabled) {
    return null;
  }

  const deadlineFormatted = data.rsvpDeadline ? formatWeddingDate(data.rsvpDeadline) : null;

  // Check if RSVP deadline has passed (using end-of-day Malaysian local / calendar semantics)
  const isDeadlinePassed = data.rsvpDeadline
    ? new Date(`${data.rsvpDeadline}T23:59:59+08:00`) < new Date()
    : false;

  return (
    <BlushSection ariaLabel="Pengesahan Kehadiran">
      <BlushCard variant="major" hasGlow>
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
            {isDeadlinePassed ? (
              <span className="text-red-700 font-semibold">
                Tarikh akhir RSVP telah tamat ({deadlineFormatted})
              </span>
            ) : (
              <>
                Mohon sahkan sebelum{" "}
                <span className="font-semibold text-[#B8955A]">{deadlineFormatted}</span>
              </>
            )}
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

        {/* CTA Button */}
        {mode === "preview" ? (
          <div>
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-full bg-[#174F3A] text-white font-inter text-sm font-semibold tracking-wide shadow-md opacity-90 cursor-not-allowed select-none"
              title="Borang RSVP interaktif aktif pada pautan rasmi jemputan"
            >
              Sahkan Kehadiran (RSVP)
            </button>
            <p className="font-inter text-[11px] text-[#746F6B]/80 mt-2.5">
              (Borang interaktif aktif pada pautan jemputan rasmi)
            </p>
          </div>
        ) : isDeadlinePassed ? (
          <div>
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-full bg-[#746F6B]/30 text-[#746F6B] font-inter text-sm font-semibold tracking-wide cursor-not-allowed select-none"
            >
              RSVP Telah Ditutup
            </button>
            <p className="font-inter text-[11px] text-red-700/80 mt-2.5 font-medium">
              Tempoh pengesahan kehadiran bagi majlis ini telah tamat.
            </p>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-full bg-[#174F3A] text-white font-inter text-sm font-semibold tracking-wide shadow-md hover:bg-[#123e2d] active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#174F3A] focus-visible:outline-offset-2 cursor-pointer"
            >
              Sahkan Kehadiran (RSVP)
            </button>
          </div>
        )}
      </BlushCard>

      {/* Interactive Modal */}
      {mode !== "preview" && !isDeadlinePassed && (
        <GuestRsvpModal
          isOpen={isModalOpen}
          invitationId={data.id}
          maxPax={data.maxPax}
          allowGuestMessage={data.allowGuestMessage}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </BlushSection>
  );
}
