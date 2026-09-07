import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauCard, ChateauSection } from "./ChateauCard";
import { ChateauFloralDivider } from "./ChateauOrnaments";

interface OpeningSectionProps {
  data: InvitationTemplateData;
}

export function OpeningSection({ data }: OpeningSectionProps) {
  const openingMsg =
    data.openingMessage ||
    "Dengan penuh kesyukuran dan berbesar hati, kami menjemput Dato' / Datin / Tuan / Puan / Encik / Cik sekeluarga hadir ke majlis perkahwinan kami.";

  const invitationMsg = data.invitationMessage;

  return (
    <ChateauSection ariaLabel="Kata Pengantar Jemputan">
      <ChateauCard hasGlow>
        <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block mb-2">
          Undangan Kasih
        </span>

        <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-4">
          Salam Kesyukuran
        </h2>

        <p className="font-chateau-body text-xs sm:text-sm text-[#2D2926] leading-relaxed max-w-md mx-auto whitespace-pre-line">
          {openingMsg}
        </p>

        {invitationMsg && (
          <>
            <ChateauFloralDivider className="my-4 opacity-70" />
            <p className="font-chateau-body text-xs sm:text-sm text-[#766467] leading-relaxed max-w-md mx-auto italic whitespace-pre-line">
              {invitationMsg}
            </p>
          </>
        )}
      </ChateauCard>
    </ChateauSection>
  );
}
