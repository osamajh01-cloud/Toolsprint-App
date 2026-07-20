import type { Tool } from "@/types/tool";

/**
 * registry/tools/pdf-merge.ts
 *
 * Registry entry for the "PDF Merge" tool. This file is the ONLY place
 * this tool's information lives — the directory card, search index, tool
 * page, sitemap, and SEO metadata all read from it via
 * registry/tools/index.ts.
 */
export const pdfMerge: Tool = {
  id: "tool_025",
  slug: "pdf-merge",
  title: "PDF Merge",
  shortDescription:
    "Combine multiple PDFs into one, in the order you choose — fully in your browser.",
  category: "productivity",
  tags: ["pdf", "merge", "combine", "join", "documents"],
  icon: "file",
  featured: false,
  premium: false,
  popular: true,
  displayOrder: 1,
  createdAt: "2026-07-08",
  languageSupport: ["en"],
  seoTitle: "Merge PDF Files Online — Combine PDFs Privately (Free)",
  seoDescription:
    "Merge multiple PDF files into one document, reorder pages by file, and download instantly. Runs entirely in your browser — no uploads, no accounts.",
};
