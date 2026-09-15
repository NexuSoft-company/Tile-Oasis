import { RuntimeLevelRegistry } from './RuntimeLevelRegistry';
import { ContentCache } from './ContentCache';

export class LevelPrefetcher {
  /**
   * Prefetches current level and next level into memory cache.
   */
  public static prefetchCurrentAndNext(currentLevelId: number): void {
    try {
      // 1. Current level
      if (!ContentCache.hasLevel(currentLevelId)) {
        const current = RuntimeLevelRegistry.getLevel(currentLevelId);
        if (current) ContentCache.setLevel(current);
      }

      // 2. Next level
      const nextId = currentLevelId + 1;
      if (!ContentCache.hasLevel(nextId)) {
        const next = RuntimeLevelRegistry.getLevel(nextId);
        if (next) ContentCache.setLevel(next);
      }
    } catch (e) {
      console.warn(`[LevelPrefetcher] Failed to prefetch level ${currentLevelId}:`, e);
    }
  }

  /**
   * Cleans up levels far behind or ahead of current level to optimize memory.
   */
  public static pruneDistance(currentLevelId: number, maxDistance: number = 3): void {
    // Keeps levels within range [current - maxDistance, current + maxDistance]
    for (let i = 1; i < currentLevelId - maxDistance; i++) {
      if (ContentCache.hasLevel(i)) {
        ContentCache.invalidateLevel(i);
      }
    }
  }
}
