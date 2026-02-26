import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { usePlaylistStore } from '../stores/playlistStore.ts';
import { TextParser } from '../services/import/TextParser.ts';
import { LinkResolver } from '../services/import/LinkResolver.ts';
import { SearchOrchestrator } from '../services/search/SearchOrchestrator.ts';
import { ResultAggregator } from '../services/search/ResultAggregator.ts';
import { MusicBrainzProvider } from '../services/providers/MusicBrainzProvider.ts';
import { BandcampProvider } from '../services/providers/BandcampProvider.ts';
import { BeatportProvider } from '../services/providers/BeatportProvider.ts';
import { TraxsourceProvider } from '../services/providers/TraxsourceProvider.ts';
import { DiscogsProvider } from '../services/providers/DiscogsProvider.ts';
import type { Playlist, TrackResult } from '../types/track.ts';

// Singleton orchestrator with all available providers
// Bandcamp + Traxsource require the Cloudflare Worker running (npm run dev in worker/)
// Beatport generates manual search links (no Worker needed)
// MusicBrainz, Discogs use direct APIs (no Worker needed)
const orchestrator = new SearchOrchestrator([
  new MusicBrainzProvider(),
  new DiscogsProvider(),
  new BandcampProvider(),
  new TraxsourceProvider(),
  new BeatportProvider(),
]);

/**
 * Hook that orchestrates the full import + search flow.
 */
export function useSearch() {
  const { setCurrentPlaylist, updateTrackResult, setSearchStatus, setError } = usePlaylistStore();

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
            setError('Could not parse any tracks. Use format: Artist - Title');
            setSearchStatus('idle');
            return;
          }
          tracks = parsed.map((input) => ({
            input,
            results: [],
            searchedAt: new Date().toISOString(),
            status: 'pending' as const,
          }));
        } else if (inputType.type === 'spotify_playlist') {
          setError('Spotify playlist import coming soon. Paste tracks as text for now (Artist - Title).');
          setSearchStatus('idle');
          return;
        } else if (inputType.type === 'youtube_playlist') {
          setError('YouTube playlist import coming soon. Paste tracks as text for now (Artist - Title).');
          setSearchStatus('idle');
          return;
        } else {
          setError(`Import not yet supported for: ${inputType.type}. Paste tracks as text.`);
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

        // Search each track sequentially (respect rate limits)
        for (const track of tracks) {
          updateTrackResult(track.input.id, { status: 'searching' });

          try {
            const results = await orchestrator.searchTrack({
              title: track.input.title,
              artist: track.input.artist,
              label: track.input.label,
              isrc: track.input.isrc,
            });

            const filtered = ResultAggregator.filterByConfidence(results, 0.3);
            const sorted = ResultAggregator.sortByConfidence(filtered);
            const bestMatch = ResultAggregator.getBestMatch(sorted);

            updateTrackResult(track.input.id, {
              results: sorted,
              bestMatch,
              status: 'done',
              searchedAt: new Date().toISOString(),
            });
          } catch {
            updateTrackResult(track.input.id, { status: 'error' });
          }
        }

        setSearchStatus('done');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        setSearchStatus('error');
      }
    },
    [setCurrentPlaylist, updateTrackResult, setSearchStatus, setError],
  );

  return { importAndSearch };
}
