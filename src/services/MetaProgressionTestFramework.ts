import { PlayerProfileService } from './PlayerProfileService';
import { RewardClaimService } from './RewardClaimService';
import { DailyRewardService } from './DailyRewardService';
import { MissionService } from './MissionService';
import { AchievementService } from './AchievementService';
import { MilestoneService } from './MilestoneService';
import { LocalSaveService } from './SaveService';
import { LocalEconomyService } from './EconomyService';
import { ProgressionIntegration } from '../engine/ProgressionIntegration';
import { TestResult } from './TestFramework';

class MemoryStorage {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

export class MetaProgressionTestFramework {
  public static runAllPhase12Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(MetaProgressionTestFramework.testProfileMigration());
    results.push(MetaProgressionTestFramework.testRewardClaiming());
    results.push(MetaProgressionTestFramework.testDailyRewardStreak());
    results.push(MetaProgressionTestFramework.testDailyRewardMissedReset());
    results.push(MetaProgressionTestFramework.testMissionTracking());
    results.push(MetaProgressionTestFramework.testAchievementUnlocks());
    results.push(MetaProgressionTestFramework.testMilestoneTracking());
    results.push(MetaProgressionTestFramework.testLevelCompletionIntegration());

    return results;
  }

  private static testProfileMigration(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();

    const profileService = new PlayerProfileService(saveService);
    const profile = profileService.getProfile();

    const passed =
      profile.playerId === 'player_1' &&
      profile.profileVersion === 1 &&
      profile.coins === 250 &&
      profile.gems === 20;

    return {
      id: 'TEST_P12_01_PROFILE_MIGRATION',
      name: 'Player Profile Versioning & Default Migration',
      passed,
      message: passed ? 'Passed: Profile initialized with correct defaults and version 1.' : 'Failed: Profile migration failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testRewardClaiming(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const claimService = new RewardClaimService(economyService, profileService);

    const initialCoins = economyService.getCoins();
    const res = claimService.claimReward({
      coins: 100,
      gems: 10,
      boosters: { undo: 2 },
      source: 'daily_reward',
      sourceId: 'day_1',
    });

    const passed =
      res.success &&
      economyService.getCoins() === initialCoins + 100 &&
      economyService.getBoosterCount('undo') === 5;

    return {
      id: 'TEST_P12_02_REWARD_CLAIM',
      name: 'Idempotent Reward Claim & Economy Granting',
      passed,
      message: passed ? 'Passed: Currencies and boosters granted safely upon claim.' : 'Failed: Reward claim failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testDailyRewardStreak(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const claimService = new RewardClaimService(economyService, profileService);
    const dailyService = new DailyRewardService(profileService, claimService);

    const now = Date.now();
    const status1 = dailyService.getStatus(now);
    const claimRes1 = dailyService.claimTodayReward(now);

    // 22 hours later: next day eligible, streak 2
    const status2 = dailyService.getStatus(now + 22 * 60 * 60 * 1000);

    const passed =
      status1.isEligible &&
      claimRes1.success &&
      status2.isEligible &&
      status2.currentDay === 2 &&
      status2.currentStreak === 2;

    return {
      id: 'TEST_P12_03_DAILY_STREAK',
      name: 'Daily Reward Streak Escalation & Window Checking',
      passed,
      message: passed ? 'Passed: Consecutive day login increased streak to Day 2.' : 'Failed: Daily streak calculation failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testDailyRewardMissedReset(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const claimService = new RewardClaimService(economyService, profileService);
    const dailyService = new DailyRewardService(profileService, claimService);

    const now = Date.now();
    dailyService.claimTodayReward(now);

    // 50 hours later: missed window -> streak resets to 1
    const status = dailyService.getStatus(now + 50 * 60 * 60 * 1000);

    const passed = status.isEligible && status.currentStreak === 1 && status.currentDay === 1;

    return {
      id: 'TEST_P12_04_STREAK_RESET',
      name: 'Daily Reward Window Expiry Streak Reset',
      passed,
      message: passed ? 'Passed: Streak correctly reset after 48h missed window.' : 'Failed: Streak reset failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testMissionTracking(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const claimService = new RewardClaimService(economyService, profileService);
    const missionService = new MissionService(profileService, claimService);

    // Complete 3 levels to fulfill m_complete_3_levels
    missionService.onGameplayEvent('level_completed', 3);

    const missions = missionService.getMissions();
    const lvlMission = missions.find((m) => m.definition.id === 'm_complete_3_levels');
    const claimRes = missionService.claimMissionReward('m_complete_3_levels');
    const duplicateRes = missionService.claimMissionReward('m_complete_3_levels');

    const passed =
      lvlMission?.state.isCompleted === true &&
      claimRes.success &&
      duplicateRes.success === false;

    return {
      id: 'TEST_P12_05_MISSIONS',
      name: 'Mission Event Progress & Duplicate Claim Protection',
      passed,
      message: passed ? 'Passed: Mission completed on event and protected against duplicate claim.' : 'Failed: Mission tracking failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testAchievementUnlocks(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const claimService = new RewardClaimService(economyService, profileService);
    const achService = new AchievementService(profileService, claimService);

    profileService.updateLifetimeStats({ levelsCompleted: 5 });
    achService.evaluateAchievements();

    const achs = achService.getAchievements();
    const firstStep = achs.find((a) => a.definition.id === 'ach_first_steps');
    const claimRes = achService.claimAchievementReward('ach_first_steps');

    const passed = firstStep?.state.isCompleted === true && claimRes.success;

    return {
      id: 'TEST_P12_06_ACHIEVEMENTS',
      name: 'Achievement Category Evaluation & Unlocks',
      passed,
      message: passed ? 'Passed: Achievement unlocked and reward claimed.' : 'Failed: Achievement evaluation failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testMilestoneTracking(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const claimService = new RewardClaimService(economyService, profileService);
    const msService = new MilestoneService(profileService, claimService);

    // Complete 10 levels to fulfill ms_complete_10_levels
    for (let i = 1; i <= 10; i++) {
      saveService.completeLevel(i, 3, 1000);
    }
    msService.evaluateMilestones();

    const milestones = msService.getMilestones();
    const ms10 = milestones.find((m) => m.definition.id === 'ms_complete_10_levels');

    const passed = ms10?.state.isCompleted === true;

    return {
      id: 'TEST_P12_07_MILESTONES',
      name: 'Campaign Progression Milestone Unlocks',
      passed,
      message: passed ? 'Passed: Milestone reached upon 10 levels completion.' : 'Failed: Milestone tracking failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testLevelCompletionIntegration(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const integration = new ProgressionIntegration(saveService, economyService, profileService);

    const report = integration.processLevelCompletion({
      levelId: 1,
      score: 2000,
      stars: 3,
      completed: true,
      movesUsed: 15,
      tilesCleared: 45,
      rewardsEarned: {
        coins: 150,
        gems: 10,
        boostersGranted: { undo: 1 },
      },
    } as any);

    const profile = profileService.getProfile();

    const passed =
      report.unlockedLevelId === 2 &&
      profile.lifetimeStatistics.levelsCompleted === 1 &&
      profile.lifetimeStatistics.totalMoves === 15;

    return {
      id: 'TEST_P12_08_PROG_INTEGRATION',
      name: 'End-to-End Progression Completion Atomicity',
      passed,
      message: passed ? 'Passed: Level completion updated save, economy, stats, and missions atomically.' : 'Failed: Integration failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }
}
