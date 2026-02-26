import type { OAuthPlatform } from './platform.ts';

export interface OAuthToken {
  platform: OAuthPlatform;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
}

export interface UserSettings {
  activePlatforms: import('./platform.ts').Platform[];
  preferredCurrency: string;
  preferredFormat: string;
  autoPlay: boolean;
}

/**
 * localStorage key structure:
 *
 * th_playlists     → Playlist[]
 * th_wishlist      → WishlistItem[]
 * th_oauth_spotify → OAuthToken
 * th_oauth_youtube → OAuthToken
 * th_settings      → UserSettings
 * th_cache_{hash}  → PlatformResult[] (TTL 24h)
 */
export const STORAGE_KEYS = {
  PLAYLISTS: 'th_playlists',
  WISHLIST: 'th_wishlist',
  OAUTH_PREFIX: 'th_oauth_',
  SETTINGS: 'th_settings',
  CACHE_PREFIX: 'th_cache_',
} as const;
