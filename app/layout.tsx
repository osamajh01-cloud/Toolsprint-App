import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteConfig } from "@/config/site";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

/**
 * app/layout.tsx
 *
 * Root layout for the entire application. Every route (marketing, tools,
 * blog, auth, dashboard) renders inside this shell, so it should only
 * contain truly global concerns: fonts, base HTML structure, and default
 * (fallback) metadata. Section-specific chrome (headers/footers/sidebars)
 * belongs in each route group's own layout.tsx, added in later milestones.
 */

/**
 * Fonts are self-hosted via Vercel's official `geist` package (wraps
 * next/font/local) instead of next/font/google. This makes builds
 * deterministic — no network fetch to fonts.googleapis.com at build time,
 * which is both faster and immune to third-party outages breaking deploys.
 * The packages expose the same `--font-geist-sans` / `--font-geist-mono`
 * CSS variables consumed by the @theme block in globals.css.
 */
const geistSans = GeistSans;
const geistMono = GeistMono;

/**
 * Default metadata for the whole site. Individual pages can override any
 * of these fields via their own `generateMetadata` / `metadata` export;
 * Next.js merges them, so this acts as a sensible fallback (important for
 * SEO — every page should always resolve to a complete <title>/<meta>).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        ThemeScript runs before paint and may add `.dark` to <html>, which
        the server can't predict — hence suppressHydrationWarning above.
      */}
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
