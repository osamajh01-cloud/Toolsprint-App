import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { HomeSearch } from "@/components/marketing/HomeSearch";
import { CategoryGrid } from "@/components/shared/CategoryGrid";
import { ToolSection } from "@/components/shared/ToolSection";
import { Container } from "@/components/ui/Container";
import {
  getRecentTools,
  getToolsInCollection,
  sortByRank,
  tools,
} from "@/registry/tools";
import { getDictionary, t } from "@/i18n/dictionary";
import { localizeTools } from "@/i18n/content";
import { localeAlternates, openGraphLocale } from "@/i18n/seo";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * app/[locale]/(marketing)/page.tsx
 *
 * The homepage, in whichever language the URL asks for. Section order
 * (from Milestone 11.1): Hero → Search → Most Popular → Recently Added →
 * Browse by Category → All Tools.
 *
 * Everything except the search box is a Server Component reading from the
 * registry and the dictionary, so each language is statically generated
 * and fully crawlable. Tool text is localized through i18n/content, which
 * swaps the human-readable fields while leaving slugs and structure —
 * and therefore URLs — identical across languages.
 */

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);

  const title = `ToolSprint — ${dictionary.home.heroTitle}`;
  const description = dictionary.home.heroSubtitle;

  return {
    title,
    description,
    alternates: localeAlternates(active, "/"),
    openGraph: { title, description, ...openGraphLocale(active) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);

  const popularTools = localizeTools(getToolsInCollection("popular"), active);
  const recentTools = localizeTools(getRecentTools(), active);
  const allTools = localizeTools(sortByRank(tools), active);

  return (
    <>
      <Hero locale={active} dictionary={dictionary} />

      <Container className="flex flex-col gap-16 pb-24">
        <HomeSearch locale={active} dictionary={dictionary} />

        <ToolSection
          id="popular"
          emoji="⭐"
          title={dictionary.home.popularTitle}
          description={dictionary.home.popularDescription}
          tools={popularTools}
          locale={active}
          dictionary={dictionary}
        />

        <ToolSection
          id="recent"
          emoji="🆕"
          title={dictionary.home.recentTitle}
          description={dictionary.home.recentDescription}
          tools={recentTools}
          locale={active}
          dictionary={dictionary}
        />

        <section
          aria-labelledby="categories-heading"
          className="flex flex-col gap-4"
        >
          <h2
            id="categories-heading"
            className="text-xl font-bold tracking-tight"
          >
            {dictionary.home.categoriesTitle}
          </h2>
          <CategoryGrid locale={active} />
        </section>

        <ToolSection
          id="all-tools"
          title={dictionary.home.allToolsTitle}
          description={t(dictionary.home.allToolsDescription, {
            count: tools.length,
          })}
          tools={allTools}
          locale={active}
          dictionary={dictionary}
          action={{ href: "/tools", label: dictionary.home.openDirectory }}
        />
      </Container>
    </>
  );
}
