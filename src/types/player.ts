export interface PlayerState {
  isPlaying: boolean;
  currentTrackId: string | null;
  currentPlatform: string | null;
  currentUrl: string | null;
  embedUrl: string | null;
  trackTitle: string | null;
}
