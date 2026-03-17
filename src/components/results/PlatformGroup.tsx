import { useState } from 'react';
import { ExternalLink, Play, ChevronDown, Search } from 'lucide-react';
import { Platform } from '../../types/platform.ts';
import type { PlatformResult } from '../../types/platform.ts';
import { EMBEDDABLE_PLATFORMS } from '../../services/player/embedBuilder.ts';

interface PlatformGroupProps {
  platform: string;
  results: PlatformResult[];
  onPlay?: (url: string, platform: string, title: string) => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  [Platform.SPOTIFY]: 'Spotify',
  [Platform.BANDCAMP]: 'Bandcamp',
  [Platform.BEATPORT]: 'Beatport',
  [Platform.DISCOGS]: 'Discogs',
  [Platform.MUSICBRAINZ]: 'MusicBrainz',
  [Platform.YOUTUBE]: 'YouTube',
  [Platform.SOUNDCLOUD]: 'SoundCloud',
};

const PLATFORM_COLORS: Record<string, string> = {
  [Platform.SPOTIFY]: 'border-platform-spotify/40 bg-platform-spotify/5',
  [Platform.BANDCAMP]: 'border-platform-bandcamp/40 bg-platform-bandcamp/5',
  [Platform.BEATPORT]: 'border-platform-beatport/40 bg-platform-beatport/5',
  [Platform.DISCOGS]: 'border-border bg-bg-secondary',
  [Platform.MUSICBRAINZ]: 'border-platform-musicbrainz/40 bg-platform-musicbrainz/5',
  [Platform.YOUTUBE]: 'border-platform-youtube/40 bg-platform-youtube/5',
  [Platform.SOUNDCLOUD]: 'border-platform-soundcloud/40 bg-platform-soundcloud/5',
};

const BADGE_COLORS: Record<string, string> = {
  [Platform.SPOTIFY]: 'bg-platform-spotify/15 text-platform-spotify',
  [Platform.BANDCAMP]: 'bg-platform-bandcamp/15 text-platform-bandcamp',
  [Platform.BEATPORT]: 'bg-platform-beatport/15 text-platform-beatport',
  [Platform.DISCOGS]: 'bg-bg-tertiary text-text-secondary',
  [Platform.MUSICBRAINZ]: 'bg-platform-musicbrainz/15 text-platform-musicbrainz',
  [Platform.YOUTUBE]: 'bg-platform-youtube/15 text-platform-youtube',
  [Platform.SOUNDCLOUD]: 'bg-platform-soundcloud/15 text-platform-soundcloud',
};

export function PlatformGroup({ platform, results, onPlay }: PlatformGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const label = PLATFORM_LABELS[platform] ?? platform;
  const colorClass = PLATFORM_COLORS[platform] ?? 'border-border bg-bg-secondary';
  const badgeClass = BADGE_COLORS[platform] ?? 'bg-bg-tertiary text-text-secondary';
  const canEmbed = EMBEDDABLE_PLATFORMS.has(platform);

  const best = results[0]; // Already sorted by confidence desc
  const others = results.slice(1);
  const isManual = best.manualSearch;

  // Manual search: simplified card with "Search on X" button
  if (isManual) {
    return (
      <div className={`rounded-sm border ${colorClass}`}>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <span className={`rounded-sm px-2 py-0.5 font-mono text-xs font-medium ${badgeClass}`}>
              {label}
            </span>
            <span className="text-xs text-text-tertiary">Manual search</span>
          </div>
          <a
            href={best.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${badgeClass} hover:opacity-80`}
          >
            <Search size={12} strokeWidth={1.5} />
            Search on {label}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-sm border ${colorClass}`}>
      {/* Best match for this platform */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3">
          {/* Platform badge */}
          <span className={`rounded-sm px-2 py-0.5 font-mono text-xs font-medium ${badgeClass}`}>
            {label}
          </span>

          {/* Best result info */}
          <div className="flex flex-col">
            <span className="text-sm text-text-primary">{best.title}</span>
            <span className="text-xs text-text-secondary">{best.artist}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Price */}
          {best.price != null && (
            <span className="font-mono text-xs text-text-primary">
              {best.currency ?? ''}{best.price.toFixed(2)}
            </span>
          )}

          {/* Format */}
          {best.format && (
            <span className="font-mono text-xs text-text-tertiary">{best.format}</span>
          )}

          {/* Play embed */}
          {canEmbed && onPlay && (
            <button
              onClick={() => onPlay(best.url, platform, `${best.artist} — ${best.title}`)}
              className="flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
              title={`Play on ${label}`}
            >
              <Play size={12} strokeWidth={2} fill="currentColor" />
              Play
            </button>
          )}

          {/* Link */}
          <a
            href={best.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${badgeClass} hover:opacity-80`}
          >
            <ExternalLink size={12} strokeWidth={1.5} />
            Open on {label}
          </a>

          {/* Show more toggle */}
          {others.length > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-0.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              +{others.length}
              <ChevronDown
                size={12}
                strokeWidth={1.5}
                className={`transition-transform ${showAll ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Other results for this platform */}
      {showAll && others.length > 0 && (
        <div className="border-t border-border/50">
          {others.map((result, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 pl-12 text-text-secondary"
            >
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">{result.title}</span>
                <span className="text-xs text-text-tertiary">{result.artist}</span>
              </div>

              <div className="flex items-center gap-2">
                {result.price != null && (
                  <span className="font-mono text-xs text-text-tertiary">
                    {result.currency ?? ''}{result.price.toFixed(2)}
                  </span>
                )}
                {canEmbed && onPlay && (
                  <button
                    onClick={() => onPlay(result.url, platform, `${result.artist} — ${result.title}`)}
                    className="flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-xs text-accent hover:bg-accent/20 transition-colors"
                    title={`Play on ${label}`}
                  >
                    <Play size={10} strokeWidth={2} fill="currentColor" />
                    Play
                  </button>
                )}
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs transition-colors ${badgeClass} opacity-70 hover:opacity-100`}
                >
                  <ExternalLink size={10} strokeWidth={1.5} />
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
