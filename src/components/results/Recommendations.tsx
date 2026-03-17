import { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Loader2 } from 'lucide-react';
import { RecommendationEngine } from '../../services/recommendations/RecommendationEngine.ts';
import type { Recommendation } from '../../services/recommendations/RecommendationEngine.ts';
import type { TrackInput } from '../../types/track.ts';

interface RecommendationsProps {
  track: TrackInput;
}

export function Recommendations({ track }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function handleLoad() {
    if (loaded || loading) return;
    setLoading(true);
    RecommendationEngine.getRecommendations(track, 5)
      .then((recs) => {
        setRecommendations(recs);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      })
      .finally(() => setLoading(false));
  }

  if (!loaded && !loading) {
    return (
      <button
        onClick={handleLoad}
        className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-xs text-text-tertiary hover:text-text-secondary hover:border-text-tertiary transition-colors"
      >
        <Sparkles size={12} strokeWidth={1.5} />
        Similar tracks
      </button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
        Finding similar tracks...
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-sm border border-border bg-bg-secondary p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} strokeWidth={1.5} className="text-accent" />
        <span className="text-xs font-medium text-text-secondary">Similar tracks</span>
      </div>
      <div className="space-y-1.5">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text-primary">
                {rec.artist} — {rec.title}
              </p>
              {(rec.album || rec.year) && (
                <p className="truncate text-xs text-text-tertiary">
                  {rec.album}{rec.album && rec.year ? ` (${rec.year})` : rec.year}
                </p>
              )}
            </div>
            {rec.url && (
              <a
                href={rec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
                title="View on MusicBrainz"
              >
                <ExternalLink size={12} strokeWidth={1.5} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
