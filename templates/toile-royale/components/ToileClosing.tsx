import React from "react";
import type { InvitationTemplateData } from "@/templates/types";
import { ToileMonogram } from "./ToileMonogram";
import { ToileFloralBorder, ToileDiamondDivider } from "./ToileOrnaments";
import { BRAND } from "@/lib/constants/brand";

interface ToileClosingProps {
  data: InvitationTemplateData;
}

export function ToileClosing({ data }: ToileClosingProps) {
  const groom = data.groomShortName || data.groomName || "Groom";
  const bride = data.brideShortName || data.brideName || "Bride";
  const closingMsg =
    data.closingMessage ||
    "Semoga kehadiran dan doa restu para hadirin sekalian akan menyerikan lagi ikatan suci perkahwinan kami serta diberkati Allah SWT.";

  return (
    <footer className="relative w-full py-12 px-4 sm:px-6 bg-[#FAF7F2] text-[#581825] overflow-hidden select-none text-center">
      {/* Top Rose Engraving Garland */}
      <div className="w-full max-w-md mx-auto -mt-6 opacity-75">
        <ToileFloralBorder position="top" color="#581825" />
      </div>

      <div className="max-w-md mx-auto py-6 px-4">
        <span className="font-toile-serif text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#6E2835] block mb-2">
          Sekalung Budi
        </span>

        <h2 className="font-toile-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#581825] mb-4">
          Terima Kasih
        </h2>

        <p className="font-toile-heading text-xs sm:text-sm text-[#581825] leading-relaxed max-w-sm mx-auto mb-6 whitespace-pre-line">
          {closingMsg}
        </p>

        <ToileDiamondDivider className="my-4 opacity-60 w-32" color="#581825" />

        {/* Couple Sign-off */}
        <div className="my-4">
          <ToileMonogram groomName={groom} brideName={bride} size="sm" color="#581825" />
          <p className="font-toile-script text-3xl sm:text-4xl text-[#581825] mt-2">
            {bride} &amp; {groom}
          </p>
          <p className="font-toile-heading italic text-xs text-[#6E2835] mt-1">
            #WanDaytillforever
          </p>
        </div>
      </div>

      {/* Bottom Rose Engraving Garland */}
      <div className="w-full max-w-md mx-auto -mb-6 opacity-75">
        <ToileFloralBorder position="bottom" color="#581825" />
      </div>

      {/* Platform Attribution */}
      <div className="pt-8 pb-4 text-[#6E2835] font-toile-body">
        <p className="text-[10px] tracking-widest uppercase opacity-75">
          Jemputan Digital Eksklusif
        </p>
        <p className="font-toile-serif text-xs font-bold tracking-wider text-[#581825] mt-0.5">
          {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
