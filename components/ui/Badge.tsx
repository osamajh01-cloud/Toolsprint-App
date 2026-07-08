import type { ReactNode } from "react";

/**
 * components/ui/Badge.tsx
 *
 * Small label primitive. Used in Milestone 2 for "Soon" markers next to
 * unlaunched nav items; will be reused for category tags on ToolCards
 * (Milestone 3) and "Pro" plan badges (Milestone 14). Style-only — no
 * business logic.
 */

type Variant = "default" | "brand" | "outline";

const variantStyles: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  brand: "bg-brand/10 text-brand",
  outline: "border border-border text-muted-foreground",
};

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
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
