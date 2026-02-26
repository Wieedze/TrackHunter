import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';
import { proxyFetch } from '../proxy.ts';

interface TraxsourceScrapedResult {
  title: string;
  artist: string;
  url: string;
  price?: number;
  genre?: string;
  label?: string;
  artworkUrl?: string;
}

interface TraxsourceResponse {
  platform: string;
  query: string;
  results: TraxsourceScrapedResult[];
}

/**
 * Traxsource Provider — searches via Cloudflare Worker proxy (scraping).
 */
export class TraxsourceProvider extends BaseProvider {
  platform = Platform.TRAXSOURCE as const;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const searchTerm = `${query.artist} ${query.title}`;
    const response = await proxyFetch('traxsource', searchTerm) as TraxsourceResponse;

    if (!response.results || !Array.isArray(response.results)) return [];

    return response.results.map((item) => ({
      platform: Platform.TRAXSOURCE,
      url: item.url,
      title: item.title,
      artist: item.artist,
      artworkUrl: item.artworkUrl,
      available: true,
      price: item.price,
      currency: '$',
      confidence: this.computeConfidence(query, {
        title: item.title,
        artist: item.artist,
      }),
    }));
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await proxyFetch('traxsource', 'test');
      return response != null;
    } catch {
      return false;
    }
  }
}
