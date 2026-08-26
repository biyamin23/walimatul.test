import { getSiteUrl } from "@/lib/utils/site-url";

export interface ShareMessageOptions {
  groomName?: string | null;
  groomShortName?: string | null;
  brideName?: string | null;
  brideShortName?: string | null;
  slug: string;
}

/**
 * Returns the canonical full public URL for a published invitation.
 */
export function getPublicInvitationUrl(slug: string): string {
  const baseUrl = getSiteUrl();
  const cleanSlug = slug.replace(/^\//, "").trim();
  return `${baseUrl}/${cleanSlug}`;
}

/**
 * Resolves couple names using standard hierarchy: short name || full name || fallback.
 */
export function resolveCoupleDisplayNames(options: Partial<ShareMessageOptions>): {
  groom: string;
  bride: string;
  coupleDisplay: string;
} {
  const groom = options.groomShortName?.trim() || options.groomName?.trim() || "Pengantin Lelaki";
  const bride = options.brideShortName?.trim() || options.brideName?.trim() || "Pengantin Perempuan";
  const coupleDisplay = `${groom} & ${bride}`;

  return { groom, bride, coupleDisplay };
}

/**
 * Builds the default respectful Malay WhatsApp share message.
 */
export function buildInvitationShareMessage(options: ShareMessageOptions): string {
  const { coupleDisplay } = resolveCoupleDisplayNames(options);
  const publicUrl = getPublicInvitationUrl(options.slug);

  return `Assalamualaikum Warahmatullahi Wabarakatuh,

Dengan penuh kesyukuran ke hadrat Ilahi, kami sekeluarga berbesar hati menjemput Dato' / Datin / Tuan / Puan / Encik / Cik ke majlis perkahwinan kami:

💍 ${coupleDisplay}

Sila layari pautan di bawah untuk melihat butiran majlis dan mengesahkan kehadiran (RSVP):
${publicUrl}

Terima kasih.`;
}

/**
 * Builds the full wa.me share URL with proper encoding.
 */
export function buildWhatsAppShareUrl(options: ShareMessageOptions): string {
  const message = buildInvitationShareMessage(options);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a clean, sanitized PNG filename for QR downloads.
 */
export function getQrFilename(slug: string): string {
  const sanitizedSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/^-+|-+$/g, "");

  return `walimatul-${sanitizedSlug || "invitation"}-qr.png`;
}
