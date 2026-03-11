import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Loader2, Check } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';
import { useSearch } from '../hooks/useSearch.ts';
import { usePlaylistStore } from '../stores/playlistStore.ts';
import { LinkResolver } from '../services/import/LinkResolver.ts';

const YOUTUBE_CONFIGURED = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY);

export function Home() {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { importAndSearch } = useSearch();
  const { searchStatus, error } = usePlaylistStore();
  const isLoading = searchStatus === 'parsing' || searchStatus === 'searching';

  // Detect input type for visual feedback
  const inputType = input.trim() ? LinkResolver.detect(input.trim()) : null;
  const inputLabel = inputType
    ? {
        text: null,
        spotify_playlist: 'Spotify playlist detected — ready to import',
        youtube_playlist: YOUTUBE_CONFIGURED
          ? 'YouTube playlist detected — ready to import'
          : 'YouTube playlist detected — set VITE_YOUTUBE_API_KEY in .env',
        youtube_mix: null,
        soundcloud_set: 'SoundCloud set detected — ready to import',
        deezer_playlist: 'Deezer playlist detected',
        unknown_link: 'Link detected',
      }[inputType.type]
    : null;

  const inputError = inputType?.type === 'youtube_mix'
    ? 'YouTube Mix/Radio not supported — only public playlists (list=PL...) can be imported'
    : null;

  function handleSearch() {
    if (!input.trim() || isLoading) return;
    // Don't await — let the search run in the background while we navigate
    importAndSearch(input.trim()).catch(() => {});
    // Subscribe to store: navigate as soon as playlist is set
    const unsub = usePlaylistStore.subscribe((state) => {
      if (state.currentPlaylist && state.searchStatus !== 'idle') {
        unsub();
        navigate('/results');
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSearch();
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col items-center gap-8 pt-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          <span className="text-accent">Track</span>Hunter
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Paste a playlist, find every track across all platforms.
        </p>
      </div>

      {/* Import zone */}
      <div className="w-full max-w-2xl">
        <div className="rounded-sm border border-border bg-bg-secondary p-5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Paste your tracks here...\n\nKerri Chandler - Rain (DJ Deep Remix)\nMoodymann - Shades of Jae\n\nOr paste a Spotify/YouTube/SoundCloud playlist link...`}
            className="w-full resize-none rounded-none border border-border bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-active focus:outline-none"
            rows={8}
            disabled={isLoading}
          />

          {/* Input type detection feedback */}
          {inputLabel && (
            <p className="mt-2 text-xs text-accent">{inputLabel}</p>
          )}

          {/* Input validation error (e.g. YouTube Mix) */}
          {inputError && (
            <p className="mt-2 text-xs text-status-error">{inputError}</p>
          )}

          {/* Error message */}
          {error && (
            <p className="mt-2 text-xs text-status-error">{error}</p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <Upload size={14} strokeWidth={1.5} />
              Upload CSV / TXT
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-tertiary">
                {input.trim() ? `Ctrl+Enter to search` : ''}
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={handleSearch}
                disabled={!input.trim() || isLoading || !!inputError}
              >
                {isLoading ? (
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                ) : (
                  <Search size={16} strokeWidth={1.5} />
                )}
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>

        {/* Platform import status */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-xs text-text-tertiary">import from</span>

          {/* Spotify — always available via Worker Client Credentials */}
          <span
            className="flex items-center gap-1.5 rounded-sm border border-platform-spotify/30 bg-platform-spotify/10 px-3 py-1 text-xs text-platform-spotify"
            title="Paste a Spotify playlist URL above"
          >
            <Check size={12} strokeWidth={2} />
            Spotify
          </span>

          {/* YouTube */}
          <span
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-1 text-xs ${
              YOUTUBE_CONFIGURED
                ? 'border-platform-youtube/30 bg-platform-youtube/10 text-platform-youtube'
                : 'border-border text-text-tertiary opacity-50'
            }`}
            title={YOUTUBE_CONFIGURED ? 'Paste a YouTube playlist URL above' : 'Set VITE_YOUTUBE_API_KEY in .env'}
          >
            {YOUTUBE_CONFIGURED && <Check size={12} strokeWidth={2} />}
            YouTube
          </span>

          {/* SoundCloud */}
          <span
            className="flex items-center gap-1.5 rounded-sm border border-platform-soundcloud/30 bg-platform-soundcloud/10 px-3 py-1 text-xs text-platform-soundcloud"
            title="Paste a SoundCloud set URL above"
          >
            <Check size={12} strokeWidth={2} />
            SoundCloud
          </span>
        </div>
      </div>

      {/* How it works */}
      <section className="mt-12 max-w-2xl text-center">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Find where to buy any track
        </h2>
        <p className="mt-3 text-sm text-text-tertiary leading-relaxed">
          TrackHunter helps DJs, collectors and music lovers find tracks across
          <strong className="text-text-secondary"> Bandcamp</strong>,
          <strong className="text-text-secondary"> Beatport</strong>,
          <strong className="text-text-secondary"> MusicBrainz</strong> and
          <strong className="text-text-secondary"> Discogs</strong>.
          Import your playlists from Spotify, YouTube or SoundCloud and instantly
          see where each track is available for purchase or download.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">1. Import</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Paste a Spotify, YouTube or SoundCloud playlist link — or type track names manually
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">2. Search</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Every track is searched across Bandcamp, Beatport, MusicBrainz and Discogs simultaneously
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">3. Buy</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Click through to buy, download or collect from your preferred music store
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary text-center">
          Built for music lovers
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">For DJs</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Found a tracklist from a set you loved? Paste it in and find every track on Beatport and Bandcamp to build your collection.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">For vinyl collectors</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Search Discogs and MusicBrainz to find physical releases, rare pressings and catalog information for any track.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Spotify to Bandcamp</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Support artists directly. Import your Spotify playlist and find the same tracks on Bandcamp where artists get a bigger share.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Cross-platform search</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Stop searching each platform manually. TrackHunter searches Bandcamp, Beatport, Discogs and MusicBrainz all at once.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 mb-12 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary text-center">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-4">
          <details className="group rounded-sm border border-border bg-bg-secondary">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
              How do I find where to buy a specific song?
            </summary>
            <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">
              Paste the track name (Artist - Title format) or a playlist link from Spotify, YouTube or SoundCloud into the search box above. TrackHunter will instantly search Bandcamp, Beatport, MusicBrainz and Discogs to show you where the track is available.
            </p>
          </details>
          <details className="group rounded-sm border border-border bg-bg-secondary">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
              Can I import my Spotify playlist to find tracks on Bandcamp?
            </summary>
            <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">
              Yes! Just paste your Spotify playlist URL above. TrackHunter extracts all tracks and searches for each one on Bandcamp, Beatport, Discogs and MusicBrainz automatically. No login required.
            </p>
          </details>
          <details className="group rounded-sm border border-border bg-bg-secondary">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
              Is TrackHunter free?
            </summary>
            <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">
              Yes, TrackHunter is completely free to use. Paste any playlist or track list and find purchase links across multiple music platforms instantly.
            </p>
          </details>
          <details className="group rounded-sm border border-border bg-bg-secondary">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
              What music platforms does TrackHunter search?
            </summary>
            <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">
              TrackHunter searches Bandcamp, Beatport, MusicBrainz and Discogs for purchase and download links. You can import tracks from Spotify, YouTube and SoundCloud playlists.
            </p>
          </details>
          <details className="group rounded-sm border border-border bg-bg-secondary">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
              How can DJs find tracks from a set or mix?
            </summary>
            <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">
              If you have a tracklist from a DJ set, paste it in (one track per line, Artist - Title format). TrackHunter will find purchase links on Bandcamp, Beatport and other platforms so you can buy the tracks for your own sets.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
