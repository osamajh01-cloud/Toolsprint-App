"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/config/navigation";

/**
 * components/layout/MobileNav.tsx
 *
 * Hamburger menu for viewports below `md`. Renders the same `mainNav`
 * config as the desktop nav, plus the theme toggle, language switcher,
 * and CTA — so nothing is lost on small screens.
 *
 * Accessibility & UX details:
 * - The trigger exposes `aria-expanded` + `aria-controls`.
 * - Escape closes the menu.
 * - The menu closes automatically on route change (pathname effect), so
 *   users never navigate "behind" an open overlay.
 * - Body scroll is locked while open to prevent background scrolling.
 * - The hamburger/close icons are aria-hidden; state is announced through
 *   the button label.
 */

const MENU_ID = "mobile-nav-menu";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-5"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id={MENU_ID}
          className="absolute inset-x-0 top-full border-b border-border bg-background shadow-lg"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                variant="mobile"
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>

          <div className="flex items-center justify-between gap-3 border-t border-border p-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <Button href="/tools" size="sm" onClick={() => setOpen(false)}>
              Explore Tools
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
