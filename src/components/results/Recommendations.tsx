import { useState } from 'react';
import { Sparkles, ExternalLink, Loader2, Play } from 'lucide-react';
import { RecommendationEngine } from '../../services/recommendations/RecommendationEngine.ts';
import type { Recommendation } from '../../services/recommendations/RecommendationEngine.ts';
import type { TrackInput } from '../../types/track.ts';
import { usePlayerStore } from '../../stores/playerStore.ts';

interface RecommendationsProps {
  track: TrackInput;
}

export function Recommendations({ track }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { play } = usePlayerStore();

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
        Similar tracks on Bandcamp
      </button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
        Searching Bandcamp...
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <p className="text-xs text-text-tertiary">No similar tracks found on Bandcamp.</p>
    );
  }

  return (
    <div className="rounded-sm border border-platform-bandcamp/30 bg-platform-bandcamp/5 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} strokeWidth={1.5} className="text-platform-bandcamp" />
        <span className="text-xs font-medium text-text-secondary">Similar on Bandcamp</span>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-center gap-3">
            {/* Artwork */}
            {rec.artworkUrl ? (
              <img src={rec.artworkUrl} alt="" className="h-8 w-8 rounded-sm object-cover shrink-0" />
            ) : (
              <div className="h-8 w-8 rounded-sm bg-bg-tertiary shrink-0" />
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text-primary">
                {rec.artist} — {rec.title}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => play(rec.id, rec.url, 'bandcamp', `${rec.artist} — ${rec.title}`)}
                className="flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-xs text-accent hover:bg-accent/20 transition-colors"
                title="Play on Bandcamp"
              >
                <Play size={10} strokeWidth={2} fill="currentColor" />
                Play
              </button>
              <a
                href={rec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-sm border border-platform-bandcamp/30 bg-platform-bandcamp/10 px-1.5 py-0.5 text-xs text-platform-bandcamp hover:bg-platform-bandcamp/20 transition-colors"
                title="Open on Bandcamp"
              >
                <ExternalLink size={10} strokeWidth={1.5} />
                Open
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
