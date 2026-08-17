/**
 * WALIMATUL — Blush Garden Template Configuration
 *
 * Design metadata and theme configuration for Blush Garden.
 * Commercial data (pricing, validity, activation status) is stored in the database.
 */

export const BLUSH_GARDEN_CONFIG = {
  key: "blush-garden",
  name: "Blush Garden",
  slug: "blush-garden",
  category: "Floral",
  version: 1,
  description:
    "A romantic floral wedding invitation with ivory, blush, and muted gold tones. Elegant, warm, and timeless.",

  /** Theme palette tokens */
  palette: {
    background: "#FCF8F3", // Warm Ivory
    blush: "#F5DDD6", // Soft Blush
    lightBlush: "#FCF1EE", // Light Blush
    primary: "#174F3A", // Deep Green
    gold: "#B8955A", // Muted Gold
    textWarm: "#746F6B", // Warm Charcoal
    borderWarm: "#E8DDD5", // Warm Border
  },

  /** Typography metadata */
  fonts: {
    script: "Great Vibes",
    serif: "Cormorant Garamond",
    sans: "Inter",
  },
} as const;

export type BlushGardenConfig = typeof BLUSH_GARDEN_CONFIG;
