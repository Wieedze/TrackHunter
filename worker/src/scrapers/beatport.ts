/**
 * Beatport search scraper.
 * Scrapes beatport.com/search?q=... for track results.
 *
 * Beatport is heavily JS-rendered, so we try to extract data from
 * the __NEXT_DATA__ JSON blob embedded in the page, or fall back
 * to a simpler regex approach.
 */

export interface BeatportResult {
  title: string;
  artist: string;
  url: string;
  price?: number;
  bpm?: number;
  key?: string;
  genre?: string;
  label?: string;
  artworkUrl?: string;
}

export async function scrapeBeatport(query: string): Promise<BeatportResult[]> {
  const searchUrl = `https://www.beatport.com/search?q=${encodeURIComponent(query)}`;

  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Beatport returned ${response.status}`);
  }

  const html = await response.text();

  // Try __NEXT_DATA__ first (Beatport uses Next.js)
  const nextDataResults = parseNextData(html);
  if (nextDataResults.length > 0) return nextDataResults;

  // Fallback: regex parsing
  return parseHtmlFallback(html);
}

function parseNextData(html: string): BeatportResult[] {
  const match = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return [];

  try {
    const data = JSON.parse(match[1]);
    // Navigate to track results — structure may vary
    const props = data?.props?.pageProps;
    const tracks = props?.searchResults?.tracks?.data
      ?? props?.dehydratedState?.queries?.[0]?.state?.data?.tracks?.data
      ?? [];

    if (!Array.isArray(tracks)) return [];

    return tracks.slice(0, 10).map((track: Record<string, unknown>) => {
      const artists = Array.isArray(track.artists)
        ? (track.artists as Array<{ name: string }>).map((a) => a.name).join(', ')
        : '';
      const genre = Array.isArray(track.genre)
        ? (track.genre as Array<{ name: string }>)[0]?.name
        : typeof track.genre === 'object' && track.genre !== null
          ? (track.genre as { name: string }).name
          : undefined;

      return {
        title: String(track.name ?? track.title ?? ''),
        artist: artists,
        url: `https://www.beatport.com/track/${track.slug ?? ''}/${track.id ?? ''}`,
        bpm: typeof track.bpm === 'number' ? track.bpm : undefined,
        key: typeof track.key === 'object' && track.key !== null
          ? (track.key as { name: string }).name
          : undefined,
        genre,
        label: typeof track.release === 'object' && track.release !== null
          ? (track.release as { label?: { name: string } }).label?.name
          : undefined,
        artworkUrl: typeof track.release === 'object' && track.release !== null
          ? (track.release as { image?: { uri: string } }).image?.uri
          : undefined,
      } satisfies BeatportResult;
    });
  } catch {
    return [];
  }
}

function parseHtmlFallback(html: string): BeatportResult[] {
  const results: BeatportResult[] = [];

  // Try to find track links in the HTML
  // Pattern: <a href="/track/slug/123456">Track Name</a>
  const trackPattern = /<a[^>]+href="(\/track\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;

  const seen = new Set<string>();
  while ((match = trackPattern.exec(html)) !== null && results.length < 10) {
    const path = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();

    if (!text || seen.has(path)) continue;
    seen.add(path);

    results.push({
      title: text,
      artist: '', // Hard to extract from fallback
      url: `https://www.beatport.com${path}`,
    });
  }

  return results;
}
