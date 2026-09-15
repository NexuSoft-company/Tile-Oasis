import { DAILY_REWARDS_CONFIG } from '../data/metaDefinitions';
import {
  DailyRewardDayConfig,
  DailyRewardState,
  ClaimResult,
} from '../types/metaProgression';
import { PlayerProfileService, globalProfileService } from './PlayerProfileService';
import { RewardClaimService, globalRewardClaimService } from './RewardClaimService';
import { AnalyticsService } from './AnalyticsService';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MIN_CLAIM_INTERVAL_MS = 20 * 60 * 60 * 1000; // 20 hours minimum interval
const MAX_STREAK_INTERVAL_MS = 48 * 60 * 60 * 1000; // 48 hours maximum window

export interface DailyRewardStatusReport {
  isEligible: boolean;
  currentStreak: number;
  currentDay: number;
  nextRewardConfig: DailyRewardDayConfig;
  timeUntilNextClaimMs: number;
  allDays: DailyRewardDayConfig[];
  claimedDays: Record<number, number>;
}

export class DailyRewardService {
  private profileService: PlayerProfileService;
  private rewardClaimService: RewardClaimService;
  private analytics: AnalyticsService;

  constructor(
    profileService: PlayerProfileService = globalProfileService,
    rewardClaimService: RewardClaimService = globalRewardClaimService,
    analytics: AnalyticsService = AnalyticsService.getInstance()
  ) {
    this.profileService = profileService;
    this.rewardClaimService = rewardClaimService;
    this.analytics = analytics;
  }

  /**
   * Checks current daily reward status and eligibility.
   */
  public getStatus(nowTimestamp: number = Date.now()): DailyRewardStatusReport {
    const profile = this.profileService.getProfile();
    const state: DailyRewardState = profile.dailyRewardState || {
      lastClaimTimestamp: 0,
      currentStreak: 0,
      currentDay: 1,
      claimedDays: {},
    };

    const lastClaim = state.lastClaimTimestamp;
    const timeDiff = nowTimestamp - lastClaim;

    let isEligible = false;
    let currentStreak = state.currentStreak;
    let currentDay = state.currentDay;

    if (lastClaim === 0) {
      // First time ever
      isEligible = true;
      currentStreak = 1;
      currentDay = 1;
    } else if (timeDiff < MIN_CLAIM_INTERVAL_MS) {
      // Already claimed within last 20 hours
      isEligible = false;
    } else if (timeDiff <= MAX_STREAK_INTERVAL_MS) {
      // Next day login within valid window (20h - 48h)
      isEligible = true;
      const nextStreak = state.currentStreak + 1;
      currentStreak = nextStreak;
      currentDay = ((nextStreak - 1) % 7) + 1;
    } else {
      // Missed day (> 48 hours), reset streak to Day 1
      isEligible = true;
      currentStreak = 1;
      currentDay = 1;
    }

    const timeUntilNext = isEligible ? 0 : Math.max(0, MIN_CLAIM_INTERVAL_MS - timeDiff);
    const dayIndex = Math.max(0, Math.min(6, currentDay - 1));
    const nextRewardConfig = DAILY_REWARDS_CONFIG[dayIndex];

    return {
      isEligible,
      currentStreak,
      currentDay,
      nextRewardConfig,
      timeUntilNextClaimMs: timeUntilNext,
      allDays: DAILY_REWARDS_CONFIG,
      claimedDays: state.claimedDays || {},
    };
  }

  /**
   * Claims today's daily reward if eligible.
   */
  public claimTodayReward(nowTimestamp: number = Date.now()): ClaimResult {
    const status = this.getStatus(nowTimestamp);

    if (!status.isEligible) {
      this.analytics.logEvent('daily_reward_failed', { reason: 'not_eligible' });
      return {
        success: false,
        message: 'Daily reward is not available yet. Please check back later.',
      };
    }

    const rewardConfig = status.nextRewardConfig;

    // Grant reward via RewardClaimService
    const claimRes = this.rewardClaimService.claimReward({
      coins: rewardConfig.coins,
      gems: rewardConfig.gems,
      boosters: rewardConfig.boosters,
      source: 'daily_reward',
      sourceId: `day_${status.currentDay}`,
    });

    if (claimRes.success) {
      const profile = this.profileService.getProfile();
      profile.dailyRewardState = {
        lastClaimTimestamp: nowTimestamp,
        currentStreak: status.currentStreak,
        currentDay: status.currentDay,
        claimedDays: {
          ...(profile.dailyRewardState?.claimedDays || {}),
          [status.currentDay]: nowTimestamp,
        },
      };

      this.profileService.saveProfile(profile);
      this.analytics.logEvent('daily_reward_claimed', {
        day: status.currentDay,
        streak: status.currentStreak,
      });
    }

    return claimRes;
  }
}

export const globalDailyRewardService = new DailyRewardService();
