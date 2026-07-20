import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, locales, localeMeta, type Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { siteConfig } from "@/config/site";

/**
 * app/[locale]/layout.tsx
 *
 * The locale boundary. Everything user-facing renders beneath it, so this
 * is where the language is resolved once per request and shared downward:
 *
 * - generateStaticParams() enumerates the locales, so every page is still
 *   statically generated per language (SSG preserved, one build artifact
 *   per locale).
 * - The dictionary is loaded here (a dynamic import — only the requested
 *   language's strings are pulled in) and handed to LocaleProvider so
 *   client islands can read strings without prop-drilling.
 * - `dir` and `lang` are applied to the content wrapper; the root layout
 *   sets them on <html> via the same locale param.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  const meta = localeMeta[locale];

  return {
    title: {
      default: `${siteConfig.name} — ${dictionary.home.heroTitle}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: dictionary.home.heroSubtitle,
    openGraph: {
      locale: meta.ogLocale,
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => localeMeta[other].ogLocale),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale as Locale);
  const meta = localeMeta[locale as Locale];

  return (
    <div lang={meta.htmlLang} dir={meta.dir}>
      <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
        {children}
      </LocaleProvider>
    </div>
  );
}
