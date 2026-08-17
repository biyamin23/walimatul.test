-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 004: Invitations
-- Created: 2026-08-17
-- Depends on: Migration 001 (profiles), Migration 003 (templates)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Each invitation belongs to exactly one authenticated client.
--   Each invitation references exactly one template.
--   Invitation lifecycle is separate from payment/order lifecycle.
--
-- STATUS DECISION:
--   Invitation status = { draft | published | archived | expired }
--   Payment status lives entirely in the orders table.
--   This separation prevents status conflation and simplifies each table.
--
-- LIFECYCLE:
--   created           → status = draft
--   admin approves    → status = published, published_at = now(), expires_at = paid_at + validity_months
--   client archives   → status = archived
--   cron/check        → status = expired (when now() > expires_at)
--
-- SLUG:
--   Nullable for drafts.
--   Must be UNIQUE when present.
--   Public route: https://walimatul.my/{slug} (Phase 6)
--   Reserved slug validation happens at application level (Phase 5+).
--
-- OWNERSHIP:
--   user_id = auth.uid()
--   RLS enforces this at DB level. Never use email for ownership.
--
-- EXPIRY:
--   expires_at is NOT set at draft creation.
--   It is calculated at payment approval: paid_at + validity_months * interval '1 month'
--   For Blush Garden: 6 months.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Invitations table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invitations (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Template reference (no cascade: template deactivation ≠ invitation deletion)
  template_id         UUID        NOT NULL REFERENCES public.templates(id) ON DELETE RESTRICT,

  -- Public URL slug (nullable for drafts, unique when set)
  slug                TEXT        UNIQUE,

  -- Couple info
  groom_name          TEXT,
  groom_short_name    TEXT,
  bride_name          TEXT,
  bride_short_name    TEXT,

  -- Event details
  wedding_date        DATE,
  start_time          TIME,
  end_time            TIME,
  venue_name          TEXT,
  venue_address       TEXT,
  google_maps_url     TEXT,
  waze_url            TEXT,

  -- Invitation content
  opening_message     TEXT,
  invitation_message  TEXT,
  closing_message     TEXT,

  -- RSVP configuration
  rsvp_enabled        BOOLEAN     NOT NULL DEFAULT true,
  rsvp_deadline       DATE,
  max_pax             INTEGER     NOT NULL DEFAULT 5,
  allow_guest_message BOOLEAN     NOT NULL DEFAULT true,

  -- Music
  music_enabled       BOOLEAN     NOT NULL DEFAULT false,
  music_key           TEXT,

  -- Lifecycle
  status              TEXT        NOT NULL DEFAULT 'draft'
                                  CHECK (status IN ('draft', 'published', 'archived', 'expired')),

  published_at        TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER on_invitations_updated
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 2. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invitations_user_id     ON public.invitations (user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_template_id ON public.invitations (template_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug        ON public.invitations (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invitations_status      ON public.invitations (status);
CREATE INDEX IF NOT EXISTS idx_invitations_wedding_date ON public.invitations (wedding_date);

-- ── 3. Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS Policies ───────────────────────────────────────────────────────────

-- SELECT: authenticated client reads own invitations only.
CREATE POLICY "invitations: authenticated users read own"
  ON public.invitations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: client can only create invitations with their own user_id.
-- The WITH CHECK prevents forging another user's ownership.
CREATE POLICY "invitations: authenticated users insert own"
  ON public.invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: client can update only their own drafts.
-- Status transitions to 'published' only occur via Admin approval logic (future).
CREATE POLICY "invitations: authenticated users update own"
  ON public.invitations
  FOR UPDATE
  TO authenticated
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anonymous users cannot read any invitation in Phase 3.
-- Public invitation route (Phase 6) will add a SELECT policy for published invitations.
-- DO NOT add anonymous access here.

-- ── 5. Published/status column protection ─────────────────────────────────────
-- Clients cannot directly set status = 'published'. That happens via Admin approval.
-- We use a BEFORE UPDATE trigger to protect the published_at, expires_at, and
-- status columns from direct client manipulation.
CREATE OR REPLACE FUNCTION public.protect_invitation_lifecycle_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF current_role = 'authenticated' THEN
    -- Prevent client from self-publishing
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('published', 'expired') THEN
      RAISE EXCEPTION 'Unauthorized: invitation status can only be changed to ''published'' or ''expired'' by the system.';
    END IF;
    -- Prevent client from setting published_at or expires_at directly
    IF NEW.published_at IS DISTINCT FROM OLD.published_at THEN
      RAISE EXCEPTION 'Unauthorized: published_at cannot be set directly.';
    END IF;
    IF NEW.expires_at IS DISTINCT FROM OLD.expires_at THEN
      RAISE EXCEPTION 'Unauthorized: expires_at cannot be set directly.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_invitations_protect_lifecycle
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_invitation_lifecycle_fields();

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTES:
--   Anonymous read (Phase 6+):
--     Add policy: FOR SELECT USING (status = 'published')
--   Invitation expiry check:
--     A future cron or on-read check may transition status draft→expired.
--     Or let the application layer compute this from expires_at.
-- ─────────────────────────────────────────────────────────────────────────────
