import React from "react";

/**
 * WALIMATUL — Rose Chateau Ornamental SVG Accents
 *
 * Handcrafted romantic French chateau & garden rose flourishes:
 * - Rose bud corner flourishes with multi-layered petals
 * - Gold vine floral dividers with animated outward expansion
 * - Double stationery arch borders
 * - Embossed wax seal emblem with tactile depth
 */

export function ChateauRoseCorner({
  position = "top-left",
  className = "",
  animated = false,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  animated?: boolean;
}) {
  const baseRotation = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  }[position];

  return (
    <div
      className={`pointer-events-none select-none transition-all duration-1000 ${
        animated ? "animate-[chateau-corner-bloom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]" : ""
      } ${className}`}
      style={{
        transform: `rotate(${baseRotation}deg)`,
      }}
      aria-hidden="true"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-18 h-18 sm:w-22 sm:h-22 text-[#B58A4A] drop-shadow-xs"
      >
        {/* Outer flourishing vine stem */}
        <path
          d="M8 112 C 8 56, 56 8, 112 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        {/* Inner parallel hairline stem */}
        <path
          d="M20 112 C 20 64, 64 20, 112 20"
          stroke="#C98B97"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />

        {/* Primary corner Rose Bloom */}
        <g transform="translate(36, 36)">
          {/* Outer petals */}
          <path
            d="M0 -14 C 10 -22, 22 -14, 18 -2 C 14 8, 0 10, -6 4 C -12 -2, -10 -10, 0 -14 Z"
            fill="#6B2333"
            fillOpacity="0.3"
            stroke="#B58A4A"
            strokeWidth="0.8"
          />
          {/* Mid petals */}
          <path
            d="M-2 -8 C 6 -14, 14 -8, 12 0 C 8 6, -2 8, -6 2 C -8 -2, -6 -6, -2 -8 Z"
            fill="#C98B97"
            fillOpacity="0.5"
            stroke="#6B2333"
            strokeWidth="0.7"
          />
          {/* Rose center swirl */}
          <path
            d="M0 -4 C 4 -6, 8 -3, 6 2 C 4 5, -1 5, -3 2 C -4 0, -2 -3, 0 -4 Z"
            fill="#6B2333"
            fillOpacity="0.8"
          />
          <circle cx="1" cy="-1" r="1.5" fill="#B58A4A" />
        </g>

        {/* Rose Petals & Delicate Leaves */}
        <path
          d="M68 22 C 76 12, 90 14, 90 24 C 82 26, 72 28, 68 22 Z"
          fill="#C98B97"
          fillOpacity="0.5"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M22 68 C 12 76, 14 90, 24 90 C 26 82, 28 72, 22 68 Z"
          fill="#C98B97"
          fillOpacity="0.5"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M58 58 C 50 66, 48 80, 58 80 C 62 72, 64 62, 58 58 Z"
          fill="#B58A4A"
          fillOpacity="0.35"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M58 58 C 66 50, 80 48, 80 58 C 72 62, 62 64, 58 58 Z"
          fill="#B58A4A"
          fillOpacity="0.35"
          stroke="currentColor"
          strokeWidth="0.8"
        />

        {/* Delicate golden bud accents */}
        <circle cx="94" cy="12" r="3" fill="#B58A4A" fillOpacity="0.85" />
        <circle cx="12" cy="94" r="3" fill="#B58A4A" fillOpacity="0.85" />
        <circle cx="78" cy="40" r="2" fill="#6B2333" fillOpacity="0.6" />
        <circle cx="40" cy="78" r="2" fill="#6B2333" fillOpacity="0.6" />
        <circle cx="74" cy="74" r="2.5" fill="#B58A4A" fillOpacity="0.75" />
      </svg>
    </div>
  );
}

export function ChateauFloralDivider({
  className = "",
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-3 my-6 sm:my-8 select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`w-14 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#B58A4A]/50 to-[#B58A4A] transition-all duration-1000 origin-right ${
          animated ? "scale-x-100" : ""
        }`}
      />
      <div className="flex items-center gap-1.5 text-[#B58A4A] transition-transform duration-700 hover:scale-110">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs">
          <circle cx="12" cy="12" r="3" fill="#6B2333" />
          <path
            d="M12 3 C 14 7.5, 16.5 7.5, 12 12 C 7.5 7.5, 10 7.5, 12 3 Z"
            fill="#C98B97"
            fillOpacity="0.75"
          />
          <path
            d="M12 21 C 14 16.5, 16.5 16.5, 12 12 C 7.5 16.5, 10 16.5, 12 21 Z"
            fill="#C98B97"
            fillOpacity="0.75"
          />
          <path
            d="M3 12 C 7.5 14, 7.5 16.5, 12 12 C 7.5 7.5, 7.5 10, 3 12 Z"
            fill="#B58A4A"
            fillOpacity="0.8"
          />
          <path
            d="M21 12 C 16.5 14, 16.5 16.5, 12 12 C 16.5 7.5, 16.5 10, 21 12 Z"
            fill="#B58A4A"
            fillOpacity="0.8"
          />
        </svg>
      </div>
      <div
        className={`w-14 sm:w-24 h-px bg-gradient-to-l from-transparent via-[#B58A4A]/50 to-[#B58A4A] transition-all duration-1000 origin-left ${
          animated ? "scale-x-100" : ""
        }`}
      />
    </div>
  );
}

export function ChateauArchFrame() {
  return (
    <>
      <div
        className="absolute inset-3 sm:inset-5 rounded-3xl border border-[#B58A4A]/30 pointer-events-none transition-opacity duration-700"
        aria-hidden="true"
      />
      <div
        className="absolute inset-4 sm:inset-6 rounded-3xl border border-[#EAD6D8]/60 pointer-events-none transition-opacity duration-700"
        aria-hidden="true"
      />
    </>
  );
}

export function WaxSealEmblem({
  className = "",
  isPressed = false,
}: {
  className?: string;
  isPressed?: boolean;
}) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${isPressed ? "scale-90" : ""} ${className}`}
      aria-hidden="true"
    >
      {/* Concentric inner seal rings with antique gold reflection */}
      <circle cx="22" cy="22" r="19" stroke="#C8A46B" strokeWidth="1.2" strokeOpacity="0.75" strokeDasharray="3 2" />
      <circle cx="22" cy="22" r="16.5" stroke="#C8A46B" strokeWidth="0.9" strokeOpacity="0.5" />
      
      {/* Center Rose Crest with 3D Embossed Detail */}
      <path
        d="M22 12 C 24.5 15.5, 28 15.5, 27 19 C 24.5 21.5, 19.5 21.5, 17 19 C 16 15.5, 19.5 15.5, 22 12 Z"
        fill="#C8A46B"
        fillOpacity="0.9"
      />
      <circle cx="22" cy="22" r="3.2" fill="#C8A46B" />
      <path
        d="M22 25.2 C 22 28.5, 19.5 31, 18.5 33"
        stroke="#C8A46B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M22 26.2 C 24.5 28.5, 25.5 31, 26.5 32"
        stroke="#C8A46B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      {/* Small side leaf accents */}
      <circle cx="15" cy="22" r="1.3" fill="#C8A46B" />
      <circle cx="29" cy="22" r="1.3" fill="#C8A46B" />
    </svg>
  );
}
