"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { getMainNav } from "@/config/navigation";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/layout/MobileNav.tsx
 *
 * Hamburger menu below `md`, carrying the same nav plus the theme toggle,
 * language switcher, and CTA — nothing is lost on small screens.
 *
 * Accessibility: aria-expanded/aria-controls on the trigger, Escape to
 * close, auto-close on route change (so switching language or navigating
 * never leaves an overlay open), and body scroll locked while open.
 */

const MENU_ID = "mobile-nav-menu";

export function MobileNav({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const mainNav = getMainNav(dictionary);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
      <Button
        variant="icon"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
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
      </Button>

      {open && (
        <div
          id={MENU_ID}
          className="absolute inset-x-0 top-full border-b border-border bg-surface shadow-lg"
        >
          <nav
            aria-label={dictionary.nav.mobileNav}
            className="flex flex-col gap-1 p-4"
          >
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                locale={locale}
                soonLabel={dictionary.nav.soon}
                variant="mobile"
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>

          <div className="flex items-center justify-between gap-3 border-t border-border p-4">
            <div className="flex items-center gap-2">
              <ThemeToggle dictionary={dictionary} />
              <LanguageSwitcher locale={locale} label={dictionary.nav.language} />
            </div>
            <Button
              href={localePath(locale, "/tools")}
              size="sm"
              onClick={() => setOpen(false)}
            >
              {dictionary.nav.exploreTools}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
