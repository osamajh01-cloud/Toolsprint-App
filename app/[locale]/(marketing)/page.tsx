import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { HomeSearch } from "@/components/marketing/HomeSearch";
import { StatsBand } from "@/components/marketing/StatsBand";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { Faq } from "@/components/marketing/Faq";
import { CtaBand } from "@/components/marketing/CtaBand";
import { CategoryGrid } from "@/components/shared/CategoryGrid";
import { ToolSection } from "@/components/shared/ToolSection";
import { Container } from "@/components/ui/Container";
import {
  getFeaturedTools,
  getPopularTools,
  getRecentTools,
} from "@/registry/tools";
import { localizeTools } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionary";
import { localeAlternates, openGraphLocale } from "@/i18n/seo";
import { faqJsonLd, jsonLdString, organizationJsonLd } from "@/lib/seo";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * app/[locale]/(marketing)/page.tsx
 *
 * The homepage as a full product landing page (Milestone 14). Section
 * order: Hero → Search → Stats → Most Popular → Featured → Recently
 * Added → Categories → Why TOOLAK → FAQ → CTA.
 *
 * Registry-driven throughout: Popular reads the `popular` flag, Featured
 * the `featured` flag, Recently Added derives from createdAt, and the
 * stats band counts tools/categories/locales — no list on this page is
 * hardcoded. HomeSearch remains the only client island; everything else
 * is statically generated per locale.
 *
 * Structured data: Organization JSON-LD plus FAQPage JSON-LD generated
 * from the same dictionary array the visible FAQ renders.
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

  const title = `${dictionary.home.heroTitle} — TOOLAK`;
  const description = dictionary.home.heroSubtitle;

  return {
    title: { absolute: title },
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

  const popularTools = localizeTools(getPopularTools(), active);
  const featuredTools = localizeTools(getFeaturedTools(), active);
  const recentTools = localizeTools(getRecentTools(), active);

  return (
    <>
      {/* Structured data: Organization + FAQ (same source as visible FAQ) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(faqJsonLd(dictionary.faq.items)),
        }}
      />

      <Hero locale={active} dictionary={dictionary} />

      <StatsBand dictionary={dictionary} />

      <Container className="flex flex-col gap-16 py-16 pb-24">
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
          id="featured"
          emoji="✨"
          title={dictionary.featuredSection.title}
          description={dictionary.featuredSection.description}
          tools={featuredTools}
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

        <WhyChooseUs dictionary={dictionary} />

        <Faq dictionary={dictionary} />

        <CtaBand locale={active} dictionary={dictionary} />
      </Container>
    </>
  );
}
