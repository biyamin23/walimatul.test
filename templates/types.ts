/**
 * WALIMATUL — Template Types
 *
 * Shared data contract used by ALL invitation templates.
 * Every template must accept exactly this shape for its data prop.
 * Templates must NOT invent incompatible custom data interfaces.
 *
 * Architecture:
 *   invitations (DB) → toTemplateData() → InvitationTemplateData → Template component
 */

// ─── Core Template Data Contract ──────────────────────────────────────────────

/**
 * The normalized data shape passed to every invitation template component.
 * Derived from the invitations + invitation_gallery DB tables.
 *
 * Used in: Phase 4 (Blush Garden renderer), Phase 5 (editor), Phase 6 (public route).
 */
export interface InvitationTemplateData {
  /** Invitation ID (for keying) */
  id: string;

  // ── Couple ────────────────────────────────────────────────────────────────
  groomName: string;
  groomShortName: string;
  brideName: string;
  brideShortName: string;

  // ── Event ─────────────────────────────────────────────────────────────────
  weddingDate: string | null; // ISO date string e.g. '2026-11-24'
  startTime: string | null; // HH:MM:SS or HH:MM
  endTime: string | null;

  // ── Venue ─────────────────────────────────────────────────────────────────
  venueName: string | null;
  venueAddress: string | null;
  googleMapsUrl: string | null;
  wazeUrl: string | null;

  // ── Messages ──────────────────────────────────────────────────────────────
  openingMessage: string | null;
  invitationMessage: string | null;
  closingMessage: string | null;

  // ── Gallery ───────────────────────────────────────────────────────────────
  gallery: GalleryItem[];

  // ── RSVP ──────────────────────────────────────────────────────────────────
  rsvpEnabled: boolean;
  rsvpDeadline: string | null; // ISO date string
  maxPax: number;
  allowGuestMessage: boolean;

  // ── Opening Cover ─────────────────────────────────────────────────────────
  openingCoverEnabled: boolean;

  // ── Countdown ─────────────────────────────────────────────────────────────
  countdownEnabled: boolean;

  // ── Guest Wishes ──────────────────────────────────────────────────────────
  guestWishesEnabled: boolean;
  guestWishes: GuestWish[];

  // ── Music ─────────────────────────────────────────────────────────────────
  musicEnabled: boolean;
  musicKey: string | null; // Supabase Storage key for legacy music
  musicYoutubeVideoId: string | null; // YouTube 11-char video ID for background music
  musicLoop: boolean;
}

export interface GalleryItem {
  id: string;
  storagePath: string; // Supabase Storage path
  sortOrder: number;
}

export interface GuestWish {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
}

// ─── Template Component Contract ──────────────────────────────────────────────

import type { TemplateDesignConfig } from "@/lib/templates/template-design";

/**
 * All WALIMATUL template React components must accept this props shape.
 * mode: 'preview' = lightweight preview (no music, reduced animations)
 *       'live'    = full published invitation (all features enabled)
 *       'editor'  = editor preview pane (real-time, may show placeholder data)
 */
export interface TemplateComponentProps {
  data: InvitationTemplateData;
  mode?: "preview" | "live" | "editor";
  designConfig?: TemplateDesignConfig | Record<string, unknown>;
}

/** The type of a WALIMATUL template React component */
export type TemplateComponent = React.ComponentType<TemplateComponentProps>;

// ─── Template Registry Metadata ───────────────────────────────────────────────

/**
 * Static metadata for a template, used by the registry.
 * Mirrors the DB templates row but sourced from code (not DB).
 * The DB is the source of truth for pricing/status; this is for component linking.
 */
export interface TemplateRegistryEntry {
  /** Must match templates.component_key in DB */
  componentKey: string;
  /** Human-readable name (display fallback if DB unavailable) */
  name: string;
  /** The React component implementing this template */
  component: TemplateComponent;
}
