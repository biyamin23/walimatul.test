# WALIMATUL — Database Schema

**Version:** 1.0 (Phase 3 target)

All migrations are in `supabase/migrations/`.

---

## Tables

### `profiles`

Extends `auth.users`. Created automatically on registration.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | References `auth.users.id` |
| `full_name` | TEXT | |
| `phone` | TEXT | |
| `avatar_url` | TEXT | |
| `role` | TEXT | `'client'` (default), `'admin'` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**RLS:** Clients can read/write own row. Clients cannot update `role`.

---

### `templates`

Template metadata. Layout is in code (`component_key`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | TEXT | |
| `slug` | TEXT UNIQUE | |
| `description` | TEXT | |
| `category` | TEXT | |
| `component_key` | TEXT UNIQUE | Maps to `templates/registry.ts` |
| `thumbnail_url` | TEXT | |
| `preview_url` | TEXT | |
| `price` | NUMERIC | Default `0` |
| `is_active` | BOOLEAN | Default `true` |
| `is_featured` | BOOLEAN | Default `false` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**RLS:** Public read (active only). Admin full access.

---

### `invitations`

Client wedding data. Template-independent.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID | FK → `profiles.id` |
| `template_id` | UUID | FK → `templates.id` |
| `slug` | TEXT UNIQUE | Public URL segment |
| `groom_name` | TEXT | |
| `groom_short_name` | TEXT | |
| `bride_name` | TEXT | |
| `bride_short_name` | TEXT | |
| `wedding_date` | DATE | |
| `start_time` | TIME | |
| `end_time` | TIME | |
| `venue_name` | TEXT | |
| `venue_address` | TEXT | |
| `google_maps_url` | TEXT | |
| `waze_url` | TEXT | |
| `opening_message` | TEXT | |
| `invitation_message` | TEXT | |
| `closing_message` | TEXT | |
| `rsvp_enabled` | BOOLEAN | Default `true` |
| `rsvp_deadline` | DATE | |
| `max_pax` | INTEGER | Default `5` |
| `allow_guest_message` | BOOLEAN | Default `true` |
| `music_enabled` | BOOLEAN | Default `false` |
| `music_key` | TEXT | |
| `status` | TEXT | `draft` → `published` |
| `published_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Status flow (pre-payment):** `draft → published`
**Status flow (post-payment):** `draft → unpaid → paid → published`

**RLS:** Clients access own invitations only. Public read for `status = 'published'` only.

---

### `invitation_gallery`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `invitation_id` | UUID | FK → `invitations.id` |
| `storage_path` | TEXT | Supabase Storage path |
| `sort_order` | INTEGER | Default `0` |
| `created_at` | TIMESTAMPTZ | |

**Storage bucket:** `invitation-images`
**Path pattern:** `{user_id}/{invitation_id}/{filename}`
**Max images:** 10 (configurable)

---

### `rsvps`

Guest RSVP submissions. No auth required to insert.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `invitation_id` | UUID | FK → `invitations.id` |
| `guest_name` | TEXT NOT NULL | |
| `attendance` | TEXT NOT NULL | `attending` or `not_attending` |
| `pax` | INTEGER | `0` if not attending; `1–max_pax` if attending |
| `message` | TEXT | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**RLS:** Anyone can insert for a published invitation. Only the invitation owner can select.

---

### `orders`

Payment records. One per invitation payment attempt.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID | FK → `profiles.id` |
| `invitation_id` | UUID | FK → `invitations.id` |
| `amount` | NUMERIC NOT NULL | |
| `currency` | TEXT | Default `'MYR'` |
| `payment_provider` | TEXT | TBD |
| `payment_reference` | TEXT | Provider transaction ID |
| `payment_status` | TEXT | `pending`, `paid`, `failed`, `refunded` |
| `created_at` | TIMESTAMPTZ | |
| `paid_at` | TIMESTAMPTZ | |

---

## Reserved Slugs

The following slugs may never be used as invitation URLs:

`admin`, `api`, `auth`, `billing`, `dashboard`, `forgot-password`, `login`, `logout`, `pricing`, `profile`, `register`, `reset-password`, `settings`, `signin`, `signup`, `support`, `templates`

Validated both client-side and server-side before saving.
