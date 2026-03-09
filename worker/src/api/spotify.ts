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
    console.log('[Spotify:Token] Using cached token (expires in', Math.round((tokenExpiresAt - now) / 1000), 's)');
    return cachedToken;
  }

  console.log('[Spotify:Token] Requesting new token...');
  console.log('[Spotify:Token] Client ID (first 8 chars):', clientId.slice(0, 8) + '...');
  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  console.log('[Spotify:Token] Response status:', res.status);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[Spotify:Token] Token request failed:', res.status, body);
    throw new Error(`Spotify token request failed: ${res.status} — ${body}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as any;
  cachedToken = data.access_token;
  // Expire 60s early to avoid edge cases
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;
  console.log('[Spotify:Token] Got token, expires_in:', data.expires_in, 's');
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
  console.log('[Spotify:Playlist] Fetching playlist:', playlistId);
  let token = await getToken(clientId, clientSecret);
  const results: SpotifyTrackResult[] = [];
  let retried = false;
  let page = 0;

  let nextUrl: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(name,artists,album,duration_ms,external_ids)),next`;

  while (nextUrl) {
    console.log('[Spotify:Playlist] Fetching page', page, ':', nextUrl);
    const res = await fetch(nextUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('[Spotify:Playlist] Page', page, 'status:', res.status);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Spotify:Playlist] Error on page', page, ':', res.status, body);
      // If 401/403 and we haven't retried yet, invalidate token cache and retry
      if ((res.status === 401 || res.status === 403) && !retried) {
        console.log('[Spotify:Playlist] Retrying with fresh token...');
        cachedToken = null;
        tokenExpiresAt = 0;
        token = await getToken(clientId, clientSecret);
        retried = true;
        continue; // Retry same URL with fresh token
      }
      if (res.status === 404) throw new Error('Spotify playlist not found. Is it public?');
      throw new Error(`Spotify API returned ${res.status}: ${body}`);
    }

    retried = false; // Reset on success

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    console.log('[Spotify:Playlist] Page', page, '- items:', data.items?.length ?? 0, '- has next:', !!data.next);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of data.items ?? []) {
      const track = item.track;
      if (!track || !track.name) {
        console.log('[Spotify:Playlist] Skipping item (no track/name):', JSON.stringify(item).slice(0, 100));
        continue;
      }

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
    page++;
  }

  console.log('[Spotify:Playlist] Done — total tracks:', results.length);
  return results;
}
