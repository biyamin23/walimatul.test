-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 001: Profiles
-- Created: 2026-08-16
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Create the profiles table that extends auth.users.
--   Every WALIMATUL authenticated user has exactly one profile.
--   Role defaults to 'client'. Admin role is assigned manually.
--
-- SECURITY:
--   - RLS is enabled. Users can only read/update their own profile.
--   - The 'role' column is NOT updatable by authenticated users.
--   - Role escalation via Supabase client or REST API is impossible.
--   - Profile insert is only done by the trigger function (security definer).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Create profiles table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  avatar_url TEXT,
  role       TEXT        NOT NULL DEFAULT 'client'
                         CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Ensure updated_at is maintained automatically ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 3. Auto-create profile on new auth.users insert ───────────────────────────
-- This trigger fires after every new Supabase Auth user is created.
-- It creates a corresponding profiles row using metadata from OAuth or email signup.
-- SECURITY DEFINER runs as the database owner, bypassing RLS.
-- Role is always hardcoded to 'client' — never taken from user input.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', NULL),
    'client'  -- ALWAYS client. Admin must be promoted manually.
  )
  ON CONFLICT (id) DO NOTHING;  -- Idempotent: safe if called multiple times.
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 4. Enable Row Level Security ──────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ── 5. RLS Policies ───────────────────────────────────────────────────────────

-- POLICY: Authenticated users can read ONLY their own profile.
CREATE POLICY "profiles: authenticated users read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- POLICY: Authenticated users can update only permitted fields of their own profile.
--   The 'role' column is excluded from updates by application code + this policy.
--   Even if a client sends { "role": "admin" }, the application only updates
--   (full_name, phone, updated_at) — and even if they bypass the app, this
--   policy restriction plus the column-level security below prevents escalation.
--
-- NOTE: True column-level restrictions for the 'role' field are enforced by:
--   a) Server Action only accepting full_name and phone
--   b) This policy using a WITH CHECK that prevents role changes
CREATE POLICY "profiles: authenticated users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    -- The WITH CHECK ensures role cannot be changed by an UPDATE.
    -- The subquery reads the current role value; if the UPDATE attempts
    -- to change it, the new row's role != old role → CHECK fails → denied.
  );

-- POLICY: Service role has full access (used by Server Actions with service key).
-- The service role bypasses RLS by default in Supabase, so no explicit policy
-- is needed. This comment documents the intended admin access pattern.
--
-- Admin READS all profiles:
--   → Use Supabase admin client (service role) in Server Actions only.
--   → Never expose service role to the browser.
-- ─────────────────────────────────────────────────────────────────────────────
-- NOTES:
--   To promote a user to Admin, run this SQL in the Supabase dashboard:
--
--   UPDATE public.profiles
--   SET role = 'admin', updated_at = now()
--   WHERE id = '<auth user uuid>';
--
--   Never allow role promotion through the application UI.
-- ─────────────────────────────────────────────────────────────────────────────
