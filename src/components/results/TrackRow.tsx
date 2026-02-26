import { useState } from 'react';
import { ChevronDown, ChevronUp, Music, Loader2 } from 'lucide-react';
import type { TrackResult } from '../../types/track.ts';
import { ConfidenceBadge } from './ConfidenceBadge.tsx';
import { PlatformCard } from './PlatformCard.tsx';

interface TrackRowProps {
  track: TrackResult;
  onPlayPreview?: (trackId: string, previewUrl: string, platform: string) => void;
}

export function TrackRow({ track, onPlayPreview }: TrackRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { input, results, bestMatch, status } = track;

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

        <div className="flex items-center gap-3">
          {/* Status */}
          {status === 'searching' && (
            <Loader2 size={14} strokeWidth={1.5} className="animate-spin text-status-warning" />
          )}

          {/* Result count */}
          {status === 'done' && (
            <span className="font-mono text-xs text-text-tertiary">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
          )}

          {/* Best match confidence */}
          {bestMatch && <ConfidenceBadge confidence={bestMatch.confidence} />}

          {/* Status dot */}
          <span
            className={`h-2 w-2 rounded-full ${
              status === 'done'
                ? results.length > 0
                  ? 'bg-status-success'
                  : 'bg-status-error'
                : status === 'searching'
                  ? 'bg-status-warning'
                  : status === 'error'
                    ? 'bg-status-error'
                    : 'bg-text-tertiary'
            }`}
          />

          {/* Expand icon */}
          {results.length > 0 && (
            expanded
              ? <ChevronUp size={14} strokeWidth={1.5} className="text-text-tertiary" />
              : <ChevronDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && results.length > 0 && (
        <div className="flex flex-col gap-1 bg-bg-primary px-4 pb-3">
          {results.map((result, i) => (
            <PlatformCard
              key={`${result.platform}-${i}`}
              result={result}
              onPlayPreview={
                onPlayPreview
                  ? (url) => onPlayPreview(input.id, url, result.platform)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
