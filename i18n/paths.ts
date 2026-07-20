import type { Locale } from "@/i18n/config";

/**
 * i18n/paths.ts
 *
 * Locale-aware path helpers. These are pure functions used by BOTH server
 * and client components, so they must live outside any "use client"
 * module — a client module's exports can't be called during server
 * rendering, only rendered as components or passed as props.
 */

/** Prefix a path with a locale: localePath("ar", "/tools") → "/ar/tools". */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
