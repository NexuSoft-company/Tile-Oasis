import { BoosterType } from './gameEngine';

export type StandardAnalyticsEventType =
  | 'APP_OPENED'
  | 'SESSION_STARTED'
  | 'MAIN_MENU_VIEWED'
  | 'WORLD_VIEWED'
  | 'PACK_VIEWED'
  | 'LEVEL_INTRO_VIEWED'
  | 'LEVEL_STARTED'
  | 'LEVEL_COMPLETED'
  | 'LEVEL_FAILED'
  | 'LEVEL_RETRIED'
  | 'LEVEL_ABANDONED'
  | 'TILE_SELECTED'
  | 'TILE_MATCHED'
  | 'COMBO_CREATED'
  | 'BOOSTER_USED'
  | 'BOOSTER_PURCHASED'
  | 'DAILY_REWARD_VIEWED'
  | 'DAILY_REWARD_CLAIMED'
  | 'MISSION_VIEWED'
  | 'MISSION_COMPLETED'
  | 'MISSION_CLAIMED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'ACHIEVEMENT_CLAIMED'
  | 'COLLECTION_VIEWED'
  | 'ITEM_UNLOCKED'
  | 'ITEM_EQUIPPED'
  | 'SHOP_VIEWED'
  | 'SHOP_ITEM_VIEWED'
  | 'SHOP_PURCHASE_STARTED'
  | 'SHOP_PURCHASE_COMPLETED'
  | 'SHOP_PURCHASE_FAILED'
  | 'PACK_COMPLETED'
  | 'WORLD_COMPLETED'
  | 'BOSS_COMPLETED'
  | 'CAMPAIGN_COMPLETED'
  | 'PLAYER_LEVEL_UP'
  | 'SESSION_ENDED'
  | 'RETENTION_DAY_1_RETURN'
  | 'RETENTION_DAY_3_RETURN'
  | 'RETENTION_DAY_7_RETURN'
  | 'RETENTION_DAY_14_RETURN'
  | 'RETENTION_DAY_30_RETURN'
  | 'FUNNEL_STAGE_RECORDED';

export type LegacyAnalyticsEventType =
  | 'xp_earned'
  | 'level_load_started'
  | 'level_load_completed'
  | 'level_load_failed'
  | 'level_started'
  | 'level_restarted'
  | 'level_completed'
  | 'level_failed'
  | 'level_abandoned'
  | 'tile_selected'
  | 'tile_selection_failed'
  | 'tile_moved_to_tray'
  | 'match_started'
  | 'match_completed'
  | 'tile_removed'
  | 'booster_activated'
  | 'booster_viewed'
  | 'booster_selected'
  | 'booster_activation_started'
  | 'booster_activation_success'
  | 'booster_activation_failed'
  | 'booster_consumed'
  | 'booster_rewarded'
  | 'booster_purchased'
  | 'level_paused'
  | 'level_resumed'
  | 'profile_created'
  | 'profile_loaded'
  | 'level_unlocked'
  | 'world_unlocked'
  | 'pack_completed'
  | 'daily_reward_viewed'
  | 'daily_reward_claimed'
  | 'daily_reward_failed'
  | 'daily_shop_gift_claimed'
  | 'mission_started'
  | 'mission_completed'
  | 'mission_claimed'
  | 'achievement_completed'
  | 'achievement_claimed'
  | 'milestone_completed'
  | 'milestone_claimed'
  | 'currency_earned'
  | 'currency_spent'
  | 'collection_item_unlocked'
  | 'shop_item_purchased'
  | 'shop_purchase_successful'
  | 'player_level_up';

export type AnalyticsEventType = StandardAnalyticsEventType | LegacyAnalyticsEventType;

export interface AnalyticsEventParams {
  levelId?: number;
  worldId?: number;
  packId?: string;
  difficulty?: string;
  score?: number;
  stars?: number;
  durationSeconds?: number;
  moves?: number;
  boostersUsed?: Partial<Record<BoosterType, number>> | BoosterType | string | number;
  reason?: string;
  source?: string;
  tileId?: string;
  typeId?: string;
  combo?: number;
  coins?: number;
  gems?: number;
  itemId?: string;
  category?: string;
  cost?: number;
  currency?: 'coins' | 'gems';
  attemptNumber?: number;
  failureReason?: string;
  version?: string;
  [key: string]: any;
}

export interface AnalyticsEventRecord {
  id: string;
  event: AnalyticsEventType;
  params: AnalyticsEventParams;
  timestamp: number;
  sessionId: string;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  lastActiveTime: number;
  durationSeconds: number;
  levelsAttempted: number;
  levelsCompleted: number;
  levelsFailed: number;
  boostersUsed: number;
  rewardsEarned: {
    coins: number;
    gems: number;
    boosters: number;
  };
  currentLevel: number;
  isEnded: boolean;
}

export type LevelFunnelStage =
  | 'VIEWED'
  | 'STARTED'
  | 'FIRST_MOVE'
  | 'PROGRESS_25'
  | 'PROGRESS_50'
  | 'PROGRESS_75'
  | 'COMPLETED'
  | 'FAILED'
  | 'ABANDONED';

export interface LevelFunnelProgress {
  levelId: number;
  stage: LevelFunnelStage;
  percent: number;
  movesUsed: number;
  timeUsedSeconds: number;
  timestamp: number;
}

export interface RetentionProfile {
  firstInstallTimestamp: number;
  lastLoginTimestamp: number;
  totalDaysActive: number;
  day1Tracked: boolean;
  day3Tracked: boolean;
  day7Tracked: boolean;
  day14Tracked: boolean;
  day30Tracked: boolean;
}

export type EconomySourceReason =
  | 'LEVEL_REWARD'
  | 'DAILY_REWARD'
  | 'MISSION_REWARD'
  | 'ACHIEVEMENT_REWARD'
  | 'MILESTONE_REWARD'
  | 'SHOP_PURCHASE'
  | 'BOOSTER_USAGE'
  | 'BOSS_REWARD'
  | 'WORLD_REWARD'
  | 'LEVEL_UP_REWARD'
  | 'DAILY_SHOP_GIFT'
  | 'DEV_GRANT';

export interface EconomyTelemetryRecord {
  id: string;
  timestamp: number;
  currency: 'coins' | 'gems' | 'booster' | 'cosmetic';
  type: 'EARN' | 'SPEND';
  amount: number;
  subType?: BoosterType | string;
  sourceReason: EconomySourceReason;
  balanceAfter: number;
}
