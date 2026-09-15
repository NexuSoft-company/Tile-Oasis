import { INITIAL_MISSIONS } from '../data/metaDefinitions';
import { MissionProgressState, MissionDefinition, ClaimResult } from '../types/metaProgression';
import { PlayerProfileService, globalProfileService } from './PlayerProfileService';
import { RewardClaimService, globalRewardClaimService } from './RewardClaimService';
import { globalNotificationService } from './NotificationService';
import { AnalyticsService } from './AnalyticsService';

export class MissionService {
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

  public getMissions(): Array<{ definition: MissionDefinition; state: MissionProgressState }> {
    const profile = this.profileService.getProfile();
    return INITIAL_MISSIONS.map((def) => {
      const state = profile.missionProgress[def.id] || {
        missionId: def.id,
        currentProgress: 0,
        isCompleted: false,
        isClaimed: false,
        startedAtTimestamp: Date.now(),
      };
      return { definition: def, state };
    });
  }

  public onGameplayEvent(
    eventType: 'level_completed' | 'stars_earned' | 'match_completed' | 'booster_used' | 'coins_earned',
    amount: number = 1,
    extraData?: any
  ): void {
    const profile = this.profileService.getProfile();
    let updated = false;

    INITIAL_MISSIONS.forEach((def) => {
      const state = profile.missionProgress[def.id];
      if (!state || state.isCompleted) return;

      let increment = 0;
      if (eventType === 'level_completed' && def.type === 'complete_levels') {
        increment = amount;
      } else if (eventType === 'stars_earned' && def.type === 'earn_stars') {
        increment = amount;
      } else if (eventType === 'match_completed' && def.type === 'match_tiles') {
        increment = amount;
      } else if (eventType === 'booster_used' && def.type === 'use_boosters') {
        increment = amount;
      } else if (eventType === 'coins_earned' && def.type === 'earn_coins') {
        increment = amount;
      }

      if (increment > 0) {
        state.currentProgress += increment;
        if (state.currentProgress >= def.targetProgress) {
          state.currentProgress = def.targetProgress;
          state.isCompleted = true;
          this.analytics.logEvent('mission_completed', { missionId: def.id });
          globalNotificationService.notify(
            'mission_completed',
            'Mission Completed!',
            `"${def.title}" is ready to claim.`
          );
        }
        updated = true;
      }
    });

    if (updated) {
      this.profileService.saveProfile(profile);
    }
  }

  public claimMissionReward(missionId: string): ClaimResult {
    const def = INITIAL_MISSIONS.find((m) => m.id === missionId);
    if (!def) {
      return { success: false, message: `Mission ${missionId} definition not found.` };
    }

    return this.rewardClaimService.claimReward({
      coins: def.rewardCoins,
      gems: def.rewardGems,
      xp: def.rewardXp,
      boosters: def.rewardBoosters,
      source: 'mission',
      sourceId: missionId,
    });
  }
}

export const globalMissionService = new MissionService();
