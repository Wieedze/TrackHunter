import { Play, Pause, X, Volume2 } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore.ts';
import { usePlayer } from '../../hooks/usePlayer.ts';

const PLATFORM_LABELS: Record<string, string> = {
  spotify: 'Spotify',
  bandcamp: 'Bandcamp',
  beatport: 'Beatport',
  discogs: 'Discogs',
  musicbrainz: 'MusicBrainz',
  youtube: 'YouTube',
  deezer: 'Deezer',
  soundcloud: 'SoundCloud',
};

export function MiniPlayer() {
  const { isPlaying, currentTrackId, currentPlatform, progress, duration, volume } = usePlayerStore();
  const { pause, resume, stop } = usePlayer();
  const setVolume = usePlayerStore((s) => s.setVolume);

  if (!currentTrackId) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const platformLabel = currentPlatform ? PLATFORM_LABELS[currentPlatform] ?? currentPlatform : '';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-secondary">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-bg-tertiary">
        <div
          className="h-full bg-accent transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        {/* Left: play/pause + track info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => (isPlaying ? pause() : resume())}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-text-inverse transition-colors hover:bg-accent-hover"
          >
            {isPlaying ? (
              <Pause size={14} strokeWidth={2} />
            ) : (
              <Play size={14} strokeWidth={2} className="ml-0.5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-text-primary truncate max-w-[200px] sm:max-w-none">
              Preview
            </span>
            {platformLabel && (
              <span className="text-xs text-text-tertiary">
                via {platformLabel}
              </span>
            )}
          </div>
        </div>

        {/* Right: volume + close */}
        <div className="flex items-center gap-3">
          {/* Time */}
          <span className="font-mono text-xs text-text-tertiary">
            {Math.floor(progress)}s / {duration}s
          </span>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Volume2 size={14} strokeWidth={1.5} className="text-text-tertiary" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-bg-tertiary accent-accent"
            />
          </div>

          {/* Close */}
          <button
            onClick={() => stop()}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
