import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePlaylistStore } from '../stores/playlistStore.ts';
import { usePlayerStore } from '../stores/playerStore.ts';
import { TrackRow } from '../components/results/TrackRow.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Platform } from '../types/platform.ts';

const PLATFORM_LEGEND: { key: string; label: string; dotClass: string }[] = [
  { key: Platform.BANDCAMP, label: 'Bandcamp', dotClass: 'bg-platform-bandcamp' },
  { key: Platform.MUSICBRAINZ, label: 'MusicBrainz', dotClass: 'bg-platform-musicbrainz' },
  { key: Platform.TRAXSOURCE, label: 'Traxsource', dotClass: 'bg-platform-traxsource' },
  { key: Platform.DISCOGS, label: 'Discogs', dotClass: 'bg-[#999]' },
  { key: Platform.BEATPORT, label: 'Beatport', dotClass: 'bg-platform-beatport' },
];

export function Results() {
  const navigate = useNavigate();
  const currentPlaylist = usePlaylistStore((s) => s.currentPlaylist);
  const searchStatus = usePlaylistStore((s) => s.searchStatus);
  const { play } = usePlayerStore();

  if (!currentPlaylist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-text-secondary">No search results yet.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          Go back
        </Button>
      </div>
    );
  }

  const doneCount = currentPlaylist.tracks.filter((t) => t.status === 'done' || t.status === 'error').length;
  const totalCount = currentPlaylist.tracks.length;
  const withResults = currentPlaylist.tracks.filter((t) => t.results.length > 0).length;
  const errorCount = currentPlaylist.tracks.filter((t) => t.status === 'error').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Button>
          <div>
            <h2 className="font-display text-lg font-semibold text-text-primary">
              {currentPlaylist.name}
            </h2>
            <p className="text-sm text-text-secondary">
              {totalCount} tracks
              {searchStatus === 'searching' && (
                <span className="ml-2 text-status-warning">
                  — {doneCount}/{totalCount} ({Math.round((doneCount / totalCount) * 100)}%)
                </span>
              )}
              {searchStatus === 'done' && (
                <span className="ml-2 text-text-tertiary">
                  — {withResults} found{errorCount > 0 ? `, ${errorCount} errors` : ''}
                </span>
              )}
            </p>
          </div>
        </div>

        {searchStatus === 'searching' && (
          <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-accent" />
        )}
      </div>

      {/* Progress bar */}
      {searchStatus === 'searching' && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      )}

      {/* Platform color legend */}
      <div className="flex flex-wrap items-center gap-3">
        {PLATFORM_LEGEND.map((p) => (
          <div key={p.key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${p.dotClass}`} />
            <span className="text-xs text-text-tertiary">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Track list */}
      <div className="rounded-sm border border-border bg-bg-secondary">
        {currentPlaylist.tracks.map((track) => (
          <TrackRow
            key={track.input.id}
            track={track}
            onPlayPreview={(trackId, previewUrl, platform) => play(trackId, previewUrl, platform)}
          />
        ))}
      </div>
    </div>
  );
}
