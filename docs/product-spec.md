# WALIMATUL — Product Specification

**Version:** 1.0 (Phase 1)
**Brand:** WALIMATUL by nasuhalias
**Domain:** walimatul.my
**Support:** +60148412018 | https://wa.me/60148412018

---

## Overview

WALIMATUL is a digital wedding invitation SaaS for Malaysian couples. Clients create beautiful, responsive digital invitations, publish them at a unique URL, and share them with guests. Guests do not require accounts. RSVPs are tracked privately through the client dashboard.

---

## Core Philosophy

> **Wedding data belongs to the invitation. Design belongs to the template.**

- Elegant, romantic, modern, premium
- Mobile-first
- Malaysian-friendly
- Simple and accessible

---

## User Types

| Type | Auth | Can |
|------|------|-----|
| Admin | Required | Manage platform, templates, users, orders |
| Client | Required | Create, edit, publish, share invitations; track RSVPs |
| Guest | None | View published invitation; submit RSVP |

Guests must never be required to create an account to RSVP.

---

## Client Journey

```
Landing → Browse Templates → Preview → Use This Template
→ Register/Login → Enter Wedding Details → Live Preview
→ Choose Slug → Review → Pay → Publish → Share
→ Guests RSVP → Client Tracks RSVPs
```

---

## MVP Acceptance Test

### Client

1. Register/Login
2. Choose Blush Garden template
3. Create Abu & Hana invitation
4. Add event information
5. Choose slug `abu-hana`
6. Publish

Result: `walimatul.my/abu-hana` is live.

### Guest

1. Open `walimatul.my/abu-hana`
2. Press Open Invitation
3. Read wedding information
4. RSVP Attending — 2 Pax
5. Submit → receive confirmation

### Client

1. Login → Dashboard → Abu & Hana → RSVP
2. See guest name, Attending, 2 Pax

---

## Security Requirements

- Guest cannot access dashboard
- Guest cannot browse RSVP records
- Client cannot access admin
- Client A cannot edit Client B's invitation
- Client cannot promote themselves to admin
- Draft invitations cannot load publicly
- Service-role credentials are never shipped to browser
- Reserved slugs cannot become invitation URLs

---

## Out of Scope for V1

- Drag/drop visual builder
- Guest accounts
- Personalized guest links
- Seating plans
- QR event check-in
- Vendor marketplace
- Custom domains
- Arbitrary font/music uploads
- Advanced analytics
- AI invitation generator

---

## Development Phases

| Phase | Focus |
|-------|-------|
| 1 | Foundation, design system, landing page |
| 2 | Authentication (Supabase Auth, Google OAuth) |
| 3 | Database schema, migrations, RLS |
| 4 | Blush Garden template |
| 5 | Invitation editor |
| 6 | Public invitation route |
| 7 | Guest RSVP |
| 8 | RSVP dashboard |
| 9 | Marketing page polish |
| 10 | Gallery + music |
| 11 | Payment integration |
| 12 | Admin dashboard |
