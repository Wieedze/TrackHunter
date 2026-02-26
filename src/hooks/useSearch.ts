import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { usePlaylistStore } from '../stores/playlistStore.ts';
import { TextParser } from '../services/import/TextParser.ts';
import { LinkResolver } from '../services/import/LinkResolver.ts';
import type { Playlist, TrackResult } from '../types/track.ts';

/**
 * Hook that orchestrates the full import + search flow.
 * Handles text parsing, link detection, and triggers search.
 */
export function useSearch() {
  const { setCurrentPlaylist, setSearchStatus, setError } = usePlaylistStore();

  const importAndSearch = useCallback(
    async (rawInput: string) => {
      setSearchStatus('parsing');
      setError(null);

      try {
        const inputType = LinkResolver.detect(rawInput);

        let tracks: TrackResult[];

        if (inputType.type === 'text') {
          const parsed = TextParser.parse(rawInput);
          if (parsed.length === 0) {
            setError('Could not parse any tracks. Try format: Artist - Title');
            setSearchStatus('idle');
            return;
          }
          tracks = parsed.map((input) => ({
            input,
            results: [],
            searchedAt: new Date().toISOString(),
            status: 'pending' as const,
          }));
        } else {
          // TODO: Implement playlist link resolution (Spotify, YouTube, etc.)
          setError(`Link import not yet implemented for: ${inputType.type}`);
          setSearchStatus('idle');
          return;
        }

        const playlist: Playlist = {
          id: nanoid(),
          name: `Import ${new Date().toLocaleDateString()}`,
          source: 'text',
          tracks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCurrentPlaylist(playlist);
        setSearchStatus('searching');

        // TODO: Launch SearchOrchestrator for each track
        // For now, mark all as done with no results
        setSearchStatus('done');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        setSearchStatus('error');
      }
    },
    [setCurrentPlaylist, setSearchStatus, setError],
  );

  return { importAndSearch };
}
