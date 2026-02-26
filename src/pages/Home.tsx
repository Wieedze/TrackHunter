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
          Paste a playlist, find every track across all platforms. Compare prices, formats, and availability.
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
    </div>
  );
}
