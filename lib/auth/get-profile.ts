import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

/**
 * WALIMATUL — Get Profile by User ID (Server-Only)
 *
 * Fetches a profile row for a given auth user UUID.
 * Returns null if not found.
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url, role, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return data as UserProfile;
}
