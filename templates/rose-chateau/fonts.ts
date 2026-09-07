import { Great_Vibes, Cormorant_Garamond, Inter } from "next/font/google";

/**
 * WALIMATUL — Rose Chateau Scoped Fonts
 *
 * Great Vibes: Couple names script (romantic, fluid calligraphy)
 * Cormorant Garamond: Ceremonial headings, dates & vows (classic French editorial elegance)
 * Inter: Functional text, address, time & RSVP details (clean, crisp legibility)
 */

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chateau-script",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-chateau-heading",
  display: "swap",
});

export const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-chateau-body",
  display: "swap",
});
