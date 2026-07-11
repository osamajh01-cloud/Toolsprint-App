import type { ToolCategory } from "@/types/tool";

/**
 * registry/tools/categories.ts
 *
 * The six launch categories. Order here is display order everywhere
 * (filter chips, future category pages, footer). Adding a category means:
 * (1) extend the CategorySlug union in types/tool.ts, (2) add an entry
 * here — the type system enforces both stay in sync.
 */

export const categories: ToolCategory[] = [
  {
    slug: "text",
    title: "Text",
    description:
      "Count, convert, clean, and generate text — everyday writing utilities that work instantly in your browser.",
    icon: "text",
  },
  {
    slug: "developer",
    title: "Developer",
    description:
      "Format, encode, generate, and test — small utilities that save developers from writing throwaway scripts.",
    icon: "code",
  },
  {
    slug: "seo",
    title: "SEO",
    description:
      "Slugs, meta tags, and keyword checks — quick helpers for making pages easier to find.",
    icon: "chart",
  },
  {
    slug: "social-media",
    title: "Social Media",
    description:
      "Character limits, hashtags, and campaign links — utilities for posting smarter across platforms.",
    icon: "hash",
  },
  {
    slug: "image",
    title: "Image",
    description:
      "Convert and inspect images without uploading them anywhere — everything runs locally in your browser.",
    icon: "image",
  },
  {
    slug: "productivity",
    title: "Productivity",
    description:
      "Timers, generators, and converters for the small tasks that interrupt your day.",
    icon: "timer",
  },
];

export function getCategory(slug: string): ToolCategory | undefined {
  return categories.find((category) => category.slug === slug);
}
