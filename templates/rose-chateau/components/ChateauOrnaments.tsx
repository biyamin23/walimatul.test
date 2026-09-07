import React from "react";

/**
 * WALIMATUL — Rose Chateau Ornamental SVG Accents
 *
 * Handcrafted romantic French chateau & garden rose flourishes:
 * - Rose bud corner flourishes
 * - Gold vine floral dividers
 * - Double stationery arch borders
 * - Embossed wax seal emblem
 */

export function ChateauRoseCorner({
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
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: rotation }}
      aria-hidden="true"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 sm:w-16 sm:h-16 text-[#B58A4A]"
      >
        {/* Outer flourishing stem */}
        <path
          d="M8 92 C 8 46, 46 8, 92 8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
        {/* Inner parallel hairline */}
        <path
          d="M18 92 C 18 54, 54 18, 92 18"
          stroke="#C98B97"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.35"
        />
        {/* Rose bloom on corner node */}
        <path
          d="M32 38 C 34 26, 48 24, 52 34 C 44 40, 36 40, 32 38 Z"
          fill="#6B2333"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M36 34 C 38 28, 46 28, 48 33 C 44 36, 39 36, 36 34 Z"
          fill="#6B2333"
          fillOpacity="0.4"
        />
        {/* Rose petals & delicate leaves */}
        <path
          d="M52 20 C 58 12, 70 14, 70 22 C 64 24, 56 26, 52 20 Z"
          fill="#C98B97"
          fillOpacity="0.45"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M20 54 C 12 60, 14 72, 22 72 C 24 66, 26 58, 20 54 Z"
          fill="#C98B97"
          fillOpacity="0.4"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M44 46 C 38 52, 36 64, 44 64 C 46 58, 48 50, 44 46 Z"
          fill="#B58A4A"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        {/* Tiny golden bud accents */}
        <circle cx="72" cy="12" r="2.5" fill="#B58A4A" fillOpacity="0.75" />
        <circle cx="12" cy="72" r="2.5" fill="#B58A4A" fillOpacity="0.75" />
        <circle cx="56" cy="56" r="2" fill="#6B2333" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

export function ChateauFloralDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 my-6 sm:my-8 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#B58A4A]/50" />
      <div className="flex items-center gap-1.5 text-[#B58A4A]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <circle cx="12" cy="12" r="2.5" fill="#6B2333" />
          <path
            d="M12 4 C 13.5 8, 15.5 8, 12 12 C 8.5 8, 10.5 8, 12 4 Z"
            fill="#C98B97"
            fillOpacity="0.6"
          />
          <path
            d="M12 20 C 13.5 16, 15.5 16, 12 12 C 8.5 16, 10.5 16, 12 20 Z"
            fill="#C98B97"
            fillOpacity="0.6"
          />
          <path
            d="M4 12 C 8 13.5, 8 15.5, 12 12 C 8 8.5, 8 10.5, 4 12 Z"
            fill="#B58A4A"
            fillOpacity="0.7"
          />
          <path
            d="M20 12 C 16 13.5, 16 15.5, 12 12 C 16 8.5, 16 10.5, 20 12 Z"
            fill="#B58A4A"
            fillOpacity="0.7"
          />
        </svg>
      </div>
      <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#B58A4A]/50" />
    </div>
  );
}

export function ChateauArchFrame() {
  return (
    <>
      <div
        className="absolute inset-3 sm:inset-5 rounded-3xl border border-[#B58A4A]/30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-4 sm:inset-6 rounded-3xl border border-[#EAD6D8]/50 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}

export function WaxSealEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Concentric inner seal ring */}
      <circle cx="22" cy="22" r="19" stroke="#C8A46B" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" />
      <circle cx="22" cy="22" r="16.5" stroke="#C8A46B" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Center Rose Crest */}
      <path
        d="M22 13 C 24 16, 27 16, 26 19 C 24 21, 20 21, 18 19 C 17 16, 20 16, 22 13 Z"
        fill="#C8A46B"
        fillOpacity="0.85"
      />
      <circle cx="22" cy="22" r="3" fill="#C8A46B" />
      <path
        d="M22 25 C 22 28, 20 30, 19 32"
        stroke="#C8A46B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M22 26 C 24 28, 25 30, 26 31"
        stroke="#C8A46B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      {/* Small side leaf accents */}
      <circle cx="16" cy="22" r="1" fill="#C8A46B" />
      <circle cx="28" cy="22" r="1" fill="#C8A46B" />
    </svg>
  );
}
