import type { PlatformResult } from './platform.ts';

export interface TrackInput {
  id: string;
  title: string;
  artist: string;
  label?: string;
  album?: string;
  year?: number;
  genre?: string;
  bpm?: number;
  key?: string;
  isrc?: string;
  duration?: number;
}

export interface TrackResult {
  input: TrackInput;
  results: PlatformResult[];
  bestMatch?: PlatformResult;
  searchedAt: string;
  status: 'pending' | 'searching' | 'done' | 'error';
}

export interface Playlist {
  id: string;
  name: string;
  source: 'text' | 'csv' | 'spotify_link' | 'youtube_link' | 'spotify_oauth' | 'youtube_oauth';
  sourceUrl?: string;
  tracks: TrackResult[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  track: TrackInput;
  targetPlatforms: import('./platform.ts').Platform[];
  addedAt: string;
  lastChecked?: string;
}
