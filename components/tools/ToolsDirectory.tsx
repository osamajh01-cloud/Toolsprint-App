"use client";

import { SearchBar } from "@/components/shared/SearchBar";
import { ToolCard } from "@/components/shared/ToolCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { CategoryFilter } from "@/components/tools/CategoryFilter";
import { useToolSearch } from "@/hooks/use-tool-search";
import { getCategoryCounts, getFeaturedTools, tools } from "@/registry/tools";
import { localizeTools } from "@/i18n/content";
import { t } from "@/i18n/dictionary";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/tools/ToolsDirectory.tsx
 *
 * The interactive body of the /tools page: search bar, category chips,
 * featured section, results grid, and empty state. This is the client
 * "island" — the page around it (hero, metadata) stays server-rendered.
 *
 * Behavior:
 * - Search and category filters compose; results update on every keystroke
 *   (in-memory filter over the registry — instant at this catalog size).
 * - The Featured section shows the 3 featured tools only in the default
 *   view. As soon as the user searches or filters, it yields to results —
 *   showing "featured" rows above a filtered grid would be noise.
 * - The result count is announced politely (aria-live) so screen-reader
 *   users hear filtering feedback without focus jumps.
 */

const categoryCounts = getCategoryCounts();

export function ToolsDirectory({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { query, setQuery, category, setCategory, results, isFiltering, reset } =
    useToolSearch(locale);
  const featuredTools = localizeTools(getFeaturedTools(), locale);

  return (
    <div className="flex flex-col gap-8">
      {/* Search + category filters */}
      <div className="flex flex-col gap-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t(dictionary.tools.searchPlaceholder, { count: tools.length })}
          label={dictionary.tools.searchLabel}
          className="max-w-xl"
        />
        <CategoryFilter
          value={category}
          onChange={setCategory}
          counts={categoryCounts}
          locale={locale}
          dictionary={dictionary}
          totalCount={tools.length}
        />
      </div>

      {/* Featured — default view only */}
      {!isFiltering && (
        <section aria-labelledby="featured-heading" className="flex flex-col gap-4">
          <h2 id="featured-heading" className="text-lg font-semibold">
            {dictionary.tools.featured}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        </section>
      )}

      {/* All tools / results */}
      <section aria-labelledby="all-tools-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="all-tools-heading" className="text-lg font-semibold">
            {isFiltering ? dictionary.tools.results : dictionary.tools.allTools}
          </h2>
          <p aria-live="polite" className="text-sm text-foreground-muted">
            {t(
              results.length === 1
                ? dictionary.tools.toolCount
                : dictionary.tools.toolCountPlural,
              { count: results.length },
            )}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={dictionary.search.emptyTitle}
            description={t(
              category !== "all"
                ? dictionary.search.emptyBodyCategory
                : dictionary.search.emptyBody,
              { query: query.trim() },
            )}
            action={
              <Button variant="secondary" size="sm" onClick={reset}>
                {dictionary.search.clearFilters}
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
