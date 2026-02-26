import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';
import { useSearch } from '../hooks/useSearch.ts';
import { usePlaylistStore } from '../stores/playlistStore.ts';
import { LinkResolver } from '../services/import/LinkResolver.ts';

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
        spotify_playlist: 'Spotify playlist detected',
        youtube_playlist: 'YouTube playlist detected',
        soundcloud_set: 'SoundCloud set detected',
        deezer_playlist: 'Deezer playlist detected',
        unknown_link: 'Link detected',
      }[inputType.type]
    : null;

  async function handleSearch() {
    if (!input.trim() || isLoading) return;
    await importAndSearch(input.trim());
    // Navigate to results if search started successfully
    const status = usePlaylistStore.getState().searchStatus;
    if (status === 'searching' || status === 'done') {
      navigate('/results');
    }
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
            placeholder={`Paste your tracks here...\n\nKerri Chandler - Rain (DJ Deep Remix)\nMoodymann - Shades of Jae\n\nOr paste a Spotify/YouTube playlist link...`}
            className="w-full resize-none rounded-none border border-border bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-active focus:outline-none"
            rows={8}
            disabled={isLoading}
          />

          {/* Input type detection feedback */}
          {inputLabel && (
            <p className="mt-2 text-xs text-accent">{inputLabel}</p>
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
                disabled={!input.trim() || isLoading}
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
