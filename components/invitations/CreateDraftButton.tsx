"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDraftInvitationAction } from "@/app/actions/invitations";

interface CreateDraftButtonProps {
  templateSlug?: string;
  className?: string;
  label?: string;
  loadingLabel?: string;
  children?: React.ReactNode;
}

export function CreateDraftButton({
  templateSlug = "blush-garden",
  className = "",
  label = "Use This Template →",
  loadingLabel = "Creating Draft...",
  children,
}: CreateDraftButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await createDraftInvitationAction(templateSlug);
      if (res.success && res.data?.invitationId) {
        router.push(`/dashboard/invitations/${res.data.invitationId}/edit`);
      } else if (res.error && res.error.toLowerCase().includes("signed in")) {
        // Redirect unauthenticated visitors safely to login with next path that auto-creates draft on arrival
        const nextUrl = `/templates/${templateSlug}/preview?create=1`;
        router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
      } else {
        alert(res.error || "Could not create draft. Please try again.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer ${className}`}
    >
      {isPending ? (
        <span className="inline-flex items-center gap-1.5">
          <svg
            className="animate-spin h-3.5 w-3.5"
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
          {loadingLabel}
        </span>
      ) : (
        children || label
      )}
    </button>
  );
}
