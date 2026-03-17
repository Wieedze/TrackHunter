import { create } from 'zustand';
import type { PlayerState } from '../types/player.ts';
import { buildEmbedUrl, resolveBandcampEmbed } from '../services/player/embedBuilder.ts';

interface PlayerStore extends PlayerState {
  play: (trackId: string, url: string, platform: string, title: string) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentTrackId: null,
  currentPlatform: null,
  currentUrl: null,
  embedUrl: null,
  trackTitle: null,

  play: (trackId, url, platform, title) => {
    const rawEmbed = buildEmbedUrl(platform, url);
    if (!rawEmbed) return;

    // Set playing state immediately (embedUrl may be null briefly for Bandcamp)
    set({
      isPlaying: true,
      currentTrackId: trackId,
      currentPlatform: platform,
      currentUrl: url,
      embedUrl: rawEmbed.startsWith('bandcamp:') ? null : rawEmbed,
      trackTitle: title,
    });

    // Resolve Bandcamp embed asynchronously
    if (rawEmbed.startsWith('bandcamp:')) {
      const pageUrl = rawEmbed.slice('bandcamp:'.length);
      resolveBandcampEmbed(pageUrl).then((resolved) => {
        // Only update if still playing the same track
        if (get().currentTrackId === trackId) {
          set({ embedUrl: resolved });
        }
      });
    }
  },

  stop: () =>
    set({
      isPlaying: false,
      currentTrackId: null,
      currentPlatform: null,
      currentUrl: null,
      embedUrl: null,
      trackTitle: null,
    }),
}));
