"use client";

import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/layout/NavLink";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useScrolled } from "@/components/layout/useScrolled";
import { mainNav } from "@/config/navigation";

/**
 * components/layout/Header.tsx
 *
 * Sticky site header: logo, primary nav, language switcher, theme toggle,
 * and the primary CTA.
 *
 * Milestone 12: the header is now scroll-aware — flat and borderless over
 * the hero, then gaining a hairline border, translucent blur, and a soft
 * shadow once content scrolls beneath it. That transition is the only
 * chrome animation on the page, and it's suppressed under motion-reduce
 * by the token-level transition rules.
 *
 * This became a Client Component only for the scroll state; all the
 * interactive parts (NavLink, MobileNav, ThemeToggle, LanguageSwitcher)
 * were already client leaves, so no new JavaScript ships for it.
 *
 * A skip link is the first focusable element; each group layout marks its
 * content region with id="main-content".
 */
export function Header() {
  const scrolled = useScrolled();

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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <Container className="relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-1.5 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button href="/tools" size="sm" className="ml-1.5">
            Explore tools
          </Button>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
