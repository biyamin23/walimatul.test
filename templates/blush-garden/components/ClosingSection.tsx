import React from "react";
import type { InvitationTemplateData } from "../../types";
import { FloralFlourish } from "./BotanicalOrnaments";

interface ClosingSectionProps {
  data: InvitationTemplateData;
}

export function ClosingSection({ data }: ClosingSectionProps) {
  const groom = data.groomShortName || data.groomName || "Pengantin Lelaki";
  const bride = data.brideShortName || data.brideName || "Pengantin Perempuan";

  return (
    <footer
      aria-label="Closing & Blessing"
      className="relative w-full max-w-xl mx-auto px-4 sm:px-6 pt-8 pb-16 text-center flex flex-col items-center"
    >
      {/* Closing message or wedding doa */}
      {data.closingMessage ? (
        <p className="font-inter text-xs sm:text-sm text-[#746F6B] leading-relaxed max-w-md mx-auto whitespace-pre-line mb-6">
          {data.closingMessage}
        </p>
      ) : (
        <p className="font-cormorant text-base sm:text-lg italic text-[#174F3A]/90 max-w-md mx-auto mb-6">
          “Semoga Allah memberkati ikatan ini dan menghimpunkan kedua mempelai dalam kebaikan dan kebahagiaan.”
        </p>
      )}

      {/* Signature */}
      <p className="font-great-vibes text-2xl sm:text-3xl text-[#174F3A] my-3">
        {groom} &amp; {bride}
      </p>

      <FloralFlourish className="my-6 opacity-75" />

      {/* Subtle WALIMATUL Attribution */}
      <div className="mt-8 pt-6 border-t border-[#E8DDD5]/60 w-full max-w-xs text-center select-none">
        <p className="font-inter text-[10px] tracking-widest uppercase text-[#746F6B]/70">
          Created with{" "}
          <span className="font-semibold text-[#174F3A]">WALIMATUL</span>
        </p>
        <p className="font-inter text-[9px] text-[#B8955A]/80 tracking-wider mt-0.5">
          by nasuhalias
        </p>
      </div>
    </footer>
  );
}
