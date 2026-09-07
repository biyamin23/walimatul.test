"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Reset navigating state during render when route successfully changes (React recommended pattern)
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsNavigating(false);
  }

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

    // If already navigating, block duplicate clicks
    if (isNavigating) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    }

    // Do NOT call e.preventDefault()!
    // Allow Next.js <Link> to perform native prefetch-cached router transition.
    setIsNavigating(true);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={isNavigating}
      aria-disabled={isNavigating}
      className={`${className} ${isNavigating ? "pointer-events-none opacity-90 cursor-wait" : ""}`}
      {...props}
    >
      {isNavigating ? (
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

