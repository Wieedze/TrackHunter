import { create } from 'zustand';
import type { Playlist, TrackResult } from '../types/track.ts';
import type { SearchStatus } from '../types/search.ts';

interface PlaylistState {
  // Current working playlist
  currentPlaylist: Playlist | null;
  searchStatus: SearchStatus;
  error: string | null;

  // Saved playlists (from localStorage)
  savedPlaylists: Playlist[];

  // Actions
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  updateTrackResult: (trackId: string, result: Partial<TrackResult>) => void;
  setSearchStatus: (status: SearchStatus) => void;
  setError: (error: string | null) => void;
  setSavedPlaylists: (playlists: Playlist[]) => void;
  addSavedPlaylist: (playlist: Playlist) => void;
  removeSavedPlaylist: (id: string) => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  currentPlaylist: null,
  searchStatus: 'idle',
  error: null,
  savedPlaylists: [],

  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist, searchStatus: 'idle', error: null }),

  updateTrackResult: (trackId, result) =>
    set((state) => {
      if (!state.currentPlaylist) return state;
      return {
        currentPlaylist: {
          ...state.currentPlaylist,
          tracks: state.currentPlaylist.tracks.map((t) =>
            t.input.id === trackId ? { ...t, ...result } : t
          ),
        },
      };
    }),

  setSearchStatus: (status) => set({ searchStatus: status }),
  setError: (error) => set({ error }),
  setSavedPlaylists: (playlists) => set({ savedPlaylists: playlists }),

  addSavedPlaylist: (playlist) =>
    set((state) => ({
      savedPlaylists: [playlist, ...state.savedPlaylists],
    })),

  removeSavedPlaylist: (id) =>
    set((state) => ({
      savedPlaylists: state.savedPlaylists.filter((p) => p.id !== id),
    })),
}));
