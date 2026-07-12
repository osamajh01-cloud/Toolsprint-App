import type { CategorySlug, Tool } from "@/types/tool";
import { categories, getCategory } from "@/registry/tools/categories";

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
  // Productivity
  pomodoroTimer,
  passwordGenerator,
  unitConverter,
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

export { categories, getCategory };
