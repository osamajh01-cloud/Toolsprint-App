import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { footerNav, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/**
 * components/layout/Footer.tsx
 *
 * Site-wide footer: brand block, four link columns (Product, Resources,
 * Legal, Social) rendered from `config/navigation.ts`, and the copyright
 * line. Server Component — purely static markup.
 *
 * Link rendering rules (from the NavItem contract):
 * - `disabled` items (pages shipping in later milestones) render as inert
 *   text with a "Soon" badge — the footer never contains a dead link.
 * - `external` items open in a new tab with rel="noopener noreferrer".
 * - `comingSoon` items that DO have a page (e.g. /pricing) render as
 *   normal links with a badge.
 */

function FooterLink({ item }: { item: NavItem }) {
  const linkStyles =
    "text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm";

  if (item.disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-foreground-subtle">
        {item.title}
        <Badge>Soon</Badge>
      </span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkStyles}
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link href={item.href} className={`inline-flex items-center gap-1.5 ${linkStyles}`}>
      {item.title}
      {item.comingSoon && <Badge>Soon</Badge>}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand block spans two columns on large screens. */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-2">
            <Logo />
            <p className="max-w-xs text-sm text-foreground-muted">
              Fast, free, browser-based tools for developers, writers, and
              everyday tasks. No sign-up required.
            </p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={item.title}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-foreground-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-foreground-muted">
            Built for speed. No sign-up required.
          </p>
        </div>
      </Container>
    </footer>
  );
}
