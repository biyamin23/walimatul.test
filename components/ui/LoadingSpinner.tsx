import React from "react";

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const SIZE_MAP = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-4 h-4 border-2",
  md: "w-5 h-5 border-2",
  lg: "w-6 h-6 border-[2.5px]",
};

export function LoadingSpinner({
  size = "sm",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <span
      className={`inline-block rounded-full animate-spin border-current border-t-transparent shrink-0 ${SIZE_MAP[size]} ${className}`}
      aria-hidden="true"
    />
  );
}
