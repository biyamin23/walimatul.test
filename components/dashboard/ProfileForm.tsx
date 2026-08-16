"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/validation/auth";
import type { UserProfile } from "@/types";

interface ProfileFormProps {
  profile: UserProfile | null;
  email: string;
}

export default function ProfileForm({ profile, email }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    updateProfile,
    undefined,
  );

  return (
    <form action={formAction} noValidate className="space-y-6 max-w-lg">
      {state?.error && (
        <div
          role="alert"
          className="rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)] font-ui"
        >
          {state.error}
        </div>
      )}
      {state?.success && (
        <div
          role="status"
          className="rounded-[var(--radius)] border border-[var(--success)] bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--success)] font-ui"
        >
          {state.success}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="profile-fullname"
          className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
        >
          Full Name
        </label>
        <input
          id="profile-fullname"
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue={profile?.full_name ?? ""}
          placeholder="Your full name"
          className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
          aria-describedby={
            state?.fieldErrors?.fullName ? "profile-fullname-error" : undefined
          }
        />
        {state?.fieldErrors?.fullName && (
          <p id="profile-fullname-error" className="mt-1.5 text-xs text-[var(--danger)] font-ui" role="alert">
            {state.fieldErrors.fullName[0]}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="profile-phone"
          className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
        >
          Phone Number{" "}
          <span className="text-[var(--text-subtle)] font-normal">(optional)</span>
        </label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={profile?.phone ?? ""}
          placeholder="+60 12-345 6789"
          className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
          aria-describedby={
            state?.fieldErrors?.phone ? "profile-phone-error" : undefined
          }
        />
        {state?.fieldErrors?.phone && (
          <p id="profile-phone-error" className="mt-1.5 text-xs text-[var(--danger)] font-ui" role="alert">
            {state.fieldErrors.phone[0]}
          </p>
        )}
      </div>

      {/* Email — read only */}
      <div>
        <label
          htmlFor="profile-email"
          className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
        >
          Email{" "}
          <span className="text-[var(--text-subtle)] font-normal">(read-only)</span>
        </label>
        <input
          id="profile-email"
          type="email"
          value={email}
          readOnly
          disabled
          className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-warm)] text-[var(--text-muted)] text-sm font-ui cursor-not-allowed opacity-70"
          aria-readonly="true"
        />
        <p className="mt-1.5 text-xs text-[var(--text-subtle)] font-ui">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      <button
        id="btn-save-profile"
        type="submit"
        disabled={isPending}
        className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold font-ui rounded-[var(--radius-lg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
      >
        {isPending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
