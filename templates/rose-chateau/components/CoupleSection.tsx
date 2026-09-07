import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauCard, ChateauSection } from "./ChateauCard";
import { ChateauFloralDivider } from "./ChateauOrnaments";
import { ChateauReveal } from "./ChateauReveal";

interface CoupleSectionProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

export function CoupleSection({ data, mode = "live" }: CoupleSectionProps) {
  const isEditor = mode === "editor";
  const groom = data.groomName || "Pengantin Lelaki";
  const bride = data.brideName || "Pengantin Perempuan";

  return (
    <ChateauSection ariaLabel="Pengantin">
      <ChateauReveal variant="fade-up" duration={750} disabled={isEditor} className="w-full">
        <ChateauCard hasGlow>
          <ChateauReveal variant="fade-down" delay={100} duration={600} disabled={isEditor}>
            <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block mb-2">
              Mempelai
            </span>
          </ChateauReveal>

          <ChateauReveal variant="fade-up" delay={180} duration={700} disabled={isEditor}>
            <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-6">
              Dua Hati Satu Jiwa
            </h2>
          </ChateauReveal>

          {/* Groom Presentation (enters smoothly from left) */}
          <ChateauReveal variant="slide-left" delay={260} duration={800} disabled={isEditor}>
            <div className="py-2 space-y-1">
              <p className="font-chateau-heading text-xl sm:text-2xl font-bold text-[#6B2333] leading-snug break-words px-2">
                {groom}
              </p>
              <p className="font-chateau-body text-[11px] sm:text-xs tracking-wider uppercase text-[#766467]">
                Pengantin Lelaki
              </p>
            </div>
          </ChateauReveal>

          <ChateauReveal variant="scale" delay={340} duration={700} disabled={isEditor}>
            <ChateauFloralDivider className="my-3 opacity-60" animated={!isEditor} />
          </ChateauReveal>

          {/* Bride Presentation (enters smoothly from right) */}
          <ChateauReveal variant="slide-right" delay={420} duration={800} disabled={isEditor}>
            <div className="py-2 space-y-1">
              <p className="font-chateau-heading text-xl sm:text-2xl font-bold text-[#6B2333] leading-snug break-words px-2">
                {bride}
              </p>
              <p className="font-chateau-body text-[11px] sm:text-xs tracking-wider uppercase text-[#766467]">
                Pengantin Perempuan
              </p>
            </div>
          </ChateauReveal>
        </ChateauCard>
      </ChateauReveal>
    </ChateauSection>
  );
}
