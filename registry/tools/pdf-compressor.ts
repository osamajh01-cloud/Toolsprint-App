import type { Tool } from "@/types/tool";

/**
 * registry/tools/pdf-compressor.ts
 *
 * Registry entry for the "PDF Compressor" tool. This file is the ONLY
 * place this tool's information lives — the directory card, search index,
 * tool page, sitemap, and SEO metadata all read from it via
 * registry/tools/index.ts.
 */
export const pdfCompressor: Tool = {
  id: "tool_027",
  slug: "pdf-compressor",
  title: "PDF Compressor",
  shortDescription:
    "Shrink PDFs by recompressing embedded images — text stays sharp and selectable.",
  category: "productivity",
  tags: ["pdf", "compress", "reduce size", "shrink", "optimize"],
  icon: "file",
  featured: false,
  premium: false,
  collections: ["popular"],
  displayOrder: 3,
  createdAt: "2026-07-14",
  languageSupport: ["en"],
  seoTitle: "Compress PDF Online — Reduce PDF File Size Privately (Free)",
  seoDescription:
    "Compress PDF files in your browser: recompress embedded images, strip metadata, and optimize structure while keeping text selectable. Nothing is uploaded.",
};
