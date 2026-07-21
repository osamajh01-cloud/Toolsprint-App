import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * app/manifest.ts
 *
 * Web app manifest at /manifest.webmanifest. Names come from the site
 * config (so the TOOLAK rebrand flows here automatically), and the icons
 * point at the brand mark rendered to PNG in public/icons. Theme/background
 * colors match the design tokens (warm neutral background, teal-ish theme).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf9",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
