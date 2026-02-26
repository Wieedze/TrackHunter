/**
 * Beatport search scraper — DEPRECATED.
 *
 * Beatport is fully JS-rendered (React Server Components) so scraping
 * from a Cloudflare Worker does not work. The frontend now generates
 * manual search links instead.
 *
 * This stub is kept so the Worker route doesn't 500.
 */

export interface BeatportResult {
  title: string;
  artist: string;
  url: string;
}

export async function scrapeBeatport(_query: string): Promise<BeatportResult[]> {
  return [];
}
