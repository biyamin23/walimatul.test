# WALIMATUL — Product Specification

## Brand

**WALIMATUL by nasuhalias**

- Domain: `walimatul.my`
- Support WhatsApp: `+60148412018`
- Support URL: `https://wa.me/60148412018`

---

## Product Model & Templates

| Property | Value |
|---|---|
| Coded Template | Blush Garden (RM49.00 / 6 months) |
| Hybrid Templates | Configurable (e.g. Royal Gold, RM69 / 12 months) |
| Payment model | One-time payment per invitation. No recurring subscriptions. |
| Payment method | Touch 'n Go eWallet QR transfer + screenshot proof verification |
| Template Engine | Coded React renderer OR Hybrid Editorial configurable renderer |
| Asset Storage | Supabase Storage `template-assets` bucket |
| Deletion Policy | Safe archive; referenced templates cannot be hard-deleted |

---

## Payment Flow

```
Client completes invitation
↓
Reviews order (template, amount, validity)
↓
Sees WALIMATUL Touch 'n Go payment QR
↓
Pays using Touch 'n Go eWallet
↓
Uploads payment proof (screenshot) and/or transaction reference
↓
Order → pending_verification
↓
Admin reviews payment proof
↓
Admin approves or rejects
```

### On Approval
```
order.payment_status = 'paid'
order.paid_at        = now()
order.reviewed_by    = admin user
order.receipt_number = 'WAL-{YYYY}-{seq}'
↓
invitation.status      = 'published'
invitation.published_at = now()
invitation.expires_at   = paid_at + validity_months
↓
Receipt generated
Invitation QR generated (https://walimatul.my/{slug})
Approval email sent to client
```

### On Rejection
```
order.payment_status   = 'payment_rejected'
order.rejection_reason = reason text
```

---

## Payment QR vs Invitation QR

| | Payment QR | Invitation QR |
|-|------------|--------------|
| Purpose | Client pays WALIMATUL | Guests open the invitation |
| Content | WALIMATUL Touch 'n Go account | https://walimatul.my/{slug} |
| Shown when | Checkout / payment step | After admin approval |
| Controlled by | Admin / platform settings | Generated per invitation |

These are two distinct QR codes. Never conflate them in code or UI.

Use explicit naming: `paymentQr`, `invitationQr`.

---

## Invitation Lifecycle

```
draft
  ↓ (editor)
published   ← requires admin payment approval
  ↓
archived   ← client archives
expired    ← now() > expires_at
```

## Order Payment Lifecycle

```
pending_payment
  ↓ (client submits proof)
pending_verification
  ↓ (admin approves)       ↓ (admin rejects)
paid                  payment_rejected
```

---

## Invitation Validity

| Template | Validity |
|----------|---------|
| Blush Garden (initial) | 6 months |
| Future premium plans | 12 months |

Validity must NOT be:
- "Forever"
- "Lifetime"

Expiry must be calculated from payment approval date.

---

## Authentication

| User | Auth required | Role |
|------|--------------|------|
| Client (invitation owner) | Yes | client |
| Admin | Yes | admin |
| Wedding guest | No (anonymous) | — |

---

## Receipt Format

```
WALIMATUL by nasuhalias

Receipt Number: WAL-2026-000001
Client: [full name]
Invitation: [groom] & [bride]
Template: Blush Garden
Amount: RM49.00
Payment Method: Touch 'n Go eWallet
Paid Date: [paid_at]
Validity: 6 months
Expiry Date: [expires_at]
```

---

## Admin Operations Specification (Phase 11B)

### 1. Customer Accounts (`/admin/users`)
- Real-time customer overview with search by name and phone.
- Aggregated client metrics: total invitations, completed paid orders, lifetime spend (LTV).
- Deep customer profile view (`/admin/users/[id]`) with linked wedding invitations and transaction history.

### 2. Invitation Management (`/admin/invitations`)
- Multi-dimensional filtering: lifecycle status (`published`, `draft`, `expired`), design template, payment status (`paid`, `pending_verification`, `pending_payment`, `payment_rejected`, `no_order`).
- Search by groom, bride, or public slug.
- 360-degree invitation inspection (`/admin/invitations/[id]`):
  - Overview: couple names, venue, event timing, slug, lifecycle timestamps.
  - Client & Template relationships: direct links to customer profile and template editor.
  - Commercial relation: snapshot order amount, snapshot validity months, payment status, receipt number.
  - Feature summary: photo gallery count, live countdown, guest wishes, YouTube background music, opening cover.
  - RSVP summary: total responses, attending, not attending, total pax, wishes count (with guest privacy preservation).

### 3. Expiry Extension Business Rules
- Manual admin extension preserves historical duration by adding months (+1, +3, +6, +12) directly to existing `expires_at`.
- Custom date selection must be strictly in the future relative to the current expiration date.
- Atomic mutation handled via security definer RPC `admin_extend_invitation_expiry`.

---

## Admin Operations Specification (Phase 11C)

### 1. Platform Settings (`/admin/settings`)
- Safe operational configuration without secrets in database.
- Support WhatsApp: automated generation of international `https://wa.me/` links and custom UI display formatting.
- Default Invitation Validity: sets default validity (in months) for newly created templates/packages without mutating historical snapshot records.
- Gallery Photos Limit: configurable photo limit (default 12) to ensure guest invitation performance.
- Manual Payment Instructions: plain text guidance for client checkout experience.
- Maintenance Notice: toggleable system notice banner.

### 2. Client Announcements (`/admin/announcements`)
- Plain text communication engine targeting client dashboards (`/dashboard`).
- Full lifecycle management: `draft`, `active`, `archived`.
- Precision scheduling: optional start and end date-times evaluated against client local / server time.
- Security & RLS: client reads strictly filtered to active scheduled announcements.

### 3. Persistent Admin Audit Logs (`/admin/audit-logs`)
- Append-only audit trail logging administrative changes across Settings, Announcements, Invitations, Payments, and Templates.
- Interactive change inspector comparing before-and-after states.
- Immutability guaranteed at database RLS level (no delete or edit access).

---

## Future Plans

- PDF receipt download
- Approval email automation
- Admin bulk review interface
- Reports & CSV Export (Phase 11D)


