import React from "react";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  errorMessage?: string;
  className?: string;
}

export function SaveStatusIndicator({
  status,
  errorMessage,
  className = "",
}: SaveStatusIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-ui whitespace-nowrap select-none ${className}`}
      aria-live="polite"
    >
      {status === "saving" && (
        <>
          <svg
            className="animate-spin h-3.5 w-3.5 text-[var(--gold)] shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <span className="text-[var(--text-muted)] text-[11px] sm:text-xs">Saving…</span>
        </>
      )}

      {status === "saved" && (
        <>
          <svg
            className="h-3.5 w-3.5 text-emerald-600 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-emerald-700 font-medium text-[11px] sm:text-xs">Saved ✓</span>
        </>
      )}

      {status === "unsaved" && (
        <>
          <span className="w-2 h-2 rounded-full bg-[var(--gold)] shrink-0" aria-hidden="true" />
          <span className="text-[var(--text-muted)] text-[11px] sm:text-xs">Unsaved</span>
        </>
      )}

      {status === "error" && (
        <>
          <svg
            className="h-3.5 w-3.5 text-red-600 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className="text-red-600 font-medium text-[11px] sm:text-xs truncate max-w-[120px] sm:max-w-[200px]"
            title={errorMessage}
          >
            {errorMessage || "Save failed"}
          </span>
        </>
      )}
    </div>
  );
}
