import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { HomeSearch } from "@/components/marketing/HomeSearch";
import { CategoryGrid } from "@/components/shared/CategoryGrid";
import { ToolSection } from "@/components/shared/ToolSection";
import { Container } from "@/components/ui/Container";
import {
  getCollection,
  getRecentTools,
  getToolsInCollection,
  sortByRank,
  tools,
} from "@/registry/tools";

/**
 * app/(marketing)/page.tsx
 *
 * The homepage. Section order (Milestone 11.1): Hero → Search → Most
 * Popular → Recently Added → Browse by Category → All Tools.
 *
 * Everything below the search box is a Server Component reading straight
 * from the registry, so the whole page stays statically generated and
 * fully crawlable; HomeSearch is the single client island.
 *
 * No list is hardcoded here: Popular comes from collection membership,
 * Recently Added from createdAt, categories from the category registry,
 * and All Tools from the shared popular → featured → rest ranking.
 */

export const metadata: Metadata = {
  description: `Browse ${tools.length} free, browser-based tools for PDFs, images, text, development, SEO, and productivity. Instant, private, no sign-up.`,
};

export default function HomePage() {
  const popularCollection = getCollection("popular");
  const popularTools = getToolsInCollection("popular");
  const recentTools = getRecentTools();
  const allTools = sortByRank(tools);

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      <Container className="flex flex-col gap-14 pb-20">
        {/* 2. Search */}
        <HomeSearch />

        {/* 3. Most Popular */}
        {popularCollection && (
          <ToolSection
            id="popular"
            emoji="⭐"
            title={popularCollection.title}
            description={popularCollection.description}
            tools={popularTools}
          />
        )}

        {/* 4. Recently Added */}
        <ToolSection
          id="recent"
          emoji="🆕"
          title="Recently added"
          description="The newest additions to the catalog."
          tools={recentTools}
        />

        {/* 5. Browse by Category */}
        <section aria-labelledby="categories-heading" className="flex flex-col gap-4">
          <h2
            id="categories-heading"
            className="text-xl font-bold tracking-tight"
          >
            Browse by category
          </h2>
          <CategoryGrid />
        </section>

        {/* 6. All Tools */}
        <ToolSection
          id="all-tools"
          title="All tools"
          description={`Every tool in the catalog — ${tools.length} and counting.`}
          tools={allTools}
          action={{ href: "/tools", label: "Open the directory" }}
        />
      </Container>
    </>
  );
}
