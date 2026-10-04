"use client";

import React, { useEffect, useRef } from "react";
import type { InvitationTemplateData } from "@/templates/types";
import { parseInvitationDate, formatWeddingTime } from "@/lib/templates/formatters";
import {
  ToileFloralCorner,
  ToileFloralBorder,
  ToileDiamondDivider,
} from "./ToileOrnaments";

const MALAY_DAYS = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
const MALAY_MONTHS = [
  "Januari",
  "Februari",
  "Mac",
  "April",
  "Mei",
  "Jun",
  "Julai",
  "Ogos",
  "September",
  "Oktober",
  "November",
  "Disember",
];

interface ToileCeremonyCardProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

/**
 * ToileCeremonyCard
 *
 * Direct recreation of Page 2 from the reference invitation:
 * - Rich velvety burgundy / wine background (#3D0C16)
 * - Delicate botanical rose line-art in soft blush/ivory (#E8C4C8)
 * - Formal parents greeting & invitation text
 * - Formal bride & groom names in Great Vibes calligraphy script
 * - "ATURCARA MAJLIS" grid: Date block | Time slot | Interactive QR Code
 * - "Turut mengundang" family acknowledgment
 * - "UNTUK DIHUBUNGI" contact badges with click-to-call & WhatsApp
 */
export function ToileCeremonyCard({ data }: ToileCeremonyCardProps) {
  const groomFullName = data.groomName || "Wan Muhammad Irsyaduddin bin Wan Rosdi";
  const brideFullName = data.brideName || "Nurhidayah binti Mohamad Saufi";

  // Parse Date
  let dayName = "SABTU";
  let dayNumber = "12";
  let monthYear = "DISEMBER 2026";

  if (data.weddingDate) {
    const parsed = parseInvitationDate(data.weddingDate);
    if (parsed) {
      const match = data.weddingDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const year = match[1];
        const monthIdx = parseInt(match[2], 10) - 1;
        const dayNum = parseInt(match[3], 10);
        const dateObj = new Date(Date.UTC(parseInt(year, 10), monthIdx, dayNum));
        dayName = MALAY_DAYS[dateObj.getUTCDay()].toUpperCase();
        dayNumber = String(dayNum);
        monthYear = `${MALAY_MONTHS[monthIdx].toUpperCase()} ${year}`;
      }
    }
  }

  // Format Time: 12.30 tengah hari - 5.00 petang
  const startTimeFormatted = data.startTime ? formatWeddingTime(data.startTime) : "12:30 PM";
  const endTimeFormatted = data.endTime ? formatWeddingTime(data.endTime) : "5:00 PM";

  // QR Code generator
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let isMounted = true;
    if (canvasRef.current) {
      import("qrcode")
        .then((QRCode) => {
          if (!isMounted || !canvasRef.current) return;
          const targetUrl = typeof window !== "undefined" ? window.location.href : "https://walimatul.my";
          QRCode.toCanvas(canvasRef.current, targetUrl, {
            width: 88,
            margin: 1,
            color: {
              dark: "#3D0C16",
              light: "#FFFFFF",
            },
          });
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative w-full py-12 sm:py-16 px-4 sm:px-8 bg-[#3D0C16] text-[#FFF8F5] overflow-hidden select-none">
      {/* Background Depth Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(92, 29, 39, 0.45) 0%, rgba(61, 12, 22, 0.85) 60%, rgba(40, 7, 14, 0.98) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Top Rose Engraving Garland in Pale Blush */}
      <div className="relative z-10 w-full max-w-md mx-auto -mt-6 opacity-60">
        <ToileFloralBorder position="top" color="#E8C4C8" />
      </div>

      {/* Corner Botanical Etchings in Pale Blush */}
      <ToileFloralCorner position="top-left" className="absolute top-4 left-4 opacity-40" color="#E8C4C8" />
      <ToileFloralCorner position="top-right" className="absolute top-4 right-4 opacity-40" color="#E8C4C8" />
      <ToileFloralCorner position="bottom-left" className="absolute bottom-4 left-4 opacity-40" color="#E8C4C8" />
      <ToileFloralCorner position="bottom-right" className="absolute bottom-4 right-4 opacity-40" color="#E8C4C8" />

      {/* Double Hairline Inner Frame */}
      <div
        className="absolute inset-3 sm:inset-5 border border-[#E8C4C8]/25 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-1.5 border border-[#E8C4C8]/15" />
      </div>

      {/* Main Ceremony Card Content Container */}
      <div className="relative z-20 max-w-md mx-auto flex flex-col items-center text-center py-2 px-2 sm:px-4">
        {/* 1. Salam & Kesyukuran */}
        <div className="space-y-1 mb-4">
          <p className="font-toile-heading text-sm sm:text-base tracking-wide text-[#FFF0F2]">
            Assalamualaikum &amp; Salam Sejahtera
          </p>
          <p className="font-toile-heading italic text-xs sm:text-sm text-[#E8C4C8]">
            Dengan penuh rasa syukur kami
          </p>
        </div>

        {/* 2. Parents Names */}
        <div className="my-3 space-y-1">
          <p className="font-toile-serif text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#FFF8F5]">
            MOHAMAD SAUFI BIN NAWI
          </p>
          <p className="font-toile-heading text-xs text-[#E8C4C8]">&amp;</p>
          <p className="font-toile-serif text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#FFF8F5]">
            ZUNAIDAH BINTI CHE HARUN
          </p>
        </div>

        {/* 3. Jemputan Text */}
        <div className="max-w-xs my-3 space-y-1">
          <p className="font-toile-heading text-xs sm:text-sm text-[#E8C4C8] leading-relaxed">
            mengalu-alukan kehadiran
          </p>
          <p className="font-toile-serif text-[11px] sm:text-xs font-semibold tracking-wider text-[#FFF8F5]">
            Dato&apos; / Datin / Tuan / Puan / Encik / Cik
          </p>
        </div>

        {/* Horizontal Dashed Divider */}
        <div className="w-48 sm:w-64 h-px border-b border-dashed border-[#E8C4C8]/40 my-4" />

        {/* 4. Majlis Perkahwinan Puteri/Putera */}
        <p className="font-toile-heading italic text-xs sm:text-sm text-[#E8C4C8] mb-4">
          ke Majlis Kesyukuran sempena Perkahwinan Puteri kami
        </p>

        {/* 5. Formal Couple Names in Script */}
        <div className="my-4 space-y-2 max-w-sm px-2">
          <h2 className="font-toile-script text-3xl sm:text-4xl text-[#FFF8F5] leading-tight drop-shadow-sm">
            {brideFullName}
          </h2>
          <p className="font-toile-heading text-base text-[#E8C4C8] font-serif">&amp;</p>
          <h2 className="font-toile-script text-3xl sm:text-4xl text-[#FFF8F5] leading-tight drop-shadow-sm">
            {groomFullName}
          </h2>
        </div>

        <ToileDiamondDivider className="my-4 opacity-70 w-36" color="#E8C4C8" />

        {/* 6. ATURCARA MAJLIS */}
        <div className="w-full my-4 py-4 px-3 sm:px-5 rounded-2xl bg-white/5 border border-[#E8C4C8]/20 backdrop-blur-xs">
          <p className="font-toile-serif text-xs font-semibold tracking-[0.25em] uppercase text-[#E8C4C8] mb-4">
            Aturcara Majlis
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center text-center">
            {/* Left: Date Block */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/15 border border-[#E8C4C8]/15">
              <span className="font-toile-serif text-[10px] tracking-widest uppercase text-[#E8C4C8]">
                {dayName}
              </span>
              <span className="font-toile-serif text-2xl sm:text-3xl font-bold text-[#FFF8F5] leading-none my-1">
                {dayNumber}
              </span>
              <span className="font-toile-serif text-[9px] tracking-wider uppercase text-[#E8C4C8]">
                {monthYear}
              </span>
            </div>

            {/* Middle: Time Slot */}
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="font-toile-body text-[11px] sm:text-xs text-[#FFF8F5] font-medium leading-tight">
                {startTimeFormatted}
              </span>
              <span className="text-xs text-[#E8C4C8] my-0.5">—</span>
              <span className="font-toile-body text-[11px] sm:text-xs text-[#FFF8F5] font-medium leading-tight">
                {endTimeFormatted}
              </span>
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-1 rounded-lg bg-white shadow-md border border-[#E8C4C8]/40">
                <canvas ref={canvasRef} className="w-18 h-18 sm:w-20 sm:h-20 block" />
              </div>
              <span className="font-toile-body text-[8px] uppercase tracking-wider text-[#E8C4C8] mt-1">
                Imbas Lokasi
              </span>
            </div>
          </div>

          {/* Navigation Action Buttons: Google Maps & Waze */}
          {(data.googleMapsUrl || data.wazeUrl) && (
            <div className="flex items-center justify-center gap-2.5 mt-4 pt-3 border-t border-[#E8C4C8]/15">
              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 max-w-[140px] px-3 py-2 rounded-full bg-[#FAF7F2] text-[#581825] font-toile-body text-[11px] font-semibold tracking-wider uppercase hover:bg-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Google Maps
                </a>
              )}
              {data.wazeUrl && (
                <a
                  href={data.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 max-w-[140px] px-3 py-2 rounded-full bg-[#FAF7F2] text-[#581825] font-toile-body text-[11px] font-semibold tracking-wider uppercase hover:bg-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                  Waze
                </a>
              )}
            </div>
          )}
        </div>

        {/* 7. Turut Mengundang */}
        <div className="my-4 text-center space-y-1">
          <p className="font-toile-heading italic text-xs text-[#E8C4C8]">
            Turut mengundang
          </p>
          <p className="font-toile-serif text-xs sm:text-sm font-semibold text-[#FFF8F5] tracking-wide">
            Kamaludin Bin Salleh dan seisi keluarga
          </p>
        </div>

        <ToileDiamondDivider className="my-3 opacity-60 w-28" color="#E8C4C8" />

        {/* 8. UNTUK DIHUBUNGI */}
        <div className="w-full my-3">
          <p className="font-toile-serif text-[11px] font-semibold tracking-[0.25em] uppercase text-[#E8C4C8] mb-3">
            Untuk Dihubungi
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Contact 1 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-[#E8C4C8]/20 text-center">
              <span className="font-toile-body text-[11px] font-bold text-[#FFF8F5]">
                Saufi
              </span>
              <a
                href="tel:0179394498"
                className="font-toile-body text-[10px] text-[#E8C4C8] hover:text-white transition-colors mt-0.5 tracking-tight underline decoration-dotted"
              >
                017-9394498
              </a>
              <a
                href="https://wa.me/60179394498"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-[9px] text-emerald-400 hover:text-emerald-300 font-medium"
              >
                WhatsApp
              </a>
            </div>

            {/* Contact 2 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-[#E8C4C8]/20 text-center">
              <span className="font-toile-body text-[11px] font-bold text-[#FFF8F5]">
                Kamaludin
              </span>
              <a
                href="tel:0129612272"
                className="font-toile-body text-[10px] text-[#E8C4C8] hover:text-white transition-colors mt-0.5 tracking-tight underline decoration-dotted"
              >
                012-9612272
              </a>
              <a
                href="https://wa.me/60129612272"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-[9px] text-emerald-400 hover:text-emerald-300 font-medium"
              >
                WhatsApp
              </a>
            </div>

            {/* Contact 3 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-[#E8C4C8]/20 text-center">
              <span className="font-toile-body text-[11px] font-bold text-[#FFF8F5]">
                Taufiq
              </span>
              <a
                href="tel:0147938847"
                className="font-toile-body text-[10px] text-[#E8C4C8] hover:text-white transition-colors mt-0.5 tracking-tight underline decoration-dotted"
              >
                014-7938847
              </a>
              <a
                href="https://wa.me/60147938847"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-[9px] text-emerald-400 hover:text-emerald-300 font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Rose Engraving Garland in Pale Blush */}
      <div className="relative z-10 w-full max-w-md mx-auto -mb-6 opacity-60">
        <ToileFloralBorder position="bottom" color="#E8C4C8" />
      </div>
    </div>
  );
}
