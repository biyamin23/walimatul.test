"use client";

import React, { useState } from "react";
import { BRAND } from "@/lib/constants/brand";
import { AdminSidebar } from "./AdminSidebar";

interface AdminMobileHeaderProps {
  email: string;
}

/**
 * AdminMobileHeader
 *
 * Slim sticky top bar shown only on mobile (md: hidden).
 * Contains hamburger button that opens the AdminSidebar drawer.
 */
export function AdminMobileHeader({ email }: AdminMobileHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "#1a3d2b",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Hamburger */}
        <button
          id="admin-mobile-menu-toggle"
          onClick={() => setDrawerOpen(true)}
          className="text-white/70 hover:text-white transition-colors p-1 -ml-1"
          aria-label="Open admin menu"
          aria-expanded={drawerOpen}
          aria-controls="admin-mobile-menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M3 6h16M3 11h16M3 16h16"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Brand */}
        <span
          className="font-display text-sm font-bold text-white"
          style={{ letterSpacing: "0.06em" }}
        >
          {BRAND.name}
        </span>

        {/* Spacer to balance hamburger */}
        <span className="w-8" aria-hidden="true" />
      </header>

      {/* Mobile drawer — rendered via AdminSidebar */}
      <AdminSidebar
        email={email}
        mobileOpen={drawerOpen}
        onMobileClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
