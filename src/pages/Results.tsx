import { usePlaylistStore } from '../stores/playlistStore.ts';

export function Results() {
  const currentPlaylist = usePlaylistStore((s) => s.currentPlaylist);

  if (!currentPlaylist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-text-secondary">No search results yet.</p>
        <p className="text-sm text-text-tertiary">
          Go to the home page and paste some tracks to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            {currentPlaylist.name}
          </h2>
          <p className="text-sm text-text-secondary">
            {currentPlaylist.tracks.length} tracks
          </p>
        </div>
      </div>

      {/* Track list placeholder */}
      <div className="rounded-sm border border-border bg-bg-secondary">
        {currentPlaylist.tracks.map((track) => (
          <div
            key={track.input.id}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0 hover:bg-bg-tertiary transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-text-primary">
                {track.input.artist} — {track.input.title}
              </p>
              {track.input.label && (
                <p className="text-xs text-text-tertiary">{track.input.label}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-tertiary">
                {track.results.length} results
              </span>
              <span
                className={`h-2 w-2 rounded-full ${
                  track.status === 'done'
                    ? 'bg-status-success'
                    : track.status === 'searching'
                    ? 'bg-status-warning'
                    : track.status === 'error'
                    ? 'bg-status-error'
                    : 'bg-text-tertiary'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
