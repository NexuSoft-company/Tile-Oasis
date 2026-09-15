import { ISaveService, globalSaveService } from './SaveService';
import {
  PlayerProfile,
  PROFILE_CURRENT_VERSION,
  LifetimeStatistics,
} from '../types/metaProgression';
import {
  INITIAL_MISSIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MILESTONES,
} from '../data/metaDefinitions';
import { getWorldForLevel } from '../data/worldDefinitions';
import { AnalyticsService } from './AnalyticsService';

const DEFAULT_LIFETIME_STATS: LifetimeStatistics = {
  levelsCompleted: 0,
  levelsFailed: 0,
  levelsAttempted: 0,
  totalMoves: 0,
  totalTilesMatched: 0,
  totalBoostersUsed: 0,
  totalCoinsEarned: 250,
  totalCoinsSpent: 0,
  totalGemsEarned: 20,
  totalGemsSpent: 0,
  totalPlayTimeSeconds: 0,
  bestScore: 0,
};

export class PlayerProfileService {
  private saveService: ISaveService;
  private analytics: AnalyticsService;

  constructor(
    saveService: ISaveService = globalSaveService,
    analytics: AnalyticsService = AnalyticsService.getInstance()
  ) {
    this.saveService = saveService;
    this.analytics = analytics;
  }

  public getProfile(): PlayerProfile {
    const rawSave = this.saveService.loadSave();
    return this.migrateAndNormalizeProfile(rawSave as any);
  }

  public saveProfile(profile: PlayerProfile): boolean {
    const currentWorld = getWorldForLevel(profile.currentLevel);
    const rawSave = this.saveService.loadSave() as any;
    const existingMeta = rawSave.metaProfile || {};

    const success = this.saveService.saveData({
      currentLevel: profile.currentLevel,
      highestLevelUnlocked: profile.highestLevelUnlocked,
      coins: profile.coins,
      gems: profile.gems,
      starsTotal: profile.starsTotal,
      boosterInventory: profile.boosterInventory,
      completedLevels: profile.completedLevels,
      metaProfile: {
        ...existingMeta,
        playerId: profile.playerId,
        displayName: profile.displayName,
        username: profile.username,
        profileVersion: profile.profileVersion,
        currentWorld: currentWorld.id,
        currentPack: profile.currentPack,
        dailyRewardState: profile.dailyRewardState,
        missionProgress: profile.missionProgress,
        achievementProgress: profile.achievementProgress,
        milestoneProgress: profile.milestoneProgress,
        lifetimeStatistics: profile.lifetimeStatistics,
        createdAtTimestamp: profile.createdAtTimestamp,
        lastActiveTimestamp: Date.now(),
      },
    } as any);
    return success;
  }

  public updateProfileDetails(displayName?: string, username?: string): PlayerProfile {
    const profile = this.getProfile();
    if (displayName !== undefined) profile.displayName = displayName;
    if (username !== undefined) profile.username = username;
    this.saveProfile(profile);
    return profile;
  }

  public updateLifetimeStats(updates: Partial<LifetimeStatistics>): PlayerProfile {
    const rawSave = this.saveService.loadSave() as any;
    const profile = this.getProfile();
    const currentStats = profile.lifetimeStatistics || { ...DEFAULT_LIFETIME_STATS };

    const storedMetaStats = rawSave.metaProfile?.lifetimeStatistics;
    const completedLevelsCount = Object.keys(rawSave.completedLevels || {}).length;

    const baseLevelsCompleted = storedMetaStats?.levelsCompleted ?? Math.max(0, completedLevelsCount - (updates.levelsCompleted || 0));
    const baseLevelsAttempted = storedMetaStats?.levelsAttempted ?? Math.max(0, completedLevelsCount - (updates.levelsAttempted || 0));

    const updatedStats: LifetimeStatistics = {
      levelsCompleted: baseLevelsCompleted + (updates.levelsCompleted || 0),
      levelsFailed: currentStats.levelsFailed + (updates.levelsFailed || 0),
      levelsAttempted: baseLevelsAttempted + (updates.levelsAttempted || 0),
      totalMoves: currentStats.totalMoves + (updates.totalMoves || 0),
      totalTilesMatched: currentStats.totalTilesMatched + (updates.totalTilesMatched || 0),
      totalBoostersUsed: currentStats.totalBoostersUsed + (updates.totalBoostersUsed || 0),
      totalCoinsEarned: currentStats.totalCoinsEarned + (updates.totalCoinsEarned || 0),
      totalCoinsSpent: currentStats.totalCoinsSpent + (updates.totalCoinsSpent || 0),
      totalGemsEarned: currentStats.totalGemsEarned + (updates.totalGemsEarned || 0),
      totalGemsSpent: currentStats.totalGemsSpent + (updates.totalGemsSpent || 0),
      totalPlayTimeSeconds: currentStats.totalPlayTimeSeconds + (updates.totalPlayTimeSeconds || 0),
      bestScore: Math.max(currentStats.bestScore, updates.bestScore || 0),
    };

    profile.lifetimeStatistics = updatedStats;
    this.saveProfile(profile);
    return profile;
  }

  public migrateAndNormalizeProfile(rawSave: any): PlayerProfile {
    const meta = rawSave.metaProfile || {};

    const profileVersion = meta.profileVersion || PROFILE_CURRENT_VERSION;
    const completedLevelsCount = Object.keys(rawSave.completedLevels || {}).length;

    // Build default mission progress
    const defaultMissions: Record<string, any> = {};
    INITIAL_MISSIONS.forEach((m) => {
      defaultMissions[m.id] = {
        missionId: m.id,
        currentProgress: 0,
        isCompleted: false,
        isClaimed: false,
        startedAtTimestamp: Date.now(),
      };
    });

    // Build default achievement progress
    const defaultAchievements: Record<string, any> = {};
    INITIAL_ACHIEVEMENTS.forEach((a) => {
      defaultAchievements[a.id] = {
        achievementId: a.id,
        currentProgress: 0,
        isCompleted: false,
        isClaimed: false,
      };
    });

    // Build default milestone progress
    const defaultMilestones: Record<string, any> = {};
    INITIAL_MILESTONES.forEach((ms) => {
      defaultMilestones[ms.id] = {
        milestoneId: ms.id,
        currentProgress: 0,
        isCompleted: false,
        isClaimed: false,
      };
    });

    const currentWorld = getWorldForLevel(rawSave.currentLevel || 1);

    const profile: PlayerProfile = {
      playerId: meta.playerId || 'player_1',
      displayName: meta.displayName,
      username: meta.username,
      profileVersion,
      currentWorld: meta.currentWorld || currentWorld.id,
      currentPack: meta.currentPack || 'world1_pack1',
      currentLevel: rawSave.currentLevel || 1,
      highestLevelUnlocked: rawSave.highestLevelUnlocked || 1,
      starsTotal: rawSave.starsTotal || 0,
      coins: rawSave.coins ?? 250,
      gems: rawSave.gems ?? 20,
      boosterInventory: rawSave.boosterInventory || {
        undo: 3,
        shuffle: 2,
        magnet: 2,
        extra_slot: 1,
        freeze: 0,
        hint: 2,
        auto_match: 1,
      },
      completedLevels: rawSave.completedLevels || {},
      dailyRewardState: meta.dailyRewardState || {
        lastClaimTimestamp: 0,
        currentStreak: 0,
        currentDay: 1,
        claimedDays: {},
      },
      missionProgress: { ...defaultMissions, ...(meta.missionProgress || {}) },
      achievementProgress: { ...defaultAchievements, ...(meta.achievementProgress || {}) },
      milestoneProgress: { ...defaultMilestones, ...(meta.milestoneProgress || {}) },
      lifetimeStatistics: {
        ...DEFAULT_LIFETIME_STATS,
        levelsCompleted: completedLevelsCount,
        levelsAttempted: completedLevelsCount,
        totalCoinsEarned: rawSave.coins ?? 250,
        totalGemsEarned: rawSave.gems ?? 20,
        ...(meta.lifetimeStatistics || {}),
      },
      createdAtTimestamp: meta.createdAtTimestamp || rawSave.lastSavedTimestamp || Date.now(),
      lastActiveTimestamp: Date.now(),
    };

    if (!meta.profileVersion) {
      this.analytics.logEvent('profile_created', {
        levelId: profile.currentLevel,
        version: `v${profile.profileVersion}`,
      });
    }

    return profile;
  }
}

export const globalProfileService = new PlayerProfileService();
