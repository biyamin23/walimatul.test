"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "./LoadingSpinner";

export interface PendingLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  pendingText?: string;
  spinnerSize?: "xs" | "sm" | "md";
  showSpinner?: boolean;
}

export function PendingLink({
  href,
  children,
  pendingText,
  spinnerSize = "xs",
  showSpinner = true,
  className = "",
  onClick,
  ...props
}: PendingLinkProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const active = isNavigating || isPending;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // If external link, or modified click (Ctrl/Cmd/Shift/Alt/Middle click), let default browser link handle it
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      props.target === "_blank" ||
      typeof href !== "string" ||
      href.startsWith("http")
    ) {
      if (onClick) onClick(e);
      return;
    }

    if (active) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    }

    e.preventDefault();
    setIsNavigating(true);

    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={active}
      aria-disabled={active}
      className={`${className} ${active ? "pointer-events-none opacity-90 cursor-wait" : ""}`}
      {...props}
    >
      {active ? (
        <span className="inline-flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
          {showSpinner && <LoadingSpinner size={spinnerSize} />}
          <span>{pendingText || children}</span>
        </span>
      ) : (
        children
      )}
    </Link>
  );
}
