-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 013: Admin Payment Approval & Rejection RPCs
-- Created: 2026-08-17
-- Depends on: Migration 001 (profiles), Migration 007 (orders), Migration 008 (payment_proofs), Migration 010 (invitations)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Sequence for concurrency-safe sequential receipt numbers (WAL-YYYY-000001).
--   2. Atomic PostgreSQL RPC for Admin payment approval:
--      - Validates caller is Admin.
--      - Validates order is in pending_verification and proof exists.
--      - Generates receipt number.
--      - Updates order to 'paid'.
--      - Publishes linked invitation and sets published_at / expires_at.
--      - Handles double-approval / idempotency safely.
--   3. Atomic PostgreSQL RPC for Admin payment rejection:
--      - Validates caller is Admin.
--      - Records rejection reason.
--      - Transitions order to 'payment_rejected' without publishing invitation.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Receipt Sequence ───────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.receipt_number_seq START 1;

-- ── 2. Admin Payment Approval RPC ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_approve_payment_order(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id         UUID;
  v_is_admin          BOOLEAN;
  v_order             RECORD;
  v_invitation        RECORD;
  v_proof_count       INTEGER;
  v_receipt_number    TEXT;
  v_published_at      TIMESTAMPTZ;
  v_expires_at        TIMESTAMPTZ;
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
    RAISE EXCEPTION 'Akses dinafikan: Hanya pentadbir boleh mengesahkan pembayaran.';
  END IF;

  -- 3. Lock and fetch order
  SELECT id, user_id, invitation_id, amount, validity_months, payment_status, receipt_number, paid_at
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pesanan tidak dijumpai.';
  END IF;

  -- 4. Idempotency Check: if already paid, return existing state gracefully
  IF v_order.payment_status = 'paid' THEN
    SELECT status, published_at, expires_at
    INTO v_invitation
    FROM public.invitations
    WHERE id = v_order.invitation_id;

    RETURN jsonb_build_object(
      'order_id', v_order.id,
      'payment_status', 'paid',
      'receipt_number', v_order.receipt_number,
      'published_at', v_invitation.published_at,
      'expires_at', v_invitation.expires_at,
      'already_approved', true
    );
  END IF;

  -- 5. Validate status eligibility
  IF v_order.payment_status != 'pending_verification' THEN
    RAISE EXCEPTION 'Pesanan mesti dalam status menunggu pengesahan (status semasa: %).', v_order.payment_status;
  END IF;

  -- 6. Verify at least one payment proof exists
  SELECT count(*) INTO v_proof_count
  FROM public.payment_proofs
  WHERE order_id = p_order_id;

  IF v_proof_count = 0 THEN
    RAISE EXCEPTION 'Pesanan tidak mempunyai rekod bukti pembayaran.';
  END IF;

  -- 7. Lock and fetch linked invitation
  SELECT id, status, published_at, expires_at
  INTO v_invitation
  FROM public.invitations
  WHERE id = v_order.invitation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Jemputan berkaitan tidak dijumpai.';
  END IF;

  -- 8. Generate sequence-based receipt number (WAL-YYYY-000001)
  v_receipt_number := 'WAL-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('public.receipt_number_seq')::text, 6, '0');
  v_published_at := now();
  v_expires_at := v_published_at + (v_order.validity_months * INTERVAL '1 month');

  -- 9. Update order to 'paid'
  UPDATE public.orders
  SET
    payment_status   = 'paid',
    paid_at          = v_published_at,
    reviewed_at      = v_published_at,
    reviewed_by      = v_caller_id,
    receipt_number   = v_receipt_number,
    rejection_reason = NULL,
    updated_at       = v_published_at
  WHERE id = p_order_id;

  -- 10. Publish invitation and activate validity period
  UPDATE public.invitations
  SET
    status       = 'published',
    published_at = v_published_at,
    expires_at   = v_expires_at,
    updated_at   = v_published_at
  WHERE id = v_order.invitation_id;

  RETURN jsonb_build_object(
    'order_id', v_order.id,
    'payment_status', 'paid',
    'receipt_number', v_receipt_number,
    'published_at', v_published_at,
    'expires_at', v_expires_at,
    'already_approved', false
  );
END;
$$;

-- ── 3. Admin Payment Rejection RPC ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_reject_payment_order(
  p_order_id UUID,
  p_reason   TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id   UUID;
  v_is_admin    BOOLEAN;
  v_order       RECORD;
  v_clean_reason TEXT;
  v_reviewed_at TIMESTAMPTZ;
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
    RAISE EXCEPTION 'Akses dinafikan: Hanya pentadbir boleh menolak pembayaran.';
  END IF;

  -- 3. Validate rejection reason
  v_clean_reason := NULLIF(TRIM(p_reason), '');
  IF v_clean_reason IS NULL OR LENGTH(v_clean_reason) < 5 THEN
    RAISE EXCEPTION 'Sila nyatakan sebab penolakan yang sah (sekurang-kurangnya 5 aksara).';
  END IF;

  IF LENGTH(v_clean_reason) > 500 THEN
    RAISE EXCEPTION 'Sebab penolakan tidak boleh melebihi 500 aksara.';
  END IF;

  -- 4. Lock and fetch order
  SELECT id, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pesanan tidak dijumpai.';
  END IF;

  IF v_order.payment_status = 'paid' THEN
    RAISE EXCEPTION 'Pesanan yang telah dibayar dan disahkan tidak boleh ditolak.';
  END IF;

  v_reviewed_at := now();

  -- 5. Update order to 'payment_rejected'
  UPDATE public.orders
  SET
    payment_status   = 'payment_rejected',
    reviewed_at      = v_reviewed_at,
    reviewed_by      = v_caller_id,
    rejection_reason = v_clean_reason,
    paid_at          = NULL,
    receipt_number   = NULL,
    updated_at       = v_reviewed_at
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'order_id', v_order.id,
    'payment_status', 'payment_rejected',
    'rejection_reason', v_clean_reason,
    'reviewed_at', v_reviewed_at
  );
END;
$$;

-- Grant execution to authenticated role (internal check enforces role = 'admin')
GRANT EXECUTE ON FUNCTION public.admin_approve_payment_order(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_payment_order(UUID, TEXT) TO authenticated;
