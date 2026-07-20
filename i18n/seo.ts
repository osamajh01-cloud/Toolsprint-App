import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { locales, localeMeta, type Locale } from "@/i18n/config";

/**
 * i18n/seo.ts
 *
 * Localized SEO helpers. Every page passes its locale-agnostic path (e.g.
 * "/tools/pdf-merge") and gets back canonical + hreflang alternates that
 * point at the right per-language URLs.
 *
 * hreflang policy: one entry per locale plus x-default pointing at the
 * default language, which is what Google expects for a site where the
 * bare path redirects rather than serving content.
 */

/** Absolute URL for a path in a given locale. */
export function localeUrl(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}/${locale}${clean}`;
}

/** canonical + hreflang alternates for a page, in every language. */
export function localeAlternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const other of locales) {
    languages[localeMeta[other].htmlLang] = localeUrl(other, path);
  }
  languages["x-default"] = localeUrl("en", path);

  return {
    canonical: localeUrl(locale, path),
    languages,
  } satisfies Metadata["alternates"];
}

/** Open Graph locale block: the active language plus its alternates. */
export function openGraphLocale(locale: Locale) {
  return {
    locale: localeMeta[locale].ogLocale,
    alternateLocale: locales
      .filter((other) => other !== locale)
      .map((other) => localeMeta[other].ogLocale),
  };
}
