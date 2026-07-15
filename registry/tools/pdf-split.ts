import type { Tool } from "@/types/tool";

/**
 * registry/tools/pdf-split.ts
 *
 * Registry entry for the "PDF Split" tool. This file is the ONLY place
 * this tool's information lives — the directory card, search index, tool
 * page, sitemap, and SEO metadata all read from it via
 * registry/tools/index.ts.
 */
export const pdfSplit: Tool = {
  id: "tool_026",
  slug: "pdf-split",
  title: "PDF Split",
  shortDescription:
    "Extract pages, ranges, or split a PDF into parts — with visual page previews.",
  category: "productivity",
  tags: ["pdf", "split", "extract pages", "separate", "page range"],
  icon: "file",
  featured: false,
  premium: false,
  languageSupport: ["en"],
  seoTitle: "Split PDF Online — Extract Pages & Ranges Privately (Free)",
  seoDescription:
    "Split a PDF by page ranges, single pages, every page, or every N pages — with visual thumbnails to pick pages. Fully in-browser, nothing is uploaded.",
};
