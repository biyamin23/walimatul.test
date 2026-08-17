import React from "react";
import type { InvitationTemplateData } from "../../types";
import { parseInvitationDate, formatTimeRange } from "@/lib/templates/formatters";
import { BotanicalDivider } from "./BotanicalOrnaments";

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
    <section
      aria-label="Event Schedule and Venue"
      className="relative px-4 sm:px-6 py-10 sm:py-14 max-w-xl mx-auto text-center"
    >
      <div className="rounded-3xl p-6 sm:p-10 bg-[#FCF8F3] border border-[#B8955A]/30 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#F5DDD6]/40 blur-xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-[#F5DDD6]/40 blur-xl pointer-events-none"
          aria-hidden="true"
        />

        <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-6">
          Aturcara Majlis
        </p>

        {/* Ceremonial Date & Time Block */}
        {parsedDate && (
          <div className="mb-8">
            <div className="font-cormorant text-[#174F3A] flex flex-col items-center">
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#746F6B]">
                {parsedDate.dayOfWeek}
              </span>
              <div className="flex items-center justify-center gap-4 my-2">
                <span className="h-px w-8 bg-[#B8955A]/40" />
                <span className="text-4xl sm:text-5xl font-bold text-[#174F3A] font-cormorant">
                  {parsedDate.dayNumber}
                </span>
                <span className="h-px w-8 bg-[#B8955A]/40" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-[0.15em] uppercase text-[#174F3A]">
                {parsedDate.monthName} {parsedDate.year}
              </span>
            </div>

            {timeDisplay && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCF1EE] border border-[#E8DDD5] text-xs sm:text-sm font-inter font-medium text-[#174F3A]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#B8955A]"
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

        {parsedDate && hasVenue && <BotanicalDivider className="my-6 opacity-60" />}

        {/* Venue Information */}
        {hasVenue && (
          <div className="mb-6">
            <p className="font-cormorant text-xs font-semibold tracking-[0.2em] uppercase text-[#B8955A] mb-2">
              Lokasi
            </p>
            {data.venueName && (
              <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-[#174F3A] leading-tight mb-2">
                {data.venueName}
              </h3>
            )}
            {data.venueAddress && (
              <address className="font-inter text-xs sm:text-sm text-[#746F6B] not-italic max-w-sm mx-auto leading-relaxed whitespace-pre-line">
                {data.venueAddress}
              </address>
            )}
          </div>
        )}

        {/* Maps & Waze Actions */}
        {(hasMaps || hasWaze) && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E8DDD5]">
            {hasMaps && (
              <a
                href={data.googleMapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#174F3A] text-white font-inter text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#123e2d] transition-colors focus-visible:outline-2 focus-visible:outline-[#174F3A] focus-visible:outline-offset-2"
                aria-label="Open location in Google Maps"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FCF8F3] border border-[#174F3A] text-[#174F3A] font-inter text-xs sm:text-sm font-semibold hover:bg-[#FCF1EE] transition-colors focus-visible:outline-2 focus-visible:outline-[#174F3A] focus-visible:outline-offset-2"
                aria-label="Open location in Waze"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>Waze</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
