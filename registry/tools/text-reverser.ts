import type { Tool } from "@/types/tool";

/**
 * registry/tools/text-reverser.ts
 *
 * Registry entry for the "Text Reverser" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const textReverser: Tool = {
  id: "tool_021",
  slug: "text-reverser",
  title: "Text Reverser",
  shortDescription:
    "Reverse text by characters, word order, or line order — instantly.",
  category: "text",
  tags: ["reverse", "backwards", "mirror text", "flip", "lines"],
  icon: "scale",
  featured: false,
  premium: false,
  createdAt: "2026-06-28",
  languageSupport: ["en"],
  seoTitle: "Text Reverser — Reverse Characters, Words & Lines Online",
  seoDescription:
    "Reverse any text instantly: flip characters, reverse word order, or invert line order. Emoji-safe, free, and running entirely in your browser.",
};
