import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';

interface DeezerTrack {
  id: number;
  title: string;
  link: string;
  duration: number;
  preview: string;
  artist: { id: number; name: string };
  album: { id: number; title: string; cover_medium: string };
}

interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
}

/**
 * Deezer Provider — Free API, no auth required, CORS OK.
 * Search endpoint: https://api.deezer.com/search?q=...
 * Also provides 30s preview URLs for free.
 */
export class DeezerProvider extends BaseProvider {
  platform = Platform.DEEZER;

  private baseUrl = 'https://api.deezer.com';

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    const searchQuery = `${query.artist} ${query.title}`;
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(searchQuery)}&limit=5`;

    const response = await fetch(url);
    if (!response.ok) return [];

    const data = (await response.json()) as DeezerSearchResponse;
    if (!data.data) return [];

    return data.data.map((track) => ({
      platform: Platform.DEEZER,
      externalId: String(track.id),
      url: track.link,
      title: track.title,
      artist: track.artist.name,
      available: true,
      previewUrl: track.preview,
      artworkUrl: track.album.cover_medium,
      confidence: this.computeConfidence(query, {
        title: track.title,
        artist: track.artist.name,
      }),
      format: 'Stream',
      quality: '128kbps',
    }));
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/infos`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
