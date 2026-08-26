import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { NavbarClient, type NavbarAuthState } from "./NavbarClient";

/**
 * WALIMATUL Navbar (Server Component)
 *
 * Checks server auth session and profiles table to pass current user state to NavbarClient.
 */
export async function Navbar() {
  const user = await getAuthenticatedUser();

  let authState: NavbarAuthState | null = null;

  if (user) {
    const role = user.profile?.role === "admin" ? "admin" : "client";
    const trimmedName = user.profile?.full_name?.trim();

    if (role === "admin") {
      authState = {
        role: "admin",
        greeting: trimmedName ? `Hai, ${trimmedName}` : "Hai, Admin",
        dashboardHref: "/admin",
        dashboardLabel: "Admin Dashboard",
      };
    } else {
      authState = {
        role: "client",
        greeting: trimmedName ? `Hai, ${trimmedName}` : "Hai 👋",
        dashboardHref: "/dashboard",
        dashboardLabel: "Ke Dashboard",
      };
    }
  }

  return <NavbarClient authState={authState} />;
}
