/**
 * Client for the Cloudflare Worker proxy.
 * Used to scrape Bandcamp, Beatport, and Traxsource.
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export async function proxyFetch(
  platform: 'bandcamp' | 'beatport' | 'traxsource',
  query: string,
): Promise<unknown> {
  const url = `${WORKER_URL}/scrape/${platform}?q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Proxy error (${platform}): ${response.status} ${response.statusText}`);
  }

  return response.json();
}
