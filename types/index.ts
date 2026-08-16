/**
 * WALIMATUL Application Types
 *
 * Shared TypeScript types used across the platform.
 * Template-specific types live in templates/types.ts
 */

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "client";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  component_key: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Invitation ────────────────────────────────────────────────────────────────

export type InvitationStatus =
  | "draft"
  | "unpaid"
  | "paid"
  | "published"
  | "archived"
  | "expired";

export interface Invitation {
  id: string;
  user_id: string;
  template_id: string;
  slug: string | null;

  groom_name: string | null;
  groom_short_name: string | null;
  bride_name: string | null;
  bride_short_name: string | null;

  wedding_date: string | null;
  start_time: string | null;
  end_time: string | null;

  venue_name: string | null;
  venue_address: string | null;
  google_maps_url: string | null;
  waze_url: string | null;

  opening_message: string | null;
  invitation_message: string | null;
  closing_message: string | null;

  rsvp_enabled: boolean;
  rsvp_deadline: string | null;
  max_pax: number;
  allow_guest_message: boolean;

  music_enabled: boolean;
  music_key: string | null;

  status: InvitationStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "attending" | "not_attending";

export interface Rsvp {
  id: string;
  invitation_id: string;
  guest_name: string;
  attendance: AttendanceStatus;
  pax: number;
  message: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  user_id: string;
  invitation_id: string;
  amount: number;
  currency: string;
  payment_provider: string | null;
  payment_reference: string | null;
  payment_status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
}

// ─── Template Data Contract ────────────────────────────────────────────────────

/**
 * Normalized data passed to every invitation template component.
 * Wedding content must be decoupled from template design.
 */
export interface InvitationTemplateData {
  groomName: string;
  groomShortName: string;
  brideName: string;
  brideShortName: string;

  weddingDate: string;
  startTime?: string;
  endTime?: string;

  venueName: string;
  venueAddress?: string;

  googleMapsUrl?: string;
  wazeUrl?: string;

  openingMessage?: string;
  invitationMessage?: string;
  closingMessage?: string;

  gallery: string[];

  rsvpEnabled: boolean;
  rsvpDeadline?: string;
  maxPax: number;
  allowGuestMessage: boolean;

  musicEnabled: boolean;
  musicKey?: string;
}
