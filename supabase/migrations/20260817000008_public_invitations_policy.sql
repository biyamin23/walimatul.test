-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 010: Public Invitation & Gallery Access Policy
-- Created: 2026-08-17
-- Depends on: Migration 004 (invitations), Migration 005 (gallery)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Enables public (unauthenticated + authenticated) read-only access to
--   published, non-expired invitations and their gallery items by slug.
--
-- PRIVACY & SECURITY RULES:
--   1. Only invitations with status = 'published' and non-expired are visible.
--   2. Drafts, archived, and expired invitations remain strictly private.
--   3. Gallery items inherit visibility from their published parent invitation.
--   4. Anonymous users get NO permissions on rsvps, orders, or payment_proofs.
--   5. Anonymous users CANNOT insert, update, or delete invitations or galleries.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Public SELECT policy for published invitations ──────────────────────────
CREATE POLICY "invitations: public can view published"
  ON public.invitations
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND slug IS NOT NULL
    AND (expires_at IS NULL OR expires_at > now())
  );

-- ── 2. Public SELECT policy for published invitation galleries ────────────────
CREATE POLICY "gallery: public can view published"
  ON public.invitation_gallery
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_gallery.invitation_id
        AND invitations.status = 'published'
        AND invitations.slug IS NOT NULL
        AND (invitations.expires_at IS NULL OR invitations.expires_at > now())
    )
  );
