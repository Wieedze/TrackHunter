import { useState, useCallback } from 'react';
import { CSVParser } from '../services/import/CSVParser.ts';
import type { TrackInput } from '../types/track.ts';

/**
 * Hook for handling CSV/TXT file imports.
 */
export function useImport() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importFile = useCallback(async (file: File): Promise<TrackInput[]> => {
    setImporting(true);
    setError(null);

    try {
      const content = await file.text();
      const tracks = CSVParser.parse(content);

      if (tracks.length === 0) {
        setError('No tracks found in file. Make sure it has "artist" and "title" columns.');
        return [];
      }

      return tracks;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      setError(message);
      return [];
    } finally {
      setImporting(false);
    }
  }, []);

  return { importFile, importing, error };
}
