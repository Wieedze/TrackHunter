export interface PlayerState {
  isPlaying: boolean;
  currentTrackId: string | null;
  currentPreviewUrl: string | null;
  currentPlatform: string | null;
  progress: number;
  duration: number;
  volume: number;
}
