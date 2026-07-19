import type { Tool } from "@/types/tool";

/**
 * registry/tools/color-palette-extractor.ts
 *
 * Registry entry for the "Color Palette Extractor" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const colorPaletteExtractor: Tool = {
  "id": "tool_017",
  "slug": "color-palette-extractor",
  "title": "Color Palette Extractor",
  "shortDescription": "Drop in an image and pull out its dominant colors as hex codes.",
  "category": "image",
  "tags": [
    "colors",
    "palette",
    "hex",
    "design",
    "extract"
  ],
  "icon": "palette",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Color Palette Extractor — Get Hex Colors from Any Image",
  "seoDescription": "Extract the dominant colors from any image as copy-ready hex codes. Processing happens locally in your browser — no upload, no account."
};
