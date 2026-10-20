// Static pre-render, run after `vite build` + the SSR build of src/entry-server.tsx.
//
// For every route in src/seo.ts it writes a real HTML file into dist/:
//   /                 → dist/index.html
//   /blog             → dist/blog.html
//   /blog/<slug>      → dist/blog/<slug>.html
// Content pages get their rendered markup + their own <head> (title, description,
// canonical, Open Graph, JSON-LD). App screens (results, wishlist…) get an empty
// shell marked noindex. Cloudflare static assets and GitHub Pages both serve
// /blog from blog.html with a 200, so crawlers no longer hit SPA 404s.
//
// Also generates dist/sitemap.xml, dist/404.html and dist/llms.txt.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, ROUTES, SITE_URL, SITE_NAME, OG_IMAGE } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);

const template = await readFile(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--seo-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--seo-head--> / <!--app-html--> markers');
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headFor(meta) {
  const url = SITE_URL + (meta.path === '/' ? '/' : meta.path);
  const isArticle = meta.path.startsWith('/blog/');
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.indexable
      ? `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`
      : `<meta name="robots" content="noindex, follow" />`,
  ];
  if (meta.indexable) {
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      `<link rel="alternate" hreflang="en" href="${url}" />`,
      `<link rel="alternate" hreflang="x-default" href="${url}" />`,
      `<link rel="alternate" type="text/plain" title="LLM summary" href="${SITE_URL}/llms.txt" />`,
      `<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${esc(meta.title)}" />`,
      `<meta property="og:description" content="${esc(meta.description)}" />`,
      `<meta property="og:image" content="${OG_IMAGE}" />`,
      `<meta property="og:site_name" content="${SITE_NAME}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(meta.title)}" />`,
      `<meta name="twitter:description" content="${esc(meta.description)}" />`,
      `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    );
    if (isArticle && meta.lastmod) {
      tags.push(`<meta property="article:published_time" content="${meta.lastmod}" />`);
    }
  }
  for (const ld of meta.jsonLd ?? []) {
    // `<` is escaped so article text can never close the script tag.
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.map((t) => `  ${t}`).join('\n').trimStart();
}

function page(meta, appHtml) {
  return template.replace('<!--seo-head-->', () => headFor(meta)).replace('<!--app-html-->', () => appHtml);
}

function outFile(path) {
  return path === '/' ? join(dist, 'index.html') : join(dist, `${path.slice(1)}.html`);
}

let rendered = 0;
let shells = 0;
for (const meta of ROUTES) {
  const html = meta.indexable ? page(meta, render(meta.path)) : page(meta, '');
  const file = outFile(meta.path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  meta.indexable ? rendered++ : shells++;
}

// Unknown URLs: empty app shell, real 404 status (served by both hosts).
await writeFile(
  join(dist, '404.html'),
  page({ path: '/404', title: `Page not found — ${SITE_NAME}`, description: '', indexable: false }, ''),
);

// Sitemap — generated so new articles are never forgotten.
const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => r.indexable)
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${r.lastmod ?? today}</lastmod>
    <changefreq>${r.changefreq ?? 'monthly'}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`,
  )
  .join('\n');
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// llms.txt — plain-text map of the site for AI assistants / answer engines.
const articles = ROUTES.filter((r) => r.indexable && r.group === 'article');
const tools = ROUTES.filter((r) => r.indexable && r.group === 'tool');
const pagesList = ROUTES.filter((r) => r.indexable && !r.group && r.path !== '/');
const llms = `# ${SITE_NAME}

> ${SITE_NAME} (${SITE_URL}) is a free music search engine for DJs, collectors and music lovers. Paste a playlist from Spotify, YouTube or SoundCloud (or a plain "Artist - Title" tracklist) and it finds where every track can be bought on Bandcamp, Beatport, Discogs and MusicBrainz. No account required.

## What it does

- Imports public Spotify playlists and albums, YouTube playlists, SoundCloud sets, CSV files or pasted tracklists.
- Searches Bandcamp, Beatport, Discogs and MusicBrainz in parallel and ranks matches with a confidence score.
- Shows purchase links and previews so users can buy music directly from the platform they prefer (supporting artists rather than streaming).
- Keeps a local wishlist and search history in the browser; nothing is stored on a server.

## Tools

${tools.map((r) => `- [${r.title.replace(/ \| TrackHunter$/, '')}](${SITE_URL}${r.path}): ${r.description}`).join('\n')}

## Pages

${pagesList.map((r) => `- [${r.title}](${SITE_URL}${r.path}): ${r.description}`).join('\n')}

## Blog

${articles.map((r) => `- [${r.title.replace(/ — TrackHunter$/, '')}](${SITE_URL}${r.path}): ${r.description}`).join('\n')}
`;
await writeFile(join(dist, 'llms.txt'), llms);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${rendered} pages, ${shells} app shells, 404.html, sitemap.xml, llms.txt`);
