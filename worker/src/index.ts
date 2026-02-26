/**
 * TrackHunter — Cloudflare Worker (CORS Proxy + Scraper)
 *
 * Routes:
 *   GET /health             → Health check
 *   GET /scrape/bandcamp    → Scrape Bandcamp search results
 *   GET /scrape/beatport    → Scrape Beatport search results
 *   GET /scrape/traxsource  → Scrape Traxsource search results
 */

import { scrapeBandcamp } from './scrapers/bandcamp.ts';
import { scrapeBeatport } from './scrapers/beatport.ts';
import { scrapeTraxsource } from './scrapers/traxsource.ts';

export interface Env {}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const query = url.searchParams.get('q');

    try {
      if (path === '/health') {
        return json({ status: 'ok', timestamp: new Date().toISOString() });
      }

      if (path === '/scrape/bandcamp') {
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        const itemType = (url.searchParams.get('type') as 't' | 'a') ?? 't';
        const results = await scrapeBandcamp(query, itemType);
        return json({ platform: 'bandcamp', query, results });
      }

      if (path === '/scrape/beatport') {
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        const results = await scrapeBeatport(query);
        return json({ platform: 'beatport', query, results });
      }

      if (path === '/scrape/traxsource') {
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        const results = await scrapeTraxsource(query);
        return json({ platform: 'traxsource', query, results });
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error';
      return json({ error: message }, 500);
    }
  },
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}
