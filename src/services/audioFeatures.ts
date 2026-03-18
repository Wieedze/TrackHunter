/**
 * Fetch BPM + Key for a track via Tunebat (proxied through worker to bypass CORS/Cloudflare).
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export interface AudioFeatures {
  bpm: number;
  key: string;
}

const cache = new Map<string, AudioFeatures | null>();

export async function fetchAudioFeatures(artist: string, title: string): Promise<AudioFeatures | null> {
  const query = `${artist} ${title}`;
  if (cache.has(query)) return cache.get(query) ?? null;

  try {
    const res = await fetch(
      `${WORKER_URL}/api/audio-features?q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) {
      cache.set(query, null);
      return null;
    }
    const data = (await res.json()) as AudioFeatures;
    cache.set(query, data);
    return data;
  } catch {
    cache.set(query, null);
    return null;
  }
}
