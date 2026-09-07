import { DashboardMobileHeader } from "./DashboardMobileHeader";
import DashboardSidebar from "./DashboardSidebar";
import type { UserProfile } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    userId: string;
    email: string;
    profile: UserProfile | null;
  };
}

/**
 * WALIMATUL — Dashboard Shell
 *
 * Shared client layout shell:
 * - On mobile/tablet (< lg: 360, 390, 430, 768, 820):
 *     Renders DashboardMobileHeader (persistent top bar with brand + hamburger trigger)
 *     and controlled slide-out navigation drawer.
 * - On desktop (>= lg: 1024, 1440):
 *     Renders fixed DashboardSidebar on the left.
 * - Main content area scrolls cleanly on all routes.
 */
export default function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-hidden"
      style={{ background: "var(--bg-cream)" }}
    >
      {/* ── Mobile/Tablet Top Bar (< lg) with Slide-out Drawer ── */}
      <DashboardMobileHeader profile={user.profile} email={user.email} />

      {/* ── Desktop Sidebar (>= lg) ── */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col h-screen sticky top-0">
        <DashboardSidebar profile={user.profile} email={user.email} />
      </div>

      {/* ── Main content area ── */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto min-w-0"
        style={{ background: "var(--bg-cream)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
