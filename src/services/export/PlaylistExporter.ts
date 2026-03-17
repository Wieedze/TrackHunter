import type { Playlist } from '../../types/track.ts';
import { Platform } from '../../types/platform.ts';

const SEARCH_PLATFORMS = [
  Platform.BANDCAMP,
  Platform.BEATPORT,
  Platform.MUSICBRAINZ,
  Platform.DISCOGS,
] as const;

export class PlaylistExporter {
  /**
   * Export as CSV with platform URLs.
   */
  static toCSV(playlist: Playlist): string {
    const header = ['Artist', 'Title', ...SEARCH_PLATFORMS.map((p) => p.charAt(0).toUpperCase() + p.slice(1) + ' URL')].join(',');

    const rows = playlist.tracks.map((track) => {
      const artist = PlaylistExporter.escapeCSV(track.input.artist);
      const title = PlaylistExporter.escapeCSV(track.input.title);
      const urls = SEARCH_PLATFORMS.map((platform) => {
        const result = track.results.find((r) => r.platform === platform && !r.manualSearch);
        return result ? PlaylistExporter.escapeCSV(result.url) : '';
      });
      return [artist, title, ...urls].join(',');
    });

    return [header, ...rows].join('\n');
  }

  /**
   * Export as plain text (Artist - Title), one per line.
   * Ready for re-import into TrackHunter or DJ software.
   */
  static toTXT(playlist: Playlist): string {
    return playlist.tracks
      .map((track) => `${track.input.artist} - ${track.input.title}`)
      .join('\n');
  }

  /**
   * Trigger a file download in the browser.
   */
  static download(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static exportCSV(playlist: Playlist): void {
    const csv = PlaylistExporter.toCSV(playlist);
    const safeName = playlist.name.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'trackhunter-export';
    PlaylistExporter.download(csv, `${safeName}.csv`, 'text/csv;charset=utf-8;');
  }

  static exportTXT(playlist: Playlist): void {
    const txt = PlaylistExporter.toTXT(playlist);
    const safeName = playlist.name.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'trackhunter-export';
    PlaylistExporter.download(txt, `${safeName}.txt`, 'text/plain;charset=utf-8;');
  }

  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
