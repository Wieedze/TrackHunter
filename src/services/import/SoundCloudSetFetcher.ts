import { nanoid } from 'nanoid';
import type { TrackInput } from '../../types/track.ts';

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

interface SoundCloudTrackResult {
  title: string;
  artist: string;
  duration?: number;
  url: string;
}

interface SoundCloudResponse {
  platform: string;
  url: string;
  results: SoundCloudTrackResult[];
}

/**
 * Fetches tracks from a SoundCloud set/playlist via Worker scraper.
 */
export class SoundCloudSetFetcher {
  static async fetch(setUrl: string): Promise<TrackInput[]> {
    const params = new URLSearchParams({ url: setUrl });
    const fetchUrl = `${WORKER_URL}/scrape/soundcloud?${params.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(fetchUrl, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`SoundCloud scraping failed: ${response.status}`);
      }

      const data = (await response.json()) as SoundCloudResponse;

      if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error('No tracks found in SoundCloud set. The set may be private.');
      }

      return data.results.map((track) => cleanSoundCloudTrack(track));
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Clean SoundCloud track metadata.
 * - Strip bracket content from artist: "Artist [Label]" → "Artist"
 * - If title contains "Artist - Track", split it properly
 * - Remove duplicate artist prefix from title
 */
function cleanSoundCloudTrack(raw: SoundCloudTrackResult): TrackInput {
  // Clean artist: remove [Label], (Label), etc.
  let artist = raw.artist.replace(/\s*[\[\(][^\]\)]*[\]\)]\s*/g, '').trim();

  let title = raw.title;

  // If title contains " - ", it likely has "Artist - Title" format
  const separators = [' - ', ' – ', ' — '];
  for (const sep of separators) {
    const idx = title.indexOf(sep);
    if (idx > 0) {
      const titleArtist = title.substring(0, idx).trim();
      const titleTrack = title.substring(idx + sep.length).trim();
      if (titleTrack) {
        // Use the artist from the title (more accurate than username)
        artist = titleArtist;
        title = titleTrack;
        break;
      }
    }
  }

  // If title still starts with the artist name, strip it
  const artistLower = artist.toLowerCase();
  const titleLower = title.toLowerCase();
  if (titleLower.startsWith(artistLower)) {
    const rest = title.substring(artist.length).replace(/^[\s\-–—:]+/, '').trim();
    if (rest) title = rest;
  }

  // Clean numbering prefixes: "1- ", "02. ", etc.
  title = title.replace(/^\d+[\s.\-–—)]+\s*/, '');

  // If title still has "Artist - Track" after numbering removal
  for (const sep of separators) {
    const idx = title.indexOf(sep);
    if (idx > 0) {
      const part1 = title.substring(0, idx).trim();
      const part2 = title.substring(idx + sep.length).trim();
      if (part2) {
        artist = part1;
        title = part2;
        break;
      }
    }
  }

  return {
    id: nanoid(),
    artist,
    title,
    duration: raw.duration,
  };
}
