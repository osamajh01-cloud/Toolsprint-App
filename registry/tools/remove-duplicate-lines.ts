import type { Tool } from "@/types/tool";

/**
 * registry/tools/remove-duplicate-lines.ts
 *
 * Registry entry for the "Remove Duplicate Lines" tool. This file is the ONLY
 * place this tool's information lives — the directory card, search index, tool
 * page, and SEO metadata all read from it via registry/tools/index.ts.
 */
export const removeDuplicateLinesTool: Tool = {
  id: "tool_022",
  slug: "remove-duplicate-lines",
  title: "Remove Duplicate Lines",
  shortDescription:
    "Paste a list and get unique lines back — with sort, trim, and ignore-case options.",
  category: "text",
  tags: ["deduplicate", "unique lines", "clean list", "sort", "remove duplicates"],
  icon: "paragraph",
  featured: false,
  premium: false,
  createdAt: "2026-06-28",
  languageSupport: ["en"],
  seoTitle: "Remove Duplicate Lines Online — Clean & Sort Any List",
  seoDescription:
    "Remove duplicate lines from any list in one paste. Options for ignoring case, trimming whitespace, and A-Z sorting. Free and fully in-browser.",
};
