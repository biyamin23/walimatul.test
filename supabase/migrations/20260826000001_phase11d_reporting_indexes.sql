-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 019: Phase 11D Reporting Indexes
-- Created: 2026-08-26
-- Depends on: Migration 005 (orders), Migration 002 (invitations), Migration 001 (profiles)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Add supporting indexes for date-range reporting queries on paid orders,
--   published invitations, and user registrations.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_orders_paid_at
  ON public.orders (paid_at DESC)
  WHERE paid_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_invitations_published_at
  ON public.invitations (published_at DESC)
  WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_created_at
  ON public.profiles (created_at DESC);
