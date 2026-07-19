"use client";

import { useMemo, useState } from "react";
import { sortByRank, tools } from "@/registry/tools";
import type { CategorySlug, Tool } from "@/types/tool";

/**
 * hooks/use-tool-search.ts
 *
 * Client-side search + category filtering over the tool registry. With a
 * catalog in the tens-to-low-hundreds, an in-memory filter on every
 * keystroke is instant (sub-millisecond) — no debounce, no index, no
 * search service needed. If the catalog ever outgrows this, only this hook
 * changes; the directory UI stays the same.
 *
 * Matching: case-insensitive substring over title, shortDescription, and
 * tags. Category filter and text query compose (AND).
 *
 * Ordering (Milestone 11.1): results are ranked popular → featured →
 * everything else via the registry's sortByRank, with registry order
 * breaking ties. Ranking is metadata-driven, so curating a tool changes
 * its search position without touching this file.
 */

export type CategoryFilterValue = CategorySlug | "all";

export function useToolSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilterValue>("all");

  const results: Tool[] = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const matched = tools.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      if (!normalized) return true;

      return (
        tool.title.toLowerCase().includes(normalized) ||
        tool.shortDescription.toLowerCase().includes(normalized) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(normalized))
      );
    });

    return sortByRank(matched);
  }, [query, category]);

  /** True when the user has narrowed the catalog in any way. */
  const isFiltering = query.trim() !== "" || category !== "all";

  function reset() {
    setQuery("");
    setCategory("all");
  }

  return { query, setQuery, category, setCategory, results, isFiltering, reset };
}
