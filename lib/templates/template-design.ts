import { z } from "zod";

/**
 * WALIMATUL — Hybrid Template Design Configuration & Schema
 *
 * Central source of truth for configurable visual styling,
 * responsive backgrounds, typography presets, color palettes,
 * decorative assets, and overlay animations.
 */

export type AnimationPreset =
  | "none"
  | "soft-float"
  | "sparkle"
  | "bokeh"
  | "petals"
  | "gentle-glow";

export type CardAnimationPreset =
  | "none"
  | "soft-fade"
  | "fade-up"
  | "gentle-scale"
  | "staggered-reveal";

export type CardAnimationDuration = "normal" | "slow";
export type OrnamentSize = "small" | "medium" | "large";

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
  { key: "sparkle", label: "Sparkle", description: "Kilauan mikro berkilau secara rawak" },
  { key: "bokeh", label: "Bokeh Light", description: "Bulatan cahaya lembut terapung perlahan" },
  { key: "petals", label: "Falling Petals", description: "Kelopak bunga halus melayang perlahan" },
  { key: "gentle-glow", label: "Gentle Glow", description: "Nadi kilauan cahaya ambien di sekeliling rekaan" },
];

export const CARD_ANIMATION_PRESETS: {
  key: CardAnimationPreset;
  label: string;
  badge?: string;
  description: string;
}[] = [
  { key: "none", label: "Tiada", description: "Paparan statik tanpa animasi kemunculan" },
  { key: "soft-fade", label: "Soft Fade", description: "Kemunculan beransur-ansur dengan kejelasan lembut" },
  { key: "fade-up", label: "Fade Up", badge: "Disyorkan", description: "Meluncur naik secara anggun sambil muncul jelas" },
  { key: "gentle-scale", label: "Gentle Scale", description: "Mengembang lembut dari saiz mikro ke saiz penuh" },
  { key: "staggered-reveal", label: "Staggered Reveal", description: "Elemen kandungan muncul bersiri satu persatu" },
];

export const ORNAMENT_SIZE_OPTIONS: {
  key: OrnamentSize;
  label: string;
  description: string;
  dimensionLabel: string;
}[] = [
  { key: "small", label: "Kecil (Small ~48px)", description: "Motif halus untuk latar belakang minimalis", dimensionLabel: "48px" },
  { key: "medium", label: "Sederhana (Medium ~80px)", description: "Saiz standard seimbang untuk kebanyakan corak", dimensionLabel: "80px" },
  { key: "large", label: "Besar (Large ~120px)", description: "Hiasan ketara untuk motif utama", dimensionLabel: "120px" },
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
  mobileImageUrl: string | null;
  desktopImageUrl: string | null;
  size: BackgroundSize;
  repeat: BackgroundRepeat;
  overlayOpacity: number;
  /** Legacy single background image for backward compatibility */
  imageUrl?: string | null;
}

export interface TemplateDesignOrnaments {
  topOrnamentUrl: string | null;
  bottomOrnamentUrl: string | null;
  dividerStyle: "floral" | "minimal" | "line" | "none";
}

export interface TemplateDesignOverlay {
  enabled: boolean;
  preset: AnimationPreset;
  customAssetUrl: string | null;
  opacity: number;
  speed: "slow" | "normal" | "fast";
  ornamentSize: OrnamentSize;
  /** Backward compatibility alias */
  animationPreset?: AnimationPreset;
}

export interface TemplateDesignAnimation {
  cardPreset: CardAnimationPreset;
  duration: CardAnimationDuration;
  triggerOnce: boolean;
}

export interface TemplateDesignConfig {
  colors: TemplateDesignColors;
  typography: TemplateDesignTypography;
  background: TemplateDesignBackground;
  ornaments: TemplateDesignOrnaments;
  overlay: TemplateDesignOverlay;
  animation: TemplateDesignAnimation;
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
    mobileImageUrl: null,
    desktopImageUrl: null,
    size: "cover",
    repeat: "no-repeat",
    overlayOpacity: 0,
    imageUrl: null,
  },
  ornaments: {
    topOrnamentUrl: null,
    bottomOrnamentUrl: null,
    dividerStyle: "floral",
  },
  overlay: {
    enabled: true,
    preset: "soft-float",
    customAssetUrl: null,
    opacity: 0.6,
    speed: "normal",
    ornamentSize: "medium",
  },
  animation: {
    cardPreset: "fade-up",
    duration: "normal",
    triggerOnce: true,
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
    mobileImageUrl: z.string().nullable().optional(),
    desktopImageUrl: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
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
    preset: z.enum(["none", "soft-float", "sparkle", "bokeh", "petals", "gentle-glow"]).optional(),
    animationPreset: z.enum(["none", "soft-float", "sparkle", "bokeh", "petals", "gentle-glow"]).optional(),
    customAssetUrl: z.string().nullable().default(null),
    opacity: z.number().min(0).max(1).default(0.6),
    speed: z.enum(["slow", "normal", "fast"]).default("normal"),
    ornamentSize: z.enum(["small", "medium", "large"]).default("medium"),
  }),
  animation: z.object({
    cardPreset: z.enum(["none", "soft-fade", "fade-up", "gentle-scale", "staggered-reveal"]).default("fade-up"),
    duration: z.enum(["normal", "slow"]).default("normal"),
    triggerOnce: z.boolean().default(true),
  }).default({
    cardPreset: "fade-up",
    duration: "normal",
    triggerOnce: true,
  }),
});

/**
 * Safely parse and normalize raw design_config jsonb into a guaranteed TemplateDesignConfig.
 * Handles backward compatibility seamlessly between single legacy background and new responsive assets.
 */
export function normalizeTemplateDesignConfig(
  raw: unknown
): TemplateDesignConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_HYBRID_DESIGN_CONFIG;
  }

  const rawObj = raw as Record<string, unknown>;
  const rawBg = (rawObj.background && typeof rawObj.background === "object"
    ? rawObj.background
    : {}) as Record<string, unknown>;
  const rawOverlay = (rawObj.overlay && typeof rawObj.overlay === "object"
    ? rawObj.overlay
    : {}) as Record<string, unknown>;

  // Backward compatibility normalization for background
  const legacyBgUrl = typeof rawBg.imageUrl === "string" ? rawBg.imageUrl : null;
  const mobileBgUrl =
    typeof rawBg.mobileImageUrl === "string"
      ? rawBg.mobileImageUrl
      : legacyBgUrl ?? (typeof rawBg.desktopImageUrl === "string" ? rawBg.desktopImageUrl : null);
  const desktopBgUrl =
    typeof rawBg.desktopImageUrl === "string"
      ? rawBg.desktopImageUrl
      : legacyBgUrl ?? (typeof rawBg.mobileImageUrl === "string" ? rawBg.mobileImageUrl : null);

  // Backward compatibility normalization for animation preset
  const rawPreset =
    typeof rawOverlay.preset === "string"
      ? rawOverlay.preset
      : typeof rawOverlay.animationPreset === "string"
      ? rawOverlay.animationPreset
      : "soft-float";
  const canonicalPreset: AnimationPreset = (
    ["none", "soft-float", "sparkle", "bokeh", "petals", "gentle-glow"].includes(rawPreset)
      ? rawPreset
      : "soft-float"
  ) as AnimationPreset;

  const rawOrnamentSize: OrnamentSize =
    typeof rawOverlay.ornamentSize === "string" && ["small", "medium", "large"].includes(rawOverlay.ornamentSize)
      ? (rawOverlay.ornamentSize as OrnamentSize)
      : "medium";

  // Card Content Animation normalization
  const rawAnim = (rawObj.animation && typeof rawObj.animation === "object"
    ? rawObj.animation
    : {}) as Record<string, unknown>;

  const rawCardPreset =
    typeof rawAnim.cardPreset === "string"
      ? rawAnim.cardPreset
      : "fade-up";
  const canonicalCardPreset: CardAnimationPreset = (
    ["none", "soft-fade", "fade-up", "gentle-scale", "staggered-reveal"].includes(rawCardPreset)
      ? rawCardPreset
      : "fade-up"
  ) as CardAnimationPreset;

  const rawDuration: CardAnimationDuration =
    typeof rawAnim.duration === "string" && ["normal", "slow"].includes(rawAnim.duration)
      ? (rawAnim.duration as CardAnimationDuration)
      : "normal";

  const rawTriggerOnce =
    typeof rawAnim.triggerOnce === "boolean" ? rawAnim.triggerOnce : true;

  const normalized = {
    ...rawObj,
    background: {
      color: typeof rawBg.color === "string" ? rawBg.color : DEFAULT_HYBRID_DESIGN_CONFIG.background.color,
      mobileImageUrl: mobileBgUrl,
      desktopImageUrl: desktopBgUrl,
      imageUrl: legacyBgUrl,
      size: typeof rawBg.size === "string" ? rawBg.size : "cover",
      repeat: typeof rawBg.repeat === "string" ? rawBg.repeat : "no-repeat",
      overlayOpacity: typeof rawBg.overlayOpacity === "number" ? rawBg.overlayOpacity : 0,
    },
    overlay: {
      enabled: typeof rawOverlay.enabled === "boolean" ? rawOverlay.enabled : true,
      preset: canonicalPreset,
      animationPreset: canonicalPreset,
      customAssetUrl: typeof rawOverlay.customAssetUrl === "string" ? rawOverlay.customAssetUrl : null,
      opacity: typeof rawOverlay.opacity === "number" ? rawOverlay.opacity : 0.6,
      speed: typeof rawOverlay.speed === "string" ? rawOverlay.speed : "normal",
      ornamentSize: rawOrnamentSize,
    },
    animation: {
      cardPreset: canonicalCardPreset,
      duration: rawDuration,
      triggerOnce: rawTriggerOnce,
    },
  };

  const parsed = templateDesignConfigSchema.safeParse(normalized);
  if (!parsed.success) {
    return DEFAULT_HYBRID_DESIGN_CONFIG;
  }

  const data = parsed.data;

  return {
    ...data,
    background: {
      color: data.background.color,
      mobileImageUrl: mobileBgUrl,
      desktopImageUrl: desktopBgUrl,
      imageUrl: legacyBgUrl,
      size: data.background.size,
      repeat: data.background.repeat,
      overlayOpacity: data.background.overlayOpacity,
    },
    overlay: {
      enabled: data.overlay.enabled,
      preset: canonicalPreset,
      animationPreset: canonicalPreset,
      customAssetUrl: data.overlay.customAssetUrl,
      opacity: data.overlay.opacity,
      speed: data.overlay.speed,
      ornamentSize: data.overlay.ornamentSize,
    },
    animation: {
      cardPreset: data.animation.cardPreset,
      duration: data.animation.duration,
      triggerOnce: data.animation.triggerOnce,
    },
  };
}
