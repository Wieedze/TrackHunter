/**
 * Detects the type of input (text vs. platform link) and routes accordingly.
 */

export type InputType =
  | { type: 'text' }
  | { type: 'spotify_playlist'; id: string }
  | { type: 'spotify_track'; id: string }
  | { type: 'spotify_album'; id: string }
  | { type: 'youtube_playlist'; id: string }
  | { type: 'youtube_mix' }
  | { type: 'soundcloud_set'; url: string }
  | { type: 'unknown_link'; url: string };

export class LinkResolver {
  static detect(input: string): InputType {
    const trimmed = input.trim();

    // Spotify playlist
    const spotifyMatch = trimmed.match(
      /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?playlist\/([a-zA-Z0-9]+)/,
    );
    if (spotifyMatch) {
      return { type: 'spotify_playlist', id: spotifyMatch[1] };
    }

    // Spotify track
    const spotifyTrackMatch = trimmed.match(
      /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]+)/,
    );
    if (spotifyTrackMatch) {
      return { type: 'spotify_track', id: spotifyTrackMatch[1] };
    }

    // Spotify album
    const spotifyAlbumMatch = trimmed.match(
      /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?album\/([a-zA-Z0-9]+)/,
    );
    if (spotifyAlbumMatch) {
      return { type: 'spotify_album', id: spotifyAlbumMatch[1] };
    }

    // YouTube playlist / mix
    const ytMatch = trimmed.match(
      /(?:youtube\.com|youtu\.be)\/.*[?&]list=([a-zA-Z0-9_-]+)/,
    );
    if (ytMatch) {
      const listId = ytMatch[1];
      // YouTube Mix/Radio IDs start with "RD" — these are auto-generated and not accessible via API
      if (listId.startsWith('RD')) {
        return { type: 'youtube_mix' };
      }
      return { type: 'youtube_playlist', id: listId };
    }

    // SoundCloud set
    if (/soundcloud\.com\/.*\/sets\//.test(trimmed)) {
      return { type: 'soundcloud_set', url: trimmed };
    }

    // Generic URL
    if (/^https?:\/\//.test(trimmed)) {
      return { type: 'unknown_link', url: trimmed };
    }

    // Default: free text
    return { type: 'text' };
  }
}
