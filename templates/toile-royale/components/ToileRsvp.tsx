"use client";

import React, { useState } from "react";
import type { InvitationTemplateData } from "@/templates/types";
import { formatWeddingDate } from "@/lib/templates/formatters";
import { GuestRsvpModal } from "@/components/rsvp/GuestRsvpModal";
import { ToileDiamondDivider } from "./ToileOrnaments";

interface ToileRsvpProps {
  data: InvitationTemplateData;
  mode?: "preview" | "live" | "editor";
}

export function ToileRsvp({ data, mode = "live" }: ToileRsvpProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data.rsvpEnabled) {
    return null;
  }

  const deadlineFormatted = data.rsvpDeadline ? formatWeddingDate(data.rsvpDeadline) : null;
  const isDeadlinePassed = data.rsvpDeadline
    ? new Date(`${data.rsvpDeadline}T23:59:59+08:00`) < new Date()
    : false;

  return (
    <section aria-label="Pengesahan Kehadiran" className="w-full py-12 px-4 sm:px-6 bg-[#3D0C16] text-[#FFF8F5] border-b border-[#581825]">
      <div className="max-w-md mx-auto text-center py-8 px-6 rounded-3xl bg-white/5 border border-[#E8C4C8]/25 shadow-xl relative overflow-hidden backdrop-blur-xs">
        {/* Subtle Hairline Frame */}
        <div className="absolute inset-2 rounded-2xl border border-[#E8C4C8]/15 pointer-events-none" />

        <span className="font-toile-serif text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#E8C4C8] block mb-2">
          Kehadiran
        </span>

        <h3 className="font-toile-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#FFF8F5] mb-2">
          Pengesahan Kehadiran (RSVP)
        </h3>

        <ToileDiamondDivider className="my-3 opacity-60 w-28" color="#E8C4C8" />

        <p className="font-toile-heading text-xs sm:text-sm text-[#E8C4C8] leading-relaxed max-w-xs mx-auto mb-5">
          Sila sahkan kehadiran anda bagi memudahkan pihak kami menyusun persiapan majlis dengan sempurna.
        </p>

        {deadlineFormatted && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 border border-[#E8C4C8]/30 text-xs font-toile-body text-[#FFF8F5] mb-6">
            {isDeadlinePassed ? (
              <span className="text-red-400 font-semibold">
                Tarikh akhir RSVP telah tamat ({deadlineFormatted})
              </span>
            ) : (
              <>
                Sila sahkan sebelum{" "}
                <span className="font-bold text-[#E8C4C8]">{deadlineFormatted}</span>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-toile-body text-[#E8C4C8] mb-8">
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E8C4C8]">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Maksimum {data.maxPax} orang
          </span>
          {data.allowGuestMessage && (
            <>
              <span className="hidden sm:inline opacity-40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E8C4C8]">
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
          className={`w-full sm:w-auto min-w-[220px] px-8 py-3.5 rounded-full font-toile-serif text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mx-auto ${
            isDeadlinePassed
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-[#FAF7F2] text-[#581825] hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
          }`}
        >
          <span>{isDeadlinePassed ? "RSVP Ditutup" : "Sahkan Kehadiran (RSVP)"}</span>
        </button>
      </div>

      {/* Guest RSVP Modal */}
      {isModalOpen && (
        <GuestRsvpModal
          invitationId={data.id}
          maxPax={data.maxPax}
          allowGuestMessage={data.allowGuestMessage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
