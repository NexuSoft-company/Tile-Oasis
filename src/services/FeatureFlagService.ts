import { FeatureFlagKey, FeatureFlags } from '../types/liveOps';

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  FEATURE_COLLECTION: true,
  FEATURE_DAILY_GIFT: true,
  FEATURE_MISSIONS: true,
  FEATURE_ACHIEVEMENTS: true,
  FEATURE_SPECIAL_EVENTS: true,
  FEATURE_NEW_SHOP: true,
  FEATURE_ANALYTICS: true,
  FEATURE_LIVEOPS_EVENTS: true,
  FEATURE_AUDIO: true,
  FEATURE_HAPTICS: true,
};

const FEATURE_FLAGS_STORAGE_KEY = 'tile_oasis_feature_flags_v1';

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: FeatureFlags;
  private listeners: Array<(flags: FeatureFlags) => void> = [];

  constructor() {
    this.flags = this.loadFlags();
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  private loadFlags(): FeatureFlags {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...DEFAULT_FEATURE_FLAGS, ...parsed };
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
    return { ...DEFAULT_FEATURE_FLAGS };
  }

  private persistFlags(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(this.flags));
      } catch (e) {
        // Safe fallback
      }
    }
  }

  public isEnabled(key: FeatureFlagKey): boolean {
    return this.flags[key] ?? false;
  }

  public setFlag(key: FeatureFlagKey, value: boolean): void {
    this.flags = {
      ...this.flags,
      [key]: value,
    };
    this.persistFlags();
    this.notifyListeners();
  }

  public setAllFlags(flags: Partial<FeatureFlags>): void {
    this.flags = {
      ...this.flags,
      ...flags,
    };
    this.persistFlags();
    this.notifyListeners();
  }

  public getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  public resetDefaults(): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS };
    this.persistFlags();
    this.notifyListeners();
  }

  public subscribe(listener: (flags: FeatureFlags) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => {
      try {
        l(this.flags);
      } catch (err) {
        console.warn('[FeatureFlagService] Error in listener:', err);
      }
    });
  }
}

export const globalFeatureFlagService = FeatureFlagService.getInstance();
