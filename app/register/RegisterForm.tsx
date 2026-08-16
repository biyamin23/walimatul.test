"use client";

import { useActionState, useTransition } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { signUpWithEmail, signInWithGoogle } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/validation/auth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    signUpWithEmail,
    undefined,
  );
  const [isGooglePending, startGoogleTransition] = useTransition();

  function handleGoogleSignIn() {
    startGoogleTransition(async () => {
      await signInWithGoogle("/dashboard");
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex flex-col items-center leading-none rounded focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-4"
          aria-label={`${BRAND.name} — Go to homepage`}
        >
          <span className="font-display text-3xl font-bold text-[var(--primary)]">
            {BRAND.name}
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[var(--gold)] font-ui">
            {BRAND.signature}
          </span>
        </Link>
        <h1 className="font-display text-2xl text-[var(--text)] mt-6 mb-1">
          Create your account
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-ui">
          Start creating beautiful digital wedding invitations
        </p>
      </div>

      {/* Form messages */}
      {state?.error && (
        <div
          role="alert"
          className="mb-4 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)] font-ui"
        >
          {state.error}
        </div>
      )}
      {state?.success && (
        <div
          role="status"
          className="mb-4 rounded-[var(--radius)] border border-[var(--success)] bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--success)] font-ui"
        >
          {state.success}
        </div>
      )}

      {/* Google OAuth */}
      <button
        id="btn-google-register"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGooglePending || isPending}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-warm)] hover:border-[var(--primary)] transition-all text-sm font-medium text-[var(--text)] font-ui disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 mb-5"
        aria-label="Continue with Google"
      >
        <GoogleIcon />
        {isGooglePending ? "Redirecting to Google…" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5" aria-hidden="true">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--text-subtle)] font-ui uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Registration form */}
      <form action={formAction} noValidate>
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="register-fullname"
              className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
            >
              Full Name <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              id="register-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              aria-describedby={
                state?.fieldErrors?.fullName
                  ? "register-fullname-error"
                  : undefined
              }
            />
            {state?.fieldErrors?.fullName && (
              <p
                id="register-fullname-error"
                className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                role="alert"
              >
                {state.fieldErrors.fullName[0]}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
            >
              Email <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              aria-describedby={
                state?.fieldErrors?.email ? "register-email-error" : undefined
              }
            />
            {state?.fieldErrors?.email && (
              <p
                id="register-email-error"
                className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                role="alert"
              >
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
            >
              Password <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              aria-describedby={
                state?.fieldErrors?.password
                  ? "register-password-error"
                  : undefined
              }
            />
            {state?.fieldErrors?.password && (
              <p
                id="register-password-error"
                className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                role="alert"
              >
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="register-confirm-password"
              className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
            >
              Confirm Password <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Repeat your password"
              className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              aria-describedby={
                state?.fieldErrors?.confirmPassword
                  ? "register-confirm-error"
                  : undefined
              }
            />
            {state?.fieldErrors?.confirmPassword && (
              <p
                id="register-confirm-error"
                className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                role="alert"
              >
                {state.fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--text-subtle)] font-ui leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[var(--primary)]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-[var(--primary)]"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <button
          id="btn-create-account"
          type="submit"
          disabled={isPending || isGooglePending}
          className="w-full mt-5 px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold font-ui rounded-[var(--radius-lg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
        >
          {isPending ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--text-muted)] mt-6 font-ui">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--primary)] font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
