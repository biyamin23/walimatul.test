import React from "react";
import type { InvitationTemplateData } from "../../types";
import { ChateauFloralDivider } from "./ChateauOrnaments";
import { ChateauCard, ChateauSection } from "./ChateauCard";
import { ChateauReveal } from "./ChateauReveal";
import { BRAND } from "@/lib/constants/brand";

interface ClosingSectionProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

export function ClosingSection({ data, mode = "live" }: ClosingSectionProps) {
  const isEditor = mode === "editor";
  const groom = data.groomShortName || data.groomName || "Groom";
  const bride = data.brideShortName || data.brideName || "Bride";
  const closingMsg =
    data.closingMessage ||
    "Semoga kehadiran dan doa restu para hadirin akan menyerikan lagi ikatan suci perkahwinan kami.";

  return (
    <footer className="w-full pt-6 pb-16">
      <ChateauSection ariaLabel="Penutup Jemputan">
        <ChateauReveal variant="fade-up" duration={850} disabled={isEditor}>
          <ChateauCard hasGlow>
            {/* Eyebrow */}
            <ChateauReveal variant="fade" delay={120} duration={650} disabled={isEditor}>
              <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block mb-2">
                Sekalung Budi
              </span>
            </ChateauReveal>

            {/* Main Thank You Title */}
            <ChateauReveal variant="fade-up" delay={220} duration={750} disabled={isEditor}>
              <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333] mb-4">
                Terima Kasih
              </h2>
            </ChateauReveal>

            {/* Closing Message */}
            <ChateauReveal variant="fade-up" delay={340} duration={750} disabled={isEditor}>
              <p className="font-chateau-body text-xs sm:text-sm text-[#2D2926] leading-relaxed max-w-sm mx-auto mb-6 whitespace-pre-line">
                {closingMsg}
              </p>
            </ChateauReveal>

            {/* Divider */}
            <ChateauReveal variant="scale" delay={440} duration={700} disabled={isEditor}>
              <ChateauFloralDivider className="my-4 opacity-70" animated />
            </ChateauReveal>

            {/* Couple Sign-off */}
            <ChateauReveal variant="scale" delay={540} duration={850} disabled={isEditor}>
              <div className="font-chateau-script text-[#6B2333] text-3xl sm:text-4xl py-2">
                {groom} &amp; {bride}
              </div>
            </ChateauReveal>

            <ChateauReveal variant="fade" delay={640} duration={650} disabled={isEditor}>
              <p className="font-chateau-body text-[10px] uppercase tracking-widest text-[#766467] mt-2">
                #Walimatulurus
              </p>
            </ChateauReveal>
          </ChateauCard>
        </ChateauReveal>
      </ChateauSection>

      {/* Elegant Platform Attribution */}
      <ChateauReveal variant="fade" delay={300} duration={800} disabled={isEditor}>
        <div className="text-center pt-8 pb-4 text-[#766467] font-chateau-body">
          <p className="text-[11px] tracking-widest uppercase opacity-75">
            Jemputan Digital Eksklusif
          </p>
          <p className="font-chateau-heading text-sm font-semibold tracking-wider text-[#6B2333] mt-0.5">
            {BRAND.name}
          </p>
        </div>
      </ChateauReveal>
    </footer>
  );
}

