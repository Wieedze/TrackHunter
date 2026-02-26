import { useState } from 'react';
import { ChevronDown, ChevronUp, Music, Loader2, Search } from 'lucide-react';
import type { TrackResult } from '../../types/track.ts';
import type { PlatformResult } from '../../types/platform.ts';
import { Platform } from '../../types/platform.ts';
import { PlatformGroup } from './PlatformGroup.tsx';

interface TrackRowProps {
  track: TrackResult;
  onPlayPreview?: (trackId: string, previewUrl: string, platform: string) => void;
}

/** Group results by platform, sorted by best confidence per group. */
function groupByPlatform(results: PlatformResult[]): Map<string, PlatformResult[]> {
  const groups = new Map<string, PlatformResult[]>();
  for (const r of results) {
    const existing = groups.get(r.platform) ?? [];
    existing.push(r);
    groups.set(r.platform, existing);
  }
  // Sort each group internally by confidence desc
  for (const [key, group] of groups) {
    groups.set(key, group.sort((a, b) => b.confidence - a.confidence));
  }
  return groups;
}

const EXTRA_SEARCH_PLATFORMS: { platform: string; label: string; urlFn: (q: string) => string }[] = [
  {
    platform: Platform.DISCOGS,
    label: 'Discogs',
    urlFn: (q) => `https://www.discogs.com/search/?q=${encodeURIComponent(q)}&type=release`,
  },
  {
    platform: Platform.YOUTUBE,
    label: 'YouTube',
    urlFn: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  },
  {
    platform: Platform.SOUNDCLOUD,
    label: 'SoundCloud',
    urlFn: (q) => `https://soundcloud.com/search/sounds?q=${encodeURIComponent(q)}`,
  },
  {
    platform: 'google',
    label: 'Google',
    urlFn: (q) => `https://www.google.com/search?q=${encodeURIComponent(q + ' buy')}`,
  },
];

const PLATFORM_DOT_COLORS: Record<string, string> = {
  [Platform.SPOTIFY]: 'bg-platform-spotify',
  [Platform.BANDCAMP]: 'bg-platform-bandcamp',
  [Platform.BEATPORT]: 'bg-platform-beatport',
  [Platform.TRAXSOURCE]: 'bg-platform-traxsource',
  [Platform.DISCOGS]: 'bg-[#999]',
  [Platform.MUSICBRAINZ]: 'bg-platform-musicbrainz',
  [Platform.YOUTUBE]: 'bg-platform-youtube',
  [Platform.DEEZER]: 'bg-platform-deezer',
  [Platform.SOUNDCLOUD]: 'bg-platform-soundcloud',
};

function ExtraSearchLinks({ query, existingPlatforms }: { query: string; existingPlatforms: Set<string> }) {
  const links = EXTRA_SEARCH_PLATFORMS.filter((p) => !existingPlatforms.has(p.platform));
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="text-xs text-text-tertiary">Also search:</span>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.urlFn(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-sm border border-border px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-colors"
        >
          <Search size={10} strokeWidth={1.5} />
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function TrackRow({ track, onPlayPreview }: TrackRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { input, results, bestMatch, status } = track;

  const grouped = groupByPlatform(results);
  const autoCount = [...grouped.values()].filter((g) => !g[0].manualSearch).length;
  const platformCount = autoCount;

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-bg-tertiary transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Artwork or placeholder */}
          {bestMatch?.artworkUrl ? (
            <img
              src={bestMatch.artworkUrl}
              alt=""
              className="h-10 w-10 rounded-sm object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-bg-tertiary">
              <Music size={16} strokeWidth={1.5} className="text-text-tertiary" />
            </div>
          )}

          {/* Track info */}
          <div>
            <p className="text-sm font-medium text-text-primary">
              {input.artist} — {input.title}
            </p>
            {input.label && (
              <p className="text-xs text-text-tertiary">{input.label}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status */}
          {status === 'searching' && (
            <Loader2 size={14} strokeWidth={1.5} className="animate-spin text-status-warning" />
          )}

          {/* Platform dots — one colored dot per platform found */}
          {status === 'done' && (
            <div className="flex items-center gap-1.5">
              {[...grouped.entries()]
                .filter(([, g]) => !g[0].manualSearch)
                .sort(([, a], [, b]) => b[0].confidence - a[0].confidence)
                .map(([platform]) => (
                  <span
                    key={platform}
                    className={`h-2.5 w-2.5 rounded-full ${PLATFORM_DOT_COLORS[platform] ?? 'bg-text-tertiary'}`}
                    title={platform}
                  />
                ))}
              {platformCount === 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-status-error" />
              )}
            </div>
          )}

          {status === 'error' && (
            <span className="h-2.5 w-2.5 rounded-full bg-status-error" />
          )}

          {status === 'pending' && (
            <span className="h-2.5 w-2.5 rounded-full bg-text-tertiary" />
          )}

          {/* Expand icon */}
          {results.length > 0 && (
            expanded
              ? <ChevronUp size={14} strokeWidth={1.5} className="text-text-tertiary" />
              : <ChevronDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
          )}
        </div>
      </button>

      {/* Expanded detail — grouped by platform */}
      {expanded && results.length > 0 && (
        <div className="flex flex-col gap-3 bg-bg-primary px-4 pb-4">
          {[...grouped.entries()]
            .sort(([, a], [, b]) => {
              // Manual search links go last
              const aManual = a[0].manualSearch ? 1 : 0;
              const bManual = b[0].manualSearch ? 1 : 0;
              if (aManual !== bManual) return aManual - bManual;
              return b[0].confidence - a[0].confidence;
            })
            .map(([platform, platformResults]) => (
              <PlatformGroup
                key={platform}
                platform={platform}
                results={platformResults}
                onPlayPreview={
                  onPlayPreview
                    ? (url) => onPlayPreview(input.id, url, platform)
                    : undefined
                }
              />
            ))}

          {/* Extra manual search links for platforms not in results */}
          <ExtraSearchLinks
            query={`${input.artist} ${input.title}`}
            existingPlatforms={new Set(grouped.keys())}
          />
        </div>
      )}
    </div>
  );
}
