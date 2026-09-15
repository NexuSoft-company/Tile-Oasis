import {
  RewardGrant,
  ClaimResult,
} from '../types/metaProgression';
import { LocalEconomyService } from './EconomyService';
import { PlayerProfileService, globalProfileService } from './PlayerProfileService';
import { PlayerProgressionService, globalPlayerProgressionService } from './PlayerProgressionService';
import { AnalyticsService } from './AnalyticsService';
import { globalNotificationService } from './NotificationService';
import { BoosterType } from '../types/gameEngine';

export class RewardClaimService {
  private economyService: LocalEconomyService;
  private profileService: PlayerProfileService;
  private progressionService: PlayerProgressionService;
  private analytics: AnalyticsService;

  constructor(
    economyService: LocalEconomyService = new LocalEconomyService(),
    profileService: PlayerProfileService = globalProfileService,
    progressionService: PlayerProgressionService = globalPlayerProgressionService,
    analytics: AnalyticsService = AnalyticsService.getInstance()
  ) {
    this.economyService = economyService;
    this.profileService = profileService;
    this.progressionService = progressionService;
    this.analytics = analytics;
  }

  /**
   * Authoritatively claims a reward for a source (mission, achievement, daily reward, milestone).
   */
  public claimReward(grant: RewardGrant): ClaimResult {
    const profile = this.profileService.getProfile();

    // 1. Verify Claim State & Idempotency
    if (grant.source === 'mission' && grant.sourceId) {
      const mission = profile.missionProgress[grant.sourceId];
      if (!mission) {
        return { success: false, message: `Mission ${grant.sourceId} not found.` };
      }
      if (!mission.isCompleted) {
        return { success: false, message: `Mission ${grant.sourceId} is not completed yet.` };
      }
      if (mission.isClaimed) {
        return { success: false, message: `Mission ${grant.sourceId} reward already claimed.` };
      }
      mission.isClaimed = true;
    } else if (grant.source === 'achievement' && grant.sourceId) {
      const ach = profile.achievementProgress[grant.sourceId];
      if (!ach) {
        return { success: false, message: `Achievement ${grant.sourceId} not found.` };
      }
      if (!ach.isCompleted) {
        return { success: false, message: `Achievement ${grant.sourceId} is not completed yet.` };
      }
      if (ach.isClaimed) {
        return { success: false, message: `Achievement ${grant.sourceId} reward already claimed.` };
      }
      ach.isClaimed = true;
    } else if (grant.source === 'milestone' && grant.sourceId) {
      const ms = profile.milestoneProgress[grant.sourceId];
      if (!ms) {
        return { success: false, message: `Milestone ${grant.sourceId} not found.` };
      }
      if (!ms.isCompleted) {
        return { success: false, message: `Milestone ${grant.sourceId} is not completed yet.` };
      }
      if (ms.isClaimed) {
        return { success: false, message: `Milestone ${grant.sourceId} reward already claimed.` };
      }
      ms.isClaimed = true;
    }

    // 2. Grant Currencies
    if (grant.coins > 0) {
      this.economyService.addCoins(grant.coins);
      this.analytics.logEvent('currency_earned', {
        amount: grant.coins,
        currency: 'coins',
        source: grant.source,
      });
    }

    if (grant.gems > 0) {
      this.economyService.addGems(grant.gems);
      this.analytics.logEvent('currency_earned', {
        amount: grant.gems,
        currency: 'gems',
        source: grant.source,
      });
    }

    // 3. Grant Boosters
    if (grant.boosters) {
      Object.entries(grant.boosters).forEach(([bType, count]) => {
        if (count && count > 0) {
          this.economyService.addBooster(bType as BoosterType, count);
          this.analytics.logEvent('booster_rewarded', {
            boosterType: bType,
            count,
            source: grant.source,
          });
        }
      });
    }

    // 4. Grant XP
    if (grant.xp && grant.xp > 0) {
      this.progressionService.addXp(grant.xp, grant.source);
      this.analytics.logEvent('xp_earned', { amount: grant.xp, source: grant.source });
    }

    // 5. Sync Profile State with Economy & Persist
    profile.coins = this.economyService.getCoins();
    profile.gems = this.economyService.getGems();
    profile.boosterInventory = {
      undo: this.economyService.getBoosterCount('undo'),
      shuffle: this.economyService.getBoosterCount('shuffle'),
      magnet: this.economyService.getBoosterCount('magnet'),
      extra_slot: this.economyService.getBoosterCount('extra_slot'),
      freeze: this.economyService.getBoosterCount('freeze'),
      hint: this.economyService.getBoosterCount('hint'),
      auto_match: this.economyService.getBoosterCount('auto_match'),
    };

    this.profileService.saveProfile(profile);

    const title = 'Reward Claimed!';
    const message = `Received +${grant.coins} Coins, +${grant.gems} Gems.`;
    globalNotificationService.notify('currency_earned', title, message);

    // 5. Analytics
    if (grant.source === 'mission') {
      this.analytics.logEvent('mission_claimed', { missionId: grant.sourceId });
    } else if (grant.source === 'achievement') {
      this.analytics.logEvent('achievement_claimed', { achievementId: grant.sourceId });
    } else if (grant.source === 'milestone') {
      this.analytics.logEvent('milestone_claimed', { milestoneId: grant.sourceId });
    } else if (grant.source === 'daily_reward') {
      this.analytics.logEvent('daily_reward_claimed', { day: grant.sourceId });
    }

    return {
      success: true,
      message: 'Reward claimed successfully.',
      granted: grant,
    };
  }
}

export const globalRewardClaimService = new RewardClaimService();
