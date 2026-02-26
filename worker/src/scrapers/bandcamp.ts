/**
 * Bandcamp search scraper.
 * Scrapes bandcamp.com/search?q=...&item_type=t (tracks) or &item_type=a (albums).
 * Uses regex-based parsing (no Cheerio in Workers).
 */

export interface BandcampResult {
  title: string;
  artist: string;
  album?: string;
  url: string;
  artworkUrl?: string;
  genre?: string;
  releaseDate?: string;
}

export async function scrapeBandcamp(
  query: string,
  itemType: 't' | 'a' = 't',
): Promise<BandcampResult[]> {
  const searchUrl = `https://bandcamp.com/search?q=${encodeURIComponent(query)}&item_type=${itemType}`;

  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Bandcamp returned ${response.status}`);
  }

  const html = await response.text();
  return parseSearchResults(html);
}

function parseSearchResults(html: string): BandcampResult[] {
  const results: BandcampResult[] = [];

  // Match each search result item block
  // Bandcamp wraps results in <li class="searchresult ...">
  const resultBlocks = html.split(/class="searchresult\s/);

  for (let i = 1; i < resultBlocks.length && results.length < 10; i++) {
    const block = resultBlocks[i];

    // Extract URL from heading link
    const urlMatch = block.match(/class="heading">\s*<a\s+href="([^"]+)"/);
    const url = urlMatch?.[1]?.trim();
    if (!url) continue;

    // Extract title from heading link text
    const titleMatch = block.match(/class="heading">\s*<a[^>]*>\s*([^<]+)/);
    const title = titleMatch?.[1]?.trim();
    if (!title) continue;

    // Extract artist/subhead — "by <artist>" or "from <album> by <artist>"
    const subheadMatch = block.match(/class="subhead">\s*([\s\S]*?)\s*<\/div/);
    let artist = '';
    let album: string | undefined;

    if (subheadMatch) {
      const subhead = subheadMatch[1].replace(/<[^>]+>/g, '').trim();
      // Pattern: "from <album> by <artist>" or just "by <artist>"
      const fromByMatch = subhead.match(/from\s+(.+?)\s+by\s+(.+)/);
      if (fromByMatch) {
        album = fromByMatch[1].trim();
        artist = fromByMatch[2].trim();
      } else {
        const byMatch = subhead.match(/by\s+(.+)/);
        if (byMatch) {
          artist = byMatch[1].trim();
        }
      }
    }

    // Extract artwork
    const artMatch = block.match(/<img[^>]+src="([^"]+)"/);
    const artworkUrl = artMatch?.[1]?.trim();

    // Extract genre
    const genreMatch = block.match(/class="genre">\s*genre:\s*([^<]+)/i);
    const genre = genreMatch?.[1]?.trim();

    // Extract release date
    const dateMatch = block.match(/class="released">\s*released\s+([^<]+)/i);
    const releaseDate = dateMatch?.[1]?.trim();

    results.push({
      title,
      artist,
      album,
      url,
      artworkUrl,
      genre,
      releaseDate,
    });
  }

  return results;
}
