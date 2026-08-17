import React from "react";
import type { InvitationTemplateData } from "../../types";

interface CoupleSectionProps {
  data: InvitationTemplateData;
}

export function CoupleSection({ data }: CoupleSectionProps) {
  const groom = data.groomName || data.groomShortName;
  const bride = data.brideName || data.brideShortName;

  return (
    <section
      aria-label="The Bride & Groom"
      className="relative px-6 py-8 sm:py-12 text-center max-w-xl mx-auto"
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FCF1EE]/60 via-[#FCF8F3] to-[#FCF1EE]/60 border border-[#E8DDD5]">
        <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-4">
          Mempelai
        </p>

        {/* Groom */}
        <div className="my-3">
          <h2 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#174F3A] tracking-wide break-words">
            {groom}
          </h2>
          <span className="font-inter text-[11px] uppercase tracking-widest text-[#746F6B] mt-1 block">
            Pengantin Lelaki
          </span>
        </div>

        {/* Ampersand & Flourish */}
        <div className="flex items-center justify-center gap-3 my-3">
          <span className="h-px w-10 bg-[#B8955A]/30" />
          <span className="font-great-vibes text-2xl text-[#B8955A] leading-none select-none">
            &amp;
          </span>
          <span className="h-px w-10 bg-[#B8955A]/30" />
        </div>

        {/* Bride */}
        <div className="my-3">
          <h2 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#174F3A] tracking-wide break-words">
            {bride}
          </h2>
          <span className="font-inter text-[11px] uppercase tracking-widest text-[#746F6B] mt-1 block">
            Pengantin Perempuan
          </span>
        </div>
      </div>
    </section>
  );
}
