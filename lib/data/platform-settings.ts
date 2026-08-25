import "server-only";

import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/constants/brand";

export interface PlatformSettingsMap {
  support_whatsapp: {
    phone: string;
    display: string;
  };
  default_invitation_validity_months: number;
  max_gallery_photos: number;
  manual_payment_instructions: {
    text: string;
  };
  maintenance_notice: {
    enabled: boolean;
    text: string;
  };
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsMap = {
  support_whatsapp: {
    phone: BRAND.supportWhatsapp,
    display: BRAND.supportPhone,
  },
  default_invitation_validity_months: 6,
  max_gallery_photos: 12,
  manual_payment_instructions: {
    text: "Scan kod QR Touch ’n Go eWallet dan muat naik tangkap layar resit pembayaran anda untuk semakan pantas.",
  },
  maintenance_notice: {
    enabled: false,
    text: "",
  },
};

/**
 * Fetch client-safe platform settings from the database via SECURITY DEFINER RPC.
 * Server-only, typed, and resilient to missing records or non-admin client contexts.
 */
export async function getPlatformSettings(): Promise<PlatformSettingsMap> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_runtime_platform_settings");

  if (error || !data || typeof data !== "object") {
    return DEFAULT_PLATFORM_SETTINGS;
  }

  const raw = data as Record<string, unknown>;
  const map: PlatformSettingsMap = { ...DEFAULT_PLATFORM_SETTINGS };

  if (raw.support_whatsapp && typeof raw.support_whatsapp === "object") {
    const v = raw.support_whatsapp as Record<string, string>;
    map.support_whatsapp = {
      phone: v.phone || DEFAULT_PLATFORM_SETTINGS.support_whatsapp.phone,
      display: v.display || DEFAULT_PLATFORM_SETTINGS.support_whatsapp.display,
    };
  }

  if (typeof raw.default_invitation_validity_months === "number") {
    map.default_invitation_validity_months = raw.default_invitation_validity_months;
  }

  if (typeof raw.max_gallery_photos === "number") {
    map.max_gallery_photos = raw.max_gallery_photos;
  }

  if (raw.manual_payment_instructions && typeof raw.manual_payment_instructions === "object") {
    const v = raw.manual_payment_instructions as Record<string, string>;
    map.manual_payment_instructions = {
      text: v.text || DEFAULT_PLATFORM_SETTINGS.manual_payment_instructions.text,
    };
  }

  if (raw.maintenance_notice && typeof raw.maintenance_notice === "object") {
    const v = raw.maintenance_notice as { enabled?: boolean; text?: string };
    map.maintenance_notice = {
      enabled: Boolean(v.enabled),
      text: v.text || "",
    };
  }

  return map;
}

/**
 * Server-only helper to read a single setting at runtime with safe fallback.
 */
export async function getRuntimePlatformSetting<K extends keyof PlatformSettingsMap>(
  key: K
): Promise<PlatformSettingsMap[K]> {
  const all = await getPlatformSettings();
  return all[key];
}
