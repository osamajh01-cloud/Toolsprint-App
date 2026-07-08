# ToolSprint

**Save hours with powerful online tools.**

ToolSprint is a production SaaS built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. It is designed to scale to 100+ browser-based tools, each with its own SEO-optimized route, driven by a central tool registry.

## Status

🚧 **Milestone 1 complete** — project bootstrap, architecture skeleton, root layout, global design tokens, and public homepage. See the roadmap for what ships next.

## Tech stack

- [Next.js 15](https://nextjs.org) — App Router, React Server Components
- TypeScript (strict)
- Tailwind CSS v4 (CSS-first configuration in `app/globals.css`)
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional for local dev; defaults are safe
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Local dev server (Turbopack)     |
| `npm run build` | Production build                 |
| `npm run start` | Serve the production build       |
| `npm run lint`  | ESLint                           |

## Project structure (high level)

```
app/            App Router routes, split into route groups:
  (marketing)/    Public marketing pages (homepage, about, pricing…)
  (tools)/        Tool directory + per-tool dynamic routes
  (blog)/         Blog (future)
  (auth)/         Auth UI (future)
  (dashboard)/    Authenticated dashboard (future)
  api/            Route handlers (future)
components/     Layered by reusability: ui/ → layout/ → shared/ → section-specific
registry/       Tool + category + plan metadata (the scaling core: tools are data, not folders)
lib/            Vendor/framework-adjacent logic (seo, auth, db, stripe — added per milestone)
content/        MDX content (blog posts, tool docs)
hooks/          Cross-cutting client hooks
types/          Shared TypeScript contracts
config/         Static site config (site.ts, navigation.ts)
prisma/         Database schema (reserved for future milestones)
```

Each folder's purpose is documented in its `.gitkeep` until populated.

## Deployment (Vercel)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected; no custom build settings are required.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL under Project → Settings → Environment Variables.
4. Every push to `main` deploys production; every PR gets a preview URL.
