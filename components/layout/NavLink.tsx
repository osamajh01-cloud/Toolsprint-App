"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { NavItem } from "@/config/navigation";

/**
 * components/layout/NavLink.tsx
 *
 * A navigation link that knows whether it's the current page. Client
 * component because active-state detection needs usePathname(); keeping
 * it small lets the header stay mostly server-rendered.
 *
 * Locale-aware: hrefs are prefixed with the active locale, and the active
 * check compares against the prefixed path so /ar/tools highlights
 * "Tools" exactly like /en/tools does.
 */

interface NavLinkProps {
  item: NavItem;
  locale: Locale;
  soonLabel: string;
  /** "desktop" = inline header link; "mobile" = full-width menu row. */
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function NavLink({
  item,
  locale,
  soonLabel,
  variant = "desktop",
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const href = localePath(locale, item.href);
  const isActive =
    item.href === "/" ? pathname === href : pathname.startsWith(href);

  const base =
    variant === "desktop"
      ? "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      : "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  const state = isActive
    ? "text-foreground bg-secondary"
    : "text-foreground-muted hover:text-foreground hover:bg-secondary";

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={`${base} ${state}`}
    >
      {item.title}
      {item.comingSoon && <Badge variant="primary">{soonLabel}</Badge>}
    </Link>
  );
}
