/**
 * i18n/dictionaries/en.ts
 *
 * English UI strings. This file defines the SHAPE of every dictionary:
 * the exported `Dictionary` type is inferred from it, so any other
 * language file that omits or misnames a key fails the build. Tool and
 * category names live in the registry (not here) — see i18n/content.ts.
 */

export const en = {
  nav: {
    home: "Home",
    tools: "Tools",
    pricing: "Pricing",
    blog: "Blog",
    soon: "Soon",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    mainNav: "Main",
    mobileNav: "Mobile",
    breadcrumb: "Breadcrumb",
    language: "Language",
    toggleTheme: "Toggle theme",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    exploreTools: "Explore tools",
  },
  home: {
    heroBadge: "{count} tools · nothing leaves your device",
    heroTitle: "Save hours with powerful online tools.",
    heroSubtitle:
      "Compress a PDF, shrink a photo, clean up text — every tool runs entirely in your browser. No uploads, no accounts, no waiting.",
    heroCtaPrimary: "Explore tools",
    heroCtaSecondary: "Merge a PDF",
    searchTip: "Every tool runs in your browser — nothing is uploaded.",
    tip: "Tip",
    popularTitle: "Most popular",
    popularDescription:
      "The tools people reach for most — PDF and image work that would otherwise need a desktop app.",
    recentTitle: "Recently added",
    recentDescription: "The newest additions to the catalog.",
    categoriesTitle: "Browse by category",
    allToolsTitle: "All tools",
    allToolsDescription: "Every tool in the catalog — {count} and counting.",
    openDirectory: "Open the directory",
  },
  tools: {
    directoryTitle: "Free online tools",
    directorySubtitle:
      "{count} fast, browser-based utilities for text, code, SEO, social media, images, and productivity. Everything runs locally — no uploads, no accounts, no waiting.",
    searchPlaceholder: "Search {count} tools — try “pdf”, “compress”, or “qr”…",
    searchLabel: "Search tools",
    clearSearch: "Clear search",
    filterByCategory: "Filter tools by category",
    all: "All",
    featured: "Featured tools",
    results: "Results",
    allTools: "All tools",
    toolCount: "{count} tool",
    toolCountPlural: "{count} tools",
    openTool: "Open tool",
    free: "Free",
    pro: "Pro",
    popular: "Popular",
    new: "New",
    featuredBadge: "Featured",
    relatedKeywords: "Related keywords",
    moreInCategory: "More {category} tools",
    viewAllInCategory: "View all {category} tools",
    browseOtherCategories: "Browse other categories",
    allCategoryTools: "All {category} tools",
    launchingSoon: "Launching soon",
    comingSoonTitle: "{tool} is in the final stretch",
    comingSoonBody:
      "This tool is being built right now and will run entirely in your browser — free, private, and with no sign-up. In the meantime, the rest of the catalog is one click away.",
    browseAll: "Browse all tools",
    loadingTool: "Loading tool…",
  },
  search: {
    emptyTitle: "No tools match your search",
    emptyBody:
      "Nothing matches “{query}”. Try a different keyword, or browse the full catalog.",
    emptyBodyCategory:
      "Nothing matches “{query}” in this category. Try a different keyword, or browse the full catalog.",
    clearFilters: "Clear search and filters",
    noMatches: "No tools match “{query}”.",
    browseCatalog: "Browse the full catalog",
    seeAllMatches: "See all {count} matches in the directory →",
    resultsFound: "{count} tools found",
  },
  footer: {
    tagline:
      "Fast, free, browser-based tools for developers, writers, and everyday tasks. No sign-up required.",
    product: "Product",
    resources: "Resources",
    legal: "Legal",
    social: "Social",
    allTools: "All tools",
    pricing: "Pricing",
    whatsNew: "What's new",
    blog: "Blog",
    contact: "Contact",
    about: "About",
    privacy: "Privacy policy",
    terms: "Terms of service",
    rights: "© {year} ToolSprint. All rights reserved.",
    builtFor: "Built for speed. No sign-up required.",
  },
  comingSoon: {
    label: "Coming soon",
    toolsTitle: "The first tools are almost ready",
    toolsBody:
      "We're putting the finishing touches on the first batch: text utilities, converters, and generators — all running entirely in your browser, with nothing to install and no sign-up.",
    pricingTitle: "Free while in early access",
    pricingBody:
      "Every tool on ToolSprint is free to use right now — no account and no usage limits. Paid plans with pro features will arrive later, and everything that's free today stays free.",
    pricingCta: "Use the free tools",
    blogTitle: "Guides and walkthroughs, on the way",
    blogBody:
      "We're writing practical, no-fluff articles: how to get the most out of each tool, workflow tips, and comparisons that help you pick the right tool for the job.",
    blogCta: "Explore the tools",
    backHome: "Back to home",
  },
  errors: {
    notFoundTitle: "This page doesn't exist",
    notFoundBody:
      "The page you're looking for may have moved, or the link may be wrong. The tool catalog is one click away.",
    genericTitle: "Something went wrong",
    genericBody:
      "An unexpected error interrupted this page. Reloading usually fixes it.",
    tryAgain: "Try again",
    backToTools: "Back to tools",
  },
  common: {
    copy: "Copy",
    copied: "Copied",
    clear: "Clear",
    download: "Download",
    remove: "Remove",
    close: "Close",
  },
};

/**
 * The shape every dictionary must satisfy.
 *
 * NOTE: `en` is deliberately NOT declared `as const`. With const
 * assertions each string would narrow to its own literal type ("Home"),
 * and a translation ("الرئيسية") could never satisfy it. Widening to
 * `string` keeps the useful guarantee — same keys, same nesting, no
 * missing or extra entries — while allowing different values per
 * language.
 */
export type Dictionary = typeof en;
