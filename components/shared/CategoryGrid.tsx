import Link from "next/link";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { categories, getCategoryCounts } from "@/registry/tools";
import { localizeCategories } from "@/i18n/content";
import { localePath } from "@/i18n/paths";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * components/shared/CategoryGrid.tsx
 *
 * "Browse by category" tiles: icon, name, live tool count, and the
 * category's own description — all read from the category registry, so a
 * seventh category appears here automatically. Links to the existing
 * category pages built in Milestone 4 (no routing changes).
 *
 * Server Component.
 */
export function CategoryGrid({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const counts = getCategoryCounts();
  const localized = localizeCategories(categories, locale);

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {localized.map((category) => (
        <li key={category.slug}>
          <Link
            href={localePath(locale, `/tools/category/${category.slug}`)}
            className="flex h-full items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
              <ToolIcon name={category.icon} className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="flex items-baseline gap-2">
                <span className="font-semibold">{category.title}</span>
                <span className="text-xs tabular-nums text-foreground-muted">
                  {counts[category.slug]}
                </span>
              </span>
              <span className="mt-0.5 block text-sm text-foreground-muted">
                {category.description}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
