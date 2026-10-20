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

`track-hunter.com` already uses Cloudflare DNS. Its apex A records point to
GitHub Pages (185.199.108-111.153, DNS only). To switch:

1. Delete those four A records (and a `www` CNAME to `*.github.io` if any).
2. Worker `trackhunter` → Settings → Domains & Routes → Add custom domain →
   `track-hunter.com` (and `www.track-hunter.com`).
3. Analytics: the Worker's Metrics tab counts requests; for visitor stats like
   OddWave's, enable Web Analytics on the `track-hunter.com` site
   (Analytics & Logs → Web Analytics → automatic setup).
4. Once the domain answers from Cloudflare (`curl -sI https://track-hunter.com`
   shows `server: cloudflare`), disable GitHub Pages and delete
   `.github/workflows/deploy.yml` and `public/CNAME`.

## After the switch

- Google Search Console + Bing Webmaster: resubmit `https://track-hunter.com/sitemap.xml`
  and request indexing of `/blog` and the articles (they used to answer 404).
