"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { BRAND } from "@/lib/constants/brand";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminSidebarProps {
  /** Authenticated admin email — passed from Server Component layout */
  email: string;
  /** Whether the mobile drawer is open — controlled externally on mobile */
  mobileOpen?: boolean;
  /** Close callback for mobile drawer */
  onMobileClose?: () => void;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: "Pengguna",
    href: "/admin/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.25" />
        <path d="M2.5 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Jemputan",
    href: "/admin/invitations",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.25" />
        <path d="M2 6.5l6 4 6-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Templates",
    href: "/admin/templates",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-9Z" stroke="currentColor" strokeWidth="1.25" fill="none" />
        <path d="M5 6h6M5 8.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.25" />
        <path d="M4.5 10.5h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Pengumuman",
    href: "/admin/announcements",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 5.5v5M14 6.5v3M10 3.5L5 6.5H2.5A1 1 0 0 0 1.5 7.5v1a1 1 0 0 0 1 1H5l5 3V3.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Log Audit",
    href: "/admin/audit-logs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M9 1.5H3.5A1 1 0 0 0 2.5 2.5v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V6L9 1.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 1.5V6h4.5M5 8.5h6M5 11.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Tetapan",
    href: "/admin/settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

const SECONDARY_ITEMS = [
  { label: "Client View", href: "/dashboard", external: false },
  {
    label: "Supabase ↗",
    href: "https://supabase.com/dashboard/project/xjaclwiilmmzjiftnnob",
    external: true,
  },
] as const;

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({
  email,
  pathname,
  onClose,
}: {
  email: string;
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <nav className="flex flex-col h-full" aria-label="Admin navigation">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <Link
          href="/admin"
          className="block group"
          onClick={onClose}
          aria-label="WALIMATUL Admin — go to dashboard"
        >
          <span
            className="font-display text-base font-bold text-white block leading-tight"
            style={{ letterSpacing: "0.04em" }}
          >
            {BRAND.name}
          </span>
          <span className="text-[10px] font-ui text-white/50 uppercase tracking-widest">
            {BRAND.signature}
          </span>
        </Link>
        <span
          className="mt-3 inline-flex items-center gap-1 text-[10px] font-ui font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
        >
          Admin Panel
        </span>
      </div>

      {/* Primary Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-2 mb-2 text-[9px] font-ui font-semibold uppercase tracking-widest text-white/30">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`admin-nav-${item.label.toLowerCase()}`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-ui font-medium transition-colors duration-150"
              style={{
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                background: isActive
                  ? "rgba(255,255,255,0.13)"
                  : "transparent",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-2 mb-2 text-[9px] font-ui font-semibold uppercase tracking-widest text-white/30">
            Quick Links
          </p>
          {SECONDARY_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-ui font-medium transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom — user + sign out */}
      <div
        className="px-5 py-4 border-t border-white/10 space-y-2"
      >
        <p
          className="text-[11px] font-ui truncate"
          style={{ color: "rgba(255,255,255,0.45)" }}
          title={email}
        >
          {email}
        </p>
        <form action={signOut}>
          <button
            id="admin-btn-sign-out"
            type="submit"
            className="text-xs font-ui font-medium transition-colors duration-150 hover:text-white"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * AdminSidebar
 *
 * Desktop: fixed 224px left sidebar (hidden on < md).
 * Mobile: slide-in drawer controlled by mobileOpen prop.
 *
 * Must be 'use client' because it uses usePathname() for active-link detection.
 */
export function AdminSidebar({
  email,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Sidebar background — dark forest green
  const sidebarBg = "#1a3d2b";

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 z-40"
        style={{ background: sidebarBg }}
        aria-label="Admin sidebar"
      >
        <SidebarContent email={email} pathname={pathname} />
      </aside>

      {/* ── Mobile Drawer ───────────────────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      {/* Drawer panel */}
      <aside
        className="md:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300"
        style={{
          background: sidebarBg,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-label="Admin mobile menu"
        aria-hidden={!mobileOpen}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4">
          <button
            id="admin-mobile-close"
            onClick={onMobileClose}
            className="text-white/50 hover:text-white transition-colors p-1"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5l-10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <SidebarContent email={email} pathname={pathname} onClose={onMobileClose} />
      </aside>
    </>
  );
}
