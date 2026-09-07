import React from "react";
import type { InvitationTemplateData } from "../../types";
import { parseInvitationDate, formatTimeRange } from "@/lib/templates/formatters";
import { ChateauFloralDivider } from "./ChateauOrnaments";
import { ChateauCard, ChateauSection } from "./ChateauCard";

interface EventDetailsSectionProps {
  data: InvitationTemplateData;
}

export function EventDetailsSection({ data }: EventDetailsSectionProps) {
  const parsedDate = parseInvitationDate(data.weddingDate);
  const timeDisplay = formatTimeRange(data.startTime, data.endTime);
  const hasVenue = Boolean(data.venueName || data.venueAddress);
  const hasMaps = Boolean(data.googleMapsUrl);
  const hasWaze = Boolean(data.wazeUrl);

  if (!parsedDate && !timeDisplay && !hasVenue) {
    return null;
  }

  return (
    <ChateauSection ariaLabel="Aturcara Majlis dan Lokasi">
      <ChateauCard hasGlow>
        <p className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] mb-4">
          Aturcara Majlis
        </p>

        {/* Ceremonial Date & Time Block */}
        {parsedDate && (
          <div className="mb-6">
            <div className="font-chateau-heading text-[#6B2333] flex flex-col items-center">
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#766467]">
                {parsedDate.dayOfWeek}
              </span>
              <div className="flex items-center justify-center gap-4 my-2">
                <span className="h-px w-8 bg-[#B58A4A]/40" />
                <span className="text-4xl sm:text-5xl font-bold text-[#6B2333]">
                  {parsedDate.dayNumber}
                </span>
                <span className="h-px w-8 bg-[#B58A4A]/40" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-[0.15em] uppercase text-[#6B2333]">
                {parsedDate.monthName} {parsedDate.year}
              </span>
            </div>

            {timeDisplay && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBEDEA] border border-[#EAD6D8] text-xs sm:text-sm font-chateau-body font-medium text-[#6B2333]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#B58A4A]"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{timeDisplay}</span>
              </div>
            )}
          </div>
        )}

        {parsedDate && hasVenue && <ChateauFloralDivider className="my-6 opacity-60" />}

        {/* Venue Information */}
        {hasVenue && (
          <div className="mb-4">
            <p className="font-chateau-heading text-xs font-semibold tracking-[0.2em] uppercase text-[#B58A4A] mb-2">
              Tempat Majlis
            </p>
            {data.venueName && (
              <h3 className="font-chateau-heading text-xl sm:text-2xl font-bold text-[#6B2333] leading-tight mb-2">
                {data.venueName}
              </h3>
            )}
            {data.venueAddress && (
              <address className="font-chateau-body text-xs sm:text-sm text-[#766467] not-italic max-w-sm mx-auto leading-relaxed whitespace-pre-line">
                {data.venueAddress}
              </address>
            )}
          </div>
        )}

        {/* Maps & Waze Actions */}
        {(hasMaps || hasWaze) && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EAD6D8]">
            {hasMaps && (
              <a
                href={data.googleMapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#6B2333] text-white font-chateau-body text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#521A26] transition-colors focus-visible:outline-2 focus-visible:outline-[#6B2333] focus-visible:outline-offset-2 active:scale-95 cursor-pointer"
                aria-label={`Buka lokasi di Google Maps${data.venueName ? `: ${data.venueName}` : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Google Maps</span>
              </a>
            )}

            {hasWaze && (
              <a
                href={data.wazeUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#FBEDEA] text-[#6B2333] border border-[#EAD6D8] font-chateau-body text-xs sm:text-sm font-semibold hover:bg-[#F7E0E5] transition-colors focus-visible:outline-2 focus-visible:outline-[#6B2333] focus-visible:outline-offset-2 active:scale-95 cursor-pointer"
                aria-label={`Buka lokasi di Waze${data.venueName ? `: ${data.venueName}` : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 2.5 0.92 4.78 2.45 6.54L3.1 21.6c-0.16 0.44 0.17 0.9 0.63 0.9h0.27l3.65-1.04C9.17 21.78 10.55 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-3.5 11.5c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5zm7 0c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z" />
                </svg>
                <span>Waze</span>
              </a>
            )}
          </div>
        )}
      </ChateauCard>
    </ChateauSection>
  );
}
