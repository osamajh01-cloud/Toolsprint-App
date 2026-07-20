"use client";

import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/layout/NavLink";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useScrolled } from "@/components/layout/useScrolled";
import { getMainNav } from "@/config/navigation";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/layout/Header.tsx
 *
 * Sticky, scroll-aware site header: flat over the hero, gaining a
 * hairline border, blur, and shadow once content passes beneath it.
 *
 * Fully localized: labels come from the dictionary, links are
 * locale-prefixed, and the layout mirrors automatically under RTL because
 * it uses flex order plus logical properties rather than left/right
 * offsets — no direction-specific CSS is needed here.
 */
export function Header({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const scrolled = useScrolled();
  const mainNav = getMainNav(dictionary);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? "border-b border-border bg-header shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground focus:start-4"
      >
        {dictionary.nav.skipToContent}
      </a>

      <Container className="relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo locale={locale} />

          <nav
            aria-label={dictionary.nav.mainNav}
            className="hidden items-center gap-1 md:flex"
          >
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                locale={locale}
                soonLabel={dictionary.nav.soon}
              />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-1.5 md:flex">
          <LanguageSwitcher locale={locale} label={dictionary.nav.language} />
          <ThemeToggle dictionary={dictionary} />
          <Button href={localePath(locale, "/tools")} size="sm" className="ms-1.5">
            {dictionary.nav.exploreTools}
          </Button>
        </div>

        <MobileNav locale={locale} dictionary={dictionary} />
      </Container>
    </header>
  );
}
