import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/layout/NavLink";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { mainNav } from "@/config/navigation";

/**
 * components/layout/Header.tsx
 *
 * Site-wide sticky header: logo, primary nav, language switcher, theme
 * toggle, and the "Explore Tools" CTA. Sticky with a translucent
 * backdrop-blur surface (the "glass" pattern used by Vercel/Linear/Stripe)
 * so content scrolls beneath it while the nav stays legible.
 *
 * This is a Server Component — all interactivity lives in the small client
 * leaves it composes (NavLink, MobileNav, ThemeToggle, LanguageSwitcher),
 * which keeps the client JS bundle minimal.
 *
 * Layout behavior:
 * - `md` and up: inline nav links + controls.
 * - Below `md`: links/controls collapse into MobileNav's hamburger menu.
 *
 * A skip link is the first focusable element for keyboard/screen-reader
 * users to jump past the nav; each group layout marks its content region
 * with id="main-content".
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:text-brand-foreground"
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

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button href="/tools" size="sm" className="ml-1">
            Explore Tools
          </Button>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
