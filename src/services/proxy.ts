/**
 * Client for the Cloudflare Worker proxy.
 * Used to scrape Bandcamp and Beatport.
 *
 * Fails gracefully if the worker is not running — providers using this
 * will simply return no results (handled by Promise.allSettled in orchestrator).
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export async function proxyFetch(
  platform: 'bandcamp' | 'beatport',
  query: string,
  params?: Record<string, string>,
): Promise<unknown> {
  const searchParams = new URLSearchParams({ q: query, ...params });
  const url = `${WORKER_URL}/scrape/${platform}?${searchParams.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Proxy error (${platform}): ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}
