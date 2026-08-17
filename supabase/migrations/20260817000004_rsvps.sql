-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 006: RSVPs
-- Created: 2026-08-17
-- Depends on: Migration 004 (invitations)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Guest RSVP responses for an invitation.
--   In Phase 3: only invitation owners can read RSVPs. No public submission yet.
--   Phase 7 will add the anonymous INSERT policy for guest submission.
--
-- CONSTRAINTS:
--   attendance = 'not_attending' → pax must be 0
--   attendance = 'attending'     → pax must be >= 1
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. RSVPs table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rsvps (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID        NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name    TEXT        NOT NULL,
  attendance    TEXT        NOT NULL CHECK (attendance IN ('attending', 'not_attending')),
  pax           INTEGER     NOT NULL DEFAULT 0,
  message       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Pax constraint: attending guests must have pax >= 1; not_attending must be 0
  CONSTRAINT rsvp_pax_check CHECK (
    (attendance = 'not_attending' AND pax = 0) OR
    (attendance = 'attending'     AND pax >= 1)
  )
);

CREATE TRIGGER on_rsvps_updated
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 2. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps (invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at    ON public.rsvps (invitation_id, created_at DESC);

-- ── 3. Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS Policies ───────────────────────────────────────────────────────────

-- SELECT: invitation owner can read all RSVPs for their invitation.
CREATE POLICY "rsvps: owner can read own invitation rsvps"
  ON public.rsvps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- Anonymous INSERT is NOT added here.
-- Phase 7 will add: FOR INSERT TO anon WITH CHECK (public invitation lookup)
-- Do not expose RSVP data publicly in Phase 3.

-- ─────────────────────────────────────────────────────────────────────────────
-- FUTURE (Phase 7): Anonymous RSVP submission
--   CREATE POLICY "rsvps: guests can submit to published invitation"
--     ON public.rsvps FOR INSERT TO anon
--     WITH CHECK (
--       EXISTS (
--         SELECT 1 FROM public.invitations
--         WHERE invitations.id = rsvps.invitation_id
--           AND invitations.status = 'published'
--           AND invitations.rsvp_enabled = true
--           AND (invitations.rsvp_deadline IS NULL OR invitations.rsvp_deadline >= now()::date)
--       )
--     );
-- ─────────────────────────────────────────────────────────────────────────────
