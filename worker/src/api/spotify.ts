/**
 * Spotify playlist fetcher using Client Credentials flow.
 * No user login required — works for public playlists only.
 */

export interface SpotifyTrackResult {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  isrc?: string;
}

// In-memory token cache (resets on cold start, which is fine)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Get a Client Credentials access token from Spotify.
 */
async function getToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as any;
  cachedToken = data.access_token;
  // Expire 60s early to avoid edge cases
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

/**
 * Fetch all tracks from a Spotify playlist (handles pagination).
 */
export async function fetchSpotifyPlaylist(
  playlistId: string,
  clientId: string,
  clientSecret: string,
): Promise<SpotifyTrackResult[]> {
  let token = await getToken(clientId, clientSecret);
  const results: SpotifyTrackResult[] = [];
  let retried = false;

  let nextUrl: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(name,artists,album,duration_ms,external_ids)),next`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) {
      // If 401/403 and we haven't retried yet, invalidate token cache and retry
      if ((res.status === 401 || res.status === 403) && !retried) {
        cachedToken = null;
        tokenExpiresAt = 0;
        token = await getToken(clientId, clientSecret);
        retried = true;
        continue; // Retry same URL with fresh token
      }
      if (res.status === 404) throw new Error('Spotify playlist not found. Is it public?');
      const body = await res.text().catch(() => '');
      throw new Error(`Spotify API returned ${res.status}: ${body}`);
    }

    retried = false; // Reset on success

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of data.items ?? []) {
      const track = item.track;
      if (!track || !track.name) continue; // Skip local/unavailable tracks

      results.push({
        title: track.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        artist: (track.artists ?? []).map((a: any) => a.name).join(', '),
        album: track.album?.name,
        duration: track.duration_ms ? Math.round(track.duration_ms / 1000) : undefined,
        isrc: track.external_ids?.isrc,
      });
    }

    nextUrl = data.next ?? null;
  }

  return results;
}
