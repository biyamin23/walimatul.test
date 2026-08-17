-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 008: Payment Proofs
-- Created: 2026-08-17
-- Depends on: Migration 007 (orders)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Stores client-submitted evidence of Touch 'n Go eWallet payment.
--   Can be a screenshot (storage_path) and/or a transaction reference number.
--   At least one of storage_path or transaction_reference must be present.
--
-- STORAGE BUCKET: 'payment-proofs'
--   PRIVATE — never public.
--   Path convention: {user_id}/{order_id}/{filename}
--   Access: client reads own; admin reads all (future, via admin server actions).
--   Do NOT use the invitation-gallery bucket for payment proofs.
--
-- PROOF LIFECYCLE:
--   Client submits proof → payment_proofs INSERT + orders.payment_status → pending_verification
--   Admin reviews proof  → approves (paid) or rejects (payment_rejected)
--   Proof is immutable after submission — no UPDATE by client.
--
-- PAYMENT QR vs INVITATION QR:
--   Payment proofs relate to the Touch 'n Go payment QR (WALIMATUL's payment QR).
--   Not to be confused with the invitation QR (generated after approval).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Payment proofs table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_proofs (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Linked order (CASCADE: if an order is deleted, its proofs go too)
  order_id              UUID        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  -- Proof evidence: at least one must be provided
  storage_path          TEXT,
  transaction_reference TEXT,

  -- Submitter (RESTRICT: preserve audit trail)
  submitted_by          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,

  -- Timestamps
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraint: at least storage_path or transaction_reference must exist
  CONSTRAINT proof_evidence_check CHECK (
    storage_path IS NOT NULL OR transaction_reference IS NOT NULL
  )
);

-- ── 2. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id     ON public.payment_proofs (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_submitted_by ON public.payment_proofs (submitted_by);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_submitted_at ON public.payment_proofs (submitted_at DESC);

-- ── 3. Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS Policies ───────────────────────────────────────────────────────────

-- SELECT: client can read proof for their own orders.
CREATE POLICY "payment_proofs: client reads own"
  ON public.payment_proofs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payment_proofs.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- INSERT: client can submit proof for their own pending orders only.
-- submitted_by must match auth.uid() (prevents forging submitter identity).
CREATE POLICY "payment_proofs: client inserts for own order"
  ON public.payment_proofs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payment_proofs.order_id
        AND orders.user_id = auth.uid()
        AND orders.payment_status IN ('pending_payment', 'pending_verification')
    )
  );

-- No UPDATE or DELETE for clients — proofs are immutable once submitted.
-- Admin access to proofs for verification will be added via admin server actions (future).

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKET SETUP (manual step in Supabase Dashboard):
--   1. Go to Storage → Create Bucket
--   2. Name: payment-proofs
--   3. Public: NO (private)
--   4. Allowed MIME types: image/jpeg, image/png, image/webp, application/pdf
--   5. Max file size: 5MB
--
-- Storage Policies (add in Supabase Dashboard → Storage → payment-proofs → Policies):
--   Client upload (INSERT):
--     bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
--   Client download (SELECT):
--     bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
-- ─────────────────────────────────────────────────────────────────────────────
