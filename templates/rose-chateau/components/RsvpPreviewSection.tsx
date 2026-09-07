"use client";

import React, { useState } from "react";
import type { InvitationTemplateData } from "../../types";
import { formatWeddingDate } from "@/lib/templates/formatters";
import { GuestRsvpModal } from "@/components/rsvp/GuestRsvpModal";
import { ChateauCard, ChateauSection } from "./ChateauCard";

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

  // Check if RSVP deadline has passed (using end-of-day Malaysian local time semantics)
  const isDeadlinePassed = data.rsvpDeadline
    ? new Date(`${data.rsvpDeadline}T23:59:59+08:00`) < new Date()
    : false;

  return (
    <ChateauSection ariaLabel="Pengesahan Kehadiran">
      <ChateauCard hasGlow>
        <p className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] mb-2">
          Kehadiran
        </p>
        <h3 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-3">
          Pengesahan Kehadiran (RSVP)
        </h3>

        <p className="font-chateau-body text-xs sm:text-sm text-[#766467] leading-relaxed max-w-sm mx-auto mb-6">
          Sila sahkan kehadiran anda bagi memudahkan pihak kami menguruskan persiapan majlis.
        </p>

        {deadlineFormatted && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FBEDEA] border border-[#EAD6D8] text-xs font-chateau-body text-[#6B2333] font-medium mb-6">
            {isDeadlinePassed ? (
              <span className="text-red-700 font-semibold">
                Tarikh akhir RSVP telah tamat ({deadlineFormatted})
              </span>
            ) : (
              <>
                Sila sahkan sebelum{" "}
                <span className="font-semibold text-[#B58A4A]">{deadlineFormatted}</span>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-chateau-body text-[#766467] mb-8">
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
              className="text-[#B58A4A]"
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
              <span className="hidden sm:inline text-[#B58A4A]/50">·</span>
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
                  className="text-[#B58A4A]"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Ucapan tetamu dibolehkan
              </span>
            </>
          )}
        </div>

        {/* Action Button: Sahkan Kehadiran */}
        <button
          type="button"
          onClick={() => {
            if (mode === "preview") {
              alert("Borang RSVP berfungsi sepenuhnya pada paparan jemputan sebenar.");
              return;
            }
            if (isDeadlinePassed) return;
            setIsModalOpen(true);
          }}
          disabled={isDeadlinePassed}
          className={`w-full sm:w-auto min-w-[220px] px-8 py-3.5 rounded-full font-chateau-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 mx-auto focus-visible:outline-2 focus-visible:outline-[#6B2333] focus-visible:outline-offset-2 ${
            isDeadlinePassed
              ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
              : "bg-[#6B2333] text-white hover:bg-[#521A26] border border-[#B58A4A]/40 hover:shadow-lg active:scale-95 cursor-pointer"
          }`}
        >
          <span>{isDeadlinePassed ? "RSVP Ditutup" : "Sahkan Kehadiran (RSVP)"}</span>
        </button>
      </ChateauCard>

      {/* Shared Guest RSVP Modal */}
      {isModalOpen && (
        <GuestRsvpModal
          invitationId={data.id}
          maxPax={data.maxPax}
          allowGuestMessage={data.allowGuestMessage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </ChateauSection>
  );
}
