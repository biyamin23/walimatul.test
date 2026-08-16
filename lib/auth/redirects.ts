/**
 * WALIMATUL — Safe Redirect Utility
 *
 * Validates that a `next` redirect URL is safe to use —
 * internal-only, no external URLs, no protocol-relative paths.
 *
 * PREVENTS open redirect vulnerabilities.
 */

/**
 * Returns a safe internal redirect URL.
 * Falls back to `fallback` if `next` is unsafe or missing.
 *
 * Rules:
 * - Must start with `/`
 * - Must NOT start with `//` (protocol-relative)
 * - Must NOT contain `://` (absolute URL)
 * - Must be a recognised internal prefix or start with /
 *   (a broader internal check — any path starting with / that
 *    isn't an absolute URL is considered safe for internal use)
 */
export function getSafeRedirectUrl(
  next: string | null | undefined,
  fallback: string = "/dashboard",
): string {
  if (!next) return fallback;

  const trimmed = next.trim();

  // Reject empty
  if (!trimmed) return fallback;

  // Reject absolute URLs (http://, https://, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(trimmed)) return fallback;

  // Reject protocol-relative URLs (//evil.com)
  if (trimmed.startsWith("//")) return fallback;

  // Reject anything not starting with /
  if (!trimmed.startsWith("/")) return fallback;

  // Reject paths containing @, which can be used in some URL attacks
  if (trimmed.includes("@")) return fallback;

  // The URL is considered safe for internal redirect
  return trimmed;
}

/**
 * Returns the default post-login destination based on role.
 */
export function getDefaultRedirect(role: string): string {
  return role === "admin" ? "/admin" : "/dashboard";
}
