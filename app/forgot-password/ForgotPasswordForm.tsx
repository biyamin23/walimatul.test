"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { sendPasswordReset } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/validation/auth";

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    sendPasswordReset,
    undefined,
  );

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
          Reset your password
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-ui">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Success state */}
      {state?.success ? (
        <div
          role="status"
          className="rounded-[var(--radius-lg)] border border-[var(--success)] bg-[var(--primary-soft)] px-5 py-4 text-sm text-[var(--success)] font-ui text-center leading-relaxed"
        >
          {state.success}
        </div>
      ) : (
        <>
          {state?.error && (
            <div
              role="alert"
              className="mb-4 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)] font-ui"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} noValidate>
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
              >
                Email
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                aria-describedby={
                  state?.fieldErrors?.email ? "forgot-email-error" : undefined
                }
              />
              {state?.fieldErrors?.email && (
                <p
                  id="forgot-email-error"
                  className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                  role="alert"
                >
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <button
              id="btn-send-reset"
              type="submit"
              disabled={isPending}
              className="w-full mt-5 px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold font-ui rounded-[var(--radius-lg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
            >
              {isPending ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        </>
      )}

      <p className="text-center text-sm text-[var(--text-muted)] mt-6 font-ui">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-[var(--primary)] font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
        >
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
