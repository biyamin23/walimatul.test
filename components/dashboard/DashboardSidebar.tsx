"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants/brand";
import { signOut } from "@/app/actions/auth";
import type { UserProfile } from "@/types";

interface DashboardSidebarProps {
  profile: UserProfile | null;
  email: string;
}

const navItems = [
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
    href: "/dashboard/invitations",
    label: "RSVP Tracker",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
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
    disabled: true,
    badge: "Soon",
  },
];

export default function DashboardSidebar({ profile, email }: DashboardSidebarProps) {
  const pathname = usePathname();

  const displayName = profile?.full_name || email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        borderRight: "1px solid var(--border)",
        background: "var(--surface)",
      }}
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link
          href="/"
          className="inline-flex flex-col leading-none rounded focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
          aria-label={`${BRAND.name} — Go to homepage`}
        >
          <span className="font-display text-xl font-bold text-[var(--primary)]">
            {BRAND.name}
          </span>
          <span className="text-[9px] tracking-widest uppercase text-[var(--gold)] font-ui">
            {BRAND.signature}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);

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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-ui text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
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
    </aside>
  );
}
