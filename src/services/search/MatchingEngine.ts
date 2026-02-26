import type { TrackQuery } from '../../types/search.ts';
import type { PlatformResult } from '../../types/platform.ts';

/**
 * Fuzzy matching engine for comparing track queries against platform results.
 * Handles variations in naming (remixes, features, labels, etc.).
 */
export class MatchingEngine {
  /**
   * Compute confidence score between a query and a candidate result.
   */
  static computeConfidence(
    query: TrackQuery,
    candidate: Partial<PlatformResult> & { isrc?: string },
  ): number {
    // ISRC match = 100% confidence (fast path)
    if (query.isrc && candidate.isrc === query.isrc) return 1.0;

    let score = 0;

    // Title similarity (weight: 40%)
    if (candidate.title) {
      const titleSim = MatchingEngine.normalizedSimilarity(query.title, candidate.title);
      score += titleSim * 0.4;
    }

    // Artist similarity (weight: 40%)
    if (candidate.artist) {
      const artistSim = MatchingEngine.normalizedSimilarity(query.artist, candidate.artist);
      score += artistSim * 0.4;
    }

    // Label bonus (weight: 10%)
    if (query.label && candidate.extras?.releaseDate) {
      score += 0.1;
    }

    // Remaining 10% reserved for duration matching (when available)

    return Math.min(score, 1.0);
  }

  /**
   * Normalize a string for comparison:
   * - lowercase
   * - remove brackets, dashes
   * - normalize "feat" variations
   * - normalize "remix" variations
   * - collapse whitespace
   */
  static normalize(s: string): string {
    return s
      .toLowerCase()
      .replace(/[\(\)\[\]\-–—]/g, ' ')
      .replace(/feat\.?|ft\.?|featuring/g, 'feat')
      .replace(/remix|rmx|rework|edit|mix/g, 'remix')
      .replace(/original\s*(mix)?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Token-based Jaccard similarity on normalized strings.
   */
  static normalizedSimilarity(a: string, b: string): number {
    const tokensA = new Set(MatchingEngine.normalize(a).split(' ').filter(Boolean));
    const tokensB = new Set(MatchingEngine.normalize(b).split(' ').filter(Boolean));

    if (tokensA.size === 0 && tokensB.size === 0) return 1;
    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let overlap = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) overlap++;
    }

    const union = new Set([...tokensA, ...tokensB]).size;
    return overlap / union;
  }
}
