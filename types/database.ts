/**
 * WALIMATUL — Database Types
 *
 * Hand-authored types matching the Supabase schema.
 * Once the remote schema is applied, run `supabase gen types typescript`
 * to regenerate and replace this file with the auto-generated version.
 *
 * Source of truth: supabase/migrations/
 */

// ─── Enumerations ─────────────────────────────────────────────────────────────

export type UserRole = "client" | "admin";

export type InvitationStatus = "draft" | "published" | "archived" | "expired";

export type RSVPAttendance = "attending" | "not_attending";

export type OrderPaymentStatus =
  | "pending_payment"
  | "pending_verification"
  | "paid"
  | "payment_rejected"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "tng_ewallet_qr";

// ─── Table Row Types ───────────────────────────────────────────────────────────

/**
 * public.profiles
 * Extended user information linked to auth.users.
 * Created automatically via trigger on new auth.users insert.
 */
export interface Profile {
  id: string; // UUID — matches auth.users.id
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export type TemplateStatus = "draft" | "active" | "archived";

/**
 * public.templates
 * Product metadata and design configuration for wedding invitation designs.
 * Actual design is rendered via coded React component or Hybrid Editorial renderer.
 * Clients: SELECT active only. Admin manages via Admin panel.
 */
export interface Template {
  id: string; // UUID
  name: string;
  slug: string; // unique — used in URLs and registry lookup
  description: string | null;
  category: string | null;
  component_key: string; // maps to templates/registry.ts key
  thumbnail_url: string | null;
  preview_url: string | null;
  price: number; // NUMERIC(10,2) — display price in MYR
  validity_months: number; // e.g. 6 or 12
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  status: TemplateStatus;
  design_config?: Record<string, unknown>;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * public.invitations
 * A client's wedding invitation. Belongs to one client, uses one template.
 *
 * Status lifecycle (invitation, not payment):
 *   draft → published → archived | expired
 *
 * Payment lifecycle lives entirely in orders.payment_status.
 *
 * expires_at: NOT set at creation. Calculated at admin approval:
 *   expires_at = paid_at + validity_months * interval
 */
export interface Invitation {
  id: string; // UUID
  user_id: string; // UUID — auth.users.id, ownership
  template_id: string; // UUID — references templates.id
  slug: string | null; // null for drafts; unique when set
  groom_name: string | null;
  groom_short_name: string | null;
  bride_name: string | null;
  bride_short_name: string | null;
  wedding_date: string | null; // DATE as ISO string
  start_time: string | null; // TIME as HH:MM:SS
  end_time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  google_maps_url: string | null;
  waze_url: string | null;
  opening_message: string | null;
  invitation_message: string | null;
  closing_message: string | null;
  rsvp_enabled: boolean;
  rsvp_deadline: string | null; // DATE
  max_pax: number;
  allow_guest_message: boolean;
  music_enabled: boolean;
  music_key: string | null;
  countdown_enabled?: boolean;
  guest_wishes_enabled?: boolean;
  music_youtube_video_id?: string | null;
  music_loop?: boolean;
  status: InvitationStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * public.invitation_gallery
 * Gallery photos for an invitation. Stored in Supabase Storage.
 * Path: {user_id}/{invitation_id}/{filename}
 */
export interface InvitationGalleryItem {
  id: string; // UUID
  invitation_id: string; // UUID — references invitations.id
  storage_path: string; // Supabase Storage path
  sort_order: number;
  created_at: string;
}

/**
 * public.rsvps
 * Guest RSVP response for a published invitation.
 *
 * Constraints:
 *   attendance = 'not_attending' → pax = 0
 *   attendance = 'attending'     → pax >= 1
 */
export interface RSVP {
  id: string; // UUID
  invitation_id: string; // UUID — references invitations.id
  guest_name: string;
  attendance: RSVPAttendance;
  pax: number;
  message: string | null;
  show_on_invitation?: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * public.orders
 * Manual Touch 'n Go eWallet QR payment order.
 *
 * SNAPSHOT: amount, template_id, validity_months are captured at creation.
 * Future price changes do not affect historical orders.
 *
 * ADMIN-ONLY fields (protected by REVOKE + trigger):
 *   payment_status (except pending_payment → pending_verification via client action)
 *   reviewed_at, reviewed_by, paid_at, receipt_number, rejection_reason,
 *   receipt_email_sent_at
 *
 * On approval (admin action, Phase 9+):
 *   payment_status = 'paid'
 *   paid_at = now()
 *   receipt_number = 'WAL-{YYYY}-{seq}'
 *   → invitation.status = 'published', invitation.expires_at = paid_at + validity_months
 */
export interface Order {
  id: string; // UUID
  receipt_number: string | null; // null until approved; format: WAL-2026-000001
  user_id: string; // UUID
  invitation_id: string; // UUID
  template_id: string; // UUID — snapshot
  amount: number; // NUMERIC(10,2) — snapshot of template price at time of order
  currency: string; // 'MYR'
  payment_method: PaymentMethod; // 'tng_ewallet_qr'
  payment_reference: string | null; // TNG transaction reference, set by client
  payment_status: OrderPaymentStatus;
  validity_months: number; // snapshot from template at time of order
  submitted_at: string | null; // when client submits proof
  reviewed_at: string | null; // when admin reviews
  reviewed_by: string | null; // UUID of admin who reviewed
  paid_at: string | null; // when admin approves payment
  rejection_reason: string | null; // set by admin on rejection
  receipt_email_sent_at: string | null; // when receipt email was sent
  created_at: string;
  updated_at: string;
}

/**
 * public.payment_proofs
 * Evidence of Touch 'n Go eWallet payment submitted by client.
 * Immutable after submission — no client UPDATE or DELETE.
 *
 * At least one of storage_path or transaction_reference must be non-null.
 *
 * Storage bucket: 'payment-proofs' (PRIVATE — never public)
 * Path: {user_id}/{order_id}/{filename}
 *
 * Do NOT confuse with the invitation-gallery bucket or the invitation QR.
 */
export interface PaymentProof {
  id: string; // UUID
  order_id: string; // UUID
  storage_path: string | null; // Supabase Storage path for proof image/PDF
  transaction_reference: string | null; // TNG transaction ID or reference number
  submitted_by: string; // UUID of client who submitted
  submitted_at: string;
  created_at: string;
}

// ─── Joined / Extended Types ───────────────────────────────────────────────────

/** Invitation with its template metadata and gallery items (joined query result) */
export interface InvitationWithTemplate extends Invitation {
  template: Template;
  gallery?: InvitationGalleryItem[];
}

/** Order with its associated invitation (joined query result) */
export interface OrderWithInvitation extends Order {
  invitation: Pick<Invitation, "id" | "slug" | "groom_name" | "bride_name" | "status">;
}

/** RSVP summary for dashboard display */
export interface RSVPSummary {
  total: number;
  attending: number;
  not_attending: number;
  total_pax: number;
}

// ─── Database namespace (Supabase gen types compatible shape) ─────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, "id">>;
      };
      templates: {
        Row: Template;
        Insert: Omit<Template, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Template, "id">>;
      };
      invitations: {
        Row: Invitation;
        Insert: Omit<Invitation, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Invitation, "id">>;
      };
      invitation_gallery: {
        Row: InvitationGalleryItem;
        Insert: Omit<InvitationGalleryItem, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<InvitationGalleryItem, "id">>;
      };
      rsvps: {
        Row: RSVP;
        Insert: Omit<RSVP, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<RSVP, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Order, "id">>;
      };
      payment_proofs: {
        Row: PaymentProof;
        Insert: Omit<PaymentProof, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: never; // payment proofs are immutable
      };
    };
    Enums: {
      user_role: UserRole;
      invitation_status: InvitationStatus;
      rsvp_attendance: RSVPAttendance;
      order_payment_status: OrderPaymentStatus;
      payment_method: PaymentMethod;
    };
  };
};
