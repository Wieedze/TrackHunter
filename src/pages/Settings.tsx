import { useSettingsStore } from '../stores/settingsStore.ts';
import { Platform } from '../types/platform.ts';
import { Button } from '../components/ui/Button.tsx';

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

export function Settings() {
  const { activePlatforms, togglePlatform, preferredCurrency, setPreferredCurrency } = useSettingsStore();

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-display text-lg font-semibold text-text-primary">Settings</h2>

      {/* Active platforms */}
      <section className="mt-6">
        <h3 className="text-sm font-medium text-text-secondary">Active Platforms</h3>
        <p className="mt-1 text-xs text-text-tertiary">
          Choose which platforms to search when looking for tracks.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.values(Platform).map((p) => {
            const isActive = activePlatforms.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-border-active bg-accent-muted text-accent'
                    : 'border-border text-text-tertiary hover:border-border-hover hover:text-text-secondary'
                }`}
              >
                {PLATFORM_LABELS[p] ?? p}
              </button>
            );
          })}
        </div>
      </section>

      {/* Currency */}
      <section className="mt-8">
        <h3 className="text-sm font-medium text-text-secondary">Preferred Currency</h3>
        <div className="mt-3 flex gap-2">
          {['EUR', 'USD', 'GBP'].map((c) => (
            <Button
              key={c}
              variant={preferredCurrency === c ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setPreferredCurrency(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
