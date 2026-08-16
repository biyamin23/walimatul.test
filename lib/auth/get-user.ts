import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

/**
 * WALIMATUL — Get Authenticated User + Profile (Server-Only)
 *
 * Fetches the currently authenticated Supabase user AND their profile row.
 * Uses getClaims() which validates the JWT signature — safe for page/data protection.
 *
 * Returns null if no valid session exists.
 */
export async function getAuthenticatedUser(): Promise<{
  userId: string;
  email: string;
  profile: UserProfile | null;
} | null> {
  const supabase = await createClient();

  // Use getClaims() — validates JWT signature via WebCrypto. NEVER use getSession().
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const email = (claimsData.claims.email as string) ?? "";

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url, role, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (profileError) {
    // Profile may not exist yet (race condition on first login)
    return { userId, email, profile: null };
  }

  return {
    userId,
    email,
    profile: profile as UserProfile,
  };
}
