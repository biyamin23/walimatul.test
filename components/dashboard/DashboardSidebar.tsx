"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants/brand";
import { signOut } from "@/app/actions/auth";
import type { UserProfile } from "@/types";

interface DashboardSidebarProps {
  profile: UserProfile | null;
  email: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  disabled?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/dashboard/invitations",
    label: "My Invitations",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 5H3a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2z" />
        <polyline points="3 7 12 13 21 7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/rsvp",
    label: "RSVP Tracker",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

export function DashboardSidebarContent({
  profile,
  email,
  pathname,
  onItemClick,
  hideLogo = false,
}: {
  profile: UserProfile | null;
  email: string;
  pathname: string;
  onItemClick?: () => void;
  hideLogo?: boolean;
}) {
  const displayName = profile?.full_name || email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function isNavItemActive(href: string, exact?: boolean) {
    if (href === "/dashboard/rsvp") {
      return (
        pathname === "/dashboard/rsvp" ||
        pathname.startsWith("/dashboard/rsvp/") ||
        (pathname.startsWith("/dashboard/invitations/") && pathname.endsWith("/rsvp"))
      );
    }

    if (href === "/dashboard/invitations") {
      const isRsvpSubroute =
        pathname.startsWith("/dashboard/invitations/") && pathname.endsWith("/rsvp");
      return pathname.startsWith("/dashboard/invitations") && !isRsvpSubroute;
    }

    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo (shown on desktop or when not explicitly hidden) */}
      {!hideLogo && (
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <Link
            href="/"
            className="inline-flex flex-col leading-none rounded focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
            aria-label={`${BRAND.name} — Go to homepage`}
            onClick={onItemClick}
          >
            <span className="font-display text-xl font-bold text-[var(--primary)]">
              {BRAND.name}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[var(--gold)] font-ui">
              {BRAND.signature}
            </span>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = isNavItemActive(item.href, item.exact);

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] opacity-40 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <span className="text-[var(--text-subtle)]">{item.icon}</span>
                <span className="text-sm font-ui text-[var(--text-muted)] flex-1">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-ui font-medium px-1.5 py-0.5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)]">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-colors text-sm font-ui focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 ${
                active
                  ? "bg-[var(--primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-warm)] hover:text-[var(--text)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Sign Out */}
      <div
        className="px-3 py-4 space-y-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Link
          href="/dashboard/profile"
          id="nav-profile"
          onClick={onItemClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-colors text-sm font-ui focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 ${
            pathname === "/dashboard/profile"
              ? "bg-[var(--primary)] text-white font-semibold"
              : "text-[var(--text-muted)] hover:bg-[var(--surface-warm)] hover:text-[var(--text)]"
          }`}
          aria-current={pathname === "/dashboard/profile" ? "page" : undefined}
        >
          {/* Avatar */}
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{
              background: "var(--primary-soft)",
              color: "var(--primary)",
            }}
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-semibold font-ui truncate ${pathname === "/dashboard/profile" ? "text-white" : "text-[var(--text)]"}`}
            >
              {displayName}
            </p>
            <p
              className={`text-[10px] font-ui truncate ${pathname === "/dashboard/profile" ? "text-white/70" : "text-[var(--text-subtle)]"}`}
            >
              {email}
            </p>
          </div>
        </Link>

        <form action={signOut}>
          <button
            id="btn-sign-out"
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-ui text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  profile,
  email,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar (>= lg) ── */}
      <aside
        className="hidden lg:flex flex-col h-full w-full"
        style={{
          borderRight: "1px solid var(--border)",
          background: "var(--surface)",
        }}
        aria-label="Dashboard desktop navigation"
      >
        <DashboardSidebarContent
          profile={profile}
          email={email}
          pathname={pathname}
        />
      </aside>

      {/* ── Mobile Drawer Backdrop (< lg) ── */}
      {mobileOpen && (
        <div
          id="client-mobile-drawer-backdrop"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Panel (< lg) ── */}
      <aside
        id="client-mobile-menu"
        className={`lg:hidden fixed left-0 top-0 h-full w-72 max-w-[85vw] z-50 flex flex-col bg-[var(--surface)] shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        style={{
          borderRight: "1px solid var(--border)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi klien"
        aria-hidden={!mobileOpen}
      >
        {/* Mobile Drawer Top Bar with Close Button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-[var(--primary)]">
              {BRAND.name}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[var(--gold)] font-ui">
              {BRAND.signature}
            </span>
          </div>
          <button
            id="client-mobile-menu-close"
            type="button"
            onClick={onMobileClose}
            className="w-8 h-8 rounded-full bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            aria-label="Tutup menu navigasi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <DashboardSidebarContent
            profile={profile}
            email={email}
            pathname={pathname}
            onItemClick={onMobileClose}
            hideLogo={true}
          />
        </div>
      </aside>
    </>
  );
}
