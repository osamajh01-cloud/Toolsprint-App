import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getFooterNav, type NavItem } from "@/config/navigation";
import { t } from "@/i18n/dictionary";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/layout/Footer.tsx
 *
 * Site footer: brand block, four link columns, copyright. Columns and
 * labels come from the dictionary-driven navigation config, and internal
 * links are locale-prefixed. Server Component — static markup.
 *
 * Link rules (from the NavItem contract): `disabled` items render as
 * inert text with a "Soon" badge (never a dead link), `external` items
 * open in a new tab with rel security attributes.
 */

function FooterLink({
  item,
  locale,
  soonLabel,
}: {
  item: NavItem;
  locale: Locale;
  soonLabel: string;
}) {
  const linkStyles =
    "rounded-sm text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  if (item.disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-foreground-subtle">
        {item.title}
        <Badge>{soonLabel}</Badge>
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
    <Link
      href={localePath(locale, item.href)}
      className={`inline-flex items-center gap-1.5 ${linkStyles}`}
    >
      {item.title}
      {item.comingSoon && <Badge>{soonLabel}</Badge>}
    </Link>
  );
}

export function Footer({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const year = new Date().getFullYear();
  const columns = getFooterNav(dictionary);

  return (
    <footer className="border-t border-border">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-2">
            <Logo locale={locale} />
            <p className="max-w-xs text-sm leading-relaxed text-foreground-muted">
              {dictionary.footer.tagline}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={item.title}>
                    <FooterLink
                      item={item}
                      locale={locale}
                      soonLabel={dictionary.nav.soon}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-foreground-muted">
            {t(dictionary.footer.rights, { year })}
          </p>
          <p className="text-sm text-foreground-subtle">
            {dictionary.footer.builtFor}
          </p>
        </div>
      </Container>
    </footer>
  );
}
