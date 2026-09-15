import { BoosterType } from './gameEngine';

export const PROFILE_CURRENT_VERSION = 1;

export interface LifetimeStatistics {
  levelsCompleted: number;
  levelsFailed: number;
  levelsAttempted: number;
  totalMoves: number;
  totalTilesMatched: number;
  totalBoostersUsed: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  totalGemsEarned: number;
  totalGemsSpent: number;
  totalPlayTimeSeconds: number;
  bestScore: number;
}

export interface DailyRewardDayConfig {
  day: number; // 1 - 7
  coins: number;
  gems: number;
  boosters: Partial<Record<BoosterType, number>>;
  description: string;
}

export interface DailyRewardState {
  lastClaimTimestamp: number;
  currentStreak: number;
  currentDay: number; // 1 - 7
  claimedDays: Record<number, number>; // day -> claim timestamp
}

export type MissionType =
  | 'complete_levels'
  | 'complete_levels_3_stars'
  | 'match_tiles'
  | 'use_boosters'
  | 'earn_coins'
  | 'earn_stars'
  | 'play_levels';

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  targetProgress: number;
  rewardCoins: number;
  rewardGems: number;
  rewardXp?: number;
  rewardBoosters?: Partial<Record<BoosterType, number>>;
  expirationHours?: number;
}

export interface MissionProgressState {
  missionId: string;
  currentProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  startedAtTimestamp: number;
  expiresAtTimestamp?: number;
}

export type AchievementCategory =
  | 'Progression'
  | 'Skill'
  | 'Collection'
  | 'Booster Usage'
  | 'Stars'
  | 'Economy'
  | 'Lifetime Statistics';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  targetProgress: number;
  rewardCoins: number;
  rewardGems: number;
  rewardBoosters?: Partial<Record<BoosterType, number>>;
  iconId?: string;
}

export interface AchievementProgressState {
  achievementId: string;
  currentProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  completedAtTimestamp?: number;
}

export interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  targetProgress: number;
  metricKey: 'levelsCompleted' | 'totalStars' | 'highestLevelUnlocked' | 'totalBoostersUsed' | 'worldUnlocked';
  rewardCoins: number;
  rewardGems: number;
  rewardBoosters?: Partial<Record<BoosterType, number>>;
}

export interface MilestoneProgressState {
  milestoneId: string;
  currentProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface PlayerProfile {
  playerId: string;
  displayName?: string;
  username?: string;
  profileVersion: number;
  currentWorld: number;
  currentPack: string;
  currentLevel: number;
  highestLevelUnlocked: number;
  starsTotal: number;
  coins: number;
  gems: number;
  boosterInventory: Record<BoosterType, number>;
  completedLevels: Record<number, { stars: number; highScore: number }>;
  dailyRewardState: DailyRewardState;
  missionProgress: Record<string, MissionProgressState>;
  achievementProgress: Record<string, AchievementProgressState>;
  milestoneProgress: Record<string, MilestoneProgressState>;
  lifetimeStatistics: LifetimeStatistics;
  createdAtTimestamp: number;
  lastActiveTimestamp: number;
}

export interface RewardGrant {
  coins: number;
  gems: number;
  xp?: number;
  boosters: Partial<Record<BoosterType, number>>;
  source: 'daily_reward' | 'mission' | 'achievement' | 'milestone' | 'level_completion';
  sourceId?: string;
}

export interface ClaimResult {
  success: boolean;
  message: string;
  granted?: RewardGrant;
}

export interface GameNotification {
  id: string;
  type:
    | 'level_unlocked'
    | 'world_unlocked'
    | 'reward_available'
    | 'daily_reward_ready'
    | 'mission_completed'
    | 'achievement_completed'
    | 'milestone_completed'
    | 'booster_earned'
    | 'currency_earned'
    | 'rank_up'
    | 'event_started'
    | 'purchase_success'
    | 'purchase_failure';
  title: string;
  message: string;
  timestamp: number;
}
