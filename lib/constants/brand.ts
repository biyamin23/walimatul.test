/**
 * WALIMATUL Brand Constants
 *
 * Centralized source of truth for all brand-related values.
 * Do not hardcode these strings inside components.
 */

export const BRAND = {
  name: "WALIMATUL",
  signature: "by nasuhalias",
  tagline: "Beautiful digital wedding invitations, shared with one link.",
  domain: "walimatul.my",
  url: "https://walimatul.my",
  supportPhone: "+60148412018",
  supportWhatsapp: "60148412018",
  supportWhatsappUrl: "https://wa.me/60148412018",
  email: "support@walimatul.my",
} as const;

export const SITE_NAV = {
  templates: "/templates",
  features: "/#features",
  pricing: "/pricing",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  admin: "/admin",
} as const;

export const RESERVED_SLUGS = [
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
  "settings",
  "signin",
  "signup",
  "support",
  "templates",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];
