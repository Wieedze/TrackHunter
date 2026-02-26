import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';
import { proxyFetch } from '../proxy.ts';

interface BandcampScrapedResult {
  title: string;
  artist: string;
  album?: string;
  url: string;
  artworkUrl?: string;
  genre?: string;
  releaseDate?: string;
}

interface BandcampResponse {
  platform: string;
  query: string;
  results: BandcampScrapedResult[];
}

/**
 * Bandcamp Provider — searches via Cloudflare Worker proxy (scraping).
 * Searches both tracks and albums to maximize coverage.
 */
export class BandcampProvider extends BaseProvider {
  platform = Platform.BANDCAMP as const;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const searchTerm = `${query.artist} ${query.title}`;

    // Search tracks and albums in parallel
    const [trackResults, albumResults] = await Promise.allSettled([
      proxyFetch('bandcamp', searchTerm, { type: 't' }) as Promise<BandcampResponse>,
      proxyFetch('bandcamp', searchTerm, { type: 'a' }) as Promise<BandcampResponse>,
    ]);

    const all: PlatformResult[] = [];

    if (trackResults.status === 'fulfilled' && Array.isArray(trackResults.value.results)) {
      all.push(...this.mapResults(trackResults.value.results, query));
    }

    if (albumResults.status === 'fulfilled' && Array.isArray(albumResults.value.results)) {
      all.push(...this.mapResults(albumResults.value.results, query));
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    return all.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });
  }

  private mapResults(items: BandcampScrapedResult[], query: TrackQuery): PlatformResult[] {
    return items.map((item) => ({
      platform: Platform.BANDCAMP,
      url: item.url,
      title: item.title,
      artist: item.artist,
      artworkUrl: item.artworkUrl,
      available: true,
      confidence: this.computeConfidence(query, {
        title: item.title,
        artist: item.artist,
      }),
      extras: {
        releaseDate: item.releaseDate,
      },
    }));
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await proxyFetch('bandcamp', 'test');
      return response != null;
    } catch {
      return false;
    }
  }
}
