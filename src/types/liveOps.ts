export type FeatureFlagKey =
  | 'FEATURE_COLLECTION'
  | 'FEATURE_DAILY_GIFT'
  | 'FEATURE_MISSIONS'
  | 'FEATURE_ACHIEVEMENTS'
  | 'FEATURE_SPECIAL_EVENTS'
  | 'FEATURE_NEW_SHOP'
  | 'FEATURE_ANALYTICS'
  | 'FEATURE_LIVEOPS_EVENTS'
  | 'FEATURE_AUDIO'
  | 'FEATURE_HAPTICS';

export interface FeatureFlags {
  FEATURE_COLLECTION: boolean;
  FEATURE_DAILY_GIFT: boolean;
  FEATURE_MISSIONS: boolean;
  FEATURE_ACHIEVEMENTS: boolean;
  FEATURE_SPECIAL_EVENTS: boolean;
  FEATURE_NEW_SHOP: boolean;
  FEATURE_ANALYTICS: boolean;
  FEATURE_LIVEOPS_EVENTS: boolean;
  FEATURE_AUDIO: boolean;
  FEATURE_HAPTICS: boolean;
}

export type ErrorCategory =
  | 'LEVEL_LOAD_ERROR'
  | 'GAMEPLAY_ERROR'
  | 'SAVE_ERROR'
  | 'REWARD_ERROR'
  | 'ECONOMY_ERROR'
  | 'SHOP_ERROR'
  | 'PROGRESSION_ERROR'
  | 'UI_ERROR'
  | 'ANALYTICS_ERROR';

export interface ErrorLogRecord {
  id: string;
  category: ErrorCategory;
  message: string;
  technicalDetails?: string;
  playerFacingMessage: string;
  timestamp: number;
  breadcrumbs: string[];
  context?: Record<string, any>;
}

export interface LiveOpsEventConfig {
  id: string;
  name: string;
  description: string;
  active: boolean;
  startTime: number;
  endTime: number;
  coinMultiplier: number;
  xpMultiplier: number;
  specialShopDiscounts: Record<string, number>;
}

export interface LiveOpsConfiguration {
  version: string;
  activeEvents: LiveOpsEventConfig[];
  dailyGiftCoins: number;
  dailyGiftUndoBoosters: number;
  boosterPriceMultiplier: number;
  featuredCosmeticId?: string;
  maintenanceMode: boolean;
}

export type CloudSyncStatus = 'offline' | 'syncing' | 'synced' | 'conflict' | 'error';

export interface ICloudSyncAdapter {
  getStatus(): CloudSyncStatus;
  enqueueAnalyticsBatch(events: any[]): Promise<boolean>;
  syncSaveData?(localData: any): Promise<{ success: boolean; data?: any }>;
}
