import { create } from 'zustand';
import type { PlayerState } from '../types/player.ts';

interface PlayerStore extends PlayerState {
  play: (trackId: string, previewUrl: string, platform: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  currentTrackId: null,
  currentPreviewUrl: null,
  currentPlatform: null,
  progress: 0,
  duration: 30,
  volume: 0.8,

  play: (trackId, previewUrl, platform) =>
    set({
      isPlaying: true,
      currentTrackId: trackId,
      currentPreviewUrl: previewUrl,
      currentPlatform: platform,
      progress: 0,
    }),

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () =>
    set({
      isPlaying: false,
      currentTrackId: null,
      currentPreviewUrl: null,
      currentPlatform: null,
      progress: 0,
    }),

  setProgress: (progress) => set({ progress }),
  setVolume: (volume) => set({ volume }),
}));
