import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Loader2, Check, Clock, X } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { useSearch } from '../../hooks/useSearch.ts';
import { usePlaylistStore } from '../../stores/playlistStore.ts';
import { LinkResolver } from '../../services/import/LinkResolver.ts';
import { LocalStore } from '../../services/storage/LocalStore.ts';
import type { SearchHistoryItem } from '../../types/storage.ts';

const YOUTUBE_CONFIGURED = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY);

const DEFAULT_PLACEHOLDER = `Paste your tracks here...\n\nKerri Chandler - Rain (DJ Deep Remix)\nMoodymann - Shades of Jae\n\nOr paste a Spotify/YouTube/SoundCloud playlist link...`;

interface SearchBoxProps {
  /** Textarea placeholder — landing pages tailor it to their source. */
  placeholder?: string;
}

/**
 * Import + search box: paste a playlist link or a tracklist, then search every
 * store. Used by Home and by the landing pages (src/pages/landing).
 */
export function SearchBox({ placeholder = DEFAULT_PLACEHOLDER }: SearchBoxProps) {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { importAndSearch } = useSearch();
  const { searchStatus, error, setCurrentPlaylist, setSearchStatus, setError } = usePlaylistStore();
  const isLoading = searchStatus === 'parsing' || searchStatus === 'searching';
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(LocalStore.getHistory());
  }, []);

  // Detect input type for visual feedback
  const inputType = input.trim() ? LinkResolver.detect(input.trim()) : null;
  const inputLabel = inputType
    ? {
        text: null,
        spotify_track: 'Spotify track detected — ready to search. Note: Spotify may occasionally return errors for some tracks.',
        spotify_album: 'Spotify album detected — ready to import. Note: Spotify may occasionally be slow or unavailable.',
        spotify_playlist: 'Spotify playlist detected — ready to import. Note: only public playlists are supported.',
        youtube_playlist: YOUTUBE_CONFIGURED
          ? 'YouTube playlist detected — ready to import'
          : 'YouTube playlist detected — set VITE_YOUTUBE_API_KEY in .env',
        youtube_mix: null,
        soundcloud_set: 'SoundCloud set detected — ready to import',
        unknown_link: 'Link detected',
      }[inputType.type]
    : null;

  const inputError = inputType?.type === 'youtube_mix'
    ? 'YouTube Mix/Radio not supported — only public playlists (list=PL...) can be imported'
    : null;

  function launchSearch(value: string) {
    if (!value.trim() || isLoading) return;
    // Reset previous search state before starting new one
    setCurrentPlaylist(null);
    setSearchStatus('idle');
    setError(null);
    // Don't await — let the search run in the background while we navigate
    importAndSearch(value.trim()).catch(() => {});
    // Subscribe to store: navigate as soon as playlist is set
    const unsub = usePlaylistStore.subscribe((state) => {
      if (state.currentPlaylist && state.searchStatus !== 'idle') {
        unsub();
        navigate('/results');
      }
    });
  }

  function handleSearch() {
    launchSearch(input);
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
    <>
      {/* Import zone */}
      <div className="w-full max-w-2xl">
        <div className="rounded-sm border border-border bg-bg-secondary p-5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
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

      {/* Search history */}
      {history.length > 0 && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <Clock size={12} strokeWidth={1.5} />
              Recent searches
            </span>
            <button
              onClick={() => { LocalStore.clearHistory(); setHistory([]); }}
              className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <X size={12} strokeWidth={1.5} />
              Clear
            </button>
          </div>
          <div className="space-y-1">
            {history.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => { setInput(item.rawInput); }}
                className="w-full flex items-center justify-between rounded-sm border border-border bg-bg-secondary px-3 py-2 text-left transition-colors hover:border-border-hover"
              >
                <span className="text-sm text-text-primary truncate">{item.name}</span>
                <span className="ml-2 shrink-0 text-xs text-text-tertiary">
                  {item.trackCount} tracks
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </>
  );
}
