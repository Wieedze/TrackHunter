import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';
import { BaseProvider } from './BaseProvider.ts';

interface MBRecording {
  id: string;
  title: string;
  'artist-credit'?: Array<{ name: string; artist: { id: string; name: string } }>;
  releases?: Array<{
    id: string;
    title: string;
    date?: string;
    'label-info'?: Array<{ label?: { name: string } }>;
  }>;
  isrcs?: string[];
  score: number;
}

interface MBSearchResponse {
  recordings: MBRecording[];
  count: number;
}

/**
 * MusicBrainz Provider — Free API, CORS OK, requires User-Agent.
 * Rate limit: 1 req/sec.
 */
export class MusicBrainzProvider extends BaseProvider {
  platform = Platform.MUSICBRAINZ;

  private baseUrl = 'https://musicbrainz.org/ws/2';
  private lastRequestTime = 0;

  async search(query: TrackQuery): Promise<PlatformResult[]> {
    // Rate limit: 1 req/sec
    await this.throttle();

    const searchQuery = `recording:"${query.title}" AND artist:"${query.artist}"`;
    const url = `${this.baseUrl}/recording?query=${encodeURIComponent(searchQuery)}&fmt=json&limit=5`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'TrackHunter/1.0.0 (https://trackhunter.app)' },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as MBSearchResponse;
    if (!data.recordings) return [];

    return data.recordings.map((rec) => {
      const artist = rec['artist-credit']?.[0]?.name ?? '';
      const release = rec.releases?.[0];
      return {
        platform: Platform.MUSICBRAINZ,
        externalId: rec.id,
        url: `https://musicbrainz.org/recording/${rec.id}`,
        title: rec.title,
        artist,
        available: true,
        confidence: this.computeConfidence(query, { title: rec.title, artist }),
        extras: {
          releaseDate: release?.date,
        },
      } satisfies PlatformResult;
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/recording?query=test&fmt=json&limit=1`, {
        headers: { 'User-Agent': 'TrackHunter/1.0.0 (https://trackhunter.app)' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < 1100) {
      await new Promise((resolve) => setTimeout(resolve, 1100 - elapsed));
    }
    this.lastRequestTime = Date.now();
  }
}
