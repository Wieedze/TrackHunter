import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCw, AlertTriangle, Download, FileText, Share2, Check, Filter } from 'lucide-react';
import { usePlaylistStore } from '../stores/playlistStore.ts';
import { usePlayerStore } from '../stores/playerStore.ts';
import { useSearch } from '../hooks/useSearch.ts';
import { TrackRow } from '../components/results/TrackRow.tsx';
import { ResultsFilter, type FilterState } from '../components/results/ResultsFilter.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Platform } from '../types/platform.ts';
import { PlaylistExporter } from '../services/export/PlaylistExporter.ts';

const PLATFORM_LEGEND: { key: string; label: string; dotClass: string }[] = [
  { key: Platform.BANDCAMP, label: 'Bandcamp', dotClass: 'bg-platform-bandcamp' },
  { key: Platform.MUSICBRAINZ, label: 'MusicBrainz', dotClass: 'bg-platform-musicbrainz' },
  { key: Platform.DISCOGS, label: 'Discogs', dotClass: 'bg-[#999]' },
  { key: Platform.BEATPORT, label: 'Beatport', dotClass: 'bg-platform-beatport' },
];

export function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPlaylist = usePlaylistStore((s) => s.currentPlaylist);
  const searchStatus = usePlaylistStore((s) => s.searchStatus);
  const error = usePlaylistStore((s) => s.error);
  const { play } = usePlayerStore();
  const { importAndSearch } = useSearch();
  const [copied, setCopied] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    status: 'all',
    sortBy: 'default',
  });

  // Handle shared link: decode tracks from URL and search
  useEffect(() => {
    const sharedTracks = searchParams.get('tracks');
    if (sharedTracks && !currentPlaylist) {
      try {
        const decoded = atob(sharedTracks);
        importAndSearch(decoded).catch(() => {});
      } catch {
        // Invalid base64, ignore
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Error state — show friendly message with retry/back buttons
  if (searchStatus === 'error' && !currentPlaylist) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 pt-24">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertTriangle size={32} strokeWidth={1.5} className="text-status-error" />
          <h2 className="font-display text-lg font-semibold text-text-primary">Something went wrong</h2>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/')}>
            <RefreshCw size={14} strokeWidth={1.5} />
            Try again
          </Button>
        </div>
      </div>
    );
  }

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

  // Apply filters
  const filteredTracks = useMemo(() => {
    let tracks = [...currentPlaylist.tracks];

    // Filter by platform
    if (filters.platforms.length > 0) {
      tracks = tracks.filter((t) =>
        filters.platforms.some((p) => t.results.some((r) => r.platform === p && !r.manualSearch))
      );
    }

    // Filter by status
    if (filters.status === 'found') {
      tracks = tracks.filter((t) => t.results.some((r) => !r.manualSearch));
    } else if (filters.status === 'not_found') {
      tracks = tracks.filter((t) => !t.results.some((r) => !r.manualSearch));
    } else if (filters.status === 'error') {
      tracks = tracks.filter((t) => t.status === 'error');
    }

    // Sort
    if (filters.sortBy === 'platforms') {
      tracks.sort((a, b) => {
        const aCount = a.results.filter((r) => !r.manualSearch).length;
        const bCount = b.results.filter((r) => !r.manualSearch).length;
        return bCount - aCount;
      });
    } else if (filters.sortBy === 'confidence') {
      tracks.sort((a, b) => (b.bestMatch?.confidence ?? 0) - (a.bestMatch?.confidence ?? 0));
    } else if (filters.sortBy === 'alpha') {
      tracks.sort((a, b) => `${a.input.artist} - ${a.input.title}`.localeCompare(`${b.input.artist} - ${b.input.title}`));
    }

    return tracks;
  }, [currentPlaylist.tracks, filters]);

  function handleShare() {
    const trackLines = currentPlaylist.tracks
      .map((t) => `${t.input.artist} - ${t.input.title}`)
      .join('\n');
    const encoded = btoa(trackLines);
    const url = `${window.location.origin}/results?tracks=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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

        <div className="flex items-center gap-2">
          {searchStatus === 'searching' && (
            <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-accent" />
          )}
          {searchStatus === 'done' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} title="Filter results">
                <Filter size={14} strokeWidth={1.5} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} title="Copy shareable link">
                {copied ? <Check size={14} strokeWidth={1.5} className="text-status-success" /> : <Share2 size={14} strokeWidth={1.5} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => PlaylistExporter.exportCSV(currentPlaylist)} title="Export CSV">
                <Download size={14} strokeWidth={1.5} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => PlaylistExporter.exportTXT(currentPlaylist)} title="Export TXT">
                <FileText size={14} strokeWidth={1.5} />
              </Button>
            </>
          )}
        </div>
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

      {/* Filters */}
      {showFilters && (
        <ResultsFilter filters={filters} onChange={setFilters} />
      )}

      {/* Track list */}
      <div className="rounded-sm border border-border bg-bg-secondary">
        {filteredTracks.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-text-tertiary">
            No tracks match your filters.
          </div>
        ) : (
          filteredTracks.map((track) => (
            <TrackRow
              key={track.input.id}
              track={track}
              onPlay={(url, platform, title) => play(currentPlaylist.id, url, platform, title)}
            />
          ))
        )}
      </div>
      {showFilters && filteredTracks.length !== currentPlaylist.tracks.length && (
        <p className="text-xs text-text-tertiary text-center">
          Showing {filteredTracks.length} of {currentPlaylist.tracks.length} tracks
        </p>
      )}
    </div>
  );
}
