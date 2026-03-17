import { useSettingsStore } from '../stores/settingsStore.ts';
import { useThemeStore } from '../stores/themeStore.ts';
import { Platform } from '../types/platform.ts';

/** Platforms that have a search provider (API or manual link). */
const SEARCH_PLATFORMS: { value: Platform; label: string }[] = [
  { value: Platform.BANDCAMP, label: 'Bandcamp' },
  { value: Platform.MUSICBRAINZ, label: 'MusicBrainz' },
  { value: Platform.DISCOGS, label: 'Discogs' },
  { value: Platform.BEATPORT, label: 'Beatport' },
];

const THEME_OPTIONS = [
  { value: 'dark' as const, label: 'Dark' },
  { value: 'light' as const, label: 'Light' },
  { value: 'system' as const, label: 'System' },
];

export function Settings() {
  const { activePlatforms, togglePlatform } = useSettingsStore();
  const { theme, setTheme } = useThemeStore();

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
          {SEARCH_PLATFORMS.map(({ value, label }) => {
            const isActive = activePlatforms.includes(value);
            return (
              <button
                key={value}
                onClick={() => togglePlatform(value)}
                className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-border-active bg-accent-muted text-accent'
                    : 'border-border text-text-tertiary hover:border-border-hover hover:text-text-secondary'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
      {/* Theme */}
      <section className="mt-8">
        <h3 className="text-sm font-medium text-text-secondary">Theme</h3>
        <p className="mt-1 text-xs text-text-tertiary">
          Choose between dark mode, light mode, or follow your system preference.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {THEME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                theme === value
                  ? 'border-border-active bg-accent-muted text-accent'
                  : 'border-border text-text-tertiary hover:border-border-hover hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
