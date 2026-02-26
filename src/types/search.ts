import type { Platform } from './platform.ts';

export interface TrackQuery {
  title: string;
  artist: string;
  label?: string;
  album?: string;
  isrc?: string;
}

export interface SearchProgress {
  totalTracks: number;
  completedTracks: number;
  currentTrack?: string;
  platformsSearched: Platform[];
  platformsRemaining: Platform[];
}

export type SearchStatus = 'idle' | 'parsing' | 'searching' | 'done' | 'error';

export interface SearchState {
  status: SearchStatus;
  progress: SearchProgress | null;
  error: string | null;
}
