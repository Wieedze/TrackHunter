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
 */
export class BandcampProvider extends BaseProvider {
  platform = Platform.BANDCAMP as const;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const response = await proxyFetch('bandcamp', `${query.artist} ${query.title}`);
    const data = response as BandcampResponse;

    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item) => ({
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
