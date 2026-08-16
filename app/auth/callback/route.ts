import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";
import { getProfile } from "@/lib/auth/get-profile";

/**
 * WALIMATUL — Auth Callback Route
 *
 * Handles:
 * 1. Email confirmation links (email verification)
 * 2. Google OAuth callback (PKCE code exchange)
 * 3. Password recovery callback
 *
 * Flow:
 *   Exchange `code` → Supabase session
 *   → Profile exists? (trigger should have created it)
 *   → Redirect to intended destination or role-based default
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const userId = data.session.user.id;

      // Ensure profile exists (in case trigger fired late or failed)
      const profile = await getProfile(userId);

      if (!profile) {
        // Trigger may not have fired — create profile manually as fallback
        const user = data.session.user;
        await supabase.from("profiles").insert({
          id: userId,
          full_name:
            user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
          avatar_url:
            user.user_metadata?.avatar_url ??
            user.user_metadata?.picture ??
            null,
          role: "client",
        });
      }

      // Determine redirect destination
      const safeNext = getSafeRedirectUrl(next);
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${safeNext}`);
      } else {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    }
  }

  // Error — redirect to login with generic error indicator
  return NextResponse.redirect(`${new URL(request.url).origin}/login?error=auth`);
}
