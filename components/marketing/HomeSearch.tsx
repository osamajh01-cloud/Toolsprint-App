"use client";

import Link from "next/link";
import { SearchBar } from "@/components/shared/SearchBar";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { Badge } from "@/components/ui/Badge";
import { useToolSearch } from "@/hooks/use-tool-search";
import { t } from "@/i18n/dictionary";
import { localePath } from "@/i18n/paths";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { tools } from "@/registry/tools";

/**
 * components/marketing/HomeSearch.tsx
 *
 * Homepage search. Reuses the existing use-tool-search hook — so matching
 * rules and the popular → featured → rest ranking are identical to the
 * /tools directory, with no duplicated logic — and the shared SearchBar.
 *
 * Deliberately a compact result list (not a card grid): on the homepage
 * search is a jump-to-tool affordance, and the card grids below already
 * cover browsing. It is the only client component on the page; every
 * section around it stays server-rendered and static.
 */

const RESULT_LIMIT = 6;

export function HomeSearch({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { query, setQuery, results, isFiltering } = useToolSearch(locale);
  const visible = results.slice(0, RESULT_LIMIT);

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={t(dictionary.tools.searchPlaceholder, { count: tools.length })}
        label={dictionary.tools.searchLabel}
        className="mx-auto w-full max-w-xl"
      />

      {isFiltering && (
        <div className="mx-auto w-full max-w-xl">
          <p aria-live="polite" className="sr-only">
            {t(dictionary.search.resultsFound, { count: results.length })}
          </p>

          {visible.length > 0 ? (
            <ul className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-2 motion-safe:animate-fade-in">
              {visible.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={localePath(locale, `/tools/${tool.slug}`)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary">
                      <ToolIcon name={tool.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {tool.title}
                      </span>
                      <span className="block truncate text-xs text-foreground-muted">
                        {tool.shortDescription}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              {results.length > RESULT_LIMIT && (
                <li className="px-3 py-2">
                  <Link
                    href={localePath(locale, "/tools")}
                    className="rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {t(dictionary.search.seeAllMatches, { count: results.length })}
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-foreground-muted">
              {t(dictionary.search.noMatches, { query: query.trim() })}{" "}
              <Link
                href={localePath(locale, "/tools")}
                className="font-medium text-primary hover:underline"
              >
                {dictionary.search.browseCatalog}
              </Link>
              .
            </p>
          )}
        </div>
      )}

      {!isFiltering && (
        <p className="text-center text-xs text-foreground-muted">
          <Badge variant="outline">{dictionary.home.tip}</Badge>{" "}
          <span className="ml-1">
            {dictionary.home.searchTip}
          </span>
        </p>
      )}
    </div>
  );
}
