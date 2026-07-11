"use client";

import { categories } from "@/registry/tools/categories";
import type { CategoryFilterValue } from "@/hooks/use-tool-search";
import type { CategorySlug } from "@/types/tool";

/**
 * components/tools/CategoryFilter.tsx
 *
 * Horizontal chip row for filtering the directory by category: "All" plus
 * the six categories from the registry, each with its tool count. Counts
 * come in as props (computed once, server-side) rather than being
 * recomputed here.
 *
 * Accessibility: single-choice filters are a radiogroup; the active chip
 * is announced via aria-checked. Scrolls horizontally on small screens
 * instead of wrapping into a wall of chips.
 */

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  counts: Record<CategorySlug, number>;
  totalCount: number;
}

export function CategoryFilter({
  value,
  onChange,
  counts,
  totalCount,
}: CategoryFilterProps) {
  const options: { slug: CategoryFilterValue; title: string; count: number }[] =
    [
      { slug: "all", title: "All", count: totalCount },
      ...categories.map((category) => ({
        slug: category.slug,
        title: category.title,
        count: counts[category.slug],
      })),
    ];

  return (
    <div
      role="radiogroup"
      aria-label="Filter tools by category"
      className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]"
    >
      {options.map((option) => {
        const active = value === option.slug;
        return (
          <button
            key={option.slug}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.slug)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
            }`}
          >
            {option.title}
            <span
              className={`text-xs tabular-nums ${
                active ? "text-brand-foreground/80" : "text-muted-foreground/70"
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
