# WALIMATUL — Architecture Overview

## System Architecture

```
Next.js 16.3.1 (App Router)
├── proxy.ts                    — Route protection + session refresh
├── app/                        — Pages and route handlers
│   ├── (marketing)             — Homepage, /templates, /pricing
│   ├── auth/callback/          — Supabase OAuth + email callback
│   ├── dashboard/              — Protected client area
│   └── admin/                  — Protected admin area
├── components/                 — Reusable UI components
├── lib/
│   ├── supabase/               — Browser + server Supabase clients
│   ├── auth/                   — Auth guards, getClaims(), permissions
│   ├── data/                   — Server-side data access layer
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

## Template Architecture

```
DB: templates.component_key = 'blush-garden'
        ↓
templates/registry.ts → TEMPLATE_REGISTRY['blush-garden'] → BlushGardenTemplate
        ↓
<BlushGardenTemplate data={InvitationTemplateData} mode="live" />
```

**Rule:** DB stores metadata. Design lives in code. Never store HTML/React in Supabase.

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
// lib/data/templates.ts (example)
import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getActiveTemplates() {
  const supabase = await createClient();
  const { data } = await supabase.from("templates").select("*").eq("is_active", true);
  return data ?? [];
}
```

RLS enforces ownership — the server client inherits the user's JWT session.

---

## Security Layers (by concern)

### Role Escalation (profiles)
1. `REVOKE UPDATE (role) FROM authenticated`
2. `prevent_role_escalation()` trigger
3. Server Action Zod schema (no role field)
4. No role-modifying UI

### Invitation Self-Publishing
1. `protect_invitation_lifecycle_fields()` trigger
2. No UPDATE policy for `published` status transitions from client

### Payment Status Fraud
1. `REVOKE UPDATE (payment_status, reviewed_by, paid_at, ...) FROM authenticated`
2. `protect_order_admin_fields()` trigger
3. INSERT policy forces `payment_status = 'pending_payment'`
4. Future Server Actions validate all transitions

---

## Future Phases

| Phase | Focus |
|-------|-------|
| 4 | Blush Garden full renderer |
| 5 | Invitation editor + live preview |
| 6 | Public invitation route + guest view |
| 7 | Guest RSVP submission |
| 8 | RSVP dashboard (client) |
| 9+ | Manual payment UI, admin approval, receipt, email |
