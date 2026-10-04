import React from "react";

/**
 * WALIMATUL — Toile Royale Ornamental SVG Flourishes & Engravings
 *
 * Handcrafted Victorian French Toile de Jouy etchings:
 * - Rococo cartouche scrollwork frame
 * - Copperplate engraved rose florals & botanical vines
 * - Delicate diamond rosette dividers
 * - Corner vine flourishes in burgundy (#581825) & soft blush (#E8C4C8)
 */

export function ToileCartoucheFrame({
  className = "",
  color = "#581825",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 460 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Center Flourish Crest */}
      <path
        d="M230 14 C215 14, 205 24, 212 36 C218 45, 230 46, 230 38 C230 46, 242 45, 248 36 C255 24, 245 14, 230 14 Z"
        fill={color}
        fillOpacity="0.85"
      />
      <circle cx="230" cy="28" r="3.5" fill="#FAF7F2" />
      <path
        d="M210 28 C185 24, 150 36, 130 58 C115 75, 105 100, 95 130"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M250 28 C275 24, 310 36, 330 58 C345 75, 355 100, 365 130"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Acanthus Leaf Scroll Curls - Top Left */}
      <path
        d="M125 54 C132 42, 148 40, 158 50 C165 58, 160 70, 148 68 C138 66, 132 58, 125 54 Z"
        fill={color}
        fillOpacity="0.75"
      />
      <path
        d="M95 125 C82 145, 78 175, 82 205 C86 230, 98 250, 92 280 C86 310, 72 335, 74 365 C76 395, 90 420, 92 450 C94 480, 84 505, 95 530"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Acanthus Leaf Scroll Curls - Top Right */}
      <path
        d="M335 54 C328 42, 312 40, 302 50 C295 58, 300 70, 312 68 C322 66, 328 58, 335 54 Z"
        fill={color}
        fillOpacity="0.75"
      />
      <path
        d="M365 125 C378 145, 382 175, 378 205 C374 230, 362 250, 368 280 C374 310, 388 335, 386 365 C384 395, 370 420, 368 450 C366 480, 376 505, 365 530"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Inner Delicate Hairline Contour */}
      <path
        d="M230 40 C170 40, 110 80, 90 150 C70 220, 95 285, 85 350 C75 415, 90 475, 110 525 C140 575, 185 600, 230 600 C275 600, 320 575, 350 525 C370 475, 385 415, 375 350 C365 285, 390 220, 370 150 C350 80, 290 40, 230 40 Z"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 2"
        strokeOpacity="0.5"
      />

      {/* Bottom Center Scrollwork & Pedestal */}
      <path
        d="M95 530 C110 560, 140 585, 175 598 C200 606, 215 608, 230 608 C245 608, 260 606, 285 598 C320 585, 350 560, 365 530"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M230 608 C222 608, 216 614, 220 622 C224 628, 236 628, 240 622 C244 614, 238 608, 230 608 Z"
        fill={color}
      />

      {/* Rococo Foliage Accents along the frame */}
      <circle cx="75" cy="350" r="3" fill={color} />
      <circle cx="385" cy="350" r="3" fill={color} />
      <path
        d="M72 342 C64 336, 56 340, 60 348 C64 354, 72 350, 72 342 Z"
        fill={color}
        fillOpacity="0.8"
      />
      <path
        d="M388 342 C396 336, 404 340, 400 348 C396 354, 388 350, 388 342 Z"
        fill={color}
        fillOpacity="0.8"
      />
    </svg>
  );
}

export function ToileFloralBorder({
  className = "",
  color = "#581825",
  position = "top",
}: {
  className?: string;
  color?: string;
  position?: "top" | "bottom";
}) {
  const isBottom = position === "bottom";

  return (
    <div
      className={`w-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{ transform: isBottom ? "rotate(180deg)" : "none" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-current"
      >
        {/* Left Rose Bouquet */}
        <g transform="translate(40, 20)">
          {/* Main Rose Engraved Center */}
          <circle cx="28" cy="28" r="22" fill={color} fillOpacity="0.12" />
          <path
            d="M28 8 C16 8, 8 18, 8 28 C8 38, 18 48, 28 48 C38 48, 48 38, 48 28 C48 18, 40 8, 28 8 Z"
            stroke={color}
            strokeWidth="1.2"
          />
          {/* Concentric Petal Etchings */}
          <path
            d="M22 18 C26 14, 34 14, 36 20 C38 24, 34 28, 28 28 C22 28, 18 24, 22 18 Z"
            fill={color}
            fillOpacity="0.65"
          />
          <path
            d="M16 26 C14 34, 20 40, 28 40 C36 40, 42 34, 40 26"
            stroke={color}
            strokeWidth="1.4"
          />
          <path
            d="M20 22 C18 16, 26 12, 34 16 C38 20, 36 28, 30 32"
            stroke={color}
            strokeWidth="1.1"
          />
          {/* Shading Hatching Lines */}
          <line x1="24" y1="34" x2="32" y2="34" stroke={color} strokeWidth="0.8" />
          <line x1="22" y1="37" x2="34" y2="37" stroke={color} strokeWidth="0.8" />
          {/* Leaves */}
          <path
            d="M8 20 C-4 14, -8 4, -4 -4 C6 -4, 14 6, 8 20 Z"
            fill={color}
            fillOpacity="0.45"
            stroke={color}
            strokeWidth="1"
          />
          <line x1="-4" y1="-4" x2="6" y2="12" stroke={color} strokeWidth="0.7" />
          <path
            d="M44 38 C54 44, 66 40, 70 32 C68 22, 56 24, 44 38 Z"
            fill={color}
            fillOpacity="0.45"
            stroke={color}
            strokeWidth="1"
          />
          <line x1="48" y1="34" x2="66" y2="32" stroke={color} strokeWidth="0.7" />
          {/* Rose Buds & tendrils */}
          <circle cx="-12" cy="30" r="4.5" fill={color} fillOpacity="0.7" />
          <path d="M-8 28 C-4 35, 6 36, 12 30" stroke={color} strokeWidth="1" />
        </g>

        {/* Center Garland Vine */}
        <path
          d="M130 50 C180 30, 220 30, 250 45 C280 30, 320 30, 370 50"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Center Floral Rosette */}
        <g transform="translate(235, 30)">
          <circle cx="15" cy="15" r="10" fill={color} fillOpacity="0.18" />
          <circle cx="15" cy="15" r="6" stroke={color} strokeWidth="1.2" />
          <circle cx="15" cy="15" r="2.5" fill={color} />
          {/* 4 Cardinal Petals */}
          <path d="M15 2 C18 6, 18 10, 15 10 C12 10, 12 6, 15 2 Z" fill={color} fillOpacity="0.7" />
          <path d="M15 28 C18 24, 18 20, 15 20 C12 20, 12 24, 15 28 Z" fill={color} fillOpacity="0.7" />
          <path d="M2 15 C6 12, 10 12, 10 15 C10 18, 6 18, 2 15 Z" fill={color} fillOpacity="0.7" />
          <path d="M28 15 C24 12, 20 12, 20 15 C20 18, 24 18, 28 15 Z" fill={color} fillOpacity="0.7" />
        </g>

        {/* Right Rose Bouquet (Mirror) */}
        <g transform="translate(390, 20) scale(-1, 1)">
          <circle cx="28" cy="28" r="22" fill={color} fillOpacity="0.12" />
          <path
            d="M28 8 C16 8, 8 18, 8 28 C8 38, 18 48, 28 48 C38 48, 48 38, 48 28 C48 18, 40 8, 28 8 Z"
            stroke={color}
            strokeWidth="1.2"
          />
          <path
            d="M22 18 C26 14, 34 14, 36 20 C38 24, 34 28, 28 28 C22 28, 18 24, 22 18 Z"
            fill={color}
            fillOpacity="0.65"
          />
          <path
            d="M16 26 C14 34, 20 40, 28 40 C36 40, 42 34, 40 26"
            stroke={color}
            strokeWidth="1.4"
          />
          <path
            d="M20 22 C18 16, 26 12, 34 16 C38 20, 36 28, 30 32"
            stroke={color}
            strokeWidth="1.1"
          />
          <path
            d="M8 20 C-4 14, -8 4, -4 -4 C6 -4, 14 6, 8 20 Z"
            fill={color}
            fillOpacity="0.45"
            stroke={color}
            strokeWidth="1"
          />
          <path
            d="M44 38 C54 44, 66 40, 70 32 C68 22, 56 24, 44 38 Z"
            fill={color}
            fillOpacity="0.45"
            stroke={color}
            strokeWidth="1"
          />
          <circle cx="-12" cy="30" r="4.5" fill={color} fillOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

export function ToileFloralCorner({
  position = "top-left",
  color = "#581825",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
  className?: string;
}) {
  const rotation = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  }[position];

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 sm:w-32 sm:h-32 text-current"
      >
        {/* Curving Vine Stem */}
        <path
          d="M8 132 C8 68, 68 8, 132 8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 132 C18 78, 78 18, 132 18"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="3 2"
          strokeOpacity="0.6"
        />

        {/* Corner Rose Flower */}
        <g transform="translate(36, 36)">
          <circle cx="20" cy="20" r="16" fill={color} fillOpacity="0.15" />
          <path
            d="M20 4 C10 4, 4 11, 4 20 C4 29, 11 36, 20 36 C29 36, 36 29, 36 20 C36 11, 29 4, 20 4 Z"
            stroke={color}
            strokeWidth="1.2"
          />
          <path
            d="M16 14 C19 10, 24 10, 26 15 C27 18, 24 22, 20 22 C16 22, 13 18, 16 14 Z"
            fill={color}
            fillOpacity="0.75"
          />
          <path d="M12 21 C10 26, 14 30, 20 30 C26 30, 30 26, 28 21" stroke={color} strokeWidth="1.2" />
        </g>

        {/* Leaves & Foliage */}
        <path
          d="M18 80 C6 76, 2 64, 8 56 C18 58, 22 70, 18 80 Z"
          fill={color}
          fillOpacity="0.5"
          stroke={color}
          strokeWidth="0.8"
        />
        <path
          d="M80 18 C76 6, 64 2, 56 8 C58 18, 70 22, 80 18 Z"
          fill={color}
          fillOpacity="0.5"
          stroke={color}
          strokeWidth="0.8"
        />
        <circle cx="100" cy="14" r="3" fill={color} fillOpacity="0.8" />
        <circle cx="14" cy="100" r="3" fill={color} fillOpacity="0.8" />
      </svg>
    </div>
  );
}

export function ToileDiamondDivider({
  className = "",
  color = "#581825",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-3 my-4 sm:my-6 select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="w-16 sm:w-28 h-px bg-gradient-to-r from-transparent via-current to-current opacity-60"
        style={{ color }}
      />
      <div className="flex items-center gap-1.5" style={{ color }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="currentColor" fillOpacity="0.85" />
          <circle cx="12" cy="12" r="2" fill="#FAF7F2" />
        </svg>
      </div>
      <div
        className="w-16 sm:w-28 h-px bg-gradient-to-l from-transparent via-current to-current opacity-60"
        style={{ color }}
      />
    </div>
  );
}
