/**
 * WALIMATUL — Client Invitation Lifecycle & Dashboard Types
 */

import type { Invitation, Order, Template } from "@/types/database";

export type ClientInvitationStage =
  | "draft"
  | "awaiting_payment"
  | "under_review"
  | "payment_rejected"
  | "published"
  | "expired"
  | "archived";

export type TimelineStepKey = "details" | "slug" | "payment" | "review" | "published";

export type TimelineStepStatus = "completed" | "current" | "upcoming" | "warning" | "rejected";

export interface TimelineStep {
  key: TimelineStepKey;
  stepNumber: number;
  label: string;
  shortLabel: string;
  status: TimelineStepStatus;
  description?: string;
}

export type ExpiryWarningLevel = "none" | "subtle" | "urgent" | "expired";

export interface ExpiryState {
  isExpired: boolean;
  daysRemaining: number | null;
  expiryDateFormatted: string | null;
  warningLevel: ExpiryWarningLevel;
  message: string | null;
}

export interface ClientNextActionItem {
  invitationId: string;
  coupleDisplay: string;
  templateName: string;
  slug: string | null;
  stage: ClientInvitationStage;
  priority: number; // Lower number = higher priority
  badgeLabel: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  ctaVariant: "primary" | "warning" | "danger" | "secondary";
  icon: string;
}

export interface ClientInvitationLifecycle {
  stage: ClientInvitationStage;
  badgeLabel: string;
  badgeVariant: "default" | "success" | "warning" | "danger" | "info" | "gold";
  title: string;
  description: string;
  timeline: TimelineStep[];
  progressStep: number; // 1 to 5
  totalSteps: number;    // 5
  isPublished: boolean;
  isExpired: boolean;
  needsAttention: boolean;
  expiry: ExpiryState;
  nextAction: {
    label: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    ctaVariant: "primary" | "warning" | "danger" | "secondary";
  };
}

export interface ClientInvitationWithDetails {
  invitation: Invitation;
  template: Pick<Template, "id" | "name" | "slug" | "thumbnail_url"> | null;
  latestOrder: Order | null;
  lifecycle: ClientInvitationLifecycle;
}

export interface ClientDashboardSummary {
  totalInvitations: number;
  activeInvitations: number;
  draftInvitations: number;
  expiredInvitations: number;
  underReviewCount: number;
}

export interface ClientDashboardData {
  clientName: string | null;
  summary: ClientDashboardSummary;
  invitations: ClientInvitationWithDetails[];
  nextAction: ClientNextActionItem | null;
  supportPhone: string;
  supportWhatsappUrl: string;
}
