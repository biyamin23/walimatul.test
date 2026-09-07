import React from "react";

interface ChateauCardProps {
  children: React.ReactNode;
  className?: string;
  hasGlow?: boolean;
}

/**
 * ChateauCard
 *
 * Premium stationery card component for Rose Chateau.
 * Emulates high-end thick wedding cardstock with subtle rose-tinted border,
 * hairline gold accenting, and soft ambient stationery drop shadow.
 */
export function ChateauCard({
  children,
  className = "",
  hasGlow = false,
}: ChateauCardProps) {
  return (
    <div
      className={`relative w-full rounded-3xl bg-[#FFFFFF] border border-[#EAD6D8] p-6 sm:p-8 text-center shadow-md shadow-[#6B2333]/5 overflow-hidden transition-all ${className}`}
      style={{
        boxShadow: hasGlow
          ? "0 10px 25px -5px rgba(107, 35, 51, 0.08), 0 8px 10px -6px rgba(181, 138, 74, 0.06)"
          : undefined,
      }}
    >
      {/* Delicate inner hairline frame */}
      <div
        className="absolute inset-2 sm:inset-3 rounded-[20px] border border-[#B58A4A]/20 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface ChateauSectionProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

export function ChateauSection({
  children,
  className = "",
  ariaLabel,
}: ChateauSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={`px-4 sm:px-6 py-6 sm:py-8 max-w-lg mx-auto w-full flex flex-col items-center justify-center ${className}`}
    >
      {children}
    </section>
  );
}

export function ChateauSectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-6 space-y-1">
      {eyebrow && (
        <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block">
          {eyebrow}
        </span>
      )}
      <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-chateau-body text-xs sm:text-sm text-[#766467] max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
