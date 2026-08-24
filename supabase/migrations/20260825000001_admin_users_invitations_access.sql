-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 017: Admin Users & Invitations Access + Expiry RPC
-- Created: 2026-08-25
-- Depends on: Migration 001 (profiles), Migration 004 (invitations), Migration 005 (gallery), Migration 006 (rsvps), Migration 014 (admin read access)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Grant additive SELECT policies to authenticated Admins on:
--      - public.rsvps (to view aggregated RSVP response metrics & wish counts)
--      - public.invitation_gallery (to view gallery photo counts and metadata)
--   2. Define secure atomic RPC public.admin_extend_invitation_expiry:
--      - Validates caller authentication and admin role.
--      - Validates new expiration timestamp > current expiration or > now.
--      - Updates invitations.expires_at safely without tripping direct client triggers.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Admin SELECT on RSVPs ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "rsvps: admin can view all rsvps" ON public.rsvps;
CREATE POLICY "rsvps: admin can view all rsvps"
  ON public.rsvps
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── 2. Admin SELECT on Invitation Gallery ─────────────────────────────────────
DROP POLICY IF EXISTS "invitation_gallery: admin can view all gallery items" ON public.invitation_gallery;
CREATE POLICY "invitation_gallery: admin can view all gallery items"
  ON public.invitation_gallery
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── 3. Admin Extend Invitation Expiry RPC ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_extend_invitation_expiry(
  p_invitation_id   UUID,
  p_new_expires_at  TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id     UUID;
  v_is_admin      BOOLEAN;
  v_invitation    RECORD;
  v_old_expires   TIMESTAMPTZ;
BEGIN
  -- 1. Verify caller authentication
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Pengesahan pengguna diperlukan.';
  END IF;

  -- 2. Verify admin role
  SELECT (role = 'admin') INTO v_is_admin
  FROM public.profiles
  WHERE id = v_caller_id;

  IF v_is_admin IS NOT TRUE THEN
    RAISE EXCEPTION 'Akses dinafikan: Hanya pentadbir boleh melanjutkan tarikh luput jemputan.';
  END IF;

  -- 3. Lock and fetch invitation
  SELECT id, status, published_at, expires_at
  INTO v_invitation
  FROM public.invitations
  WHERE id = p_invitation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Jemputan tidak dijumpai.';
  END IF;

  v_old_expires := v_invitation.expires_at;

  -- 4. Validate invitation eligibility (only published or expired invitations)
  IF v_invitation.published_at IS NULL THEN
    RAISE EXCEPTION 'Jemputan draf atau belum diterbitkan tidak boleh dilanjutkan tarikh luput.';
  END IF;

  -- 5. Validate new expires_at timestamp
  IF p_new_expires_at IS NULL THEN
    RAISE EXCEPTION 'Tarikh luput baharu tidak sah.';
  END IF;

  IF v_old_expires IS NOT NULL AND p_new_expires_at <= v_old_expires THEN
    RAISE EXCEPTION 'Tarikh luput baharu (%) mesti selepas tarikh luput semasa (%).', p_new_expires_at, v_old_expires;
  END IF;

  -- 6. Update invitation expires_at and restore status to published if previously expired
  UPDATE public.invitations
  SET
    expires_at = p_new_expires_at,
    status = CASE
      WHEN status = 'expired' AND published_at IS NOT NULL AND p_new_expires_at > now() THEN 'published'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_invitation_id;

  RETURN jsonb_build_object(
    'invitation_id', p_invitation_id,
    'old_expires_at', v_old_expires,
    'new_expires_at', p_new_expires_at,
    'updated_by', v_caller_id,
    'updated_at', now()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_extend_invitation_expiry(UUID, TIMESTAMPTZ) TO authenticated;
