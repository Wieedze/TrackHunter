import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';

/**
 * Beatport Provider — generates a manual search link.
 * Beatport is fully JS-rendered so scraping doesn't work from a Worker.
 * Instead we provide a direct search URL for the user to click.
 */
export class BeatportProvider extends BaseProvider {
  platform = Platform.BEATPORT as const;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const searchTerm = `${query.artist} ${query.title}`;
    const url = `https://www.beatport.com/search?q=${encodeURIComponent(searchTerm)}`;

    return [{
      platform: Platform.BEATPORT,
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
