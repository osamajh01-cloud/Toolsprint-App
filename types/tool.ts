/**
 * types/tool.ts
 *
 * The Tool contract: the single TypeScript schema every registry entry
 * must satisfy. The registry (data), ToolCard (directory UI), the /tools
 * search hook, the /tools/[slug] page, and its generateMetadata all
 * consume this one type — so a field added here is type-checked
 * everywhere at once, and tool information is never duplicated.
 */

/** Slugs of the six launch categories. Extending this union is how a new
 *  category is added — TypeScript then forces categories.ts to define it. */
export type CategorySlug =
  | "text"
  | "developer"
  | "seo"
  | "social-media"
  | "image"
  | "productivity";

/** Icon keys understood by components/shared/ToolIcon.tsx. A union (not
 *  plain string) so a typo'd icon name fails the build, not the UI. */
export type ToolIconName =
  | "text"
  | "type"
  | "paragraph"
  | "braces"
  | "binary"
  | "code"
  | "link"
  | "tag"
  | "chart"
  | "hash"
  | "image"
  | "palette"
  | "timer"
  | "key"
  | "scale";

/** Languages a tool's interface supports. Arabic is planned (see the
 *  header language switcher); tools declare readiness individually. */
export type LanguageCode = "en" | "ar";

export interface ToolCategory {
  slug: CategorySlug;
  title: string;
  /** One sentence shown on category pages and used for their SEO meta. */
  description: string;
  icon: ToolIconName;
}

export interface Tool {
  /** Stable unique identifier (never changes, even if slug/title do). */
  id: string;
  /** URL segment: /tools/[slug]. Lowercase, hyphen-separated. */
  slug: string;
  /** Display name shown on cards and the tool page. */
  title: string;
  /** One-line value proposition shown on ToolCards (aim for < 110 chars). */
  shortDescription: string;
  category: CategorySlug;
  /** Search keywords beyond the title; powers client-side search. */
  tags: string[];
  icon: ToolIconName;
  /** Featured tools surface in the directory's featured section (max 3). */
  featured: boolean;
  /** Reserved for Milestone 14+ plan gating. All launch tools are free. */
  premium: boolean;
  languageSupport: LanguageCode[];
  /** <title> for the tool page (may differ from display title for SEO). */
  seoTitle: string;
  /** Meta description for the tool page (aim for 140–160 chars). */
  seoDescription: string;
}
