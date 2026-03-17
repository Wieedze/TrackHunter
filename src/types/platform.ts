export const Platform = {
  SPOTIFY: 'spotify',
  BANDCAMP: 'bandcamp',
  BEATPORT: 'beatport',
  DISCOGS: 'discogs',
  MUSICBRAINZ: 'musicbrainz',
  YOUTUBE: 'youtube',
  SOUNDCLOUD: 'soundcloud',
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

export const OAuthPlatform = {
  SPOTIFY: 'spotify',
  YOUTUBE: 'youtube',
  SOUNDCLOUD: 'soundcloud',
} as const;

export type OAuthPlatform = (typeof OAuthPlatform)[keyof typeof OAuthPlatform];

export interface PlatformResult {
  platform: Platform;
  externalId?: string;
  url: string;
  title: string;
  artist: string;
  price?: number;
  currency?: string;
  format?: string;
  quality?: string;
  available: boolean;
  previewUrl?: string;
  artworkUrl?: string;
  confidence: number;
  manualSearch?: boolean;
  extras?: {
    bpm?: number;
    key?: string;
    releaseDate?: string;
    condition?: string;
    sellers?: number;
    wantCount?: number;
  };
}
