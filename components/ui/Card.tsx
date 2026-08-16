import { type HTMLAttributes, forwardRef } from "react";

type CardVariant = "default" | "warm" | "blush" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-[var(--surface)] border border-[var(--border-soft)] shadow-[var(--shadow-card)]",
  warm: "bg-[var(--surface-warm)] border border-[var(--border-soft)] shadow-[var(--shadow-card)]",
  blush:
    "bg-[var(--blush-soft)] border border-[var(--blush)] shadow-[var(--shadow-sm)]",
  elevated:
    "bg-[var(--surface)] border border-[var(--border-soft)] shadow-[var(--shadow-elevated)]",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * WALIMATUL Card
 *
 * Variants: default | warm | blush | elevated
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", className = "", children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-[var(--radius-lg)]",
          variantStyles[variant],
          paddingStyles[padding],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
export type { CardProps, CardVariant };
