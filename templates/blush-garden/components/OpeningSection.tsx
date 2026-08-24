import React from "react";
import type { InvitationTemplateData } from "../../types";
import { BismillahMotif, BotanicalDivider, FloralFlourish } from "./BotanicalOrnaments";
import { BlushSection } from "./BlushCard";

interface OpeningSectionProps {
  data: InvitationTemplateData;
}

export function OpeningSection({ data }: OpeningSectionProps) {
  if (!data.openingMessage && !data.invitationMessage) {
    return null;
  }

  return (
    <BlushSection ariaLabel="Opening & Greetings">
      {/* Bismillah Motif */}
      <BismillahMotif className="mb-6" />

      {/* Opening Quote / Verse */}
      {data.openingMessage && (
        <blockquote className="mb-8 font-cormorant text-base sm:text-lg italic text-[#174F3A]/90 leading-relaxed max-w-md mx-auto whitespace-pre-line px-2">
          {data.openingMessage}
        </blockquote>
      )}

      {data.openingMessage && data.invitationMessage && (
        <FloralFlourish className="my-6 opacity-75" />
      )}

      {/* Formal Invitation Message */}
      {data.invitationMessage && (
        <p className="font-inter text-xs sm:text-sm text-[#746F6B] leading-relaxed max-w-md mx-auto whitespace-pre-line px-2">
          {data.invitationMessage}
        </p>
      )}

      <BotanicalDivider className="mt-8" />
    </BlushSection>
  );
}
