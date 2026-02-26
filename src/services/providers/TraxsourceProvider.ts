import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';

/**
 * Traxsource Provider — generates a manual search link.
 * Traxsource blocks Worker requests, so we provide a direct search URL.
 */
export class TraxsourceProvider extends BaseProvider {
  platform = Platform.TRAXSOURCE;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const searchTerm = `${query.artist} ${query.title}`;
    const url = `https://www.traxsource.com/search?term=${encodeURIComponent(searchTerm)}`;

    return [{
      platform: Platform.TRAXSOURCE,
      url,
      title: query.title,
      artist: query.artist,
      available: true,
      confidence: 0,
      manualSearch: true,
    }];
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
