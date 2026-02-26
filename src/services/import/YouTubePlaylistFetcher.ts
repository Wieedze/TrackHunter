import { nanoid } from 'nanoid';
import type { TrackInput } from '../../types/track.ts';
import { YouTubeTitleParser } from './YouTubeTitleParser.ts';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    channelTitle: string;
    resourceId: { videoId: string };
  };
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
  pageInfo: { totalResults: number };
}

/**
 * Fetches tracks from a YouTube playlist via Data API v3.
 * Uses YouTubeTitleParser to clean video titles into artist/title pairs.
 */
export class YouTubePlaylistFetcher {
  static async fetch(playlistId: string): Promise<{
    tracks: TrackInput[];
    skipped: string[];
    filtered: string[];
  }> {
    if (!API_KEY) {
      throw new Error('YouTube API key not configured. Set VITE_YOUTUBE_API_KEY in .env');
    }

    const tracks: TrackInput[] = [];
    const skipped: string[] = [];
    const filtered: string[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        part: 'snippet',
        playlistId,
        maxResults: '50',
        key: API_KEY,
      });
      if (pageToken) params.set('pageToken', pageToken);

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(
          `YouTube API error: ${response.status} — ${errorData?.error?.message ?? 'Unknown'}`,
        );
      }

      const data = (await response.json()) as YouTubePlaylistResponse;

      for (const item of data.items) {
        const title = item.snippet.title;

        // Skip private/deleted videos
        if (title === 'Private video' || title === 'Deleted video') continue;

        // Check if it's a DJ set
        if (YouTubeTitleParser.isDJSet(title)) {
          filtered.push(title);
          continue;
        }

        const parsed = YouTubeTitleParser.parse(title);

        if (!parsed) {
          skipped.push(title);
          continue;
        }

        tracks.push({
          id: nanoid(),
          artist: parsed.artist,
          title: parsed.title,
        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return { tracks, skipped, filtered };
  }
}
