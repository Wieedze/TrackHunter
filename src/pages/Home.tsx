import { Search } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';

export function Home() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          <span className="text-accent">Track</span>Hunter
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Paste a playlist, find every track across all platforms. Compare prices, formats, and availability.
        </p>
      </div>

      {/* Import zone */}
      <div className="w-full max-w-2xl">
        <div className="rounded-sm border border-border bg-bg-secondary p-5">
          <textarea
            placeholder="Paste your tracks here...&#10;&#10;Kerri Chandler - Rain (DJ Deep Remix)&#10;Moodymann - Shades of Jae&#10;&#10;Or paste a Spotify/YouTube playlist link..."
            className="w-full resize-none rounded-none border border-border bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-active focus:outline-none"
            rows={8}
          />

          <div className="mt-4 flex items-center justify-between">
            <button className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              Upload CSV / TXT
            </button>

            <Button variant="primary" size="md">
              <Search size={16} strokeWidth={1.5} />
              Search
            </Button>
          </div>
        </div>

        {/* OAuth platforms */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-xs text-text-tertiary">or import from</span>
          {['Spotify', 'YouTube', 'SoundCloud', 'Deezer'].map((name) => (
            <button
              key={name}
              className="rounded-sm border border-border px-3 py-1 text-xs text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
