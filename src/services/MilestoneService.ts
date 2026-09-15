import { INITIAL_MILESTONES } from '../data/metaDefinitions';
import {
  MilestoneDefinition,
  MilestoneProgressState,
  ClaimResult,
} from '../types/metaProgression';
import { PlayerProfileService, globalProfileService } from './PlayerProfileService';
import { RewardClaimService, globalRewardClaimService } from './RewardClaimService';
import { globalNotificationService } from './NotificationService';
import { AnalyticsService } from './AnalyticsService';

export class MilestoneService {
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

  public getMilestones(): Array<{ definition: MilestoneDefinition; state: MilestoneProgressState }> {
    const profile = this.profileService.getProfile();
    return INITIAL_MILESTONES.map((def) => {
      const state = profile.milestoneProgress[def.id] || {
        milestoneId: def.id,
        currentProgress: 0,
        isCompleted: false,
        isClaimed: false,
      };
      return { definition: def, state };
    });
  }

  public evaluateMilestones(): void {
    const profile = this.profileService.getProfile();
    const stats = profile.lifetimeStatistics;
    let updated = false;

    INITIAL_MILESTONES.forEach((def) => {
      const state = profile.milestoneProgress[def.id];
      if (!state || state.isCompleted) return;

      let val = 0;
      switch (def.metricKey) {
        case 'levelsCompleted':
          val = stats.levelsCompleted;
          break;
        case 'totalStars':
          val = profile.starsTotal;
          break;
        case 'highestLevelUnlocked':
          val = profile.highestLevelUnlocked;
          break;
        case 'totalBoostersUsed':
          val = stats.totalBoostersUsed;
          break;
        default:
          break;
      }

      state.currentProgress = val;
      if (state.currentProgress >= def.targetProgress) {
        state.currentProgress = def.targetProgress;
        state.isCompleted = true;
        this.analytics.logEvent('milestone_completed', { milestoneId: def.id });
        globalNotificationService.notify(
          'milestone_completed',
          'Milestone Reached!',
          `"${def.title}" completed!`
        );
      }
      updated = true;
    });

    if (updated) {
      this.profileService.saveProfile(profile);
    }
  }

  public claimMilestoneReward(milestoneId: string): ClaimResult {
    const def = INITIAL_MILESTONES.find((m) => m.id === milestoneId);
    if (!def) {
      return { success: false, message: `Milestone ${milestoneId} definition not found.` };
    }

    return this.rewardClaimService.claimReward({
      coins: def.rewardCoins,
      gems: def.rewardGems,
      boosters: def.rewardBoosters,
      source: 'milestone',
      sourceId: milestoneId,
    });
  }
}

export const globalMilestoneService = new MilestoneService();
