/**
 * TrackHunter — Cloudflare Worker (CORS Proxy + Scraper)
 *
 * Routes:
 *   GET /health                  → Health check
 *   GET /scrape/bandcamp         → Scrape Bandcamp search results
 *   GET /scrape/beatport         → Scrape Beatport search results
 *   GET /scrape/soundcloud       → Scrape SoundCloud set tracks
 *   GET /api/spotify/playlist    → Fetch Spotify playlist tracks (Client Credentials)
 */

import { scrapeBandcamp } from './scrapers/bandcamp.ts';
import { scrapeBeatport } from './scrapers/beatport.ts';
import { scrapeSoundCloudSet } from './scrapers/soundcloud.ts';
import { fetchSpotifyPlaylist, fetchSpotifyTrack, fetchSpotifyAlbum } from './api/spotify.ts';

export interface Env {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const query = url.searchParams.get('q');

    try {
      if (path === '/health') {
        return json({ status: 'ok', timestamp: new Date().toISOString() });
      }

      if (path === '/scrape/bandcamp') {
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        const itemType = (url.searchParams.get('type') as 't' | 'a') ?? 't';
        const results = await scrapeBandcamp(query, itemType);
        return json({ platform: 'bandcamp', query, results });
      }

      if (path === '/scrape/beatport') {
        if (!query) return json({ error: 'Missing ?q= parameter' }, 400);
        const results = await scrapeBeatport(query);
        return json({ platform: 'beatport', query, results });
      }

      if (path === '/scrape/soundcloud') {
        const scUrl = url.searchParams.get('url');
        if (!scUrl) return json({ error: 'Missing ?url= parameter' }, 400);
        const results = await scrapeSoundCloudSet(scUrl);
        return json({ platform: 'soundcloud', url: scUrl, results });
      }

      if (path === '/api/spotify/playlist') {
        const playlistId = url.searchParams.get('id');
        console.log('[Worker:Spotify] Received request for playlist:', playlistId);
        if (!playlistId) return json({ error: 'Missing ?id= parameter' }, 400);
        console.log('[Worker:Spotify] SPOTIFY_CLIENT_ID set:', !!env.SPOTIFY_CLIENT_ID);
        console.log('[Worker:Spotify] SPOTIFY_CLIENT_SECRET set:', !!env.SPOTIFY_CLIENT_SECRET);
        if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
          console.error('[Worker:Spotify] Missing credentials!');
          return json({ error: 'Spotify credentials not configured on worker' }, 500);
        }
        console.log('[Worker:Spotify] Fetching playlist...');
        const results = await fetchSpotifyPlaylist(playlistId, env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
        console.log('[Worker:Spotify] Got', results.length, 'tracks');
        return json({ platform: 'spotify', playlistId, results });
      }

      if (path === '/api/spotify/track') {
        const trackId = url.searchParams.get('id');
        if (!trackId) return json({ error: 'Missing ?id= parameter' }, 400);
        if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
          return json({ error: 'Spotify credentials not configured on worker' }, 500);
        }
        const result = await fetchSpotifyTrack(trackId, env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
        return json({ platform: 'spotify', trackId, results: [result] });
      }

      if (path === '/api/spotify/album') {
        const albumId = url.searchParams.get('id');
        if (!albumId) return json({ error: 'Missing ?id= parameter' }, 400);
        if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
          return json({ error: 'Spotify credentials not configured on worker' }, 500);
        }
        const results = await fetchSpotifyAlbum(albumId, env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
        return json({ platform: 'spotify', albumId, results });
      }

      // Resolve Bandcamp track page → numeric track ID for embed player
      if (path === '/resolve/bandcamp') {
        const trackUrl = url.searchParams.get('url');
        if (!trackUrl) return json({ error: 'Missing ?url= parameter' }, 400);
        const res = await fetch(trackUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        });
        if (!res.ok) return json({ error: 'Failed to fetch Bandcamp page' }, 502);
        const html = await res.text();
        const trackIdMatch = html.match(/\/track=(\d+)/) || html.match(/data-tralbum-id="(\d+)"/);
        if (!trackIdMatch) return json({ error: 'Track ID not found on page' }, 404);
        return json({ trackId: trackIdMatch[1] });
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error';
      return json({ error: message }, 500);
    }
  },
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}
