import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * WALIMATUL — Proxy (Session Refresh + Route Protection)
 *
 * Next.js 16 renames middleware.ts → proxy.ts.
 * `middleware.ts` is deprecated and should not be used.
 *
 * RESPONSIBILITIES:
 *  1. Refresh the Supabase auth token on every request (via getClaims).
 *     This ensures Server Components always receive a fresh session cookie.
 *  2. Protect /dashboard/* — redirect unauthenticated users to /login.
 *  3. Protect /admin/* — redirect unauthenticated users to /login.
 *     (Admin role check is done in app/admin/layout.tsx — the proxy only
 *     checks authentication, not authorization, to avoid DB calls in every request.)
 *  4. Redirect authenticated users away from /login and /register.
 *
 * SECURITY NOTE:
 *  - NEVER use getSession() in proxy. It does not revalidate the JWT.
 *  - ALWAYS use getClaims() which validates the JWT signature via WebCrypto.
 *  - The proxy is an OPTIMISTIC check. True data-level security is enforced
 *    by RLS in Supabase and server-side checks in layouts/actions.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, cacheHeaders) {
          // Write cookies to the request (for Server Components downstream).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Write cookies to the response (for the browser).
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Apply cache headers to prevent CDN from caching session responses.
          if (cacheHeaders) {
            Object.entries(cacheHeaders).forEach(([key, value]) =>
              supabaseResponse.headers.set(key, value as string),
            );
          }
        },
      },
    },
  );

  // IMPORTANT: Call getClaims() to refresh the session token.
  // Do NOT use getSession() — it does not validate the JWT.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;

  const pathname = request.nextUrl.pathname;

  // ── Protected routes ────────────────────────────────────────────────────────
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isDashboardRoute || isAdminRoute) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from auth pages ──────────────────────
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
