/**
 * Detects the type of input (text vs. platform link) and routes accordingly.
 */

export type InputType =
  | { type: 'text' }
  | { type: 'spotify_playlist'; id: string }
  | { type: 'youtube_playlist'; id: string }
  | { type: 'soundcloud_set'; url: string }
  | { type: 'deezer_playlist'; id: string }
  | { type: 'unknown_link'; url: string };

export class LinkResolver {
  static detect(input: string): InputType {
    const trimmed = input.trim();

    // Spotify playlist
    const spotifyMatch = trimmed.match(
      /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    );
    if (spotifyMatch) {
      return { type: 'spotify_playlist', id: spotifyMatch[1] };
    }

    // YouTube playlist
    const ytMatch = trimmed.match(
      /(?:youtube\.com|youtu\.be)\/.*[?&]list=([a-zA-Z0-9_-]+)/,
    );
    if (ytMatch) {
      return { type: 'youtube_playlist', id: ytMatch[1] };
    }

    // SoundCloud set
    if (/soundcloud\.com\/.*\/sets\//.test(trimmed)) {
      return { type: 'soundcloud_set', url: trimmed };
    }

    // Deezer playlist
    const deezerMatch = trimmed.match(/deezer\.com\/.*\/playlist\/(\d+)/);
    if (deezerMatch) {
      return { type: 'deezer_playlist', id: deezerMatch[1] };
    }

    // Generic URL
    if (/^https?:\/\//.test(trimmed)) {
      return { type: 'unknown_link', url: trimmed };
    }

    // Default: free text
    return { type: 'text' };
  }
}
