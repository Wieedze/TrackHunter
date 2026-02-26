/**
 * TrackHunter — Cloudflare Worker (CORS Proxy)
 *
 * Routes:
 *   GET /health          → Health check
 *   GET /scrape/bandcamp → Scrape Bandcamp search results
 *   GET /scrape/beatport → Scrape Beatport search results
 *   GET /scrape/traxsource → Scrape Traxsource search results
 */

export interface Env {
  // Add KV namespace bindings, secrets, etc. here as needed
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/health') {
        return json({ status: 'ok', timestamp: new Date().toISOString() });
      }

      if (path === '/scrape/bandcamp') {
        const query = url.searchParams.get('q');
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        // TODO: Implement Bandcamp scraper
        return json({ platform: 'bandcamp', query, results: [] });
      }

      if (path === '/scrape/beatport') {
        const query = url.searchParams.get('q');
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        // TODO: Implement Beatport scraper
        return json({ platform: 'beatport', query, results: [] });
      }

      if (path === '/scrape/traxsource') {
        const query = url.searchParams.get('q');
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        // TODO: Implement Traxsource scraper
        return json({ platform: 'traxsource', query, results: [] });
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
