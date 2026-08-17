import React from "react";

/**
 * WALIMATUL — Blush Garden Botanical & Ornamental SVG Accents
 *
 * Handcrafted SVG flourishes designed specifically for Blush Garden:
 * - Floral corners
 * - Botanical dividers
 * - Gold leaf flourishes
 * - Decorative arch borders
 */

export function BotanicalCorner({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const rotation = {
    "top-left": "rotate(0deg)",
    "top-right": "rotate(90deg)",
    "bottom-right": "rotate(180deg)",
    "bottom-left": "rotate(270deg)",
  }[position];

  return (
    <div
      className={`pointer-events-none select-none transition-opacity duration-700 ${className}`}
      style={{ transform: rotation }}
      aria-hidden="true"
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 sm:w-16 sm:h-16 text-[#B8955A]"
      >
        {/* Main corner stem */}
        <path
          d="M6 94 C 6 50, 50 6, 94 6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
        <path
          d="M16 94 C 16 58, 58 16, 94 16"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.25"
        />
        {/* Delicate leaves */}
        <path
          d="M30 42 C 34 32, 46 30, 48 38 C 42 42, 34 44, 30 42 Z"
          fill="#F5DDD6"
          fillOpacity="0.8"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M48 24 C 54 16, 66 18, 66 26 C 60 28, 52 30, 48 24 Z"
          fill="#174F3A"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M24 60 C 18 66, 18 78, 26 76 C 28 70, 30 62, 24 60 Z"
          fill="#174F3A"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M42 48 C 36 54, 34 66, 42 66 C 44 60, 46 52, 42 48 Z"
          fill="#F5DDD6"
          fillOpacity="0.7"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        {/* Tiny berry accent */}
        <circle cx="68" cy="14" r="2.5" fill="#B8955A" fillOpacity="0.7" />
        <circle cx="14" cy="68" r="2.5" fill="#B8955A" fillOpacity="0.7" />
        <circle cx="50" cy="50" r="2" fill="#B8955A" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

export function BotanicalDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 my-6 sm:my-8 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#B8955A]/50" />
      <svg
        width="36"
        height="18"
        viewBox="0 0 36 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#B8955A]"
      >
        <path
          d="M18 9 C13 5, 6 7, 2 9 C8 11, 14 10, 18 9 Z"
          fill="#F5DDD6"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M18 9 C23 5, 30 7, 34 9 C28 11, 22 10, 18 9 Z"
          fill="#F5DDD6"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <circle cx="18" cy="9" r="2.2" fill="#174F3A" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.6" />
      </svg>
      <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#B8955A]/50" />
    </div>
  );
}

export function FloralFlourish({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center select-none ${className}`} aria-hidden="true">
      <svg
        width="80"
        height="24"
        viewBox="0 0 80 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#B8955A]"
      >
        <path
          d="M40 12 C30 6, 15 8, 4 12 C16 16, 28 14, 40 12 Z"
          fill="#F5DDD6"
          fillOpacity="0.6"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M40 12 C50 6, 65 8, 76 12 C64 16, 52 14, 40 12 Z"
          fill="#F5DDD6"
          fillOpacity="0.6"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <circle cx="40" cy="12" r="3" fill="#B8955A" fillOpacity="0.8" />
        <circle cx="28" cy="11" r="1.5" fill="#174F3A" fillOpacity="0.5" />
        <circle cx="52" cy="11" r="1.5" fill="#174F3A" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

export function BismillahMotif({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center select-none ${className}`} aria-hidden="true">
      <p
        className="text-lg sm:text-xl font-normal text-[#174F3A]/80 tracking-widest"
        style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Scheherazade', serif" }}
      >
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  );
}
