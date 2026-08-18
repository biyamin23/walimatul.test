import { z } from "zod";

/**
 * WALIMATUL — Hybrid Template Design Configuration & Schema
 *
 * Central source of truth for configurable visual styling,
 * typography presets, color palettes, decorative assets, and overlay animations.
 */

export type AnimationPreset =
  | "none"
  | "soft-float"
  | "sparkle"
  | "bokeh"
  | "petals"
  | "gentle-glow";

export type BackgroundSize = "cover" | "contain" | "auto";
export type BackgroundRepeat = "no-repeat" | "repeat" | "repeat-y";
export type FontFamilyKey =
  | "playfair"
  | "cormorant"
  | "great-vibes"
  | "inter"
  | "outfit";

export interface FontOption {
  key: FontFamilyKey;
  label: string;
  category: "serif" | "sans" | "script";
  cssVariable: string;
}

export const APPROVED_FONTS: Record<FontFamilyKey, FontOption> = {
  cormorant: {
    key: "cormorant",
    label: "Cormorant Garamond (Serif Elegan)",
    category: "serif",
    cssVariable: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
  },
  playfair: {
    key: "playfair",
    label: "Playfair Display (Serif Klasik)",
    category: "serif",
    cssVariable: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
  },
  "great-vibes": {
    key: "great-vibes",
    label: "Great Vibes (Kaligrafi Romantik)",
    category: "script",
    cssVariable: "var(--font-great-vibes, 'Great Vibes', 'Brush Script MT', cursive)",
  },
  inter: {
    key: "inter",
    label: "Inter (Moden & Jelas)",
    category: "sans",
    cssVariable: "var(--font-inter, Inter, system-ui, sans-serif)",
  },
  outfit: {
    key: "outfit",
    label: "Outfit (Sans Kontemporari)",
    category: "sans",
    cssVariable: "var(--font-outfit, Outfit, system-ui, sans-serif)",
  },
};

export const ANIMATION_PRESETS: {
  key: AnimationPreset;
  label: string;
  description: string;
}[] = [
  { key: "none", label: "Tiada Animasi", description: "Lapisan statik tanpa pergerakan" },
  { key: "soft-float", label: "Soft Float", description: "Pergerakan terapung yang lembut dan tenang" },
  { key: "sparkle", label: "Sparkle", description: "Kilauan cahaya mikro berkilau secara rawak" },
  { key: "bokeh", label: "Bokeh Light", description: "Bulatan cahaya lembut kabur terapung perlahan" },
  { key: "petals", label: "Falling Petals", description: "Kelopak bunga halus melayang perlahan" },
  { key: "gentle-glow", label: "Gentle Glow", description: "Nadi kilauan cahaya ambien di sekeliling rekaan" },
];

export interface TemplateDesignColors {
  background: string;
  surface: string;
  surfaceCard: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  border: string;
  buttonBg: string;
  buttonText: string;
}

export interface TemplateDesignTypography {
  headingFont: FontFamilyKey;
  scriptFont: FontFamilyKey;
  bodyFont: FontFamilyKey;
}

export interface TemplateDesignBackground {
  color: string;
  imageUrl: string | null;
  size: BackgroundSize;
  repeat: BackgroundRepeat;
  overlayOpacity: number;
}

export interface TemplateDesignOrnaments {
  topOrnamentUrl: string | null;
  bottomOrnamentUrl: string | null;
  dividerStyle: "floral" | "minimal" | "line" | "none";
}

export interface TemplateDesignOverlay {
  enabled: boolean;
  animationPreset: AnimationPreset;
  customAssetUrl: string | null;
  opacity: number;
  speed: "slow" | "normal" | "fast";
}

export interface TemplateDesignConfig {
  colors: TemplateDesignColors;
  typography: TemplateDesignTypography;
  background: TemplateDesignBackground;
  ornaments: TemplateDesignOrnaments;
  overlay: TemplateDesignOverlay;
}

export const DEFAULT_HYBRID_DESIGN_CONFIG: TemplateDesignConfig = {
  colors: {
    background: "#FDFBF7",
    surface: "#FFFFFF",
    surfaceCard: "rgba(255, 255, 255, 0.88)",
    primaryText: "#2C2523",
    secondaryText: "#736862",
    accent: "#9C7A4A",
    border: "#EFE8DF",
    buttonBg: "#9C7A4A",
    buttonText: "#FFFFFF",
  },
  typography: {
    headingFont: "cormorant",
    scriptFont: "great-vibes",
    bodyFont: "inter",
  },
  background: {
    color: "#FDFBF7",
    imageUrl: null,
    size: "cover",
    repeat: "no-repeat",
    overlayOpacity: 0,
  },
  ornaments: {
    topOrnamentUrl: null,
    bottomOrnamentUrl: null,
    dividerStyle: "floral",
  },
  overlay: {
    enabled: true,
    animationPreset: "soft-float",
    customAssetUrl: null,
    opacity: 0.6,
    speed: "normal",
  },
};

// ─── Zod Schema for Validation ────────────────────────────────────────────────

const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Warna hex tidak sah.")
  .or(z.string().regex(/^rgba?\(/, "Warna rgb/rgba tidak sah."));

export const templateDesignConfigSchema = z.object({
  colors: z.object({
    background: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.background),
    surface: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.surface),
    surfaceCard: z.string().default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.surfaceCard),
    primaryText: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.primaryText),
    secondaryText: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.secondaryText),
    accent: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.accent),
    border: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.border),
    buttonBg: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.buttonBg),
    buttonText: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.colors.buttonText),
  }),
  typography: z.object({
    headingFont: z.enum(["playfair", "cormorant", "great-vibes", "inter", "outfit"]).default("cormorant"),
    scriptFont: z.enum(["playfair", "cormorant", "great-vibes", "inter", "outfit"]).default("great-vibes"),
    bodyFont: z.enum(["playfair", "cormorant", "great-vibes", "inter", "outfit"]).default("inter"),
  }),
  background: z.object({
    color: hexColorSchema.default(DEFAULT_HYBRID_DESIGN_CONFIG.background.color),
    imageUrl: z.string().nullable().default(null),
    size: z.enum(["cover", "contain", "auto"]).default("cover"),
    repeat: z.enum(["no-repeat", "repeat", "repeat-y"]).default("no-repeat"),
    overlayOpacity: z.number().min(0).max(1).default(0),
  }),
  ornaments: z.object({
    topOrnamentUrl: z.string().nullable().default(null),
    bottomOrnamentUrl: z.string().nullable().default(null),
    dividerStyle: z.enum(["floral", "minimal", "line", "none"]).default("floral"),
  }),
  overlay: z.object({
    enabled: z.boolean().default(true),
    animationPreset: z.enum(["none", "soft-float", "sparkle", "bokeh", "petals", "gentle-glow"]).default("soft-float"),
    customAssetUrl: z.string().nullable().default(null),
    opacity: z.number().min(0).max(1).default(0.6),
    speed: z.enum(["slow", "normal", "fast"]).default("normal"),
  }),
});

/**
 * Safely parse and normalize raw design_config jsonb into a guaranteed TemplateDesignConfig.
 * Never throws — always falls back to valid defaults.
 */
export function normalizeTemplateDesignConfig(
  raw: unknown
): TemplateDesignConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_HYBRID_DESIGN_CONFIG;
  }

  const parsed = templateDesignConfigSchema.safeParse(raw);
  if (!parsed.success) {
    return DEFAULT_HYBRID_DESIGN_CONFIG;
  }

  return parsed.data as TemplateDesignConfig;
}
