import type { NextConfig } from "next";

/**
 * next.config.ts
 *
 * Kept intentionally minimal for Milestone 1 — Next.js defaults are already
 * production-grade on Vercel (static optimization, image optimization,
 * compression, HTTP caching). Future milestones will extend this file for:
 *  - MDX support (Milestone 10, blog)
 *  - image remotePatterns if external images are ever used
 *  - redirects/rewrites as the URL space grows
 */
const nextConfig: NextConfig = {
  // Fail builds on type errors and lint errors (production-quality gate).
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
