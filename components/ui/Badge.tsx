import { type HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "gold"
  | "blush";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border)]",
  primary:
    "bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary-soft)]",
  success:
    "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-soft)]",
  warning:
    "bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-soft)]",
  danger:
    "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger-soft)]",
  gold: "bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold-soft)]",
  blush:
    "bg-[var(--blush-soft)] text-[var(--text-muted)] border border-[var(--blush)]",
};

/**
 * WALIMATUL Badge
 *
 * Small status indicator. Variants: default | primary | success | warning | danger | gold | blush
 */
function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-[var(--radius-pill)]",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
