import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauCard, ChateauSection } from "./ChateauCard";
import { ChateauFloralDivider } from "./ChateauOrnaments";
import { ChateauReveal } from "./ChateauReveal";

interface OpeningSectionProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

export function OpeningSection({ data, mode = "live" }: OpeningSectionProps) {
  const isEditor = mode === "editor";
  const openingMsg =
    data.openingMessage ||
    "Dengan penuh kesyukuran dan berbesar hati, kami menjemput Dato' / Datin / Tuan / Puan / Encik / Cik sekeluarga hadir ke majlis perkahwinan kami.";

  const invitationMsg = data.invitationMessage;

  return (
    <ChateauSection ariaLabel="Kata Pengantar Jemputan">
      <ChateauReveal variant="fade-up" duration={750} disabled={isEditor} className="w-full">
        <ChateauCard hasGlow>
          <ChateauReveal variant="fade-down" delay={100} duration={600} disabled={isEditor}>
            <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block mb-2">
              Undangan Kasih
            </span>
          </ChateauReveal>

          <ChateauReveal variant="fade-up" delay={180} duration={700} disabled={isEditor}>
            <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-4">
              Salam Kesyukuran
            </h2>
          </ChateauReveal>

          <ChateauReveal variant="fade-up" delay={260} duration={750} disabled={isEditor}>
            <p className="font-chateau-body text-xs sm:text-sm text-[#2D2926] leading-relaxed max-w-md mx-auto whitespace-pre-line">
              {openingMsg}
            </p>
          </ChateauReveal>

          {invitationMsg && (
            <>
              <ChateauFloralDivider className="my-4 opacity-70" animated={!isEditor} />
              <ChateauReveal variant="fade-up" delay={340} duration={750} disabled={isEditor}>
                <p className="font-chateau-body text-xs sm:text-sm text-[#766467] leading-relaxed max-w-md mx-auto italic whitespace-pre-line">
                  {invitationMsg}
                </p>
              </ChateauReveal>
            </>
          )}
        </ChateauCard>
      </ChateauReveal>
    </ChateauSection>
  );
}
