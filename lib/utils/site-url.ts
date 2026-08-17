/**
 * WALIMATUL — Site URL Helper
 *
 * Resolves the canonical base URL dynamically based on environment variables.
 */
export function getSiteUrl(): string {
  // 1. Explicit production / environment configured URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  // 2. Vercel deployment preview URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  // 3. Default fallback
  return "https://walimatul.my";
}
