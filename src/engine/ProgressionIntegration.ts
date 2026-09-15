import { LevelResult } from '../types/runtimeContract';
import { ISaveService, globalSaveService } from '../services/SaveService';
import { LocalEconomyService } from '../services/EconomyService';
import { WorldPackHierarchy } from './WorldPackHierarchy';
import { PlayerProfileService, globalProfileService } from '../services/PlayerProfileService';
import { MissionService, globalMissionService } from '../services/MissionService';
import { AchievementService, globalAchievementService } from '../services/AchievementService';
import { MilestoneService, globalMilestoneService } from '../services/MilestoneService';
import {
  PlayerProgressionService,
  globalPlayerProgressionService,
  PlayerXpReport,
} from '../services/PlayerProgressionService';
import { CollectionService, globalCollectionService } from '../services/CollectionService';
import { globalNotificationService } from '../services/NotificationService';

export interface ProgressionUpdateReport {
  levelId: number;
  unlockedLevelId: number;
  newStarsEarned: number;
  totalStars: number;
  xpEarned: number;
  xpReport: PlayerXpReport;
  newlyUnlockedCollectibles: string[];
  isPackComplete: boolean;
  packInfo?: {
    worldId: number;
    packId: string;
    packName: string;
    starsEarned: number;
  };
  isWorldComplete: boolean;
  worldInfo?: {
    worldId: number;
    worldName: string;
    totalStars: number;
  };
  isCampaignFinale: boolean;
  rewardsGranted: {
    coins: number;
    gems: number;
    boosters: Record<string, number>;
  };
  worldUnlocked?: {
    worldId: number;
    worldName: string;
  };
}

export class ProgressionIntegration {
  private saveService: ISaveService;
  private economyService: LocalEconomyService;
  private profileService: PlayerProfileService;
  private missionService: MissionService;
  private achievementService: AchievementService;
  private milestoneService: MilestoneService;
  private playerProgressionService: PlayerProgressionService;
  private collectionService: CollectionService;

  constructor(
    saveService: ISaveService = globalSaveService,
    economyService: LocalEconomyService = new LocalEconomyService(),
    profileService: PlayerProfileService = globalProfileService,
    missionService: MissionService = globalMissionService,
    achievementService: AchievementService = globalAchievementService,
    milestoneService: MilestoneService = globalMilestoneService,
    playerProgressionService: PlayerProgressionService = globalPlayerProgressionService,
    collectionService: CollectionService = globalCollectionService
  ) {
    this.saveService = saveService;
    this.economyService = economyService;
    this.profileService = profileService;
    this.missionService = missionService;
    this.achievementService = achievementService;
    this.milestoneService = milestoneService;
    this.playerProgressionService = playerProgressionService;
    this.collectionService = collectionService;
  }

  /**
   * Processes an authoritative LevelResult upon level completion.
   */
  public processLevelCompletion(result: LevelResult): ProgressionUpdateReport {
    if (!result.completed) {
      throw new Error('[ProgressionIntegration] Cannot process completion for a failed level result.');
    }

    const currentSave = this.saveService.loadSave();
    const existing = currentSave.completedLevels[result.levelId] || { stars: 0, highScore: 0 };
    const newStarsEarned = Math.max(0, result.stars - existing.stars);

    // 1. Update Save Service
    if (typeof this.saveService.completeLevel === 'function') {
      this.saveService.completeLevel(result.levelId, result.stars, result.score);
    } else if (typeof this.saveService.saveData === 'function') {
      const highest = Math.max(currentSave.highestLevelUnlocked || 1, result.levelId + 1);
      this.saveService.saveData({
        highestLevelUnlocked: highest,
        completedLevels: {
          ...currentSave.completedLevels,
          [result.levelId]: {
            stars: Math.max(existing.stars, result.stars),
            highScore: Math.max(existing.highScore, result.score),
          },
        },
      });
    }

    // 2. Grant Economy Rewards safely
    const rewards = result.rewardsEarned;
    if (rewards.coins > 0) {
      this.economyService.addCoins(rewards.coins);
    }
    if (rewards.gems > 0) {
      this.economyService.addGems(rewards.gems);
    }
    if (rewards.boostersGranted) {
      Object.entries(rewards.boostersGranted).forEach(([bType, count]) => {
        if (count > 0) {
          this.economyService.addBooster(bType as any, count);
        }
      });
    }

    // 3. Update Lifetime Stats
    this.profileService.updateLifetimeStats({
      levelsCompleted: 1,
      levelsAttempted: 1,
      totalMoves: result.movesUsed || 0,
      totalCoinsEarned: rewards.coins || 0,
      totalGemsEarned: rewards.gems || 0,
      bestScore: result.score || 0,
    });

    // 4. Calculate & Grant XP
    const isBoss = result.levelId % 25 === 0;
    const xpAmount = this.playerProgressionService.calculateLevelCompletionXp(
      result.levelId,
      result.stars,
      isBoss
    );
    const xpReport = this.playerProgressionService.addXp(xpAmount, `level_${result.levelId}`);

    // 5. Trigger Missions, Achievements & Milestones Evaluation
    this.missionService.onGameplayEvent('level_completed', 1);
    if (newStarsEarned > 0) {
      this.missionService.onGameplayEvent('stars_earned', newStarsEarned);
    }
    if (rewards.coins > 0) {
      this.missionService.onGameplayEvent('coins_earned', rewards.coins);
    }

    this.achievementService.evaluateAchievements();
    this.milestoneService.evaluateMilestones();

    // 6. Check Collections Unlock
    const updatedProfile = this.profileService.getProfile();
    const newlyUnlockedCollectibles = this.collectionService.checkAndUnlockEligible(updatedProfile);

    // 7. Check Pack & World Completion
    const updatedSave = this.saveService.loadSave();
    const unlockedLevelId = updatedSave.highestLevelUnlocked;

    const currentWorld = WorldPackHierarchy.getWorldForLevel(result.levelId);
    const currentPack = WorldPackHierarchy.getPackForLevel(result.levelId);

    const isPackComplete = result.levelId % 25 === 0;
    const isWorldComplete = result.levelId % 100 === 0;
    const isCampaignFinale = result.levelId === 9999;

    let packInfo: ProgressionUpdateReport['packInfo'];
    if (isPackComplete && currentPack) {
      packInfo = {
        worldId: currentWorld.id,
        packId: currentPack.id,
        packName: currentPack.name,
        starsEarned: Object.entries(updatedSave.completedLevels)
          .filter(([lvl]) => {
            const l = Number(lvl);
            return l >= currentPack.startLevel && l <= currentPack.endLevel;
          })
          .reduce((sum, [, data]) => sum + (data.stars || 0), 0),
      };
      globalNotificationService.notify('level_unlocked', 'Pack Completed!', `${currentPack.name} conquered!`);
    }

    let worldInfo: ProgressionUpdateReport['worldInfo'];
    if (isWorldComplete) {
      worldInfo = {
        worldId: currentWorld.id,
        worldName: currentWorld.name,
        totalStars: updatedSave.starsTotal,
      };
      globalNotificationService.notify('world_unlocked', 'World Restored!', `${currentWorld.name} fully mastered!`);
    }

    const nextWorld = WorldPackHierarchy.getWorldForLevel(unlockedLevelId);
    let worldUnlockedData: { worldId: number; worldName: string } | undefined = undefined;
    if (nextWorld.id > currentWorld.id) {
      worldUnlockedData = {
        worldId: nextWorld.id,
        worldName: nextWorld.name,
      };
    }

    return {
      levelId: result.levelId,
      unlockedLevelId,
      newStarsEarned,
      totalStars: updatedSave.starsTotal,
      xpEarned: xpAmount,
      xpReport,
      newlyUnlockedCollectibles,
      isPackComplete,
      packInfo,
      isWorldComplete,
      worldInfo,
      isCampaignFinale,
      rewardsGranted: {
        coins: rewards.coins,
        gems: rewards.gems,
        boosters: rewards.boostersGranted || {},
      },
      worldUnlocked: worldUnlockedData,
    };
  }
}

export const globalProgressionIntegration = new ProgressionIntegration();
