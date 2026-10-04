import React from "react";

interface ToileMonogramProps {
  groomName: string;
  brideName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

/**
 * ToileMonogram
 *
 * Interwoven royal couple monogram (inspired by classical French armorial lettermarks).
 * Renders two interlaced serif initials with deep wine ink tones, fine crossbars,
 * and high-contrast Didone serifs.
 */
export function ToileMonogram({
  groomName,
  brideName,
  className = "",
  size = "lg",
  color = "#581825",
}: ToileMonogramProps) {
  // Extract initials: first letter of groom and bride
  const initial1 = (groomName || "W").trim().charAt(0).toUpperCase();
  const initial2 = (brideName || "I").trim().charAt(0).toUpperCase();

  const sizeClasses = {
    sm: "w-20 h-20 text-3xl",
    md: "w-28 h-28 text-5xl",
    lg: "w-36 h-36 sm:w-44 sm:h-44 text-6xl sm:text-7xl",
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}
      aria-label={`Monogram ${initial1} & ${initial2}`}
    >
      {/* Background delicate oval engraving halo */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="46"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          strokeOpacity="0.45"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="47"
          ry="49"
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />
      </svg>

      {/* Interlaced Monogram Letterforms */}
      <div className="relative font-toile-serif font-bold tracking-tighter flex items-center justify-center">
        {/* First Letter (slightly shifted left and angled) */}
        <span
          className="relative z-10 drop-shadow-sm select-none"
          style={{
            color,
            transform: "translateX(8px) scaleY(1.08)",
            textShadow: "0 2px 8px rgba(88, 24, 37, 0.18)",
          }}
        >
          {initial1}
        </span>

        {/* Second Letter (interwoven slightly right) */}
        <span
          className="relative z-20 select-none font-serif italic"
          style={{
            color,
            transform: "translateX(-8px) translateY(2px) scale(0.92)",
            opacity: 0.9,
            textShadow: "1px 1px 2px #FAF7F2, 0 2px 8px rgba(88, 24, 37, 0.15)",
          }}
        >
          {initial2}
        </span>
      </div>
    </div>
  );
}
