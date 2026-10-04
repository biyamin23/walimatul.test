import { Cinzel, Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";

/**
 * WALIMATUL — Toile Royale Scoped Typography
 *
 * Cinzel: Majestically tracked Roman/French engraved serif headings & cartouche titles
 * Cormorant Garamond: Classical French serif for ceremonial texts, subtitles, dates & quotes
 * Great Vibes: Fluid calligraphy script for royal couple names
 * Inter: Clean, ultra-readable modern sans for times, buttons, numbers & RSVP forms
 */

export const cinzel = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-toile-serif",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-toile-heading",
  display: "swap",
});

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-toile-script",
  display: "swap",
});

export const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-toile-body",
  display: "swap",
});
