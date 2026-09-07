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
      className={`relative w-full rounded-3xl bg-[#FFFFFF] border border-[#EAD6D8] p-6 sm:p-8 text-center overflow-hidden transition-all duration-500 ${className}`}
      style={{
        boxShadow: hasGlow
          ? "0 14px 34px -4px rgba(107, 35, 51, 0.09), 0 6px 16px -2px rgba(181, 138, 74, 0.07)"
          : "0 8px 24px -4px rgba(107, 35, 51, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.03)",
      }}
    >
      {/* Delicate inner hairline frame */}
      <div
        className="absolute inset-2 sm:inset-3 rounded-[20px] border border-[#B58A4A]/25 pointer-events-none"
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

import { ChateauReveal } from "./ChateauReveal";

export function ChateauSectionHeader({
  eyebrow,
  title,
  subtitle,
  disabled = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
}) {
  return (
    <div className="text-center mb-6 space-y-1">
      {eyebrow && (
        <ChateauReveal variant="fade" duration={600} disabled={disabled}>
          <span className="font-chateau-heading text-xs font-semibold tracking-[0.25em] uppercase text-[#B58A4A] block">
            {eyebrow}
          </span>
        </ChateauReveal>
      )}
      <ChateauReveal variant="fade-up" delay={80} duration={650} disabled={disabled}>
        <h2 className="font-chateau-heading text-2xl sm:text-3xl font-semibold text-[#6B2333]">
          {title}
        </h2>
      </ChateauReveal>
      {subtitle && (
        <ChateauReveal variant="fade-up" delay={160} duration={650} disabled={disabled}>
          <p className="font-chateau-body text-xs sm:text-sm text-[#766467] max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </ChateauReveal>
      )}
    </div>
  );
}

