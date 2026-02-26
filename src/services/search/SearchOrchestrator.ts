import type { TrackQuery } from '../../types/search.ts';
import type { PlatformResult } from '../../types/platform.ts';
import type { BaseProvider } from '../providers/BaseProvider.ts';

/**
 * Launches all providers in parallel for a given track query.
 * Uses Promise.allSettled to ensure one failing provider doesn't block others.
 */
export class SearchOrchestrator {
  private providers: BaseProvider[];

  constructor(providers: BaseProvider[]) {
    this.providers = providers;
  }

  async searchTrack(query: TrackQuery): Promise<PlatformResult[]> {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.search(query)),
    );

    const allResults: PlatformResult[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value);
      }
      // Rejected providers are silently skipped — they'll show as "not found"
    }

    return allResults;
  }

  async searchBatch(
    queries: TrackQuery[],
    onProgress?: (completed: number, total: number) => void,
  ): Promise<Map<string, PlatformResult[]>> {
    const resultsMap = new Map<string, PlatformResult[]>();
    let completed = 0;

    for (const query of queries) {
      const key = `${query.artist} - ${query.title}`;
      const results = await this.searchTrack(query);
      resultsMap.set(key, results);

      completed++;
      onProgress?.(completed, queries.length);
    }

    return resultsMap;
  }
}
