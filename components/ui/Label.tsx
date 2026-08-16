import { type LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/**
 * WALIMATUL Label
 *
 * Accessible form label. Pass `required` to display an asterisk.
 * Use `htmlFor` to associate with an input.
 */
function Label({ required, className = "", children, ...props }: LabelProps) {
  return (
    <label
      className={[
        "block text-sm font-medium text-[var(--text)] mb-1.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-[var(--danger)]" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

export { Label };
export type { LabelProps };
