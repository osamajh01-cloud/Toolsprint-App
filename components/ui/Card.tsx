import type { ElementType, ReactNode } from "react";

/**
 * components/ui/Card.tsx
 *
 * The product's surface primitive: rounded, hairline-bordered, and
 * elevated by tokenized shadows rather than heavy borders. Three levels:
 *
 *   flat        — sunken/quiet panels (options, info bars)
 *   raised      — standard content card (default)
 *   interactive — raised + hover elevation and a primary-tinted edge, for
 *                 cards that are themselves links or buttons
 *
 * Consolidates the ad-hoc `rounded-xl border border-border p-4` strings
 * that had accumulated across tools, so padding, radius, and elevation
 * are decided once.
 */

type Elevation = "flat" | "raised" | "interactive";
type Padding = "none" | "sm" | "md" | "lg";

const elevationStyles: Record<Elevation, string> = {
  flat: "bg-surface-sunken border border-border",
  raised: "bg-surface border border-border shadow-xs",
  interactive:
    "bg-surface border border-border shadow-xs transition-[box-shadow,border-color,transform] duration-200 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-reduce:transform-none",
};

const paddingStyles: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-8",
};

interface CardProps {
  children: ReactNode;
  elevation?: Elevation;
  padding?: Padding;
  className?: string;
  as?: ElementType;
}

export function Card({
  children,
  elevation = "raised",
  padding = "md",
  className = "",
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={`rounded-xl ${elevationStyles[elevation]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </Component>
  );
}
