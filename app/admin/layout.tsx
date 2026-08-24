import { requireAdmin } from "@/lib/auth/permissions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — WALIMATUL",
  description: "WALIMATUL admin panel.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const email = user.email ?? "";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-cream, #fcf8f3)" }}>
      {/* ── Desktop Sidebar (md+) ───────────────────────────────────────── */}
      <AdminSidebar email={email} />

      {/* ── Content Area ────────────────────────────────────────────────── */}
      <div className="md:ml-56 flex flex-col min-h-screen">
        {/* Mobile top-bar + drawer (< md) */}
        <AdminMobileHeader email={email} />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
