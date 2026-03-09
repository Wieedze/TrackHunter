import { create } from 'zustand';
import { Platform } from '../types/platform.ts';
import type { UserSettings } from '../types/storage.ts';

interface SettingsStore extends UserSettings {
  setActivePlatforms: (platforms: Platform[]) => void;
  togglePlatform: (platform: Platform) => void;
  setPreferredFormat: (format: string) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  loadSettings: (settings: UserSettings) => void;
}

const DEFAULT_PLATFORMS = [
  Platform.BANDCAMP,
  Platform.BEATPORT,
  Platform.DISCOGS,
  Platform.DEEZER,
  Platform.MUSICBRAINZ,
];

export const useSettingsStore = create<SettingsStore>((set) => ({
  activePlatforms: DEFAULT_PLATFORMS,
  preferredCurrency: 'EUR',
  preferredFormat: 'FLAC',
  autoPlay: false,

  setActivePlatforms: (platforms) => set({ activePlatforms: platforms }),

  togglePlatform: (platform) =>
    set((state) => ({
      activePlatforms: state.activePlatforms.includes(platform)
        ? state.activePlatforms.filter((p) => p !== platform)
        : [...state.activePlatforms, platform],
    })),

  setPreferredFormat: (format) => set({ preferredFormat: format }),
  setAutoPlay: (autoPlay) => set({ autoPlay }),
  loadSettings: (settings) => set(settings),
}));
