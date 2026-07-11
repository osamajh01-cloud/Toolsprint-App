import type { Tool } from "@/types/tool";

/**
 * registry/tools/lorem-ipsum-generator.ts
 *
 * Registry entry for the "Lorem Ipsum Generator" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const loremIpsumGenerator: Tool = {
  "id": "tool_003",
  "slug": "lorem-ipsum-generator",
  "title": "Lorem Ipsum Generator",
  "shortDescription": "Generate placeholder paragraphs, sentences, or words for mockups and layouts.",
  "category": "text",
  "tags": [
    "placeholder",
    "dummy text",
    "mockup",
    "filler"
  ],
  "icon": "paragraph",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Lorem Ipsum Generator — Placeholder Text for Designers",
  "seoDescription": "Generate clean lorem ipsum placeholder text by paragraphs, sentences, or word count. Copy-ready filler text for mockups, free and instant."
};
