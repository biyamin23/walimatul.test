import { requireAdmin } from "@/lib/auth/permissions";
import { signOut } from "@/app/actions/auth";
import { BRAND } from "@/lib/constants/brand";
import Link from "next/link";
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

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-cream)" }}>
      {/* Admin top bar */}
      <header
        className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between"
        style={{
          background: "var(--primary)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-display text-lg font-bold text-white hover:text-white/90">
            {BRAND.name}
          </Link>
          <span
            className="text-xs font-ui font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            Admin
          </span>
          <Link
            href="/admin/payments"
            className="text-xs font-ui font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
          >
            Payments
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70 font-ui hidden sm:block">
            {user.email}
          </span>
          <Link
            href="/dashboard"
            className="text-sm text-white/80 hover:text-white font-ui transition-colors"
          >
            Client View →
          </Link>
          <form action={signOut}>
            <button
              id="admin-btn-sign-out"
              type="submit"
              className="text-sm text-white/80 hover:text-white font-ui transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
