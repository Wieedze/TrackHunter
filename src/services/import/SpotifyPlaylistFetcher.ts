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
    const res = await fetch(`${WORKER_URL}/api/spotify/playlist?id=${encodeURIComponent(playlistId)}`);

    if (!res.ok) {
      const body = await res.json().catch(() => null) as { error?: string } | null;
      throw new Error(body?.error ?? `Spotify fetch failed: ${res.status}`);
    }

    const data = (await res.json()) as SpotifyWorkerResponse;

    if (data.error) throw new Error(data.error);

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
