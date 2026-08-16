import { type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
  size?: "default" | "narrow" | "wide";
}

const sizeStyles = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

/**
 * WALIMATUL Container
 *
 * Responsive centered content wrapper.
 */
function Container({
  as: Tag = "div",
  size = "default",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={[
        "w-full mx-auto px-5 sm:px-8 lg:px-10",
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { Container };
export type { ContainerProps };
