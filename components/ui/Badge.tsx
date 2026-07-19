import type { ReactNode } from "react";

/**
 * components/ui/Badge.tsx
 *
 * Small status label. Variants map to the semantic state tokens, so a
 * "danger" badge and a danger button draw from the same color — the state
 * palette is defined once in globals.css.
 *
 * Subtle backgrounds (not solid fills) keep badges quiet next to buttons;
 * each pairing was contrast-checked against its subtle surface.
 */

type Variant =
  | "neutral"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

const variantStyles: Record<Variant, string> = {
  neutral: "bg-surface-sunken text-foreground-muted",
  primary: "bg-primary-subtle text-primary",
  accent: "bg-accent-subtle text-accent",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
  info: "bg-info-subtle text-info",
  outline: "border border-border text-foreground-muted",
};

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-4 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
