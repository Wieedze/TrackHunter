import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';
import { proxyFetch } from '../proxy.ts';

interface BeatportScrapedResult {
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

interface BeatportResponse {
  platform: string;
  query: string;
  results: BeatportScrapedResult[];
}

/**
 * Beatport Provider — searches via Cloudflare Worker proxy (scraping).
 */
export class BeatportProvider extends BaseProvider {
  platform = Platform.BEATPORT as const;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const response = await proxyFetch('beatport', `${query.artist} ${query.title}`);
    const data = response as BeatportResponse;

    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item) => ({
      platform: Platform.BEATPORT,
      url: item.url,
      title: item.title,
      artist: item.artist,
      artworkUrl: item.artworkUrl,
      available: true,
      price: item.price,
      confidence: this.computeConfidence(query, {
        title: item.title,
        artist: item.artist,
      }),
      extras: {
        bpm: item.bpm,
        key: item.key,
      },
    }));
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await proxyFetch('beatport', 'test');
      return response != null;
    } catch {
      return false;
    }
  }
}
