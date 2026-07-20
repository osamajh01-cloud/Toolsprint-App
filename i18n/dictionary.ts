import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * i18n/dictionary.ts
 *
 * Dictionary loading. Each language is a dynamic import, so a request for
 * an English page never downloads the Arabic strings (and vice versa) —
 * the "lazy-load translation files" requirement, satisfied at the module
 * level rather than at runtime in the browser.
 *
 * Pages are Server Components, so the dictionary is resolved during
 * rendering and only the rendered text reaches the client. Client islands
 * receive the strings they need as props.
 */

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/i18n/dictionaries/en").then((module) => module.en),
  ar: () => import("@/i18n/dictionaries/ar").then((module) => module.ar),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

/**
 * Fill {placeholders} in a translated string.
 * t("{count} tools", { count: 27 }) → "27 tools"
 *
 * Values are stringified as-is; counts stay in Western digits, which is
 * standard in Gulf-market software UI and matches the tabular figures
 * used across the product.
 */
export function t(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
