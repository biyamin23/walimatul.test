-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 014: Admin Payment Read Access RLS Policies
-- Created: 2026-08-17
-- Depends on: Migration 001 (profiles), Migration 002 (invitations), Migration 005 (orders), Migration 006 (payment_proofs)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Define security helper function public.is_admin() to check role without recursive RLS.
--   2. Grant additive SELECT policies to authenticated Admins on:
--      - public.orders (to view all client orders in the queue)
--      - public.payment_proofs (to view payment proof metadata)
--      - public.profiles (to view client names/emails for review)
--      - public.invitations (to view linked draft/couple information for review)
--      - storage.objects (for private payment-proofs bucket preview)
--   3. Preserve strict owner-only isolation for normal clients (role = 'client').
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Admin Verification Helper Function ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ── 2. Admin SELECT on Orders ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "orders: admin can view all orders" ON public.orders;
CREATE POLICY "orders: admin can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── 3. Admin SELECT on Payment Proofs ─────────────────────────────────────────
DROP POLICY IF EXISTS "payment_proofs: admin can view all payment proofs" ON public.payment_proofs;
CREATE POLICY "payment_proofs: admin can view all payment proofs"
  ON public.payment_proofs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── 4. Admin SELECT on Profiles ───────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: admin can view all profiles" ON public.profiles;
CREATE POLICY "profiles: admin can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── 5. Admin SELECT on Invitations ────────────────────────────────────────────
DROP POLICY IF EXISTS "invitations: admin can view all invitations" ON public.invitations;
CREATE POLICY "invitations: admin can view all invitations"
  ON public.invitations
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── 6. Admin SELECT on Storage Objects (payment-proofs bucket) ────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects'
  ) THEN
    EXECUTE '
      DROP POLICY IF EXISTS "payment_proofs: admin can view all payment proof objects" ON storage.objects;
      CREATE POLICY "payment_proofs: admin can view all payment proof objects"
        ON storage.objects
        FOR SELECT
        TO authenticated
        USING (
          bucket_id = ''payment-proofs''
          AND public.is_admin()
        );
    ';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- In environments where storage.objects RLS is managed via dashboard
    NULL;
END;
$$;
