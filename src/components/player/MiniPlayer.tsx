import { X, Loader2 } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore.ts';

const PLATFORM_LABELS: Record<string, string> = {
  spotify: 'Spotify',
  bandcamp: 'Bandcamp',
  beatport: 'Beatport',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
};

/** Height of the iframe per platform (large enough for seekbar / controls) */
const EMBED_HEIGHTS: Record<string, number> = {
  bandcamp: 141,
  spotify: 152,
  youtube: 200,
  soundcloud: 166,
};

export function MiniPlayer() {
  const { isPlaying, currentPlatform, embedUrl, trackTitle, stop } = usePlayerStore();

  if (!isPlaying) return null;

  const platformLabel = currentPlatform ? PLATFORM_LABELS[currentPlatform] ?? currentPlatform : '';
  const height = currentPlatform ? EMBED_HEIGHTS[currentPlatform] ?? 80 : 80;
  const loading = !embedUrl;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header: track info + close */}
        <div className="flex h-10 items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {loading && <Loader2 size={12} strokeWidth={1.5} className="animate-spin text-text-tertiary" />}
            <span className="text-sm text-text-primary truncate">{trackTitle}</span>
            {platformLabel && (
              <span className="shrink-0 text-xs text-text-tertiary">
                via {platformLabel}
              </span>
            )}
          </div>
          <button
            onClick={() => stop()}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Embed iframe */}
        {embedUrl && (
          <div className="pb-2">
            <iframe
              src={embedUrl}
              style={{ border: 0, width: '100%', height: `${height}px` }}
              allow="autoplay; encrypted-media"
              loading="lazy"
              title={`${platformLabel} player`}
            />
          </div>
        )}

        {/* Loading fallback */}
        {loading && (
          <div className="flex items-center justify-center py-3">
            <span className="text-xs text-text-tertiary">Loading player...</span>
          </div>
        )}
      </div>
    </div>
  );
}
