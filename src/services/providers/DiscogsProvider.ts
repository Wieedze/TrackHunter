import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';

const DISCOGS_TOKEN = import.meta.env.VITE_DISCOGS_TOKEN as string | undefined;

/**
 * Discogs Provider — uses the Discogs API when a token is configured.
 * Falls back to a manual search link when no token is available.
 * Get a free token at: https://www.discogs.com/settings/developers
 */
export class DiscogsProvider extends BaseProvider {
  platform = Platform.DISCOGS;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const searchTerm = `${query.artist} ${query.title}`;

    // No token → manual search link
    if (!DISCOGS_TOKEN) {
      return [{
        platform: Platform.DISCOGS,
        url: `https://www.discogs.com/search/?q=${encodeURIComponent(searchTerm)}&type=release`,
        title: query.title,
        artist: query.artist,
        available: true,
        confidence: 0,
        manualSearch: true,
      }];
    }

    const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(searchTerm)}&type=release&per_page=5`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TrackHunter/1.0 +https://github.com/trackhunter',
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Discogs API: ${response.status}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await response.json() as any;

    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results
      .filter((item: { title?: string }) => item.title)
      .slice(0, 5)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => {
        // Discogs title format: "Artist - Title"
        const parts = (item.title as string).split(' - ');
        const artist = parts[0]?.trim() ?? '';
        const title = parts.slice(1).join(' - ').trim() || item.title;

        return {
          platform: Platform.DISCOGS,
          url: item.uri
            ? `https://www.discogs.com${item.uri.replace('/releases/', '/release/')}`
            : `https://www.discogs.com/search/?q=${encodeURIComponent(searchTerm)}`,
          title,
          artist,
          artworkUrl: item.cover_image || item.thumb,
          available: true,
          confidence: this.computeConfidence(query, { title, artist }),
          extras: {
            releaseDate: item.year ? String(item.year) : undefined,
          },
        } satisfies PlatformResult;
      });
  }

  async isAvailable(): Promise<boolean> {
    return true; // Always available (manual search fallback)
  }
}
