"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/constants/brand";
import { resetPassword } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/validation/auth";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    resetPassword,
    undefined,
  );

  useEffect(() => {
    if (state?.redirectTo) {
      const timer = setTimeout(() => router.push(state.redirectTo!), 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.redirectTo, router]);

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
          Set a new password
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-ui">
          Choose a strong password for your account
        </p>
      </div>

      {state?.success ? (
        <div
          role="status"
          className="rounded-[var(--radius-lg)] border border-[var(--success)] bg-[var(--primary-soft)] px-5 py-4 text-sm text-[var(--success)] font-ui text-center leading-relaxed"
        >
          {state.success}
          <br />
          <span className="opacity-70">Redirecting to sign in…</span>
        </div>
      ) : (
        <>
          {state?.error && (
            <div
              role="alert"
              className="mb-4 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)] font-ui"
            >
              {state.error}{" "}
              <Link href="/forgot-password" className="underline font-semibold">
                Request new link
              </Link>
            </div>
          )}

          <form action={formAction} noValidate>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
                >
                  New Password
                </label>
                <input
                  id="reset-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                  aria-describedby={
                    state?.fieldErrors?.password
                      ? "reset-password-error"
                      : undefined
                  }
                />
                {state?.fieldErrors?.password && (
                  <p
                    id="reset-password-error"
                    className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                    role="alert"
                  >
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-sm font-medium text-[var(--text)] mb-1.5 font-ui"
                >
                  Confirm Password
                </label>
                <input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Repeat your new password"
                  className="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--text-subtle)] text-sm font-ui focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                  aria-describedby={
                    state?.fieldErrors?.confirmPassword
                      ? "reset-confirm-error"
                      : undefined
                  }
                />
                {state?.fieldErrors?.confirmPassword && (
                  <p
                    id="reset-confirm-error"
                    className="mt-1.5 text-xs text-[var(--danger)] font-ui"
                    role="alert"
                  >
                    {state.fieldErrors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </div>

            <button
              id="btn-set-password"
              type="submit"
              disabled={isPending}
              className="w-full mt-6 px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold font-ui rounded-[var(--radius-lg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
            >
              {isPending ? "Updating…" : "Update Password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
