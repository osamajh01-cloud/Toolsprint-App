"use client";

import { SearchBar } from "@/components/shared/SearchBar";
import { ToolCard } from "@/components/shared/ToolCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { CategoryFilter } from "@/components/tools/CategoryFilter";
import { useToolSearch } from "@/hooks/use-tool-search";
import { getCategoryCounts, getFeaturedTools, tools } from "@/registry/tools";

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

const featuredTools = getFeaturedTools();
const categoryCounts = getCategoryCounts();

export function ToolsDirectory() {
  const { query, setQuery, category, setCategory, results, isFiltering, reset } =
    useToolSearch();

  return (
    <div className="flex flex-col gap-8">
      {/* Search + category filters */}
      <div className="flex flex-col gap-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={`Search ${tools.length} tools — try “json”, “password”, or “hashtag”…`}
          label="Search tools"
          className="max-w-xl"
        />
        <CategoryFilter
          value={category}
          onChange={setCategory}
          counts={categoryCounts}
          totalCount={tools.length}
        />
      </div>

      {/* Featured — default view only */}
      {!isFiltering && (
        <section aria-labelledby="featured-heading" className="flex flex-col gap-4">
          <h2 id="featured-heading" className="text-lg font-semibold">
            Featured tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* All tools / results */}
      <section aria-labelledby="all-tools-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="all-tools-heading" className="text-lg font-semibold">
            {isFiltering ? "Results" : "All tools"}
          </h2>
          <p aria-live="polite" className="text-sm text-foreground-muted">
            {results.length} {results.length === 1 ? "tool" : "tools"}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tools match your search"
            description={`Nothing matches “${query.trim()}”${
              category !== "all" ? " in this category" : ""
            }. Try a different keyword, or browse the full catalog.`}
            action={
              <Button variant="secondary" size="sm" onClick={reset}>
                Clear search and filters
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
