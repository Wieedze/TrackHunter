import { nanoid } from 'nanoid';
import type { TrackInput } from '../../types/track.ts';

/**
 * Parses CSV/TSV files into TrackInput objects.
 * Auto-detects delimiter (comma, tab, semicolon).
 * Expects at minimum: artist, title columns.
 */
export class CSVParser {
  static parse(content: string): TrackInput[] {
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) return []; // Need header + at least one row

    const delimiter = CSVParser.detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());

    const artistIdx = headers.findIndex((h) => /artist|artiste/.test(h));
    const titleIdx = headers.findIndex((h) => /title|titre|track|name/.test(h));

    if (artistIdx === -1 || titleIdx === -1) return [];

    const labelIdx = headers.findIndex((h) => /label/.test(h));
    const albumIdx = headers.findIndex((h) => /album/.test(h));
    const genreIdx = headers.findIndex((h) => /genre/.test(h));
    const yearIdx = headers.findIndex((h) => /year|année|date/.test(h));

    const tracks: TrackInput[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map((c) => c.trim());
      const artist = cols[artistIdx];
      const title = cols[titleIdx];

      if (!artist || !title) continue;

      tracks.push({
        id: nanoid(),
        artist,
        title,
        label: labelIdx !== -1 ? cols[labelIdx] : undefined,
        album: albumIdx !== -1 ? cols[albumIdx] : undefined,
        genre: genreIdx !== -1 ? cols[genreIdx] : undefined,
        year: yearIdx !== -1 ? parseInt(cols[yearIdx], 10) || undefined : undefined,
      });
    }

    return tracks;
  }

  private static detectDelimiter(headerLine: string): string {
    const counts = {
      '\t': (headerLine.match(/\t/g) ?? []).length,
      ',': (headerLine.match(/,/g) ?? []).length,
      ';': (headerLine.match(/;/g) ?? []).length,
    };

    return Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }
}
