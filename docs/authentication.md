# WALIMATUL — Authentication

**Version:** 1.0 (Phase 2 target)

---

## Provider

Supabase Auth — single authentication system for both Admin and Client.

---

## User Roles

| Role | Source | Access |
|------|--------|--------|
| `client` | Default on registration | `/dashboard/*` |
| `admin` | Manually assigned | `/admin/*` and `/dashboard/*` |

- New public registrations always receive `role = 'client'`
- Admin role is never assignable through registration forms
- Role is stored in `profiles.role`, enforced by RLS

---

## Authentication Methods

| Method | Status |
|--------|--------|
| Email / Password | Phase 2 |
| Continue with Google (OAuth) | Phase 2 |
| Forgot Password | Phase 2 |
| Reset Password | Phase 2 |

---

## Auth Flow

### Email / Password

```
Register form → Supabase Auth → profile created (trigger) → /dashboard
Login form → Supabase Auth → /dashboard
```

### Google OAuth

```
Continue with Google → Google → Supabase → /auth/callback
→ resolve/create profile → redirect to intended destination
```

### Preserve Intended Destination

If the user clicks "Use This Template" while unauthenticated:

```
Blush Garden preview → Use This Template
→ Save template selection
→ Login / Register
→ OAuth callback
→ Create Blush Garden draft
→ Invitation editor
```

The user must not be dumped at a generic dashboard after auth.

---

## Google OAuth Setup

1. Create OAuth credentials in Google Cloud Console
2. Add authorized redirect URI: `https://xjaclwiilmmzjiftnnob.supabase.co/auth/v1/callback`
3. Enable Google provider in Supabase Dashboard → Auth → Providers
4. Set Client ID and Secret

---

## Route Protection

| Route | Guard |
|-------|-------|
| `/dashboard/*` | Must have valid session |
| `/admin/*` | Must have session + `profiles.role = 'admin'` |
| `/[slug]` | No auth; only published invitations |

Guards implemented via:
- Next.js middleware (session check)
- Server Component session verification
- Supabase RLS (backend enforcement)

Do not rely on UI-only hiding for security.

---

## Supabase Auth Callback

Route: `/auth/callback`

```ts
// app/auth/callback/route.ts
// Exchange code for session
// Resolve or create profile
// Redirect to intended destination
```

---

## Profile Creation

On new user registration, a database trigger creates a `profiles` row:

```sql
INSERT INTO profiles (id, full_name, avatar_url, role)
VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', 'client');
```

---

## Admin Authentication

No public admin registration endpoint.

Admin access is granted by manually updating `profiles.role = 'admin'` in the Supabase dashboard or via a secure server-side migration.

Admin route: `/admin`
Admin session check: `profiles.role = 'admin'` (server-side, RLS-backed)
