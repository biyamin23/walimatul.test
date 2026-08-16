import { type HTMLAttributes } from "react";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  level?: 2 | 3;
}

/**
 * WALIMATUL SectionHeading
 *
 * Consistent section title used across marketing and dashboard pages.
 * Playfair Display heading + Inter eyebrow and subtitle.
 * Pass `id` via HTML attributes to reference from `aria-labelledby`.
 */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  level = 2,
  className = "",
  id,
  ...props
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const HeadingTag = `h${level}` as "h2" | "h3";

  return (
    <div
      className={[
        "max-w-2xl",
        align === "center" ? "mx-auto" : "",
        alignClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {eyebrow && (
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--gold)] mb-3 font-ui">
          {eyebrow}
        </p>
      )}
      <HeadingTag
        id={id}
        className="font-display text-3xl sm:text-4xl text-[var(--text)] leading-tight mb-4"
      >
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="text-base text-[var(--text-muted)] leading-relaxed font-ui">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
