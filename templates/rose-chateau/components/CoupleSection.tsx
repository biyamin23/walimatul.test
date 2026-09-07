import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauCard, ChateauSection } from "./ChateauCard";
import { ChateauFloralDivider } from "./ChateauOrnaments";

interface CoupleSectionProps {
  data: InvitationTemplateData;
}

export function CoupleSection({ data }: CoupleSectionProps) {
  const groom = data.groomName || "Pengantin Lelaki";
  const bride = data.brideName || "Pengantin Perempuan";

  return (
    <ChateauSection ariaLabel="Pengantin">
      <ChateauCard hasGlow>
        <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block mb-2">
          Mempelai
        </span>

        <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-6">
          Dua Hati Satu Jiwa
        </h2>

        {/* Groom Presentation */}
        <div className="py-2 space-y-1">
          <p className="font-chateau-heading text-xl sm:text-2xl font-bold text-[#6B2333] leading-snug break-words px-2">
            {groom}
          </p>
          <p className="font-chateau-body text-[11px] sm:text-xs tracking-wider uppercase text-[#766467]">
            Pengantin Lelaki
          </p>
        </div>

        <ChateauFloralDivider className="my-3 opacity-60" />

        {/* Bride Presentation */}
        <div className="py-2 space-y-1">
          <p className="font-chateau-heading text-xl sm:text-2xl font-bold text-[#6B2333] leading-snug break-words px-2">
            {bride}
          </p>
          <p className="font-chateau-body text-[11px] sm:text-xs tracking-wider uppercase text-[#766467]">
            Pengantin Perempuan
          </p>
        </div>
      </ChateauCard>
    </ChateauSection>
  );
}
