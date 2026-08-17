"use client";

import React, { useState, useEffect, useRef } from "react";
import { checkSlugAvailabilityAction } from "@/app/actions/invitations";

interface SlugFieldProps {
  value: string;
  invitationId: string;
  onChange: (newSlug: string) => void;
  error?: string;
}

export function SlugField({
  value,
  invitationId,
  onChange,
  error: parentError,
}: SlugFieldProps) {
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    checked: boolean;
    available: boolean;
    error?: string;
  }>({ checked: false, available: true });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const slug = value.trim().toLowerCase();

    if (!slug) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setChecking(true);
      const res = await checkSlugAvailabilityAction(slug, invitationId);
      setChecking(false);
      setAvailability({
        checked: true,
        available: res.available,
        error: res.error,
      });
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, invitationId]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Sanitize input as user types: lowercase, remove spaces, keep hyphens & alphanumerics
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!raw.trim()) {
      setAvailability({ checked: false, available: true });
    }
    onChange(raw);
  }

  return (
    <div className="space-y-2 w-full max-w-full min-w-0 box-border">
      <label
        htmlFor="invitation-slug-input"
        className="block text-xs sm:text-xs font-semibold font-ui text-[var(--text)] mb-1.5 break-words max-w-full"
      >
        Pautan Jemputan (URL)
      </label>

      {/* Input Group with Domain Prefix */}
      <div className="w-full max-w-full min-w-0 box-border flex items-stretch rounded-xl border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 transition-all bg-[var(--surface)] overflow-hidden">
        {/* Domain Prefix */}
        <span className="shrink-0 inline-flex items-center px-3 sm:px-3.5 bg-[var(--surface-warm)] text-xs font-mono text-[var(--text-muted)] border-r border-[var(--border-soft)] select-none">
          walimatul.my/
        </span>

        {/* Input */}
        <input
          id="invitation-slug-input"
          name="slug"
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="abu-hana"
          maxLength={60}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          className="flex-1 min-w-0 w-full px-3 py-2.5 min-h-[48px] sm:min-h-[44px] text-base sm:text-sm font-mono text-[var(--text)] bg-transparent focus:outline-none placeholder:text-[var(--text-subtle)]"
          aria-describedby="slug-help-text"
        />

        {/* Inline checking spinner only (compact) */}
        {checking && (
          <div className="shrink-0 flex items-center pr-3" aria-label="Checking availability">
            <svg
              className="animate-spin h-4 w-4 text-[var(--gold)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Availability Status (Placed cleanly below input to avoid horizontal expansion) */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-ui min-w-0">
        {checking && (
          <span className="text-[11px] text-[var(--text-muted)] font-ui flex items-center gap-1">
            Checking availability…
          </span>
        )}

        {!checking && value.trim() && availability.checked && (
          <div>
            {availability.available ? (
              <span
                className="text-xs font-ui font-semibold text-emerald-600 flex items-center gap-1"
                title="URL is available"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Available
              </span>
            ) : (
              <span
                className="text-xs font-ui font-semibold text-red-600 flex items-center gap-1"
                title={availability.error || "URL is not available"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {availability.error || "Unavailable"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Help / Error Text */}
      <div id="slug-help-text" className="text-xs font-ui min-w-0">
        {parentError || (!availability.available && availability.error) ? (
          <p className="text-red-600 font-medium break-words">
            {parentError || availability.error}
          </p>
        ) : (
          <p className="text-[var(--text-subtle)] text-[11px] sm:text-xs leading-relaxed break-words">
            Gunakan huruf kecil, nombor, dan tanda sempang sahaja (contoh:{" "}
            <span className="font-mono text-[var(--primary)] font-medium">
              abu-dan-hana
            </span>
            ). Boleh dipilih atau ditukar kemudian sebelum pembayaran.
          </p>
        )}
      </div>
    </div>
  );
}
