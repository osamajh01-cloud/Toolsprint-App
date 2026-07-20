import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { tools } from "@/registry/tools";
import { getDictionary, t } from "@/i18n/dictionary";
import { localeAlternates, openGraphLocale } from "@/i18n/seo";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * app/[locale]/(tools)/tools/page.tsx
 *
 * The tool directory, per language. Server Component: the SEO-relevant
 * hero renders as static HTML while ToolsDirectory (the client island)
 * handles search and filtering. The tool count comes from the registry,
 * so the copy can't drift from the catalog in either language.
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

  const title = dictionary.tools.directoryTitle;
  const description = t(dictionary.tools.directorySubtitle, {
    count: tools.length,
  });

  return {
    title,
    description,
    alternates: localeAlternates(active, "/tools"),
    openGraph: { title, description, ...openGraphLocale(active) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ToolsPage({ params }: PageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);

  return (
    <>
      <section className="border-b border-border bg-surface-sunken">
        <Container className="flex flex-col gap-3 py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {dictionary.tools.directoryTitle}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground-muted">
            {t(dictionary.tools.directorySubtitle, { count: tools.length })}
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <ToolsDirectory locale={active} dictionary={dictionary} />
      </Container>
    </>
  );
}
