import type { TrackInput } from '../../types/track.ts';

export interface Recommendation {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  source: 'musicbrainz' | 'discogs';
  url?: string;
}

const MB_BASE = 'https://musicbrainz.org/ws/2';
const MB_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'TrackHunter/0.1.0 (https://trackhunter.app)',
};

/**
 * Find similar tracks via MusicBrainz artist lookup → other recordings by same artist
 * and related artists (if available).
 */
export class RecommendationEngine {
  private static lastRequestMs = 0;

  /** Throttle MusicBrainz requests to 1/s */
  private static async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestMs;
    if (elapsed < 1100) {
      await new Promise((r) => setTimeout(r, 1100 - elapsed));
    }
    this.lastRequestMs = Date.now();
  }

  /**
   * Get recommendations for a track.
   * Strategy:
   * 1. Search MusicBrainz for the artist
   * 2. Get other recordings by the same artist (different from the input track)
   * 3. If artist has relations, get recordings from related artists
   */
  static async getRecommendations(
    track: TrackInput,
    limit: number = 5,
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    try {
      // Step 1: Find artist on MusicBrainz
      const artistId = await this.findArtistId(track.artist);
      if (!artistId) return [];

      // Step 2: Get other recordings by this artist
      const artistTracks = await this.getArtistRecordings(artistId, track.title);
      recommendations.push(...artistTracks);

      // Step 3: Get related artists and their top recordings
      if (recommendations.length < limit) {
        const relatedTracks = await this.getRelatedArtistTracks(artistId, limit - recommendations.length);
        recommendations.push(...relatedTracks);
      }
    } catch {
      // Silently fail — recommendations are non-critical
    }

    // Deduplicate by title+artist
    const seen = new Set<string>();
    return recommendations.filter((r) => {
      const key = `${r.artist.toLowerCase()}|${r.title.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, limit);
  }

  private static async findArtistId(artistName: string): Promise<string | null> {
    await this.throttle();
    const url = `${MB_BASE}/artist?query=artist:"${encodeURIComponent(artistName)}"&fmt=json&limit=1`;
    const res = await fetch(url, { headers: MB_HEADERS });
    if (!res.ok) return null;
    const data = await res.json();
    return data.artists?.[0]?.id ?? null;
  }

  private static async getArtistRecordings(
    artistId: string,
    excludeTitle: string,
  ): Promise<Recommendation[]> {
    await this.throttle();
    const url = `${MB_BASE}/recording?artist=${artistId}&fmt=json&limit=10&offset=${Math.floor(Math.random() * 20)}`;
    const res = await fetch(url, { headers: MB_HEADERS });
    if (!res.ok) return [];
    const data = await res.json();

    const excludeLower = excludeTitle.toLowerCase();
    return (data.recordings ?? [])
      .filter((r: any) => !r.title.toLowerCase().includes(excludeLower))
      .slice(0, 3)
      .map((r: any) => ({
        id: r.id,
        title: r.title,
        artist: r['artist-credit']?.[0]?.name ?? 'Unknown',
        album: r.releases?.[0]?.title,
        year: r['first-release-date'] ? parseInt(r['first-release-date'].slice(0, 4)) : undefined,
        source: 'musicbrainz' as const,
        url: `https://musicbrainz.org/recording/${r.id}`,
      }));
  }

  private static async getRelatedArtistTracks(
    artistId: string,
    limit: number,
  ): Promise<Recommendation[]> {
    await this.throttle();
    // Get artist relations (member-of, collaboration, etc.)
    const url = `${MB_BASE}/artist/${artistId}?inc=artist-rels&fmt=json`;
    const res = await fetch(url, { headers: MB_HEADERS });
    if (!res.ok) return [];
    const data = await res.json();

    const relatedArtists = (data.relations ?? [])
      .filter((rel: any) => rel.type === 'member of band' || rel.type === 'collaboration' || rel.type === 'subgroup')
      .map((rel: any) => rel.artist)
      .filter(Boolean)
      .slice(0, 2);

    const results: Recommendation[] = [];
    for (const artist of relatedArtists) {
      if (results.length >= limit) break;
      await this.throttle();
      const recUrl = `${MB_BASE}/recording?artist=${artist.id}&fmt=json&limit=3`;
      const recRes = await fetch(recUrl, { headers: MB_HEADERS });
      if (!recRes.ok) continue;
      const recData = await recRes.json();

      for (const r of recData.recordings ?? []) {
        if (results.length >= limit) break;
        results.push({
          id: r.id,
          title: r.title,
          artist: r['artist-credit']?.[0]?.name ?? artist.name ?? 'Unknown',
          album: r.releases?.[0]?.title,
          year: r['first-release-date'] ? parseInt(r['first-release-date'].slice(0, 4)) : undefined,
          source: 'musicbrainz',
          url: `https://musicbrainz.org/recording/${r.id}`,
        });
      }
    }

    return results;
  }
}
