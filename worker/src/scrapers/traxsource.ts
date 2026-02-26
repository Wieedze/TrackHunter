/**
 * Traxsource search scraper.
 * Scrapes traxsource.com/search?term=... for track results.
 * Traxsource serves server-rendered HTML, so regex parsing works.
 */

export interface TraxsourceResult {
  title: string;
  artist: string;
  url: string;
  price?: number;
  genre?: string;
  label?: string;
  artworkUrl?: string;
}

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

export async function scrapeTraxsource(query: string): Promise<TraxsourceResult[]> {
  const searchUrl = `https://www.traxsource.com/search?term=${encodeURIComponent(query)}`;

  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Traxsource returned ${response.status}`);
  }

  const html = await response.text();
  return parseTraxsourceResults(html);
}

function parseTraxsourceResults(html: string): TraxsourceResult[] {
  const results: TraxsourceResult[] = [];

  // Traxsource wraps each track in a <div class="trk-row ...">
  const trackBlocks = html.split(/class="trk-row\b/);

  for (let i = 1; i < trackBlocks.length && results.length < 10; i++) {
    const block = trackBlocks[i];

    // Extract track URL and title from the track title link
    // Pattern: <a ... class="trk-name" ... href="/track/..." ...>Title</a>
    const titleMatch = block.match(
      /class="trk-name[^"]*"[^>]*href="(\/track\/[^"]+)"[^>]*>([^<]+)/
    );
    if (!titleMatch) continue;

    const path = titleMatch[1].trim();
    const title = titleMatch[2].trim();

    // Extract artist(s)
    // Pattern: <a ... class="com-artists" or inside artist-name spans
    const artistMatch = block.match(/class="com-artists[^"]*"[^>]*>([^<]+)/);
    let artist = artistMatch?.[1]?.trim() ?? '';

    // Alternative: gather all artist links
    if (!artist) {
      const artistLinks: string[] = [];
      const artistPattern = /class="art-name[^"]*"[^>]*>([^<]+)/g;
      let m;
      while ((m = artistPattern.exec(block)) !== null) {
        artistLinks.push(m[1].trim());
      }
      artist = artistLinks.join(', ');
    }

    if (!artist) {
      // Fallback: look in a broader artist container
      const artistContainerMatch = block.match(/class="artists[^"]*">([\s\S]*?)<\/div/);
      if (artistContainerMatch) {
        artist = artistContainerMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      }
    }

    // Extract label
    const labelMatch = block.match(/class="label[^"]*"[^>]*>([^<]+)/);
    const label = labelMatch?.[1]?.trim();

    // Extract genre
    const genreMatch = block.match(/class="genre[^"]*"[^>]*>([^<]+)/);
    const genre = genreMatch?.[1]?.trim();

    // Extract artwork
    const artMatch = block.match(/<img[^>]+src="([^"]+)"[^>]*class="trk-artwork/);
    const artworkUrl = artMatch?.[1]?.trim()
      // Also try generic image in the block
      ?? block.match(/<img[^>]+src="(https:\/\/geo-media\.traxsource\.com[^"]+)"/)?.[1]?.trim();

    // Extract price
    const priceMatch = block.match(/class="price[^"]*"[^>]*>\s*\$?([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : undefined;

    results.push({
      title,
      artist,
      url: `https://www.traxsource.com${path}`,
      price,
      genre,
      label,
      artworkUrl,
    });
  }

  return results;
}
