const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

/**
 * Builds an embeddable iframe URL from a platform result URL.
 * Returns null if the platform doesn't support embeds.
 */
export function buildEmbedUrl(platform: string, url: string): string | null {
  switch (platform) {
    case 'bandcamp':
      return buildBandcampEmbed(url);
    case 'spotify':
      return buildSpotifyEmbed(url);
    case 'youtube':
      return buildYouTubeEmbed(url);
    case 'soundcloud':
      return buildSoundCloudEmbed(url);
    default:
      return null;
  }
}

/** Platforms that support embed playback */
export const EMBEDDABLE_PLATFORMS = new Set(['bandcamp', 'spotify', 'youtube', 'soundcloud']);

/**
 * Bandcamp: return a marker — the track ID must be resolved async via the worker.
 */
function buildBandcampEmbed(url: string): string | null {
  if (url.includes('bandcamp.com')) {
    return `bandcamp:${url}`;
  }
  return null;
}

/**
 * Spotify embed: /track/ID → /embed/track/ID
 */
function buildSpotifyEmbed(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(track|album)\/([a-zA-Z0-9]+)/);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0`;
  }
  return null;
}

/**
 * YouTube embed: watch?v=ID → /embed/ID
 */
function buildYouTubeEmbed(url: string): string | null {
  let videoId: string | null = null;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) videoId = watchMatch[1];
  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) videoId = shortMatch[1];
  }
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return null;
}

/**
 * SoundCloud embed: uses the widget API with the track URL
 */
function buildSoundCloudEmbed(url: string): string | null {
  if (url.includes('soundcloud.com')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&color=%23ff5500&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
  }
  return null;
}

/**
 * Resolve a Bandcamp track page URL to the numeric embed URL.
 * Uses the Cloudflare Worker proxy to bypass CORS.
 */
export async function resolveBandcampEmbed(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(`${WORKER_URL}/resolve/bandcamp?url=${encodeURIComponent(pageUrl)}`);
    if (!res.ok) return null;
    const data = await res.json() as { trackId?: string };
    if (data.trackId) {
      return `https://bandcamp.com/EmbeddedPlayer/track=${data.trackId}/size=large/bgcol=333333/linkcol=0f91ff/artwork=small/tracklist=false/transparent=true/`;
    }
    return null;
  } catch {
    return null;
  }
}
