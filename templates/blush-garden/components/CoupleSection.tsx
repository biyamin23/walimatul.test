import React from "react";
import type { InvitationTemplateData } from "../../types";
import { BlushCard, BlushSection } from "./BlushCard";

interface CoupleSectionProps {
  data: InvitationTemplateData;
}

export function CoupleSection({ data }: CoupleSectionProps) {
  const groom = data.groomName || data.groomShortName || "Pengantin Lelaki";
  const bride = data.brideName || data.brideShortName || "Pengantin Perempuan";

  return (
    <BlushSection ariaLabel="The Bride & Groom">
      <BlushCard variant="major" hasGlow>
        <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-6">
          Mempelai
        </p>

        {/* Groom */}
        <div className="space-y-1.5 my-2">
          <h2 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#174F3A] tracking-wide break-words leading-snug px-2">
            {groom}
          </h2>
          <span className="font-inter text-[11px] uppercase tracking-widest text-[#746F6B] block">
            Pengantin Lelaki
          </span>
        </div>

        {/* Ampersand & Flourish */}
        <div className="flex items-center justify-center gap-3 my-5 sm:my-6">
          <span className="h-px w-10 sm:w-14 bg-[#B8955A]/30" />
          <span className="font-great-vibes text-2xl sm:text-3xl text-[#B8955A] leading-none select-none">
            &amp;
          </span>
          <span className="h-px w-10 sm:w-14 bg-[#B8955A]/30" />
        </div>

        {/* Bride */}
        <div className="space-y-1.5 my-2">
          <h2 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#174F3A] tracking-wide break-words leading-snug px-2">
            {bride}
          </h2>
          <span className="font-inter text-[11px] uppercase tracking-widest text-[#746F6B] block">
            Pengantin Perempuan
          </span>
        </div>
      </BlushCard>
    </BlushSection>
  );
}
