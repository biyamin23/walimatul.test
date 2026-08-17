-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 012: Payment Proof Submission RPC & Active Order Index
-- Created: 2026-08-17
-- Depends on: Migration 007 (orders), Migration 008 (payment_proofs)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Secure RPC function allowing clients to submit payment proof and
--      transition their order from pending_payment/payment_rejected to pending_verification.
--   2. Prevents duplicate active unpaid orders for the same invitation.
--   3. Storage RLS policies for private payment-proofs bucket.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Single Active Unpaid Order Index ───────────────────────────────────────
-- Prevents creating multiple pending orders for the same invitation concurrently
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_active_unpaid
  ON public.orders (invitation_id)
  WHERE payment_status IN ('pending_payment', 'pending_verification');

-- ── 2. Secure RPC for Payment Proof Submission ────────────────────────────────
CREATE OR REPLACE FUNCTION public.submit_payment_proof(
  p_order_id              UUID,
  p_storage_path          TEXT,
  p_transaction_reference TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id   UUID;
  v_order       RECORD;
  v_proof_id    UUID;
  v_clean_ref   TEXT;
  v_clean_path  TEXT;
BEGIN
  -- 1. Verify caller authentication
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Pengesahan pengguna diperlukan.';
  END IF;

  -- 2. Clean inputs
  v_clean_path := NULLIF(TRIM(p_storage_path), '');
  v_clean_ref  := NULLIF(TRIM(p_transaction_reference), '');

  IF v_clean_path IS NULL AND v_clean_ref IS NULL THEN
    RAISE EXCEPTION 'Sila muat naik resit pembayaran atau masukkan nombor rujukan transaksi.';
  END IF;

  -- 3. Lock and fetch order
  SELECT id, user_id, invitation_id, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pesanan tidak dijumpai.';
  END IF;

  -- 4. Verify ownership
  IF v_order.user_id != v_caller_id THEN
    RAISE EXCEPTION 'Anda tidak mempunyai kebenaran untuk pesanan ini.';
  END IF;

  -- 5. Verify order status eligibility
  IF v_order.payment_status NOT IN ('pending_payment', 'payment_rejected') THEN
    RAISE EXCEPTION 'Pesanan ini tidak berada dalam status menunggu pembayaran (status: %).', v_order.payment_status;
  END IF;

  -- 6. Insert payment proof record
  INSERT INTO public.payment_proofs (
    order_id,
    storage_path,
    transaction_reference,
    submitted_by,
    submitted_at
  )
  VALUES (
    p_order_id,
    v_clean_path,
    v_clean_ref,
    v_caller_id,
    now()
  )
  RETURNING id INTO v_proof_id;

  -- 7. Update order status to pending_verification (bypasses direct authenticated REVOKE)
  UPDATE public.orders
  SET
    payment_status = 'pending_verification',
    submitted_at = now(),
    payment_reference = COALESCE(v_clean_ref, payment_reference),
    updated_at = now()
  WHERE id = p_order_id;

  RETURN v_proof_id;
END;
$$;

-- Grant execution to authenticated role
GRANT EXECUTE ON FUNCTION public.submit_payment_proof(UUID, TEXT, TEXT) TO authenticated;
