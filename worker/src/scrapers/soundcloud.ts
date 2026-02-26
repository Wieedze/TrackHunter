/**
 * SoundCloud set/playlist scraper.
 *
 * SoundCloud only embeds ~5 full track objects in __sc_hydration.
 * The rest are ID-only stubs. We extract the client_id from the page
 * scripts and call the internal API to resolve the missing tracks.
 */

export interface SoundCloudTrackResult {
  title: string;
  artist: string;
  duration?: number;
  url: string;
}

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

export async function scrapeSoundCloudSet(url: string): Promise<SoundCloudTrackResult[]> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`SoundCloud returned ${response.status}`);
  }

  const html = await response.text();

  // Try hydration data (with API fallback for missing tracks)
  const hydrationResults = await parseHydrationData(html);
  if (hydrationResults && hydrationResults.length > 0) return hydrationResults;

  // Fallback: JSON-LD
  const jsonLdResults = parseJsonLd(html);
  if (jsonLdResults.length > 0) return jsonLdResults;

  return [];
}

/**
 * Extract client_id from SoundCloud's JS bundles referenced in the HTML.
 */
async function extractClientId(html: string): Promise<string | null> {
  // client_id is sometimes directly in an inline script
  const inlineMatch = html.match(/client_id=([a-zA-Z0-9]{32})/);
  if (inlineMatch) return inlineMatch[1];

  // Otherwise it's in one of the JS bundle files
  const scriptUrls: string[] = [];
  const scriptPattern = /<script[^>]+src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"/g;
  let m;
  while ((m = scriptPattern.exec(html)) !== null) {
    scriptUrls.push(m[1]);
  }

  // Check the last few scripts (client_id is usually in the last bundles)
  for (const scriptUrl of scriptUrls.slice(-3).reverse()) {
    try {
      const res = await fetch(scriptUrl, {
        headers: { 'User-Agent': BROWSER_UA },
      });
      if (!res.ok) continue;
      const js = await res.text();
      const cidMatch = js.match(/client_id:"([a-zA-Z0-9]{32})"/);
      if (cidMatch) return cidMatch[1];
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Fetch full track data from SoundCloud internal API for tracks that are ID-only.
 */
async function fetchTracksByIds(
  ids: number[],
  clientId: string,
): Promise<SoundCloudTrackResult[]> {
  const results: SoundCloudTrackResult[] = [];

  // SoundCloud API accepts up to 50 IDs at once
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const idsParam = batch.join(',');
    const apiUrl = `https://api-v2.soundcloud.com/tracks?ids=${idsParam}&client_id=${clientId}`;

    try {
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': BROWSER_UA,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tracks = (await res.json()) as any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const track of tracks) {
        if (track.title) {
          results.push({
            title: track.title,
            artist: track.user?.username ?? '',
            duration: track.duration ? Math.round(track.duration / 1000) : undefined,
            url: track.permalink_url ?? '',
          });
        }
      }
    } catch {
      continue;
    }
  }

  return results;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseHydrationData(html: string): Promise<SoundCloudTrackResult[] | null> {
  const match = html.match(/window\.__sc_hydration\s*=\s*(\[[\s\S]*?\]);\s*<\/script/);
  if (!match) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hydration = JSON.parse(match[1]) as any[];

    const playlistEntry = hydration.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (h: any) => h.hydratable === 'playlist' || h.hydratable === 'system-playlist',
    );

    if (!playlistEntry?.data?.tracks) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allTracks: any[] = playlistEntry.data.tracks;

    // Separate full tracks from ID-only stubs
    const fullResults: SoundCloudTrackResult[] = [];
    const missingIds: number[] = [];

    for (const track of allTracks) {
      if (track.title) {
        fullResults.push({
          title: track.title,
          artist: track.user?.username ?? '',
          duration: track.duration ? Math.round(track.duration / 1000) : undefined,
          url: track.permalink_url ?? '',
        });
      } else if (track.id) {
        missingIds.push(track.id);
      }
    }

    // If there are missing tracks, fetch them via API
    if (missingIds.length > 0) {
      const clientId = await extractClientId(html);
      if (clientId) {
        const extraTracks = await fetchTracksByIds(missingIds, clientId);
        fullResults.push(...extraTracks);
      }
    }

    return fullResults;
  } catch {
    return null;
  }
}

function parseJsonLd(html: string): SoundCloudTrackResult[] {
  const results: SoundCloudTrackResult[] = [];
  const jsonLdPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;

  while ((match = jsonLdPattern.exec(html)) !== null) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ld = JSON.parse(match[1]) as any;

      if (ld['@type'] === 'MusicPlaylist' && Array.isArray(ld.track)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const t of ld.track) {
          results.push({
            title: t.name ?? '',
            artist: t.byArtist?.name ?? '',
            url: t.url ?? '',
          });
        }
      }
    } catch {
      // continue
    }
  }

  return results;
}
