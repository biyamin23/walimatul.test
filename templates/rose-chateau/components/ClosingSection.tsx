import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauFloralDivider } from "./ChateauOrnaments";
import { ChateauCard, ChateauSection } from "./ChateauCard";
import { BRAND } from "@/lib/constants/brand";

interface ClosingSectionProps {
  data: InvitationTemplateData;
}

export function ClosingSection({ data }: ClosingSectionProps) {
  const groom = data.groomShortName || data.groomName || "Groom";
  const bride = data.brideShortName || data.brideName || "Bride";
  const closingMsg =
    data.closingMessage ||
    "Semoga kehadiran dan doa restu para hadirin akan menyerikan lagi ikatan suci perkahwinan kami.";

  return (
    <footer className="w-full pt-4 pb-12">
      <ChateauSection ariaLabel="Penutup Jemputan">
        <ChateauCard hasGlow>
          <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block mb-2">
            Sekalung Budi
          </span>

          <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-4">
            Terima Kasih
          </h2>

          <p className="font-chateau-body text-xs sm:text-sm text-[#2D2926] leading-relaxed max-w-sm mx-auto mb-6 whitespace-pre-line">
            {closingMsg}
          </p>

          <ChateauFloralDivider className="my-4 opacity-70" />

          {/* Couple Sign-off */}
          <div className="font-chateau-script text-[#6B2333] text-3xl sm:text-4xl py-2">
            {groom} &amp; {bride}
          </div>

          <p className="font-chateau-body text-[10px] uppercase tracking-widest text-[#766467] mt-2">
            #Walimatulurus
          </p>
        </ChateauCard>
      </ChateauSection>

      {/* Elegant Platform Attribution */}
      <div className="text-center pt-8 pb-4 text-[#766467] font-chateau-body">
        <p className="text-[11px] tracking-widest uppercase opacity-75">
          Jemputan Digital Eksklusif
        </p>
        <p className="font-chateau-heading text-sm font-semibold tracking-wider text-[#6B2333] mt-0.5">
          {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
