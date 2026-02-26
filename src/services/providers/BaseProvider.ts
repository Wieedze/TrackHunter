import type { Platform, PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';

/**
 * Base class for all platform providers.
 * Each provider implements search() to find tracks on a specific platform.
 */
export abstract class BaseProvider {
  abstract platform: Platform;

  abstract search(query: TrackQuery): Promise<PlatformResult[]>;

  abstract isAvailable(): Promise<boolean>;

  /**
   * Compute confidence score between a query and a candidate result.
   * Uses normalized string comparison.
   */
  protected computeConfidence(
    query: TrackQuery,
    candidate: { title?: string; artist?: string },
  ): number {
    const normalize = (s: string): string =>
      s
        .toLowerCase()
        .replace(/[\(\)\[\]\-–—]/g, ' ')
        .replace(/feat\.?|ft\.?|featuring/g, 'feat')
        .replace(/remix|rmx|rework|edit|mix/g, 'remix')
        .replace(/original\s*(mix)?/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    let score = 0;

    // Title similarity (40%)
    if (candidate.title) {
      const sim = tokenSimilarity(normalize(query.title), normalize(candidate.title));
      score += sim * 0.4;
    }

    // Artist similarity (40%)
    if (candidate.artist) {
      const sim = tokenSimilarity(normalize(query.artist), normalize(candidate.artist));
      score += sim * 0.4;
    }

    // Label bonus (20%)
    if (query.label && candidate.title) {
      // Simple heuristic — label matching would need the candidate label field
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }
}

/**
 * Token-based similarity: measures overlap between word sets.
 */
function tokenSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.split(' ').filter(Boolean));
  const tokensB = new Set(b.split(' ').filter(Boolean));

  if (tokensA.size === 0 && tokensB.size === 0) return 1;
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let overlap = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap++;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return overlap / union; // Jaccard similarity
}
