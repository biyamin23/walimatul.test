-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 002: Role Escalation Protection
-- Created: 2026-08-16
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Harden the profiles table against direct role escalation attacks.
--
-- BACKGROUND — Why migration 001's WITH CHECK is insufficient:
--
--   The original policy used:
--     WITH CHECK (
--       auth.uid() = id
--       AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
--     )
--
--   In PostgreSQL, the WITH CHECK expression evaluates AFTER the mutation
--   is staged in the transaction. The subquery therefore reads the ALREADY-
--   MODIFIED row and returns the new value ('admin'), making the check
--   self-referentially pass. This is a known PostgreSQL RLS pitfall.
--
-- FIX — Two complementary layers:
--
--   Layer 1 (column-level): REVOKE UPDATE(role) from the `authenticated`
--     role. PostgreSQL enforces this before RLS, so no policy or trigger
--     can be bypassed by a direct UPDATE that touches the role column.
--
--   Layer 2 (trigger): A BEFORE UPDATE trigger that raises an exception if
--     the role column value is being changed. The trigger fires for all
--     connections that are NOT the postgres superuser or service_role.
--     This catches any path that column privileges might not, e.g. bulk
--     operations or future policy mistakes.
--
--   Together with the application-level defenses (Zod schema, Server Action
--   whitelist), this provides four independent layers of role protection.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Layer 1: Column-level privilege revocation ────────────────────────────────
-- Revoke the UPDATE privilege on the 'role' column from the authenticated role.
-- After this, any attempt by an authenticated (non-superuser, non-service-role)
-- user to execute `UPDATE profiles SET role = '...'` will fail with a column
-- privilege error — before RLS is even evaluated.
--
-- The 'anon' role (unauthenticated) already has no update access at all.
-- The 'service_role' and 'postgres' superuser retain full access.
REVOKE UPDATE (role) ON public.profiles FROM authenticated;

-- ── Layer 2: BEFORE UPDATE trigger ────────────────────────────────────────────
-- A row-level trigger that rejects any attempt to change the role column
-- when the current session role is 'authenticated'.
--
-- This provides defence-in-depth: if a future migration accidentally restores
-- UPDATE(role) privileges, or if another policy gap is introduced, this trigger
-- still blocks escalation for authenticated sessions.
--
-- Admins promoting users must do so via the Supabase dashboard (postgres/service
-- role) or a dedicated SECURITY DEFINER function that checks the caller's role
-- before performing the promotion.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER  -- Runs as the calling role, so current_role is accurate.
AS $$
BEGIN
  -- Block role changes for any authenticated session.
  -- current_role is the effective database role for this connection.
  IF current_role = 'authenticated' AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION
      'Unauthorized: the role field cannot be modified. '
      'Contact your platform administrator to request a role change.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profiles_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- ── Repair the WITH CHECK policy (defence in depth) ───────────────────────────
-- Drop and recreate the update policy with a simpler, correct check.
-- Since column-level privileges now prevent role updates entirely,
-- the WITH CHECK only needs to ensure users update their own row.
DROP POLICY IF EXISTS "profiles: authenticated users update own profile" ON public.profiles;

CREATE POLICY "profiles: authenticated users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING  (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
-- The role column update is now blocked at the column-privilege level (Layer 1)
-- and at the trigger level (Layer 2), not by the RLS WITH CHECK expression.

-- ── VERIFICATION ──────────────────────────────────────────────────────────────
-- To verify role protection is working, run as an authenticated test user:
--
--   UPDATE public.profiles SET role = 'admin' WHERE id = auth.uid();
--
-- Expected result: ERROR — permission denied for column role (from Layer 1)
-- OR: ERROR — Unauthorized: the role field cannot be modified (from Layer 2)
--
-- To promote a legitimate user to Admin (must be run as postgres/service role):
--
--   UPDATE public.profiles
--   SET role = 'admin', updated_at = now()
--   WHERE id = '<auth-user-uuid>';
-- ─────────────────────────────────────────────────────────────────────────────
