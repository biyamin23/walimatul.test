import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

/**
 * WALIMATUL Input
 *
 * Renders a styled text input consistent with the WALIMATUL platform.
 * Pair with <Label> for accessibility.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          "w-full px-4 py-3 text-sm rounded-[var(--radius)]",
          "bg-[var(--surface)] border transition-colors",
          "text-[var(--text)] placeholder:text-[var(--text-subtle)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background)]",
          hasError
            ? "border-[var(--danger)] focus:ring-[var(--danger)]"
            : "border-[var(--border)] hover:border-[var(--text-muted)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
