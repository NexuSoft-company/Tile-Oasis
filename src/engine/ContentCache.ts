import { RuntimeLevelDefinition } from '../types/runtimeContract';
import { RuntimeLevelRegistry } from './RuntimeLevelRegistry';

export class ContentCache {
  private static cache: Map<number, RuntimeLevelDefinition> = new Map();
  private static readonly MAX_CACHE_SIZE = 50;

  /**
   * Stores an approved level in local cache.
   */
  public static setLevel(level: RuntimeLevelDefinition): void {
    if (!level || level.metadata?.approvalStatus !== 'APPROVED') {
      console.warn(`[ContentCache] Refusing to cache unapproved or invalid level ${level?.id}`);
      return;
    }

    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Evict oldest entry (FIFO)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(level.id, level);
  }

  /**
   * Fetches cached approved level or null if not cached or invalid.
   */
  public static getLevel(levelId: number): RuntimeLevelDefinition | null {
    const cached = this.cache.get(levelId);
    if (!cached) return null;

    // Invalidate if version unsupported
    if (!cached.version || !RuntimeLevelRegistry.SUPPORTED_VERSIONS.includes(cached.version)) {
      this.invalidateLevel(levelId);
      return null;
    }

    return cached;
  }

  public static hasLevel(levelId: number): boolean {
    return this.cache.has(levelId);
  }

  public static invalidateLevel(levelId: number): void {
    this.cache.delete(levelId);
  }

  public static clearCache(): void {
    this.cache.clear();
  }

  public static getCacheSize(): number {
    return this.cache.size;
  }
}
