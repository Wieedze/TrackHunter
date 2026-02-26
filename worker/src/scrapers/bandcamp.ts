/**
 * Bandcamp search scraper.
 * Scrapes bandcamp.com/search?q=...&item_type=t for track results.
 *
 * TODO: Implement with HTMLRewriter or regex-based parsing.
 */
export interface BandcampResult {
  title: string;
  artist: string;
  url: string;
  artworkUrl?: string;
}

export async function scrapeBandcamp(_query: string): Promise<BandcampResult[]> {
  // TODO: Phase 4 implementation
  return [];
}
