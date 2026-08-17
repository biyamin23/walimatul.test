import { Great_Vibes, Cormorant_Garamond, Inter } from "next/font/google";

/**
 * WALIMATUL — Blush Garden Scoped Fonts
 *
 * Great Vibes: Couple names script (warm, fluid, romantic)
 * Cormorant Garamond: Ceremonial headings & dates (editorial elegance)
 * Inter: Body text & functional details (clean readability)
 */

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter-bg",
  display: "swap",
});
