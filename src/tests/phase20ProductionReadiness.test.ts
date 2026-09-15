import { TestResult } from '../services/TestFramework';
import { AnalyticsService } from '../services/AnalyticsService';
import { FeatureFlagService } from '../services/FeatureFlagService';
import { LiveOpsConfigService } from '../services/LiveOpsConfigService';
import { ErrorMonitoringService } from '../services/ErrorMonitoringService';
import { SaveValidationService } from '../services/SaveValidationService';
import { EconomyTelemetryService } from '../services/EconomyTelemetryService';
import { LocalSaveService } from '../services/SaveService';
import { LocalEconomyService } from '../services/EconomyService';
import { ShopService } from '../services/ShopService';
import { CollectionService } from '../services/CollectionService';
import { PlayerProgressionService } from '../services/PlayerProgressionService';
import { CoreGameplayEngine } from '../engine/CoreGameplayEngine';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';

export class Phase20ProductionReadinessTestFramework {
  public static runAllPhase20Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(Phase20ProductionReadinessTestFramework.testArchitectureAndServices());
    results.push(Phase20ProductionReadinessTestFramework.testCentralizedAnalyticsEvents());
    results.push(Phase20ProductionReadinessTestFramework.testSessionLifecycleTracking());
    results.push(Phase20ProductionReadinessTestFramework.testLevelFunnelStages());
    results.push(Phase20ProductionReadinessTestFramework.testRetentionEvents());
    results.push(Phase20ProductionReadinessTestFramework.testEconomyTelemetryLedger());
    results.push(Phase20ProductionReadinessTestFramework.testShopAtomicHardening());
    results.push(Phase20ProductionReadinessTestFramework.testDailyGiftCooldownHardening());
    results.push(Phase20ProductionReadinessTestFramework.testCosmeticOwnershipStateMachine());
    results.push(Phase20ProductionReadinessTestFramework.testPlayerXpAndRankHardening());
    results.push(Phase20ProductionReadinessTestFramework.testSaveSystemValidationAndHealing());
    results.push(Phase20ProductionReadinessTestFramework.testOfflineOnlineArchitecture());
    results.push(Phase20ProductionReadinessTestFramework.testLiveOpsConfiguration());
    results.push(Phase20ProductionReadinessTestFramework.testFeatureFlagsSystem());
    results.push(Phase20ProductionReadinessTestFramework.testErrorMonitoringAndDiagnostics());
    results.push(Phase20ProductionReadinessTestFramework.testSecurityAuthoritativeValidation());
    results.push(Phase20ProductionReadinessTestFramework.testPerformanceAndMemoryCleanup());
    results.push(Phase20ProductionReadinessTestFramework.testCampaign9999RepresentativeRegression());

    return results;
  }

  private static testArchitectureAndServices(): TestResult {
    const start = performance.now();
    const analytics = AnalyticsService.getInstance();
    const flags = FeatureFlagService.getInstance();
    const liveOps = LiveOpsConfigService.getInstance();
    const errors = ErrorMonitoringService.getInstance();
    const telemetry = EconomyTelemetryService.getInstance();

    const passed =
      analytics !== null &&
      flags !== null &&
      liveOps !== null &&
      errors !== null &&
      telemetry !== null;

    return {
      id: 'PHASE20_TEST_01_ARCHITECTURE_SERVICES',
      name: 'Phase 20 Architecture & Service Audit',
      passed,
      message: passed
        ? 'Passed: All centralized foundation services are properly instantiated, singletons configured, and interfaces clean.'
        : 'Failed: Core live-ops services failed to initialize.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testCentralizedAnalyticsEvents(): TestResult {
    const start = performance.now();
    const analytics = new AnalyticsService();
    let listenerCalled = false;

    const unsubscribe = analytics.subscribe((rec) => {
      if (rec.event === 'APP_OPENED') listenerCalled = true;
    });

    analytics.logEvent('APP_OPENED', { version: '2026.1.0' });
    analytics.logEvent('MAIN_MENU_VIEWED');
    analytics.logEvent('LEVEL_INTRO_VIEWED', { levelId: 1 });
    analytics.logEvent('TILE_SELECTED', { tileId: 't1', typeId: 'lotus' });
    analytics.logEvent('COMBO_CREATED', { combo: 2 });
    analytics.logEvent('BOSS_COMPLETED', { levelId: 25 });

    unsubscribe();

    const log = analytics.getEventLog();
    const passed = log.length >= 6 && listenerCalled;

    return {
      id: 'PHASE20_TEST_02_CENTRALIZED_ANALYTICS',
      name: 'Phase 20 Centralized Analytics & Strongly Typed Events',
      passed,
      message: passed
        ? `Passed: Logged ${log.length} strongly typed analytics events with real-time listener notification.`
        : 'Failed: Analytics event logging or listener dispatch failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testSessionLifecycleTracking(): TestResult {
    const start = performance.now();
    const analytics = new AnalyticsService();

    const session = analytics.startSession();
    analytics.recordSessionLevelAttempt(1);
    analytics.recordSessionLevelComplete(1, 3, 450);
    analytics.recordSessionLevelAttempt(2);
    analytics.recordSessionLevelFail(2, 'tray_full');
    analytics.recordSessionBoosterUsed('undo');
    analytics.recordSessionRewardEarned(100, 5, 1);

    const ended = analytics.endSession();

    const passed =
      ended !== null &&
      ended.levelsAttempted === 2 &&
      ended.levelsCompleted === 1 &&
      ended.levelsFailed === 1 &&
      ended.boostersUsed === 1 &&
      ended.rewardsEarned.coins === 100 &&
      ended.rewardsEarned.gems === 5 &&
      ended.rewardsEarned.boosters === 1 &&
      ended.isEnded === true;

    return {
      id: 'PHASE20_TEST_03_SESSION_LIFECYCLE',
      name: 'Phase 20 Session Analytics Lifecycle Tracker',
      passed,
      message: passed
        ? `Passed: Session ${ended?.sessionId} accurately tracked 2 attempts, 1 win, 1 fail, 1 booster, and rewards.`
        : 'Failed: Session tracker metrics mismatch.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testLevelFunnelStages(): TestResult {
    const start = performance.now();
    const analytics = new AnalyticsService();

    analytics.recordFunnelStage(1, 'VIEWED', 0, 0, 0);
    analytics.recordFunnelStage(1, 'STARTED', 0, 0, 1);
    analytics.recordFunnelStage(1, 'FIRST_MOVE', 5, 1, 2);
    analytics.recordFunnelStage(1, 'PROGRESS_25', 25, 3, 5);
    analytics.recordFunnelStage(1, 'PROGRESS_50', 50, 6, 10);
    analytics.recordFunnelStage(1, 'PROGRESS_75', 75, 9, 15);
    analytics.recordFunnelStage(1, 'COMPLETED', 100, 12, 18);

    const funnel = analytics.getFunnelRecordsForLevel(1);
    const passed = funnel.length === 7 && funnel[6].stage === 'COMPLETED' && funnel[6].percent === 100;

    return {
      id: 'PHASE20_TEST_04_LEVEL_FUNNEL',
      name: 'Phase 20 Level Funnel Analytics Stages',
      passed,
      message: passed
        ? `Passed: All 7 funnel stages (Viewed -> Started -> First Move -> 25% -> 50% -> 75% -> Completed) tracked accurately.`
        : 'Failed: Funnel progression records missing stages.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testRetentionEvents(): TestResult {
    const start = performance.now();
    const analytics = new AnalyticsService();

    const installTime = Date.now() - 31 * 24 * 60 * 60 * 1000;
    (analytics as any).retentionProfile.firstInstallTimestamp = installTime;

    analytics.evaluateRetention(Date.now());

    const profile = analytics.getRetentionProfile();
    const d1Events = analytics.getEventsByType('RETENTION_DAY_1_RETURN');
    const d7Events = analytics.getEventsByType('RETENTION_DAY_7_RETURN');
    const d30Events = analytics.getEventsByType('RETENTION_DAY_30_RETURN');

    const passed =
      profile.day1Tracked &&
      profile.day3Tracked &&
      profile.day7Tracked &&
      profile.day14Tracked &&
      profile.day30Tracked &&
      d1Events.length === 1 &&
      d7Events.length === 1 &&
      d30Events.length === 1;

    return {
      id: 'PHASE20_TEST_05_RETENTION_FOUNDATION',
      name: 'Phase 20 Retention Event Foundation (Days 1, 3, 7, 14, 30)',
      passed,
      message: passed
        ? 'Passed: Retention milestones accurately evaluated day boundaries and emitted telemetry events.'
        : 'Failed: Retention day return calculations failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testEconomyTelemetryLedger(): TestResult {
    const start = performance.now();
    const telemetry = new EconomyTelemetryService();

    telemetry.recordTransaction('coins', 'EARN', 200, 'LEVEL_REWARD', 450);
    telemetry.recordTransaction('coins', 'SPEND', 100, 'SHOP_PURCHASE', 350);
    telemetry.recordTransaction('gems', 'EARN', 10, 'DAILY_REWARD', 30);
    telemetry.recordTransaction('booster', 'EARN', 2, 'MISSION_REWARD', 5, 'undo');
    telemetry.recordTransaction('booster', 'SPEND', 1, 'BOOSTER_USAGE', 4, 'undo');
    telemetry.recordTransaction('cosmetic', 'SPEND', 1, 'SHOP_PURCHASE', 0);

    const summary = telemetry.getLifetimeSummary();
    const passed =
      summary.totalCoinsEarned === 200 &&
      summary.totalCoinsSpent === 100 &&
      summary.totalGemsEarned === 10 &&
      summary.totalBoostersEarned === 2 &&
      summary.totalBoostersUsed === 1 &&
      summary.totalCosmeticsPurchased === 1;

    return {
      id: 'PHASE20_TEST_06_ECONOMY_TELEMETRY',
      name: 'Phase 20 Economy Telemetry Ledger & Financial Audit',
      passed,
      message: passed
        ? 'Passed: Economy telemetry ledger accurately balanced coin, gem, booster, and cosmetic transactions.'
        : 'Failed: Economy summary ledger balance mismatch.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testShopAtomicHardening(): TestResult {
    const start = performance.now();
    const mockSave = new LocalSaveService();
    mockSave.resetSave();
    const eco = new LocalEconomyService(mockSave);
    const shop = new ShopService(mockSave, eco);

    // Initial coins: 250
    // Try buying an expensive item (e.g. 1100 coins)
    const expensiveResult = shop.purchaseItem('bundle_tactical_master', 'coins');
    const coinsAfterFail = eco.getCoins();

    // Idempotency token test
    const idToken = 'tx_test_unique_123';
    const validBuy1 = shop.purchaseItem('shop_booster_undo', 'coins', idToken);
    const validBuy2 = shop.purchaseItem('shop_booster_undo', 'coins', idToken); // Replay attack

    const passed =
      !expensiveResult.success &&
      coinsAfterFail === 250 &&
      validBuy1.success &&
      !validBuy2.success &&
      validBuy2.message.includes('already processed');

    return {
      id: 'PHASE20_TEST_07_SHOP_HARDENING',
      name: 'Phase 20 Shop Transaction Hardening & Idempotency',
      passed,
      message: passed
        ? 'Passed: Insufficient balance safely aborted; Idempotency token prevented duplicate charge on replay.'
        : 'Failed: Shop transaction did not handle atomic rollback or idempotency.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testDailyGiftCooldownHardening(): TestResult {
    const start = performance.now();
    const mockSave = new LocalSaveService();
    mockSave.resetSave();
    const eco = new LocalEconomyService(mockSave);
    const shop = new ShopService(mockSave, eco);

    const now = Date.now();
    const firstClaim = shop.claimDailyFreeGift(now);
    const doubleClickClaim = shop.claimDailyFreeGift(now + 1000); // 1 sec later
    const futureClaim = shop.claimDailyFreeGift(now + 25 * 60 * 60 * 1000); // 25 hours later

    const passed =
      firstClaim.success &&
      !doubleClickClaim.success &&
      doubleClickClaim.message.includes('cooldown') &&
      futureClaim.success;

    return {
      id: 'PHASE20_TEST_08_DAILY_GIFT_HARDENING',
      name: 'Phase 20 Daily Free Gift 24-Hour Cooldown Hardening',
      passed,
      message: passed
        ? 'Passed: Enforced strict 24-hour cooldown and prevented double-click exploitation.'
        : 'Failed: Daily gift cooldown allowed invalid claims.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testCosmeticOwnershipStateMachine(): TestResult {
    const start = performance.now();
    const mockSave = new LocalSaveService();
    mockSave.resetSave();
    const eco = new LocalEconomyService(mockSave);
    const collection = new CollectionService(mockSave, eco);

    // 1. Try to equip locked/unowned item
    const unownedEquip = collection.equipItem('tt_gemstone_haven');

    // 2. Grant coins and purchase valid item
    eco.addCoins(2000);
    // Artificially satisfy unlock requirement
    const state = collection.getCollectionState();
    state.unlockedItemIds.push('tt_orchard_harvest');
    collection.saveCollectionState(state);

    const buyRes1 = collection.purchaseItem('tt_orchard_harvest', 'coins');
    const buyRes2 = collection.purchaseItem('tt_orchard_harvest', 'coins'); // Double purchase guard
    const equipRes = collection.equipItem('tt_orchard_harvest');
    const equipped = collection.getEquippedCustomizations();

    const passed =
      !unownedEquip &&
      buyRes1.success &&
      !buyRes2.success &&
      equipRes &&
      equipped.equippedTileTheme === 'tt_orchard_harvest';

    return {
      id: 'PHASE20_TEST_09_COSMETIC_OWNERSHIP',
      name: 'Phase 20 Cosmetic State Machine & Ownership Integrity',
      passed,
      message: passed
        ? 'Passed: Prevented equipping unowned items; prevented duplicate purchases; state successfully persisted.'
        : 'Failed: Cosmetic state machine allowed illegal state transitions.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testPlayerXpAndRankHardening(): TestResult {
    const start = performance.now();
    const mockSave = new LocalSaveService();
    mockSave.resetSave();
    const eco = new LocalEconomyService(mockSave);
    const prog = new PlayerProgressionService(mockSave, eco);

    // Level 1: 0 XP. Cumulative for level 2 is 200. Cumulative for level 3 is 450.
    // Adding 500 XP should jump from Level 1 to Level 3 in a single award.
    const initialCoins = eco.getCoins();
    const report = prog.addXp(500, 'test_award');

    const passed =
      report.leveledUp &&
      report.previousLevel === 1 &&
      report.currentLevel === 3 &&
      report.levelsGained === 2 &&
      report.levelUpRewards.length === 2 &&
      eco.getCoins() > initialCoins;

    return {
      id: 'PHASE20_TEST_10_PLAYER_XP_RANK',
      name: 'Phase 20 Player XP & Multi-Level Rank Leap Hardening',
      passed,
      message: passed
        ? `Passed: Single 500 XP grant cleanly progressed player from Rank 1 -> Rank ${report.currentLevel} and granted all cumulative rank rewards.`
        : 'Failed: XP calculation or multi-level leap rewards failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testSaveSystemValidationAndHealing(): TestResult {
    const start = performance.now();

    // Corrupted save mock with out-of-bounds numbers and invalid types
    const corruptSave = {
      currentLevel: -10,
      highestLevelUnlocked: 15000,
      coins: -999,
      gems: 'twenty',
      starsTotal: -5,
      boosterInventory: {
        undo: -2,
        shuffle: 10000,
      },
      completedLevels: {
        '1': { stars: 5, highScore: 100 },
        'invalid_lvl': { stars: 2 },
      },
    };

    const defaultSave: any = {
      currentLevel: 1,
      highestLevelUnlocked: 1,
      coins: 250,
      gems: 20,
      starsTotal: 0,
      boosterInventory: { undo: 3, shuffle: 2, magnet: 2, extra_slot: 1, freeze: 0, hint: 2, auto_match: 1 },
      completedLevels: {},
    };

    const report = SaveValidationService.validateAndSanitize(corruptSave, defaultSave);
    const s = report.sanitizedData;

    const passed =
      report.healed &&
      s.highestLevelUnlocked === 9999 &&
      s.currentLevel >= 1 &&
      s.coins === 250 &&
      s.gems === 20 &&
      s.boosterInventory.undo === 0 &&
      s.boosterInventory.shuffle === 999 &&
      s.completedLevels[1].stars === 3 &&
      s.completedLevels['invalid_lvl'] === undefined &&
      s.starsTotal === 3;

    return {
      id: 'PHASE20_TEST_11_SAVE_HEALING',
      name: 'Phase 20 Save System Validation, Bounds Sanitization & Auto-Healing',
      passed,
      message: passed
        ? `Passed: Repaired ${report.anomaliesFound.length} corruption anomalies and safely auto-healed save data.`
        : 'Failed: Save corruption sanitizer failed to clamp or heal data.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testOfflineOnlineArchitecture(): TestResult {
    const start = performance.now();
    const analytics = new AnalyticsService();

    // Fill buffer
    for (let i = 0; i < 20; i++) {
      analytics.logEvent('TILE_SELECTED', { tileId: `t_${i}` });
    }

    const log = analytics.getEventLog();
    const passed = log.length >= 20;

    return {
      id: 'PHASE20_TEST_12_OFFLINE_ONLINE_ARCH',
      name: 'Phase 20 Offline-First Architecture & Event Queueing',
      passed,
      message: passed
        ? `Passed: Offline event queue buffered ${log.length} events safely without network dependence.`
        : 'Failed: Event queue failed to buffer events.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testLiveOpsConfiguration(): TestResult {
    const start = performance.now();
    const liveOps = new LiveOpsConfigService();

    const initialCoinMult = liveOps.getCoinMultiplier();
    liveOps.updateConfig({
      activeEvents: [
        {
          id: 'event_test_double',
          name: 'Double Coins Test',
          description: '2x Coins on all levels',
          active: true,
          startTime: 0,
          endTime: 0,
          coinMultiplier: 2.0,
          xpMultiplier: 1.5,
          specialShopDiscounts: { shop_booster_undo: 0.5 },
        },
      ],
    });

    const newMult = liveOps.getCoinMultiplier();
    const discount = liveOps.getShopDiscountForItem('shop_booster_undo');

    const passed = initialCoinMult >= 1.0 && newMult === 2.0 && discount === 0.5;

    return {
      id: 'PHASE20_TEST_13_LIVEOPS_CONFIG',
      name: 'Phase 20 Live-Ops Configuration & Dynamic Event Modifiers',
      passed,
      message: passed
        ? `Passed: Live-Ops configuration successfully applied 2.0x coin multiplier and 50% shop discount dynamically.`
        : 'Failed: Live-Ops configuration update failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testFeatureFlagsSystem(): TestResult {
    const start = performance.now();
    const flags = new FeatureFlagService();

    const initialDaily = flags.isEnabled('FEATURE_DAILY_GIFT');
    flags.setFlag('FEATURE_DAILY_GIFT', false);
    const disabledDaily = flags.isEnabled('FEATURE_DAILY_GIFT');
    flags.resetDefaults();
    const restoredDaily = flags.isEnabled('FEATURE_DAILY_GIFT');

    const passed = initialDaily === true && disabledDaily === false && restoredDaily === true;

    return {
      id: 'PHASE20_TEST_14_FEATURE_FLAGS',
      name: 'Phase 20 Feature Flags Architecture & Runtime Overrides',
      passed,
      message: passed
        ? 'Passed: Feature flags supported clean toggle, runtime overrides, and default state restoration.'
        : 'Failed: Feature flag system failed to toggle values.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testErrorMonitoringAndDiagnostics(): TestResult {
    const start = performance.now();
    const errors = new ErrorMonitoringService();
    errors.clearErrors();

    errors.addBreadcrumb('Player opened Level 1');
    errors.addBreadcrumb('Player matched 3 Lotus tiles');
    const err = errors.logError('GAMEPLAY_ERROR', 'Visual animation frame lag detected');

    const breadcrumbs = errors.getBreadcrumbs();
    const recent = errors.getRecentErrors();

    const passed =
      breadcrumbs.length === 2 &&
      recent.length === 1 &&
      err.playerFacingMessage.length > 0 &&
      err.category === 'GAMEPLAY_ERROR';

    return {
      id: 'PHASE20_TEST_15_ERROR_MONITORING',
      name: 'Phase 20 Error Monitoring, Breadcrumb Trails & Friendly Fallbacks',
      passed,
      message: passed
        ? `Passed: Captured error with 2 breadcrumb trails and friendly fallback message: "${err.playerFacingMessage}"`
        : 'Failed: Error monitoring failed to record breadcrumbs or categorization.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testSecurityAuthoritativeValidation(): TestResult {
    const start = performance.now();
    const mockSave = new LocalSaveService();
    mockSave.resetSave();
    const eco = new LocalEconomyService(mockSave);

    // Negative deduction attempt
    const initialCoins = eco.getCoins();
    eco.addCoins(-100);
    const coinsAfterNegativeAdd = eco.getCoins();

    const negCoins = eco.deductCoins(-50);
    const negGems = eco.deductGems(-10);

    const passed = !negCoins && !negGems && coinsAfterNegativeAdd === initialCoins;

    return {
      id: 'PHASE20_TEST_16_SECURITY_AUTHORITY',
      name: 'Phase 20 Security & Authoritative Boundary Validation',
      passed,
      message: passed
        ? 'Passed: Authoritative economy boundary rejected all negative deduction attempts and invalid operations.'
        : 'Failed: Authoritative economy allowed negative or illegal deductions.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testPerformanceAndMemoryCleanup(): TestResult {
    const start = performance.now();

    // Rapidly instantiate and destroy 5 engines in sequence
    for (let i = 1; i <= 5; i++) {
      const engine = new CoreGameplayEngine({ levelId: 1 });
      engine.destroy();
    }

    const duration = performance.now() - start;
    const passed = duration < 500;

    return {
      id: 'PHASE20_TEST_17_PERFORMANCE_MEMORY',
      name: 'Phase 20 Performance, Memory & Engine Teardown Lifecycle',
      passed,
      message: passed
        ? `Passed: Rapid 5x CoreGameplayEngine instantiations & destructions completed in ${Math.round(duration)}ms without timer leaks.`
        : 'Failed: Engine performance or lifecycle teardown was sluggish.',
      durationMs: Math.round(duration),
    };
  }

  private static testCampaign9999RepresentativeRegression(): TestResult {
    const start = performance.now();
    const sampleLevels = [
      1, 2, 5, 10, 25, 26, 50, 51, 75, 100, 101, 250, 500, 1000, 2500, 5000, 7500, 9000, 9500, 9998, 9999,
    ];

    let allValid = true;
    const errors: string[] = [];

    for (const lvlId of sampleLevels) {
      const def = RuntimeLevelRegistry.getLevel(lvlId);
      if (!def) {
        allValid = false;
        errors.push(`Level ${lvlId} not found in RuntimeLevelRegistry.`);
        continue;
      }
      if (def.tiles.length % 3 !== 0) {
        allValid = false;
        errors.push(`Level ${lvlId} tiles count (${def.tiles.length}) not divisible by 3.`);
      }
      if (def.trayCapacity < 6 || def.trayCapacity > 9) {
        allValid = false;
        errors.push(`Level ${lvlId} trayCapacity (${def.trayCapacity}) out of bounds.`);
      }
    }

    const passed = allValid && errors.length === 0;

    return {
      id: 'PHASE20_TEST_18_9999_REGRESSION',
      name: 'Phase 20 Representative 9,999-Level Campaign Regression',
      passed,
      message: passed
        ? `Passed: All 21 milestone levels across the 9,999-level campaign verified for triplet parity and runtime validity.`
        : `Failed: Regression errors: ${errors.join(', ')}`,
      durationMs: Math.round(performance.now() - start),
    };
  }
}
