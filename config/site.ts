/**
 * config/site.ts
 *
 * Single source of truth for site-wide constants: name, description, URL,
 * social links, and default SEO assets. Every place that needs these values
 * (root layout metadata, per-page generateMetadata, sitemap, JSON-LD, footer)
 * imports from here instead of hardcoding strings, so the Milestone 15
 * rebrand from "ToolSprint" to "TOOLAK" was almost entirely a matter of
 * editing this one file.
 */

export const siteConfig = {
  name: "TOOLAK",
  shortName: "TOOLAK",
  tagline: "Free online tools for everyone.",
  description:
    "TOOLAK is a growing collection of free, fast, browser-based tools for developers, writers, and everyday tasks — no sign-up required.",
  /**
   * NOTE: Update this once a production domain is connected in Vercel.
   * Using a placeholder now keeps metadata/sitemaps valid pre-launch.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolak.vercel.app",
  ogImage: "/og/default.png",
  links: {
    twitter: "https://twitter.com/toolak",
    github: "https://github.com/toolak",
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
