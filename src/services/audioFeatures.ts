/**
 * Fetch BPM + Key for a track via GetSongBPM (proxied through worker to bypass CORS).
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export interface AudioFeatures {
  bpm: number;
  key: string;
}

const cache = new Map<string, AudioFeatures | null>();

export async function fetchAudioFeatures(artist: string, title: string): Promise<AudioFeatures | null> {
  const cacheKey = `${artist}|${title}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  try {
    const res = await fetch(
      `${WORKER_URL}/api/audio-features?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) {
      cache.set(cacheKey, null);
      return null;
    }
    const data = (await res.json()) as AudioFeatures;
    cache.set(cacheKey, data);
    return data;
  } catch {
    cache.set(cacheKey, null);
    return null;
  }
}
