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

/**
 * Clean up track titles by removing BPM indicators, "Original Mix", etc.
 */
function cleanTitle(title: string): string {
  return title
    .replace(/\s*[\(\[]\s*\d{2,3}\s*[Bb][Pp][Mm]\s*[\)\]]/g, '') // (150 Bpm), [148 BPM]
    .replace(/\s*-\s*\d{2,3}\s*[Bb][Pp][Mm]\s*/g, '')             // - 150 Bpm
    .replace(/\s*\d{2,3}\s*[Bb][Pp][Mm]\s*$/g, '')                 // trailing 150 Bpm
    .replace(/\s*[\(\[]\s*Original Mix\s*[\)\]]/gi, '')             // (Original Mix)
    .replace(/\s*-\s*Original Mix\s*$/gi, '')                       // - Original Mix
    .trim();
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
 * Fetch all tracks from a Spotify playlist via the embed page.
 * This bypasses the API playlist endpoint restriction for dev apps.
 */
export async function fetchSpotifyPlaylist(
  playlistId: string,
  _clientId: string,
  _clientSecret: string,
): Promise<SpotifyTrackResult[]> {
  console.log('[Spotify:Playlist] Fetching playlist via embed:', playlistId);

  const res = await fetch(`https://open.spotify.com/embed/playlist/${playlistId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TrackHunter/1.0)',
    },
  });

  console.log('[Spotify:Playlist] Embed status:', res.status);

  if (!res.ok) {
    if (res.status === 404) throw new Error('Spotify playlist not found. Is it public?');
    throw new Error(`Spotify embed returned ${res.status}`);
  }

  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/);
  if (!match) {
    console.error('[Spotify:Playlist] Could not find __NEXT_DATA__ in embed page');
    throw new Error('Could not parse Spotify playlist. It may be private or unavailable.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(match[1]);
  } catch {
    throw new Error('Failed to parse Spotify embed data.');
  }

  const trackList = data?.props?.pageProps?.state?.data?.entity?.trackList ?? [];
  console.log('[Spotify:Playlist] Found', trackList.length, 'tracks in embed');

  const results: SpotifyTrackResult[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const track of trackList) {
    if (!track.title) continue;

    // subtitle contains artist(s) separated by non-breaking spaces and commas
    const artist = (track.subtitle ?? '').replace(/\u00a0/g, ' ');

    results.push({
      title: cleanTitle(track.title),
      artist,
      duration: track.duration ? Math.round(track.duration / 1000) : undefined,
    });
  }

  console.log('[Spotify:Playlist] Done — total tracks:', results.length);
  return results;
}

/**
 * Fetch a single track from Spotify by ID.
 */
export async function fetchSpotifyTrack(
  trackId: string,
  clientId: string,
  clientSecret: string,
): Promise<SpotifyTrackResult> {
  console.log('[Spotify:Track] Fetching track:', trackId);
  const token = await getToken(clientId, clientSecret);

  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  console.log('[Spotify:Track] Status:', res.status);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[Spotify:Track] Error:', res.status, body);
    if (res.status === 404) throw new Error('Spotify track not found.');
    throw new Error(`Spotify API returned ${res.status}: ${body}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const track = (await res.json()) as any;

  return {
    title: cleanTitle(track.name),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artist: (track.artists ?? []).map((a: any) => a.name).join(', '),
    album: track.album?.name,
    duration: track.duration_ms ? Math.round(track.duration_ms / 1000) : undefined,
    isrc: track.external_ids?.isrc,
  };
}

/**
 * Fetch BPM + Key via Tunebat search API (proxied through worker to bypass CORS/Cloudflare).
 * Endpoint: https://api.tunebat.com/api/tracks/search?term=QUERY
 */
export async function fetchAudioFeatures(
  query: string,
): Promise<{ bpm: number; key: string } | null> {
  console.log('[AudioFeatures] Searching Tunebat for:', query);

  const res = await fetch(
    `https://api.tunebat.com/api/tracks/search?term=${encodeURIComponent(query)}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    },
  );

  console.log('[AudioFeatures] Tunebat status:', res.status);

  if (!res.ok) {
    console.log('[AudioFeatures] Tunebat request failed');
    return null;
  }

  const text = await res.text();
  console.log('[AudioFeatures] Response:', text.slice(0, 500));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  } catch {
    console.log('[AudioFeatures] Failed to parse JSON');
    return null;
  }

  const items = data?.data?.items;
  if (!items || items.length === 0) {
    console.log('[AudioFeatures] No results');
    return null;
  }

  // Tunebat response fields: b = bpm, k = key, n = name, as = artists
  const track = items[0];
  console.log('[AudioFeatures] First result keys:', Object.keys(track));
  console.log('[AudioFeatures] First result:', JSON.stringify(track).slice(0, 300));

  const bpm = track.b ?? track.bpm ?? track.tempo;
  const key = track.k ?? track.key;

  if (bpm) {
    console.log('[AudioFeatures] Found — BPM:', bpm, 'Key:', key);
    return { bpm: Math.round(bpm), key: key ?? '?' };
  }

  console.log('[AudioFeatures] No BPM in result');
  return null;
}

/**
 * Fetch all tracks from a Spotify album by ID.
 */
export async function fetchSpotifyAlbum(
  albumId: string,
  clientId: string,
  clientSecret: string,
): Promise<SpotifyTrackResult[]> {
  console.log('[Spotify:Album] Fetching album:', albumId);
  const token = await getToken(clientId, clientSecret);

  // First get album info for the album name
  const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!albumRes.ok) {
    const body = await albumRes.text().catch(() => '');
    if (albumRes.status === 404) throw new Error('Spotify album not found.');
    throw new Error(`Spotify API returned ${albumRes.status}: ${body}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const album = (await albumRes.json()) as any;
  const albumName = album.name;
  const results: SpotifyTrackResult[] = [];

  for (const track of album.tracks?.items ?? []) {
    results.push({
      title: cleanTitle(track.name),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      artist: (track.artists ?? []).map((a: any) => a.name).join(', '),
      album: albumName,
      duration: track.duration_ms ? Math.round(track.duration_ms / 1000) : undefined,
    });
  }

  console.log('[Spotify:Album] Done — total tracks:', results.length);
  return results;
}
