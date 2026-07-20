"use client";

import { useMemo, useState } from "react";
import { sortByRank, tools } from "@/registry/tools";
import { localizeTools, searchTermsFor } from "@/i18n/content";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { CategorySlug, Tool } from "@/types/tool";

/**
 * hooks/use-tool-search.ts
 *
 * Client-side search + category filtering over the tool registry.
 *
 * BILINGUAL MATCHING (Milestone 13): the index for each tool merges its
 * English title/description/tags with the Arabic ones, so a query in
 * either language finds the tool regardless of which language the user is
 * browsing in — searching "ضغط" in English mode, or "compress" in Arabic
 * mode, both work. The DISPLAYED text still follows the active locale.
 *
 * The index is built once per locale (useMemo on the tool list), not per
 * keystroke; filtering stays an in-memory scan, which is instant at this
 * catalog size — no debounce, no search service.
 *
 * Ordering: popular → featured → rest, via the registry's sortByRank.
 */

export type CategoryFilterValue = CategorySlug | "all";

export function useToolSearch(locale: Locale = defaultLocale) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilterValue>("all");

  /** Tools with locale-appropriate display text. */
  const localized = useMemo(() => localizeTools(tools, locale), [locale]);

  /** slug → lowercased haystack containing BOTH languages' text. */
  const searchIndex = useMemo(() => {
    const index = new Map<string, string>();
    for (const tool of tools) {
      const parts = [
        tool.title,
        tool.shortDescription,
        ...tool.tags,
        ...searchTermsFor(tool.slug),
      ];
      index.set(tool.slug, parts.join(" ").toLowerCase());
    }
    return index;
  }, []);

  const results: Tool[] = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const matched = localized.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      if (!normalized) return true;
      return (searchIndex.get(tool.slug) ?? "").includes(normalized);
    });

    return sortByRank(matched);
  }, [query, category, localized, searchIndex]);

  const isFiltering = query.trim() !== "" || category !== "all";

  function reset() {
    setQuery("");
    setCategory("all");
  }

  return { query, setQuery, category, setCategory, results, isFiltering, reset };
}
