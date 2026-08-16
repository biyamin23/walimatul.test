import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * WALIMATUL — Supabase Server Client
 *
 * Use in Server Components, Server Actions, and Route Handlers.
 *
 * IMPORTANT: A new client must be created for every request because
 * cookies are request-scoped. Do not cache or reuse server clients
 * across requests.
 *
 * Per Supabase SSR docs: the `setAll` call is wrapped in try/catch
 * because Server Components cannot write cookies — the proxy.ts handles
 * cookie writes on every request.
 *
 * Auth verification: use `supabase.auth.getClaims()` — NOT `getSession()`.
 * getClaims() validates the JWT signature locally (via WebCrypto API)
 * and is the correct method for protecting pages and data.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies.
            // The proxy.ts handles cookie refresh on every request.
          }
        },
      },
    },
  );
}
