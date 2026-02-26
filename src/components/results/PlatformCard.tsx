import { ExternalLink, Play } from 'lucide-react';
import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import { ConfidenceBadge } from './ConfidenceBadge.tsx';

interface PlatformCardProps {
  result: PlatformResult;
  onPlayPreview?: (previewUrl: string) => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  [Platform.SPOTIFY]: 'Spotify',
  [Platform.BANDCAMP]: 'Bandcamp',
  [Platform.BEATPORT]: 'Beatport',
  [Platform.TRAXSOURCE]: 'Traxsource',
  [Platform.DISCOGS]: 'Discogs',
  [Platform.MUSICBRAINZ]: 'MusicBrainz',
  [Platform.YOUTUBE]: 'YouTube',
  [Platform.DEEZER]: 'Deezer',
  [Platform.SOUNDCLOUD]: 'SoundCloud',
  [Platform.TIDAL]: 'Tidal',
  [Platform.JUNO]: 'Juno',
};

const PLATFORM_COLORS: Record<string, string> = {
  [Platform.SPOTIFY]: 'bg-platform-spotify/15 text-platform-spotify',
  [Platform.BANDCAMP]: 'bg-platform-bandcamp/15 text-platform-bandcamp',
  [Platform.BEATPORT]: 'bg-platform-beatport/15 text-platform-beatport',
  [Platform.DISCOGS]: 'bg-bg-tertiary text-text-secondary',
  [Platform.MUSICBRAINZ]: 'bg-platform-musicbrainz/15 text-platform-musicbrainz',
  [Platform.YOUTUBE]: 'bg-platform-youtube/15 text-platform-youtube',
  [Platform.DEEZER]: 'bg-platform-deezer/15 text-platform-deezer',
  [Platform.TRAXSOURCE]: 'bg-platform-traxsource/15 text-platform-traxsource',
  [Platform.SOUNDCLOUD]: 'bg-platform-soundcloud/15 text-platform-soundcloud',
};

export function PlatformCard({ result, onPlayPreview }: PlatformCardProps) {
  const label = PLATFORM_LABELS[result.platform] ?? result.platform;
  const colorClass = PLATFORM_COLORS[result.platform] ?? 'bg-bg-tertiary text-text-secondary';

  return (
    <div className="flex items-center justify-between rounded-sm border border-border bg-bg-primary px-3 py-2 hover:border-border-hover transition-colors">
      <div className="flex items-center gap-3">
        {/* Platform badge */}
        <span className={`rounded-sm px-2 py-0.5 font-mono text-xs ${colorClass}`}>
          {label}
        </span>

        {/* Track info from this platform */}
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">{result.title}</span>
          <span className="text-xs text-text-secondary">{result.artist}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Price */}
        {result.price != null && (
          <span className="font-mono text-xs text-text-primary">
            {result.currency ?? ''}
            {result.price.toFixed(2)}
          </span>
        )}

        {/* Format */}
        {result.format && (
          <span className="font-mono text-xs text-text-tertiary">{result.format}</span>
        )}

        {/* Confidence */}
        <ConfidenceBadge confidence={result.confidence} />

        {/* Preview button */}
        {result.previewUrl && onPlayPreview && (
          <button
            onClick={() => onPlayPreview(result.previewUrl!)}
            className="text-text-secondary hover:text-accent transition-colors"
          >
            <Play size={14} strokeWidth={1.5} />
          </button>
        )}

        {/* External link */}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <ExternalLink size={14} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}
