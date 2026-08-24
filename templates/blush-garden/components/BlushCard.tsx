import React from "react";

export interface BlushCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "major" | "nested" | "plain";
  children: React.ReactNode;
  className?: string;
  hasGlow?: boolean;
}

/**
 * WALIMATUL — Blush Garden Shared Card Primitive
 *
 * Single authoritative source of truth for major card proportions, radii,
 * border treatments, surfaces, shadows, and responsive padding.
 */
export function BlushCard({
  variant = "major",
  children,
  className = "",
  hasGlow = false,
  ...rest
}: BlushCardProps) {
  if (variant === "major") {
    return (
      <div
        className={`relative w-full max-w-lg mx-auto rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-b from-[#FCF1EE]/70 via-[#FCF8F3] to-[#FCF1EE]/70 border border-[#B8955A]/30 shadow-[0_4px_24px_-4px_rgba(23,79,58,0.05)] overflow-hidden transition-all text-center ${className}`}
        {...rest}
      >
        {hasGlow && (
          <>
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#F5DDD6]/40 blur-xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-[#F5DDD6]/40 blur-xl pointer-events-none"
              aria-hidden="true"
            />
          </>
        )}
        {children}
      </div>
    );
  }

  if (variant === "nested") {
    return (
      <div
        className={`rounded-2xl p-4 sm:p-5 bg-[#FCF8F3] border border-[#E8DDD5] shadow-xs text-left transition-all ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }

  // Plain / unbordered container
  return (
    <div className={`w-full max-w-lg mx-auto ${className}`} {...rest}>
      {children}
    </div>
  );
}

/**
 * Standard Blush Garden Section Shell
 * Ensures uniform horizontal breathing room and vertical rhythm across all sections.
 */
export function BlushSection({
  children,
  className = "",
  ariaLabel,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      aria-label={ariaLabel}
      className={`relative w-full max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

/**
 * Standard Blush Garden Section Header
 * Eyebrow + Section Title with consistent typography and spacing tokens.
 */
export function BlushSectionHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-6 sm:mb-8 text-center ${className}`}>
      {eyebrow && (
        <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-2 sm:mb-2.5">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#174F3A] tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="font-inter text-xs sm:text-sm text-[#746F6B] leading-relaxed max-w-sm mx-auto mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
