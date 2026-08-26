"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, SITE_NAV } from "@/lib/constants/brand";
import { Container } from "@/components/ui/Container";

export interface NavbarAuthState {
  role: "admin" | "client";
  greeting: string;
  dashboardHref: string;
  dashboardLabel: string;
}

export interface NavbarClientProps {
  authState?: NavbarAuthState | null;
}

/**
 * WALIMATUL Navbar (Client Component)
 *
 * Sticky, responsive navigation with mobile menu and auth-aware actions.
 */
export function NavbarClient({ authState }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Templates", href: SITE_NAV.templates },
    { label: "Features", href: SITE_NAV.features },
    { label: "Pricing", href: SITE_NAV.pricing },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--background-soft)]/95 backdrop-blur-sm border-b border-[var(--border-soft)]"
      style={{ WebkitBackdropFilter: "blur(8px)" }}
      role="banner"
    >
      <Container>
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* ── Logo / Brand ── */}
          <Link
            href="/"
            className="flex flex-col leading-none rounded focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
            aria-label={`${BRAND.name} — Go to homepage`}
          >
            <span className="font-display text-xl font-bold tracking-wide text-[var(--primary)]">
              {BRAND.name}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[var(--gold)] font-ui -mt-0.5">
              {BRAND.signature}
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-1 list-none" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-[var(--radius)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            {authState ? (
              <>
                <span className="text-sm font-medium text-[var(--text-muted)] font-ui px-1">
                  {authState.greeting}
                </span>
                <Link
                  href={authState.dashboardHref}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-lg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 shadow-xs"
                >
                  {authState.dashboardLabel}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={SITE_NAV.login}
                  className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded px-2 py-1"
                >
                  Log Masuk
                </Link>
                <Link
                  href={SITE_NAV.templates}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-lg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 shadow-xs"
                  aria-label="Browse templates and create your invitation"
                >
                  Create Invitation
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            className="md:hidden p-2 rounded-[var(--radius)] text-[var(--text-muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            <span aria-hidden="true">
              {isMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </span>
          </button>
        </nav>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-[var(--border-soft)] py-4"
          >
            <ul className="flex flex-col gap-1 list-none mb-4" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-[var(--radius)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 px-4">
              {authState ? (
                <>
                  <div className="text-center text-xs font-medium text-[var(--text-muted)] font-ui py-1">
                    {authState.greeting}
                  </div>
                  <Link
                    href={authState.dashboardHref}
                    className="w-full text-center py-3 px-6 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-lg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 shadow-xs"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {authState.dashboardLabel}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={SITE_NAV.login}
                    className="w-full text-center py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log Masuk
                  </Link>
                  <Link
                    href={SITE_NAV.templates}
                    className="w-full text-center py-3.5 px-6 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-lg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 shadow-xs"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Invitation
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
