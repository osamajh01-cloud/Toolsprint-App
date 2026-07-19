import type { Tool } from "@/types/tool";

/**
 * registry/tools/image-compressor.ts
 *
 * Registry entry for the "Image Compressor" tool. This file is the ONLY
 * place this tool's information lives — the directory card, search index,
 * tool page, sitemap, and SEO metadata all read from it via
 * registry/tools/index.ts.
 */
export const imageCompressor: Tool = {
  id: "tool_024",
  slug: "image-compressor",
  title: "Image Compressor",
  shortDescription:
    "Shrink JPEG, PNG, and WebP files right in your browser — nothing is uploaded.",
  category: "image",
  tags: ["compress", "jpeg", "png", "webp", "reduce size", "optimize", "batch"],
  icon: "image",
  featured: false,
  premium: false,
  collections: ["popular"],
  displayOrder: 4,
  createdAt: "2026-07-05",
  languageSupport: ["en"],
  seoTitle: "Image Compressor — Shrink JPEG, PNG & WebP Online (Private)",
  seoDescription:
    "Compress JPEG, PNG, and WebP images with a live quality preview and batch ZIP download. Runs entirely in your browser — your photos never leave your device.",
};
