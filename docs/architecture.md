# WALIMATUL — Architecture Overview

## System Architecture

```
Next.js 16.3.1 (App Router)
├── proxy.ts                    — Route protection + session refresh
├── app/                        — Pages and route handlers
│   ├── (marketing)             — Homepage, /templates, /pricing
│   ├── auth/callback/          — Supabase OAuth + email callback
│   ├── dashboard/              — Protected client area
│   │   ├── invitations/        — Client invitation drafts list
│   │   │   └── [id]/edit/      — Invitation editor with live preview
│   │   └── profile/            — User profile management
│   └── admin/                  — Protected admin area
├── components/                 — Reusable UI components
│   └── invitations/            — InvitationEditor, Form, Cards, SlugField, SaveStatus
├── lib/
│   ├── supabase/               — Browser + server Supabase clients
│   ├── auth/                   — Auth guards, getClaims(), permissions
│   ├── data/                   — Server-side data access layer
│   ├── templates/              — Template mappers & deterministic formatters
│   └── validation/             — Zod schemas
├── templates/                  — Invitation template system
│   ├── types.ts                — Shared InvitationTemplateData contract
│   ├── registry.ts             — component_key → React component map
│   └── blush-garden/           — Blush Garden template component
├── types/
│   ├── database.ts             — All DB row types, enums, Database namespace
│   └── index.ts                — Re-export convenience
└── supabase/migrations/        — All tracked DB migrations
```

---

## Authentication Architecture

```
Browser → proxy.ts (getClaims JWT verify) → App Router
                                                ↓
                                        layout.tsx (requireAuth/Admin)
                                                ↓
                                        Server Component (read profile)
```

- `getClaims()` validates JWT cryptographically — never use `getSession()` for page protection
- Guests are unauthenticated; they access published invitations directly (Phase 6)
- Roles: `client` (default) | `admin` (manual promotion only)

---

## Template & Editor Architecture

```
Editor Form State (local React state)
        ↓
formValuesToTemplateData() (instant transformation)
        ↓
<BlushGardenTemplate data={liveTemplateData} mode="editor" />
        ↓ (debounced 1200ms or explicit Save)
updateOwnInvitationAction() (Zod validation + RLS update)
        ↓
invitations table in Supabase
```

**Key Architectural Rules:**
1. **Wedding data belongs to the invitation. Design belongs to the template.**
2. The template renderer receives normalized `InvitationTemplateData` and never accesses database rows or editor state directly.
3. Live preview updates immediately from local state without waiting for network roundtrips.

---

## Payment Architecture

```
WALIMATUL Touch 'n Go Payment QR
        ↓ (client scans and pays)
Client uploads payment proof (image/reference)
        ↓
payment_proofs INSERT → orders.payment_status → 'pending_verification'
        ↓
Admin reviews in dashboard
        ↓ approve                    ↓ reject
orders.payment_status = 'paid'   payment_status = 'payment_rejected'
invitations.status = 'published'  rejection_reason = '...'
invitations.expires_at = now + 6mo
receipt_number = 'WAL-YYYY-seq'
```

**Important:** Payment QR ≠ Invitation QR  
- Payment QR → WALIMATUL TNG account (shown at checkout)  
- Invitation QR → `https://walimatul.my/{slug}` (shown after approval)

---

## Data Access Pattern

All DB access from Server Components uses the server Supabase client:

```ts
// lib/data/invitations.ts (example)
import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getOwnInvitations() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return [];

  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
```

Multi-tenant data isolation is enforced both at the database level via RLS and at the data access layer via explicit `user_id = auth.uid()` query scoping.

---

## Security Layers (by concern)

### Role Escalation (profiles)
1. `REVOKE UPDATE (role) FROM authenticated`
2. `prevent_role_escalation()` trigger
3. Server Action Zod schema (no role field)
4. No role-modifying UI

### Invitation Self-Publishing & Lifecycle Protection
1. `protect_invitation_lifecycle_fields()` trigger
2. Server Actions strictly whitelist editable fields, excluding `status`, `published_at`, and `expires_at`
3. No client can publish without administrative payment verification

### Ownership & Slug Conflict Security
1. RLS enforces `user_id = auth.uid()` on all SELECT, INSERT, UPDATE, and DELETE queries
2. Server Actions verify user authentication via `getClaims()` and filter by `user_id`
3. Unique constraint on `invitations.slug` in database + realtime availability check with reserved route blacklist

### Payment Status Fraud & Proof Protection
1. `REVOKE UPDATE (payment_status, reviewed_by, paid_at, ...) FROM authenticated`
2. `protect_order_admin_fields()` trigger prevents unauthorized modification of admin/financial fields
3. INSERT policy forces `payment_status = 'pending_payment'`
4. Transition from `pending_payment` / `payment_rejected` to `pending_verification` is strictly managed via PostgreSQL RPC `submit_payment_proof`
5. Payment proof storage bucket `payment-proofs` is strictly private with path-level RLS (`{user_id}/{order_id}/{timestamp}-{filename}`)
6. Partial unique index `idx_orders_active_unpaid` enforces at most one active unpaid order per invitation
7. Atomic Admin approval via PostgreSQL RPC `admin_approve_payment_order`:
   - Enforces `profiles.role = 'admin'`
   - Acquires `FOR UPDATE` locks on `orders` and `invitations`
   - Idempotent: safe against double-clicks/retries
   - Generates sequential receipt numbers (`WAL-YYYY-000001`) via sequence `public.receipt_number_seq`
   - Transitions order to `paid`, sets `paid_at`, `reviewed_at`, `reviewed_by`
   - Publishes invitation (`status = 'published'`, `published_at = now()`, `expires_at = published_at + order.validity_months`)
8. Admin rejection via PostgreSQL RPC `admin_reject_payment_order`:
   - Transitions order to `payment_rejected`, stores sanitized `rejection_reason`
   - Leaves invitation unpublished and private
   - Client can resubmit new proof, transitioning order back to `pending_verification`

---

## Development Phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Brand, Typography & Landing Page | ✅ Complete |
| 2 | Auth, Profiles & SSR Security | ✅ Complete |
| 3 | Core Data Model & Manual Payment Infrastructure | ✅ Complete |
| 4 | Blush Garden Production Renderer | ✅ Complete |
| 4.1 | Mobile Preview Toolbar Refinement | ✅ Complete |
| 5 | Invitation Editor, Draft Creation & Live Preview | ✅ Complete |
| 5.1 | Form UX Standardization & Responsive Overflow | ✅ Complete |
| 5.2 | Date/Time & RSVP Form Responsive Fix | ✅ Complete |
| 5.3 | Final Editor Form Layout Polish | ✅ Complete |
| 5.4 | Final iOS Date Input Width Fix | ✅ Complete |
| 6 | Public Invitation Route & Guest View | ✅ Complete |
| 7 | Guest RSVP Submission & Client RSVP Dashboard | ✅ Complete |
| 8 | Payment UI & Proof Upload (Client Flow) | ✅ Complete |
| 8.1 | Multi-Tenant Data Isolation Security Hotfix | ✅ Complete |
| 9 | Admin Payment Approval & Invitation Activation | ✅ Complete |
| 10 | Receipt PDF & Approval Email Notification | Next |

