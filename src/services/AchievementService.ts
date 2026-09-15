import { INITIAL_ACHIEVEMENTS } from '../data/metaDefinitions';
import {
  AchievementDefinition,
  AchievementProgressState,
  ClaimResult,
} from '../types/metaProgression';
import { PlayerProfileService, globalProfileService } from './PlayerProfileService';
import { RewardClaimService, globalRewardClaimService } from './RewardClaimService';
import { globalNotificationService } from './NotificationService';
import { AnalyticsService } from './AnalyticsService';

export class AchievementService {
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

  public getAchievements(): Array<{ definition: AchievementDefinition; state: AchievementProgressState }> {
    const profile = this.profileService.getProfile();
    return INITIAL_ACHIEVEMENTS.map((def) => {
      const state = profile.achievementProgress[def.id] || {
        achievementId: def.id,
        currentProgress: 0,
        isCompleted: false,
        isClaimed: false,
      };
      return { definition: def, state };
    });
  }

  public evaluateAchievements(): void {
    const profile = this.profileService.getProfile();
    const stats = profile.lifetimeStatistics;
    let updated = false;

    INITIAL_ACHIEVEMENTS.forEach((def) => {
      const state = profile.achievementProgress[def.id];
      if (!state || state.isCompleted) return;

      let currentVal = 0;
      switch (def.id) {
        case 'ach_first_steps':
        case 'ach_marathoner':
          currentVal = stats.levelsCompleted;
          break;
        case 'ach_master_matcher':
          currentVal = stats.totalTilesMatched / 3; // triplets matched
          break;
        case 'ach_star_collector':
          currentVal = profile.starsTotal;
          break;
        case 'ach_booster_enthusiast':
          currentVal = stats.totalBoostersUsed;
          break;
        case 'ach_wealthy_explorer':
          currentVal = stats.totalCoinsEarned;
          break;
        case 'ach_flawless_victory':
          currentVal = Object.values(profile.completedLevels).filter((l) => l.stars === 3).length;
          break;
        default:
          break;
      }

      state.currentProgress = currentVal;
      if (state.currentProgress >= def.targetProgress) {
        state.currentProgress = def.targetProgress;
        state.isCompleted = true;
        state.completedAtTimestamp = Date.now();
        this.analytics.logEvent('achievement_completed', { achievementId: def.id });
        globalNotificationService.notify(
          'achievement_completed',
          'Achievement Unlocked!',
          `"${def.title}" — Reward Ready!`
        );
      }
      updated = true;
    });

    if (updated) {
      this.profileService.saveProfile(profile);
    }
  }

  public claimAchievementReward(achievementId: string): ClaimResult {
    const def = INITIAL_ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!def) {
      return { success: false, message: `Achievement ${achievementId} definition not found.` };
    }

    return this.rewardClaimService.claimReward({
      coins: def.rewardCoins,
      gems: def.rewardGems,
      boosters: def.rewardBoosters,
      source: 'achievement',
      sourceId: achievementId,
    });
  }
}

export const globalAchievementService = new AchievementService();
