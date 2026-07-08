"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import type { NavItem } from "@/config/navigation";

/**
 * components/layout/NavLink.tsx
 *
 * A single navigation link that knows whether it's the current page and
 * styles itself accordingly. Client component only because active-state
 * detection needs `usePathname()`; keeping this tiny means Header itself
 * can stay a server component.
 *
 * Used by both the desktop nav and the mobile menu (via the `variant`
 * prop) so link behavior — active styling, "Soon" badges, aria-current —
 * is implemented exactly once.
 */

interface NavLinkProps {
  item: NavItem;
  /** "desktop" = inline header link; "mobile" = full-width menu row. */
  variant?: "desktop" | "mobile";
  /** Called on navigation, e.g. to close the mobile menu. */
  onNavigate?: () => void;
}

export function NavLink({
  item,
  variant = "desktop",
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  const base =
    variant === "desktop"
      ? "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      : "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  const state = isActive
    ? "text-foreground bg-muted"
    : "text-muted-foreground hover:text-foreground hover:bg-muted/60";

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={`${base} ${state}`}
    >
      {item.title}
      {item.comingSoon && <Badge variant="brand">Soon</Badge>}
    </Link>
  );
}
