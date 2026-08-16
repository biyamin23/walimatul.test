import { createBrowserClient } from "@supabase/ssr";

/**
 * WALIMATUL — Supabase Browser Client
 *
 * Use in Client Components (browser-only code).
 * `createBrowserClient` uses a singleton internally, so this
 * function is safe to call multiple times.
 *
 * Uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (not the legacy ANON_KEY name).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
