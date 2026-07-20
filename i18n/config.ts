/**
 * i18n/config.ts
 *
 * Locale registry — the single source of truth for which languages exist.
 * Adding a third language means: add an entry here, add a dictionary file,
 * and add the tool/category translations. Routing, metadata, hreflang,
 * sitemap, and the language switcher all read from this list, so none of
 * them need editing.
 */

export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleMeta {
  code: Locale;
  /** Native name, shown in the switcher (never translated). */
  name: string;
  /** Short label for compact UI. */
  short: string;
  dir: "ltr" | "rtl";
  /** BCP 47 tag for <html lang> and Open Graph. */
  htmlLang: string;
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    name: "English",
    short: "EN",
    dir: "ltr",
    htmlLang: "en",
    ogLocale: "en_US",
  },
  ar: {
    code: "ar",
    name: "العربية",
    short: "AR",
    dir: "rtl",
    htmlLang: "ar",
    ogLocale: "ar_SA",
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Cookie the switcher writes and middleware reads on later visits. */
export const LOCALE_COOKIE = "toolsprint-locale";

/**
 * Pick the best locale from an Accept-Language header, falling back to
 * the default. Parses quality values so "ar;q=0.9, en;q=0.8" resolves
 * correctly, and matches on the primary subtag so "ar-SA" finds "ar".
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        quality: q ? Number(q.split("=")[1]) || 0 : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return defaultLocale;
}
