"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/shared/SearchBar";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { Badge } from "@/components/ui/Badge";
import { useToolSearch } from "@/hooks/use-tool-search";
import { getPopularTools, tools } from "@/registry/tools";
import { localizeTool } from "@/i18n/content";
import { t } from "@/i18n/dictionary";
import { localePath } from "@/i18n/paths";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/marketing/HomeSearch.tsx
 *
 * Homepage search, upgraded in Milestone 14:
 * - "/" focuses the field from anywhere on the page (ignored while typing
 *   in another input/textarea, so it never hijacks real text entry);
 *   the shortcut is advertised with a <kbd> hint inside the field area.
 * - RECENT searches: the last 5 committed queries, persisted in
 *   localStorage (read inside an effect, so SSR and first paint match),
 *   shown as one-tap chips and clearable.
 * - POPULAR searches: chips derived from the popular tools' localized
 *   titles — registry-driven, nothing hardcoded, bilingual for free.
 *
 * Matching and ranking still come from the shared use-tool-search hook,
 * so homepage search and directory search cannot diverge.
 */

const RESULT_LIMIT = 6;
// Persistence key kept stable across the rebrand (see ThemeScript) so a
// visitor's recent searches survive the update; never shown in the UI.
const RECENT_KEY = "toolsprint-recent-searches";
const RECENT_LIMIT = 5;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function HomeSearch({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { query, setQuery, results, isFiltering } = useToolSearch(locale);
  const [recent, setRecent] = useState<string[]>([]);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const visible = results.slice(0, RESULT_LIMIT);

  // Popular chips: localized titles of the registry's popular tools.
  const popularChips = getPopularTools()
    .slice(0, 4)
    .map((tool) => localizeTool(tool, locale).title);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  // "/" focuses the search field, unless the user is already typing.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      event.preventDefault();
      inputWrapRef.current?.querySelector("input")?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /** Commit a query to the recent list (called when a result is chosen). */
  function remember(value: string) {
    const clean = value.trim();
    if (!clean) return;
    const next = [clean, ...recent.filter((item) => item !== clean)].slice(
      0,
      RECENT_LIMIT,
    );
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* private mode — chips just won't persist */
    }
  }

  function clearRecent() {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div ref={inputWrapRef} className="relative mx-auto w-full max-w-xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t(dictionary.tools.searchPlaceholder, {
            count: tools.length,
          })}
          label={dictionary.tools.searchLabel}
          className="w-full"
        />
        {!query && (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute end-12 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-[11px] text-foreground-subtle sm:block"
          >
            /
          </kbd>
        )}
      </div>

      {/* Recent + popular chips (hidden while results are showing) */}
      {!isFiltering && (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
          {recent.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-foreground-subtle">
                {dictionary.search.recent}
              </span>
              {recent.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                onClick={clearRecent}
                className="rounded-full px-2 py-1 text-xs text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {dictionary.search.clearRecent}
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-foreground-subtle">
              {dictionary.search.popularSearches}
            </span>
            {popularChips.map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => setQuery(title)}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}

      {isFiltering && (
        <div className="mx-auto w-full max-w-xl">
          <p aria-live="polite" className="sr-only">
            {t(dictionary.search.resultsFound, { count: results.length })}
          </p>

          {visible.length > 0 ? (
            <ul className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-2 shadow-sm motion-safe:animate-fade-in">
              {visible.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={localePath(locale, `/tools/${tool.slug}`)}
                    onClick={() => remember(query)}
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
                    {t(dictionary.search.seeAllMatches, {
                      count: results.length,
                    })}
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
          <span className="ms-1">{dictionary.home.searchTip}</span>
        </p>
      )}
    </div>
  );
}
