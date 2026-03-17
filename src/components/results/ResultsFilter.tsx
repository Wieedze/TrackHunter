import { Platform } from '../../types/platform.ts';

export interface FilterState {
  platforms: Platform[];
  status: 'all' | 'found' | 'not_found' | 'error';
  sortBy: 'default' | 'platforms' | 'confidence' | 'alpha';
}

const FILTER_PLATFORMS = [
  { value: Platform.BANDCAMP, label: 'Bandcamp', color: 'border-platform-bandcamp/30 bg-platform-bandcamp/10 text-platform-bandcamp' },
  { value: Platform.BEATPORT, label: 'Beatport', color: 'border-platform-beatport/30 bg-platform-beatport/10 text-platform-beatport' },
  { value: Platform.MUSICBRAINZ, label: 'MusicBrainz', color: 'border-platform-musicbrainz/30 bg-platform-musicbrainz/10 text-platform-musicbrainz' },
  { value: Platform.DISCOGS, label: 'Discogs', color: 'border-border bg-bg-tertiary text-text-secondary' },
] as const;

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ResultsFilter({ filters, onChange }: Props) {
  function togglePlatform(platform: Platform) {
    const next = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onChange({ ...filters, platforms: next });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border bg-bg-secondary px-4 py-3">
      {/* Platform toggles */}
      <span className="text-xs text-text-tertiary">Platform:</span>
      {FILTER_PLATFORMS.map((p) => {
        const active = filters.platforms.includes(p.value);
        return (
          <button
            key={p.value}
            onClick={() => togglePlatform(p.value)}
            className={`rounded-sm border px-2.5 py-1 text-xs transition-colors ${
              active ? p.color : 'border-border text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {p.label}
          </button>
        );
      })}

      <span className="text-border">|</span>

      {/* Status filter */}
      <span className="text-xs text-text-tertiary">Status:</span>
      {(['all', 'found', 'not_found', 'error'] as const).map((s) => (
        <button
          key={s}
          onClick={() => onChange({ ...filters, status: s })}
          className={`rounded-sm border px-2.5 py-1 text-xs transition-colors ${
            filters.status === s
              ? 'border-accent/30 bg-accent/10 text-accent'
              : 'border-border text-text-tertiary hover:text-text-secondary'
          }`}
        >
          {s === 'all' ? 'All' : s === 'found' ? 'Found' : s === 'not_found' ? 'Not found' : 'Errors'}
        </button>
      ))}

      <span className="text-border">|</span>

      {/* Sort */}
      <span className="text-xs text-text-tertiary">Sort:</span>
      <select
        value={filters.sortBy}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
        className="rounded-sm border border-border bg-bg-primary px-2 py-1 text-xs text-text-secondary focus:border-border-active focus:outline-none"
      >
        <option value="default">Default</option>
        <option value="platforms">Most platforms</option>
        <option value="confidence">Best match</option>
        <option value="alpha">A → Z</option>
      </select>
    </div>
  );
}
