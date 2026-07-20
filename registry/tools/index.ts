import type { CategorySlug, Tool } from "@/types/tool";
import { categories, getCategory } from "@/registry/tools/categories";

/** How many of the newest tools appear in "Recently added" AND carry the
 *  "New" badge. Deterministic (rank-based, not clock-based) so server and
 *  client always agree — no hydration mismatch at a date boundary. */
export const RECENT_TOOL_COUNT = 5;

import { wordCounter } from "@/registry/tools/word-counter";
import { caseConverter } from "@/registry/tools/case-converter";
import { loremIpsumGenerator } from "@/registry/tools/lorem-ipsum-generator";
import { textCleaner } from "@/registry/tools/text-cleaner";
import { textReverser } from "@/registry/tools/text-reverser";
import { removeDuplicateLinesTool } from "@/registry/tools/remove-duplicate-lines";
import { jsonFormatter } from "@/registry/tools/json-formatter";
import { base64Encoder } from "@/registry/tools/base64-encoder";
import { uuidGenerator } from "@/registry/tools/uuid-generator";
import { regexTester } from "@/registry/tools/regex-tester";
import { urlEncoder } from "@/registry/tools/url-encoder";
import { slugGenerator } from "@/registry/tools/slug-generator";
import { metaTagGenerator } from "@/registry/tools/meta-tag-generator";
import { keywordDensityChecker } from "@/registry/tools/keyword-density-checker";
import { socialCharacterCounter } from "@/registry/tools/social-character-counter";
import { hashtagGenerator } from "@/registry/tools/hashtag-generator";
import { utmLinkBuilder } from "@/registry/tools/utm-link-builder";
import { imageToBase64 } from "@/registry/tools/image-to-base64";
import { colorPaletteExtractor } from "@/registry/tools/color-palette-extractor";
import { qrCodeGenerator } from "@/registry/tools/qr-code-generator";
import { imageCompressor } from "@/registry/tools/image-compressor";
import { pdfMerge } from "@/registry/tools/pdf-merge";
import { pdfSplit } from "@/registry/tools/pdf-split";
import { pdfCompressor } from "@/registry/tools/pdf-compressor";
import { pomodoroTimer } from "@/registry/tools/pomodoro-timer";
import { passwordGenerator } from "@/registry/tools/password-generator";
import { unitConverter } from "@/registry/tools/unit-converter";

/**
 * registry/tools/index.ts
 *
 * The single aggregation point for the tool catalog. Everything that needs
 * "all tools" — the /tools directory, search, /tools/[slug] static params,
 * the sitemap (Milestone 7), category pages (Milestone 4) — imports from
 * here and only here.
 *
 * ADDING TOOL #21: create registry/tools/<slug>.ts, import it, and append
 * it to the array below (grouped by category for readability). No routing,
 * layout, or SEO code changes required — that is the whole point of the
 * registry architecture.
 */

export const tools: Tool[] = [
  // Text
  wordCounter,
  caseConverter,
  loremIpsumGenerator,
  textCleaner,
  textReverser,
  removeDuplicateLinesTool,
  // Developer
  jsonFormatter,
  base64Encoder,
  uuidGenerator,
  regexTester,
  urlEncoder,
  // SEO
  slugGenerator,
  metaTagGenerator,
  keywordDensityChecker,
  // Social Media
  socialCharacterCounter,
  hashtagGenerator,
  utmLinkBuilder,
  // Image
  imageToBase64,
  colorPaletteExtractor,
  qrCodeGenerator,
  imageCompressor,
  // Productivity
  pomodoroTimer,
  passwordGenerator,
  unitConverter,
  pdfMerge,
  pdfSplit,
  pdfCompressor,
];

/** Look up a single tool by its URL slug (used by /tools/[slug]). */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

/** All tools in a category, preserving registry order. */
export function getToolsByCategory(category: CategorySlug): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

/** The featured tools surfaced at the top of the directory (max 3). */
export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured).slice(0, 3);
}

/** Number of tools per category, for filter-chip counts. */
export function getCategoryCounts(): Record<CategorySlug, number> {
  const counts = Object.fromEntries(
    categories.map((category) => [category.slug, 0]),
  ) as Record<CategorySlug, number>;
  for (const tool of tools) counts[tool.category] += 1;
  return counts;
}

/* ------------------------- collections & recency -------------------------
 * All derived from registry metadata — nothing is hardcoded here, so a
 * tool joining a collection or shipping later is reflected everywhere
 * (homepage, badges, search ranking) by editing only its own file.
 */

/** All popular tools, ordered by displayOrder (unset sorts last). */
export function getPopularTools(): Tool[] {
  return tools
    .filter((tool) => tool.popular)
    .sort(
      (a, b) =>
        (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.displayOrder ?? Number.MAX_SAFE_INTEGER),
    );
}

export function isPopular(tool: Tool): boolean {
  return tool.popular === true;
}

/** Honest usage indicator for tool cards. The product has no analytics
 *  yet, so instead of inventing absolute numbers ("12k uses/mo") the tier
 *  is derived from real registry metadata and rendered as a relative
 *  meter: popular → high, newest → new, featured → growing, else steady.
 *  When real usage data exists, only this function needs to change. */
export type UsageTier = "high" | "growing" | "new" | "steady";

export function usageTier(tool: Tool): UsageTier {
  if (isPopular(tool)) return "high";
  if (isNew(tool)) return "new";
  if (tool.featured) return "growing";
  return "steady";
}

/** Newest tools by createdAt, most recent first (ties broken by id so the
 *  order is stable). */
export function getRecentTools(limit: number = RECENT_TOOL_COUNT): Tool[] {
  return [...tools]
    .sort((a, b) =>
      a.createdAt === b.createdAt
        ? b.id.localeCompare(a.id)
        : b.createdAt.localeCompare(a.createdAt),
    )
    .slice(0, limit);
}

/** Slugs of the tools that currently count as "new" — the same set shown
 *  in Recently Added, so the badge and the section can never disagree. */
const recentSlugs = new Set(getRecentTools().map((tool) => tool.slug));

export function isNew(tool: Tool): boolean {
  return recentSlugs.has(tool.slug);
}

/** Ranking used by search results and the All-tools grid: popular first,
 *  then featured, then everything else; registry order breaks ties. */
export function toolRank(tool: Tool): number {
  if (isPopular(tool)) return 0;
  if (tool.featured) return 1;
  return 2;
}

/** Stable sort of any tool list by rank, preserving registry order within
 *  each rank (Array.prototype.sort is stable in modern engines). */
export function sortByRank(list: Tool[]): Tool[] {
  return [...list].sort((a, b) => toolRank(a) - toolRank(b));
}

export { categories, getCategory };
