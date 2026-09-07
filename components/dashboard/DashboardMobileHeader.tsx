"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants/brand";
import DashboardSidebar from "./DashboardSidebar";
import type { UserProfile } from "@/types";

interface DashboardMobileHeaderProps {
  profile: UserProfile | null;
  email: string;
}

/**
 * DashboardMobileHeader
 *
 * Slim, persistent sticky top bar rendered on mobile and tablet viewports (< lg: 360, 390, 430, 768, 820).
 * Hidden on desktop (>= lg).
 *
 * Provides:
 * - Brand identity with link to /dashboard
 * - Dedicated accessible hamburger menu button (id="client-mobile-menu-toggle", data-testid="client-mobile-menu-button")
 * - Slide-out drawer with full client navigation (Dashboard, My Invitations, RSVP Tracker, Billing, Sign Out)
 */
export function DashboardMobileHeader({ profile, email }: DashboardMobileHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close drawer when route changes (React recommended pattern)
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  return (
    <>
      <header
        className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)] shadow-xs shrink-0"
        role="banner"
      >
        {/* Mobile Menu Trigger Button (☰) — Left-aligned */}
        <button
          id="client-mobile-menu-toggle"
          data-testid="client-mobile-menu-button"
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] shrink-0 cursor-pointer"
          aria-label="Buka menu navigasi"
          aria-expanded={drawerOpen}
          aria-controls="client-mobile-menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        {/* Brand identity — immediately beside hamburger */}
        <Link
          href="/dashboard"
          className="inline-flex flex-col leading-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded py-1"
          aria-label={`${BRAND.name} — Ke Dashboard`}
        >
          <span className="font-display text-lg font-bold text-[var(--primary)] tracking-wide leading-tight">
            {BRAND.name}
          </span>
          <span className="text-[9px] tracking-widest uppercase text-[var(--gold)] font-ui leading-tight">
            {BRAND.signature}
          </span>
        </Link>
      </header>

      {/* Controlled Mobile Drawer */}
      <DashboardSidebar
        profile={profile}
        email={email}
        mobileOpen={drawerOpen}
        onMobileClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
