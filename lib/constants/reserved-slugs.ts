/**
 * WALIMATUL — Reserved Invitation Slugs
 *
 * Slugs that cannot be claimed by clients to avoid route collisions
 * with application pages, API routes, system assets, and brand terms.
 */

export const RESERVED_SLUGS = new Set([
  // Core application routes
  "admin",
  "api",
  "auth",
  "billing",
  "dashboard",
  "forgot-password",
  "login",
  "logout",
  "pricing",
  "profile",
  "register",
  "reset-password",
  "rsvp",
  "settings",
  "signin",
  "signup",
  "support",
  "templates",

  // Static assets & system files
  "favicon",
  "favicon.ico",
  "robots",
  "robots.txt",
  "sitemap",
  "sitemap.xml",
  "manifest",
  "manifest.json",
  "_next",
  "public",
  "assets",
  "images",

  // Brand & platform terms
  "walimatul",
  "nasuhalias",
  "walimatulmy",
  "official",
  "help",
  "contact",
  "terms",
  "privacy",
  "faq",
  "null",
  "undefined",
]);

/**
 * Check whether a candidate slug is reserved.
 */
export function isReservedSlug(slug: string): boolean {
  const normalized = slug.trim().toLowerCase();
  return RESERVED_SLUGS.has(normalized);
}
