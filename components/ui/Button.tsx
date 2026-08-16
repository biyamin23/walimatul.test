import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm",
  secondary:
    "bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary-soft)]",
  ghost: "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-soft)]",
  destructive:
    "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)] hover:bg-[var(--danger)] hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-[var(--radius)]",
  md: "px-6 py-3 text-sm rounded-[var(--radius-lg)]",
  lg: "px-8 py-4 text-base rounded-[var(--radius-lg)]",
};

/**
 * WALIMATUL Button
 *
 * Renders as a <button> element.
 * For navigation CTAs, use Next.js <Link> with appropriate styling.
 *
 * Variants: primary | secondary | ghost | destructive
 * Sizes:    sm | md | lg
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-busy={isLoading}
        className={[
          "inline-flex items-center justify-center gap-2 font-medium transition-all",
          "cursor-pointer select-none whitespace-nowrap",
          "focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
