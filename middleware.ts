import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  isLocale,
  locales,
  matchLocale,
} from "@/i18n/config";

/**
 * middleware.ts
 *
 * Locale routing. Every page lives under a locale prefix (/en/…, /ar/…),
 * and unprefixed URLs redirect to one of them. That means each page has
 * exactly ONE canonical URL per language — serving identical HTML at both
 * "/" and "/en" would be duplicate content, which is why the root
 * redirects rather than rendering.
 *
 * Locale choice on an unprefixed request, in priority order:
 *   1. the toolsprint-locale cookie (an explicit past choice),
 *   2. the Accept-Language header (browser detection on first visit),
 *   3. the default locale.
 *
 * Static assets, API routes, and the SEO files are excluded via the
 * matcher below so they're never rewritten.
 */
/** Root-served files that must never be locale-prefixed. */
const PUBLIC_FILES = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  "/manifest.webmanifest",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEO/metadata files and any static asset (anything with an extension)
  // are served as-is. This check lives in the function rather than the
  // matcher because matcher lookaheads proved unreliable for the dotted
  // filenames here — sitemap.xml was being redirected to /en/sitemap.xml.
  if (PUBLIC_FILES.has(pathname) || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Already localized (/en/... or /ar/...)? Let it through.
  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Run on page routes only. Excluded:
     *  - /api routes and /_next internals
     *  - the SEO/metadata files served from the app root
     *  - any path containing a dot (static assets)
     *
     * The dot-check is a separate alternative from the named files
     * because Next.js compiles each matcher entry independently; folding
     * them into one lookahead let `sitemap.xml` slip through and get
     * redirected to /en/sitemap.xml.
     */
    "/((?!api|_next).*)",
  ],
};

export { locales };
