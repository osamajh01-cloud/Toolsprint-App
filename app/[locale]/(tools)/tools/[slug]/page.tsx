import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolShell } from "@/components/tools/ToolShell";
import { getToolImplementation } from "@/components/tools/implementations";
import { breadcrumbJsonLd, jsonLdString, toolJsonLd } from "@/lib/seo";
import {
  getCategory,
  getToolBySlug,
  getToolsByCategory,
  tools,
} from "@/registry/tools";
import { localizeCategory, localizeTool, localizeTools } from "@/i18n/content";
import { getDictionary, t } from "@/i18n/dictionary";
import { localeAlternates, localeUrl, openGraphLocale } from "@/i18n/seo";
import { localePath } from "@/i18n/paths";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";

/**
 * app/[locale]/(tools)/tools/[slug]/page.tsx
 *
 * THE dynamic tool route — one file serves every tool in every language.
 * generateStaticParams() crosses the locale list with the registry, so
 * all tool pages are pre-rendered per language (SSG preserved), each with
 * its own translated metadata, canonical URL, hreflang alternates, and
 * localized JSON-LD.
 *
 * Slugs are intentionally NOT translated: one URL per tool per language
 * keeps links stable, avoids a second slug namespace to maintain, and
 * lets hreflang pair the pages cleanly.
 */

interface ToolPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tools.map((tool) => ({ locale, slug: tool.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const raw = getToolBySlug(slug);
  if (!raw) return {};
  const tool = localizeTool(raw, active);

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: localeAlternates(active, `/tools/${tool.slug}`),
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: localeUrl(active, `/tools/${tool.slug}`),
      ...openGraphLocale(active),
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const raw = getToolBySlug(slug);
  if (!raw) notFound();

  const dictionary = await getDictionary(active);
  const tool = localizeTool(raw, active);
  const rawCategory = getCategory(raw.category);
  const category = rawCategory ? localizeCategory(rawCategory, active) : undefined;

  const related = localizeTools(
    getToolsByCategory(raw.category)
      .filter((other) => other.slug !== raw.slug)
      .slice(0, 3),
    active,
  );

  const ToolUi = getToolImplementation(raw.slug);

  return (
    <Container className="py-12 sm:py-16">
      {/* schema.org SoftwareApplication — localized name/description */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString({
            ...toolJsonLd(tool),
            url: localeUrl(active, `/tools/${tool.slug}`),
            inLanguage: active,
          }),
        }}
      />
      {/* schema.org BreadcrumbList — mirrors the visible trail */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: dictionary.nav.home, url: localeUrl(active, "/") },
              { name: dictionary.nav.tools, url: localeUrl(active, "/tools") },
              ...(category
                ? [
                    {
                      name: category.title,
                      url: localeUrl(active, `/tools/category/${category.slug}`),
                    },
                  ]
                : []),
              { name: tool.title },
            ]),
          ),
        }}
      />

      <ToolShell tool={tool} locale={active} dictionary={dictionary}>
        {ToolUi ? <ToolUi /> : undefined}
      </ToolShell>

      {related.length > 0 && category && (
        <section aria-labelledby="related-heading" className="mt-14">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="related-heading" className="text-lg font-semibold">
              {t(dictionary.tools.moreInCategory, { category: category.title })}
            </h2>
            <Link
              href={localePath(active, `/tools/category/${category.slug}`)}
              className="rounded-sm text-sm font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t(dictionary.tools.viewAllInCategory, {
                category: category.title,
              })}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <ToolCard
                key={other.id}
                tool={other}
                locale={active}
                dictionary={dictionary}
              />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
