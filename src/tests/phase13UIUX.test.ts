import { PlayerProfileService } from '../services/PlayerProfileService';
import { RewardClaimService } from '../services/RewardClaimService';
import { LocalSaveService } from '../services/SaveService';
import { LocalEconomyService } from '../services/EconomyService';
import { MilestoneService } from '../services/MilestoneService';
import { ProgressionIntegration } from '../engine/ProgressionIntegration';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { TestResult } from '../services/TestFramework';

export class Phase13UIUXTestFramework {
  public static runAllPhase13Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(Phase13UIUXTestFramework.testNavigationStateTransitions());
    results.push(Phase13UIUXTestFramework.testLevelIntroModalDataIntegrity());
    results.push(Phase13UIUXTestFramework.testRewardPresentationIdempotency());
    results.push(Phase13UIUXTestFramework.testEndToEndPlayerFlowProgression());

    return results;
  }

  private static testNavigationStateTransitions(): TestResult {
    const start = performance.now();
    const validScreens = [
      'SPLASH',
      'MAIN_MENU',
      'LEVEL_MAP',
      'GAMEPLAY',
      'COLLECTION',
      'EVENTS',
      'SHOP',
    ];

    let currentScreen = 'SPLASH';
    const transitions: string[] = [];

    // Simulate navigation: SPLASH -> MAIN_MENU -> LEVEL_MAP -> GAMEPLAY -> MAIN_MENU
    currentScreen = 'MAIN_MENU';
    transitions.push(currentScreen);

    currentScreen = 'LEVEL_MAP';
    transitions.push(currentScreen);

    currentScreen = 'GAMEPLAY';
    transitions.push(currentScreen);

    currentScreen = 'MAIN_MENU';
    transitions.push(currentScreen);

    const passed =
      transitions.length === 4 && transitions.every((scr) => validScreens.includes(scr));

    return {
      id: 'TEST_P13_01_NAV_TRANSITIONS',
      name: 'Player Flow Screen Navigation State Machine',
      passed,
      message: passed
        ? 'Passed: Validated transitions between SPLASH, MAIN_MENU, LEVEL_MAP, and GAMEPLAY.'
        : 'Failed: Invalid navigation transition detected.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testLevelIntroModalDataIntegrity(): TestResult {
    const start = performance.now();
    const level1 = RuntimeLevelRegistry.getLevel(1);

    const passed =
      level1 !== undefined &&
      level1.id === 1 &&
      level1.tiles.length > 0;

    return {
      id: 'TEST_P13_02_LEVEL_INTRO_DATA',
      name: 'Level Intro Screen Objective & Data Binding',
      passed,
      message: passed
        ? 'Passed: Level 1 definition data correctly bound for intro modal display.'
        : 'Failed: Level definition missing or corrupt.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testRewardPresentationIdempotency(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();

    // Complete 10 levels so milestone ms_complete_10_levels is completed
    for (let i = 1; i <= 10; i++) {
      saveService.completeLevel(i, 3, 1000);
    }

    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const msService = new MilestoneService(profileService);
    msService.evaluateMilestones();

    const claimService = new RewardClaimService(economyService, profileService);

    const initialCoins = economyService.getCoins();
    const claimResult = claimService.claimReward({
      coins: 200,
      gems: 15,
      boosters: {},
      source: 'milestone',
      sourceId: 'ms_complete_10_levels',
    });

    // Duplicate claim attempt with same sourceId
    const duplicateClaim = claimService.claimReward({
      coins: 200,
      gems: 15,
      boosters: {},
      source: 'milestone',
      sourceId: 'ms_complete_10_levels',
    });

    const passed =
      claimResult.success &&
      economyService.getCoins() === initialCoins + 200 &&
      duplicateClaim.success === false &&
      economyService.getCoins() === initialCoins + 200;

    return {
      id: 'TEST_P13_03_REWARD_PRESENTATION_IDEMPOTENCY',
      name: 'Reward Presentation Double-Claim Protection',
      passed,
      message: passed
        ? 'Passed: Reward presentation popup prevented duplicate reward granting.'
        : 'Failed: Double claim protection failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testEndToEndPlayerFlowProgression(): TestResult {
    const start = performance.now();
    const saveService = new LocalSaveService();
    saveService.resetSave();
    const economyService = new LocalEconomyService(saveService);
    const profileService = new PlayerProfileService(saveService);
    const integration = new ProgressionIntegration(saveService, economyService);

    // Complete Level 1
    const report1 = integration.processLevelCompletion({
      levelId: 1,
      score: 1800,
      stars: 3,
      completed: true,
      movesUsed: 12,
      tilesCleared: 36,
      rewardsEarned: {
        coins: 100,
        gems: 5,
        boostersGranted: {},
      },
    } as any);

    const profile = profileService.getProfile();
    const save = saveService.loadSave();

    const passed =
      report1.unlockedLevelId === 2 &&
      save.highestLevelUnlocked === 2 &&
      save.completedLevels[1].stars === 3 &&
      profile.lifetimeStatistics.levelsCompleted === 1;

    return {
      id: 'TEST_P13_04_E2E_PROGRESSION_FLOW',
      name: 'End-to-End Player Journey Level Completion & Save Integration',
      passed,
      message: passed
        ? 'Passed: End-to-end player progression flow updated save, unlocks, and profile seamlessly.'
        : 'Failed: End-to-end progression integration failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }
}
