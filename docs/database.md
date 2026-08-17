# WALIMATUL — Database Architecture

## Entity Relationship

```
auth.users
    │
    ├── profiles              (1:1 — auto-created via trigger)
    │
    └── invitations           (1:N — user owns many invitations)
           │
           ├── templates      (N:1 — each invitation uses one template)
           │
           ├── invitation_gallery  (1:N — photos for the invitation)
           │
           ├── rsvps              (1:N — guest responses)
           │
           └── orders             (1:N — payment records)
                  │
                  └── payment_proofs  (1:N — proof of Touch 'n Go payment)
```

---

## Separation of Concerns

| Concern | Table | Notes |
|---------|-------|-------|
| Invitation lifecycle | `invitations.status` | draft → published → archived → expired |
| Payment lifecycle | `orders.payment_status` | pending_payment → pending_verification → paid |
| Financial snapshot | `orders.amount`, `orders.validity_months`, `orders.template_id` | Immutable after creation |
| Template design | `templates/registry.ts` (code) | DB stores metadata only |
| Template metadata | `templates` table | Pricing, validity, active status |

> **Principle:** Wedding data belongs to the invitation. Design belongs to the template.

---

## Tables

### `public.profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | = auth.users.id |
| full_name | TEXT | |
| phone | TEXT | |
| avatar_url | TEXT | |
| role | TEXT | 'client' (default) or 'admin' |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `public.templates`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | |
| slug | TEXT UNIQUE | URL-friendly identifier |
| component_key | TEXT UNIQUE | Registry key in templates/registry.ts |
| price | NUMERIC(10,2) | Display price; orders snapshot at purchase |
| validity_months | INTEGER | 6 for Blush Garden |
| is_active | BOOLEAN | False = hidden from catalogue |
| is_featured | BOOLEAN | |
| sort_order | INTEGER | |

### `public.invitations`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | auth.users — ownership |
| template_id | UUID FK | templates — RESTRICT delete |
| slug | TEXT UNIQUE | Null for drafts; used in public URL |
| status | TEXT | draft \| published \| archived \| expired |
| published_at | TIMESTAMPTZ | Set on admin approval |
| expires_at | TIMESTAMPTZ | paid_at + validity_months |
| ... | | See migration for full schema |

### `public.invitation_gallery`
| Column | Type | Notes |
|--------|------|-------|
| invitation_id | UUID FK | CASCADE delete |
| storage_path | TEXT | Supabase Storage path |
| sort_order | INTEGER | |

### `public.rsvps`
| Column | Type | Notes |
|--------|------|-------|
| invitation_id | UUID FK | CASCADE delete |
| guest_name | TEXT | |
| attendance | TEXT | 'attending' or 'not_attending' |
| pax | INTEGER | 0 if not_attending; ≥1 if attending |

### `public.orders`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| receipt_number | TEXT UNIQUE | Null until paid; format WAL-2026-000001 |
| user_id | UUID FK | RESTRICT delete |
| invitation_id | UUID FK | RESTRICT delete |
| template_id | UUID FK | Snapshot |
| amount | NUMERIC(10,2) | Snapshot |
| currency | TEXT | 'MYR' |
| payment_method | TEXT | 'tng_ewallet_qr' |
| payment_status | TEXT | pending_payment → pending_verification → paid |
| validity_months | INTEGER | Snapshot |
| reviewed_by | UUID FK | Admin who approved/rejected |
| paid_at | TIMESTAMPTZ | Set on approval |
| rejection_reason | TEXT | Set on rejection |

### `public.payment_proofs`
| Column | Type | Notes |
|--------|------|-------|
| order_id | UUID FK | CASCADE delete |
| storage_path | TEXT | Supabase Storage (private bucket) |
| transaction_reference | TEXT | TNG transaction ID |
| submitted_by | UUID FK | RESTRICT |

**Constraint:** At least one of `storage_path` or `transaction_reference` must be non-null.

---

## RLS Summary

| Table | anon SELECT | auth SELECT | auth INSERT | auth UPDATE | Admin |
|-------|------------|------------|------------|------------|-------|
| profiles | ✗ | own only | via trigger | own (role protected) | postgres |
| templates | active only | active only | ✗ | ✗ | postgres |
| invitations | ✗ (Phase 6+) | own only | own | own (lifecycle protected) | postgres |
| invitation_gallery | ✗ (Phase 6+) | own (via invite) | own | own | postgres |
| rsvps | ✗ (Phase 7+) | own (via invite) | ✗ (Phase 7+) | ✗ | postgres |
| orders | ✗ | own only | own (pending_payment initial) | limited (no admin fields) | postgres |
| payment_proofs | ✗ | own (via order) | own (own pending orders) | ✗ | postgres |

---

## Financial Security Layers

Client cannot set `payment_status = 'paid'` because:
1. **Column-level REVOKE:** `REVOKE UPDATE (payment_status, ...) ON orders FROM authenticated`
2. **BEFORE UPDATE trigger:** `protect_order_admin_fields()` raises exception
3. **RLS WITH CHECK:** INSERT policy forces `payment_status = 'pending_payment'`
4. **Application layer:** Server Actions validate all mutations

---

## Migrations Applied Order

```
20260816000001_profiles.sql          Phase 2 — profiles, RLS, auto-create trigger
20260816000002_role_escalation.sql   Phase 2 — role escalation protection
20260817000001_templates.sql         Phase 3 — templates table
20260817000002_invitations.sql       Phase 3 — invitations table
20260817000003_gallery.sql           Phase 3 — invitation_gallery table
20260817000004_rsvps.sql             Phase 3 — rsvps table
20260817000005_orders.sql            Phase 3 — orders table
20260817000006_payment_proofs.sql    Phase 3 — payment_proofs table
20260817000007_seed_templates.sql    Phase 3 — Blush Garden seed
```

---

## Storage Buckets

| Bucket | Access | Path Pattern | Usage |
|--------|--------|-------------|-------|
| `invitation-gallery` | Private (signed URLs) | `{user_id}/{invitation_id}/{filename}` | Invitation photos |
| `payment-proofs` | Private (never public) | `{user_id}/{order_id}/{filename}` | TNG payment evidence |

---

## Admin Promotion (SQL Editor)

```sql
UPDATE public.profiles
SET role = 'admin', updated_at = now()
WHERE id = '<auth-user-uuid>';
```
