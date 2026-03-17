import type { TrackInput } from '../../types/track.ts';

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export interface Recommendation {
  id: string;
  title: string;
  artist: string;
  url: string;
  artworkUrl?: string;
  source: 'bandcamp';
}

/**
 * Find similar tracks on Bandcamp by searching the artist name.
 * Uses the Cloudflare Worker scraper to bypass CORS.
 */
export class RecommendationEngine {
  static async getRecommendations(
    track: TrackInput,
    limit: number = 5,
  ): Promise<Recommendation[]> {
    try {
      // Search Bandcamp for the artist name
      const query = track.artist;
      const res = await fetch(
        `${WORKER_URL}/scrape/bandcamp?q=${encodeURIComponent(query)}&type=t`,
      );
      if (!res.ok) return [];

      const data = await res.json() as {
        results: { title: string; artist: string; url: string; artworkUrl?: string }[];
      };

      if (!data.results?.length) return [];

      // Filter out the current track and deduplicate
      const currentTitle = track.title.toLowerCase();
      const seen = new Set<string>();

      return data.results
        .filter((r) => {
          const titleLower = r.title.toLowerCase();
          if (titleLower.includes(currentTitle) || currentTitle.includes(titleLower)) return false;
          const key = `${r.artist.toLowerCase()}|${titleLower}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, limit)
        .map((r, i) => ({
          id: `bc-${i}`,
          title: r.title,
          artist: r.artist,
          url: r.url,
          artworkUrl: r.artworkUrl,
          source: 'bandcamp' as const,
        }));
    } catch {
      return [];
    }
  }
}
