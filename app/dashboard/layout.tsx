import { requireClient } from "@/lib/auth/permissions";
import DashboardShell from "@/components/dashboard/DashboardShell";

/**
 * WALIMATUL — Dashboard Layout
 *
 * Server Component. Performs a real auth check (getClaims + DB).
 * Redirects unauthenticated users to /login.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Throws redirect() if unauthenticated — Next.js handles it.
  const user = await requireClient("/dashboard");

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
