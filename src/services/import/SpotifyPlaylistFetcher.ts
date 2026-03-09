import { nanoid } from 'nanoid';
import type { TrackInput } from '../../types/track.ts';

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

interface SpotifyWorkerResponse {
  platform: string;
  playlistId: string;
  results: Array<{
    title: string;
    artist: string;
    album?: string;
    duration?: number;
    isrc?: string;
  }>;
  error?: string;
}

/**
 * Fetches tracks from a Spotify playlist via the Worker proxy (Client Credentials).
 * No user login required — works for public playlists only.
 */
export class SpotifyPlaylistFetcher {
  static async fetch(playlistId: string): Promise<TrackInput[]> {
    const url = `${WORKER_URL}/api/spotify/playlist?id=${encodeURIComponent(playlistId)}`;
    console.log('[SpotifyFetcher] Requesting:', url);
    console.log('[SpotifyFetcher] WORKER_URL:', WORKER_URL);

    let res: Response;
    try {
      res = await fetch(url);
    } catch (err) {
      console.error('[SpotifyFetcher] Network error (fetch threw):', err);
      throw new Error(`Cannot reach worker at ${WORKER_URL}: ${err instanceof Error ? err.message : err}`);
    }

    console.log('[SpotifyFetcher] Response status:', res.status, res.statusText);
    console.log('[SpotifyFetcher] Response headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const rawBody = await res.text().catch(() => '');
      console.error('[SpotifyFetcher] Error response body:', rawBody);
      let parsed: { error?: string } | null = null;
      try { parsed = JSON.parse(rawBody); } catch { /* not JSON */ }
      throw new Error(parsed?.error ?? `Spotify fetch failed: ${res.status} — ${rawBody.slice(0, 200)}`);
    }

    const rawText = await res.text();
    console.log('[SpotifyFetcher] Raw response (first 500 chars):', rawText.slice(0, 500));

    let data: SpotifyWorkerResponse;
    try {
      data = JSON.parse(rawText) as SpotifyWorkerResponse;
    } catch {
      console.error('[SpotifyFetcher] Failed to parse JSON:', rawText.slice(0, 300));
      throw new Error('Worker returned invalid JSON');
    }

    if (data.error) {
      console.error('[SpotifyFetcher] Worker returned error:', data.error);
      throw new Error(data.error);
    }

    console.log('[SpotifyFetcher] Got', data.results?.length ?? 0, 'tracks');

    return data.results.map((t) => ({
      id: nanoid(),
      artist: t.artist,
      title: t.title,
      album: t.album,
      duration: t.duration,
      isrc: t.isrc,
    }));
  }
}
