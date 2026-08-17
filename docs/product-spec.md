# WALIMATUL — Product Specification

## Brand

**WALIMATUL by nasuhalias**

- Domain: `walimatul.my`
- Support WhatsApp: `+60148412018`
- Support URL: `https://wa.me/60148412018`

---

## Product: Blush Garden

| Property | Value |
|----------|-------|
| Template | Blush Garden |
| Price | RM49.00 |
| Validity | 6 months |
| Payment model | One payment. No recurring fees. |
| Payment method | Touch 'n Go eWallet QR |

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

## Future Plans

- 12-month validity tier
- Additional templates (Royal Gold, Minimal White, Malay Heritage)
- PDF receipt download
- Approval email automation
- Admin bulk review interface
