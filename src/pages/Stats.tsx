import { useState, useEffect, useMemo } from 'react';
import { BarChart3, Music, Search, Heart } from 'lucide-react';
import { LocalStore } from '../services/storage/LocalStore.ts';
import type { WishlistItem } from '../types/track.ts';
import type { SearchHistoryItem } from '../types/storage.ts';

export function Stats() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Promise.resolve(LocalStore.getHistory()),
      LocalStore.getWishlist(),
    ]).then(([h, w]) => {
      setHistory(h);
      setWishlist(w);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const totalSearches = history.length;
    const totalTracksSearched = history.reduce((sum, h) => sum + h.trackCount, 0);
    const totalWishlist = wishlist.length;

    // Sources breakdown
    const sourceMap: Record<string, number> = {};
    for (const h of history) {
      const src = h.source || 'unknown';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    }
    const sources = Object.entries(sourceMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Artists from wishlist
    const artistMap: Record<string, number> = {};
    for (const item of wishlist) {
      const artist = item.track.artist;
      if (artist) {
        artistMap[artist] = (artistMap[artist] || 0) + 1;
      }
    }
    const topArtists = Object.entries(artistMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Labels from wishlist
    const labelMap: Record<string, number> = {};
    for (const item of wishlist) {
      const label = item.track.label;
      if (label) {
        labelMap[label] = (labelMap[label] || 0) + 1;
      }
    }
    const topLabels = Object.entries(labelMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Genres from wishlist
    const genreMap: Record<string, number> = {};
    for (const item of wishlist) {
      const genre = item.track.genre;
      if (genre) {
        genreMap[genre] = (genreMap[genre] || 0) + 1;
      }
    }
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalSearches,
      totalTracksSearched,
      totalWishlist,
      sources,
      topArtists,
      topLabels,
      topGenres,
    };
  }, [history, wishlist]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-text-secondary">Loading stats...</p>
      </div>
    );
  }

  const isEmpty = history.length === 0 && wishlist.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <BarChart3 size={32} strokeWidth={1.5} className="text-text-tertiary" />
        <p className="text-text-secondary">No stats yet.</p>
        <p className="text-sm text-text-tertiary">
          Start searching for tracks and adding to your wishlist to see stats here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-text-primary">Stats</h1>
        <p className="text-sm text-text-tertiary">Overview of your TrackHunter activity.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={Search} label="Searches" value={stats.totalSearches} />
        <StatCard icon={Music} label="Tracks searched" value={stats.totalTracksSearched} />
        <StatCard icon={Heart} label="Wishlist tracks" value={stats.totalWishlist} />
      </div>

      {/* Source breakdown */}
      {stats.sources.length > 0 && (
        <Section title="Import sources">
          <BarList
            items={stats.sources.map((s) => ({
              label: formatSource(s.name),
              value: s.count,
              color: 'bg-accent',
            }))}
          />
        </Section>
      )}

      {/* Top artists */}
      {stats.topArtists.length > 0 && (
        <Section title="Top artists (wishlist)">
          <BarList
            items={stats.topArtists.map((a) => ({
              label: a.name,
              value: a.count,
              color: 'bg-platform-spotify',
            }))}
          />
        </Section>
      )}

      {/* Top labels */}
      {stats.topLabels.length > 0 && (
        <Section title="Top labels (wishlist)">
          <BarList
            items={stats.topLabels.map((l) => ({
              label: l.name,
              value: l.count,
              color: 'bg-platform-beatport',
            }))}
          />
        </Section>
      )}

      {/* Top genres */}
      {stats.topGenres.length > 0 && (
        <Section title="Top genres (wishlist)">
          <BarList
            items={stats.topGenres.map((g) => ({
              label: g.name,
              value: g.count,
              color: 'bg-platform-discogs',
            }))}
          />
        </Section>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Search; label: string; value: number }) {
  return (
    <div className="rounded-sm border border-border bg-bg-secondary px-4 py-3">
      <div className="flex items-center gap-2 text-text-tertiary">
        <Icon size={14} strokeWidth={1.5} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-border bg-bg-secondary p-4">
      <h2 className="mb-3 text-sm font-semibold text-text-primary">{title}</h2>
      {children}
    </div>
  );
}

function BarList({ items }: { items: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-sm text-text-secondary" title={item.label}>
            {item.label}
          </span>
          <div className="relative flex-1 h-5 rounded-sm bg-bg-tertiary overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-sm ${item.color} opacity-80`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs text-text-tertiary">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatSource(source: string): string {
  const map: Record<string, string> = {
    text: 'Manual input',
    csv: 'CSV file',
    spotify_link: 'Spotify link',
    youtube_link: 'YouTube link',
    soundcloud_link: 'SoundCloud link',
    spotify_oauth: 'Spotify account',
    youtube_oauth: 'YouTube account',
  };
  return map[source] || source;
}
