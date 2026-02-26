import { nanoid } from 'nanoid';
import type { TrackInput } from '../../types/track.ts';

/**
 * Parses free-text input into TrackInput objects.
 * Supports formats:
 *   - "Artist - Title"
 *   - "Artist — Title (Label)"
 *   - "Artist – Title [Remix]"
 *   - Numbers prefixed: "1. Artist - Title"
 */
export class TextParser {
  private static SEPARATORS = [' - ', ' – ', ' — ', ' // '];

  private static NUMBER_PREFIX = /^\d+[\.\)\-]?\s*/;

  static parse(text: string): TrackInput[] {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const tracks: TrackInput[] = [];

    for (const line of lines) {
      const track = TextParser.parseLine(line);
      if (track) {
        tracks.push(track);
      }
    }

    return tracks;
  }

  static parseLine(line: string): TrackInput | null {
    // Remove number prefix (e.g., "1. ", "01) ", "3- ")
    let clean = line.replace(TextParser.NUMBER_PREFIX, '');

    // Extract label if in parentheses at end: "Artist - Title (Label)"
    let label: string | undefined;
    const labelMatch = clean.match(/\(([^)]+)\)\s*$/);
    if (labelMatch) {
      // Only treat as label if it doesn't look like a remix indicator
      const candidate = labelMatch[1];
      if (!/remix|mix|edit|rework|dub|version/i.test(candidate)) {
        label = candidate.trim();
        clean = clean.replace(/\(([^)]+)\)\s*$/, '').trim();
      }
    }

    // Try each separator
    for (const sep of TextParser.SEPARATORS) {
      const idx = clean.indexOf(sep);
      if (idx !== -1) {
        const artist = clean.slice(0, idx).trim();
        const title = clean.slice(idx + sep.length).trim();

        if (artist && title) {
          return {
            id: nanoid(),
            artist,
            title,
            label,
          };
        }
      }
    }

    return null;
  }
}
