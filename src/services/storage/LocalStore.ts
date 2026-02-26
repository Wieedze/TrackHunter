import { get, set, del, keys } from 'idb-keyval';
import { STORAGE_KEYS } from '../../types/storage.ts';
import type { Playlist, WishlistItem } from '../../types/track.ts';
import type { OAuthToken, UserSettings } from '../../types/storage.ts';
import type { OAuthPlatform } from '../../types/platform.ts';

/**
 * LocalStore — Wrapper around localStorage + IndexedDB (via idb-keyval).
 *
 * Uses localStorage for small, frequently accessed data (settings, tokens).
 * Falls back to IndexedDB for larger datasets (playlists, cache).
 */
export class LocalStore {
  // ── Playlists ─────────────────────────────────────────

  static async getPlaylists(): Promise<Playlist[]> {
    try {
      const data = await get<Playlist[]>(STORAGE_KEYS.PLAYLISTS);
      return data ?? [];
    } catch {
      const raw = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return raw ? JSON.parse(raw) as Playlist[] : [];
    }
  }

  static async savePlaylists(playlists: Playlist[]): Promise<void> {
    await set(STORAGE_KEYS.PLAYLISTS, playlists);
  }

  // ── Wishlist ──────────────────────────────────────────

  static async getWishlist(): Promise<WishlistItem[]> {
    try {
      const data = await get<WishlistItem[]>(STORAGE_KEYS.WISHLIST);
      return data ?? [];
    } catch {
      const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return raw ? JSON.parse(raw) as WishlistItem[] : [];
    }
  }

  static async saveWishlist(items: WishlistItem[]): Promise<void> {
    await set(STORAGE_KEYS.WISHLIST, items);
  }

  // ── OAuth Tokens ──────────────────────────────────────

  static getOAuthToken(platform: OAuthPlatform): OAuthToken | null {
    const raw = localStorage.getItem(STORAGE_KEYS.OAUTH_PREFIX + platform);
    return raw ? JSON.parse(raw) as OAuthToken : null;
  }

  static setOAuthToken(token: OAuthToken): void {
    localStorage.setItem(STORAGE_KEYS.OAUTH_PREFIX + token.platform, JSON.stringify(token));
  }

  static removeOAuthToken(platform: OAuthPlatform): void {
    localStorage.removeItem(STORAGE_KEYS.OAUTH_PREFIX + platform);
  }

  // ── Settings ──────────────────────────────────────────

  static getSettings(): UserSettings | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) as UserSettings : null;
  }

  static saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // ── Cache ─────────────────────────────────────────────

  static async getCached<T>(hash: string): Promise<T | null> {
    const key = STORAGE_KEYS.CACHE_PREFIX + hash;
    try {
      const entry = await get<{ data: T; expiresAt: number }>(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        await del(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  static async setCache<T>(hash: string, data: T, ttlMs: number = 24 * 60 * 60 * 1000): Promise<void> {
    const key = STORAGE_KEYS.CACHE_PREFIX + hash;
    await set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  // ── Cleanup ───────────────────────────────────────────

  static async clearExpiredCache(): Promise<void> {
    const allKeys = await keys();
    for (const key of allKeys) {
      if (typeof key === 'string' && key.startsWith(STORAGE_KEYS.CACHE_PREFIX)) {
        const entry = await get<{ expiresAt: number }>(key);
        if (entry && Date.now() > entry.expiresAt) {
          await del(key);
        }
      }
    }
  }
}
