# Deploy — Cloudflare Workers (Git-connected)

The site is static: `pnpm build` runs Vite, then pre-renders every content route
to HTML (`scripts/prerender.mjs`, route metadata in `src/seo.ts`):

| URL | File | Content |
|---|---|---|
| `/`, `/guide`, `/blog`, `/about`, `/privacy`, `/terms`, `/blog/<slug>` | `dist/<path>.html` | full markup + per-page `<head>` (title, description, canonical, Open Graph, JSON-LD) |
| `/results`, `/wishlist`, `/stats`, `/settings` | `dist/<path>.html` | empty app shell, `noindex` |
| anything else | `dist/404.html` | empty app shell, `noindex`, HTTP 404 |

The build also generates `dist/sitemap.xml` and `dist/llms.txt` from `src/seo.ts`,
so a new article only needs an entry in `src/pages/articles/index.ts` (+ its
component in `ArticleLayout.tsx`).

## Worker

[`wrangler.jsonc`](../wrangler.jsonc) declares the assets-only Worker
`trackhunter` serving `./dist`. Create it once in the dashboard:

1. Workers & Pages → Create → Import a repository → this repo.
2. Build command: `pnpm run build` — Deploy command: `npx wrangler deploy` (no
   extra flags, so `wrangler.jsonc` drives the deploy). Root: `/`.
3. Build variables (Settings → Build → Variables and secrets):

   | Name | Value |
   |---|---|
   | `VITE_WORKER_URL` | `https://trackhunter-proxy.maxime-moodz.workers.dev` |
   | `VITE_YOUTUBE_API_KEY` | same as the GitHub secret |
   | `VITE_DISCOGS_TOKEN` | same as the GitHub secret |

4. Check the `*.workers.dev` URL (e.g. `/blog/bpm-key-guide-for-djs` must
   answer 200 with the article text in the HTML).

## Custom domain

`track-hunter.com` and `www.track-hunter.com` are custom domains of the
`trackhunter` Worker (Settings → Domains), on Cloudflare DNS. The site moved off
GitHub Pages on 2026-10-20 (its SPA 404 fallback hid every page but `/` from
crawlers).

- `www` → apex: Rules → Redirect Rules → "Redirect from WWW to root".
- Visitor stats: Analytics & Logs → Web Analytics on the `track-hunter.com` site.

## After the switch

- Google Search Console + Bing Webmaster: resubmit `https://track-hunter.com/sitemap.xml`
  and request indexing of `/blog` and the articles (they used to answer 404).
