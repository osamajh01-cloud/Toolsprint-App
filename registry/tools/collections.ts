import type { CollectionSlug } from "@/types/tool";

/**
 * registry/tools/collections.ts
 *
 * Editorial collections — a second, independent axis from categories.
 * A tool has exactly ONE category (its subject) but may belong to ZERO OR
 * MORE collections (curation). Categories are untouched by this file.
 *
 * Membership lives on each tool's registry entry (`collections: [...]`),
 * not here, so a tool's data stays in one place; this module only names
 * and describes the collections, and defines how many tools count as
 * "recently added".
 *
 * Adding a collection: extend CollectionSlug in types/tool.ts and add an
 * entry below — the type system then keeps entries and slugs in sync.
 */

export interface Collection {
  slug: CollectionSlug;
  title: string;
  description: string;
}

export const collections: Collection[] = [
  {
    slug: "popular",
    title: "Most popular",
    description:
      "The tools people reach for most — PDF and image work that would otherwise need a desktop app.",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

/** How many of the newest tools appear in "Recently added" AND carry the
 *  "New" badge. Deterministic (rank-based, not clock-based) so server and
 *  client always agree — no hydration mismatch at a date boundary. */
export const RECENT_TOOL_COUNT = 5;
