import "server-only";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/get-user";

/**
 * WALIMATUL — Route Permission Guards (Server-Only)
 *
 * Call these at the top of Server Component layouts/pages
 * to enforce access control beyond the proxy optimistic check.
 *
 * These perform a real auth + DB check — more secure than proxy alone.
 */

/**
 * requireAuth()
 * Ensures the caller has a valid Supabase session.
 * Redirects to /login if unauthenticated.
 * Returns the authenticated user + profile.
 */
export async function requireAuth(nextPath?: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    const loginUrl = nextPath
      ? `/login?next=${encodeURIComponent(nextPath)}`
      : "/login";
    redirect(loginUrl);
  }

  return user;
}

/**
 * requireClient()
 * Ensures the caller is an authenticated client (any role).
 * Redirects to /login if unauthenticated.
 */
export async function requireClient(nextPath?: string) {
  return requireAuth(nextPath);
}

/**
 * requireAdmin()
 * Ensures the caller is an authenticated admin.
 * Redirects to /login if unauthenticated.
 * Redirects to /dashboard if authenticated but not admin.
 */
export async function requireAdmin() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.profile || user.profile.role !== "admin") {
    // Authenticated but not admin — send to their dashboard
    redirect("/dashboard");
  }

  return user;
}
