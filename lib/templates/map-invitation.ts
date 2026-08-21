import type { Invitation, InvitationGalleryItem } from "@/types/database";
import type { InvitationTemplateData, GuestWish } from "@/templates/types";

/**
 * WALIMATUL — Database to Template Data Mapper
 *
 * Converts Supabase snake_case invitation and gallery rows into the normalized
 * camelCase InvitationTemplateData structure required by all template components.
 *
 * Rules:
 *   - Renderer components must NEVER access database rows or snake_case fields directly.
 *   - Missing/null fields are cleanly normalized.
 *   - No styling/presentation logic is embedded in this mapper.
 */
export function mapInvitationToTemplateData(
  invitation: Invitation,
  galleryItems: InvitationGalleryItem[] = [],
  guestWishes: GuestWish[] = []
): InvitationTemplateData {
  const sortedGallery = [...galleryItems]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: item.id,
      storagePath: item.storage_path,
      sortOrder: item.sort_order,
    }));

  return {
    id: invitation.id,
    groomName: invitation.groom_name || "",
    groomShortName: invitation.groom_short_name || invitation.groom_name || "",
    brideName: invitation.bride_name || "",
    brideShortName: invitation.bride_short_name || invitation.bride_name || "",
    weddingDate: invitation.wedding_date || null,
    startTime: invitation.start_time || null,
    endTime: invitation.end_time || null,
    venueName: invitation.venue_name || null,
    venueAddress: invitation.venue_address || null,
    googleMapsUrl: invitation.google_maps_url || null,
    wazeUrl: invitation.waze_url || null,
    openingMessage: invitation.opening_message || null,
    invitationMessage: invitation.invitation_message || null,
    closingMessage: invitation.closing_message || null,
    gallery: sortedGallery,
    rsvpEnabled: invitation.rsvp_enabled ?? true,
    rsvpDeadline: invitation.rsvp_deadline || null,
    maxPax: invitation.max_pax ?? 5,
    allowGuestMessage: invitation.allow_guest_message ?? true,
    openingCoverEnabled: invitation.opening_cover_enabled ?? true,
    countdownEnabled: invitation.countdown_enabled ?? false,
    guestWishesEnabled: invitation.guest_wishes_enabled ?? false,
    guestWishes: guestWishes,
    musicEnabled: invitation.music_enabled ?? false,
    musicKey: invitation.music_key || null,
    musicYoutubeVideoId: invitation.music_youtube_video_id || null,
    musicLoop: invitation.music_loop ?? false,
  };
}
