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
 * Provides the two-column layout: fixed sidebar + scrollable content area.
 * Receives the authenticated user from the layout (server-fetched).
 */
export default function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-cream)" }}
    >
      {/* Sidebar — fixed width */}
      <div className="hidden md:flex md:w-64 lg:w-72 xl:w-72 shrink-0 flex-col h-screen sticky top-0">
        <DashboardSidebar profile={user.profile} email={user.email} />
      </div>

      {/* Main content area */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--bg-cream)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
