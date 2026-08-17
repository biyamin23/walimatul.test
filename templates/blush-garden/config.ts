/**
 * WALIMATUL — Blush Garden Static Config
 *
 * Static metadata for the Blush Garden template.
 * Use for display purposes when DB is not available (e.g. error states, build-time).
 * The DB templates table is the authoritative source for pricing and status.
 */

export const BLUSH_GARDEN_CONFIG = {
  componentKey: "blush-garden",
  name: "Blush Garden",
  slug: "blush-garden",
  category: "Floral",
  description:
    "A romantic floral wedding invitation with ivory, blush, and muted gold tones. Elegant, warm, and timeless.",
  /** Brand palette tokens */
  palette: {
    background: "#FCF8F3", // Warm Ivory
    blush: "#F5DDD6", // Blush
    primary: "#174F3A", // Deep Green
    gold: "#B8955A", // Muted Gold
  },
  /** Price in MYR — DB is authoritative; this is a build-time fallback */
  priceDisplay: "RM49",
  /** Validity in months — DB is authoritative */
  validityMonths: 6,
} as const;
