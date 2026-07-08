/**
 * config/site.ts
 *
 * Single source of truth for site-wide constants: name, description, URL,
 * social links, and default SEO assets. Every place that needs these values
 * (root layout metadata, per-page generateMetadata, sitemap, JSON-LD, footer)
 * should import from here instead of hardcoding strings, so a rebrand or
 * domain change only requires editing this one file.
 */

export const siteConfig = {
  name: "ToolSprint",
  shortName: "ToolSprint",
  tagline: "Save hours with powerful online tools.",
  description:
    "ToolSprint is a growing collection of free, fast, browser-based tools for developers, writers, and everyday tasks — no sign-up required.",
  /**
   * NOTE: Update this once a production domain is connected in Vercel.
   * Using a placeholder now keeps metadata/sitemaps valid pre-launch.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolsprint.vercel.app",
  ogImage: "/og/default.png",
  links: {
    twitter: "https://twitter.com/toolsprint",
    github: "https://github.com/toolsprint",
  },
  keywords: [
    "online tools",
    "free tools",
    "developer tools",
    "productivity tools",
    "web utilities",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
