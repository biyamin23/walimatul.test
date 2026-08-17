/**
 * WALIMATUL Application Types — Public Re-export Index
 *
 * All application types are now defined in types/database.ts.
 * Import from here for convenience, or directly from types/database.ts.
 *
 * Template-specific types: templates/types.ts
 */

// Re-export all database types
export type {
  // Enumerations
  UserRole,
  InvitationStatus,
  RSVPAttendance,
  OrderPaymentStatus,
  PaymentMethod,

  // Table rows
  Profile,
  Template,
  Invitation,
  InvitationGalleryItem,
  RSVP,
  Order,
  PaymentProof,

  // Joined types
  InvitationWithTemplate,
  OrderWithInvitation,
  RSVPSummary,

  // Database namespace
  Database,
} from "./database";

// Legacy alias — kept for Phase 2 auth compatibility
export type { Profile as UserProfile } from "./database";
