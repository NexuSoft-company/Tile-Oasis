import { TestResult } from '../services/TestFramework';
import { CollectionService } from '../services/CollectionService';
import { PlayerProgressionService } from '../services/PlayerProgressionService';
import { ShopService } from '../services/ShopService';
import { LocalEconomyService } from '../services/EconomyService';
import { ISaveService } from '../services/SaveService';
import { PlayerSaveData } from '../types/gameEngine';
import { COLLECTIBLE_ITEMS } from '../data/collectionDefinitions';
import { SHOP_CATALOG } from '../data/shopDefinitions';
import { ProgressionIntegration } from '../engine/ProgressionIntegration';
import { LevelResult } from '../types/runtimeContract';
import { PlayerProfileService } from '../services/PlayerProfileService';

class MockSaveService implements ISaveService {
  private data: PlayerSaveData;

  constructor(initialData?: Partial<PlayerSaveData>) {
    this.data = {
      currentLevel: 1,
      highestLevelUnlocked: 1,
      coins: 1000,
      gems: 50,
      starsTotal: 0,
      boosterInventory: {
        undo: 3,
        shuffle: 2,
        magnet: 1,
        extra_slot: 1,
        freeze: 0,
        hint: 2,
        auto_match: 1,
      },
      completedLevels: {},
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
      lastSavedTimestamp: Date.now(),
      metaProfile: {
        playerStats: {
          levelsCompleted: 0,
          levelsAttempted: 0,
          totalMoves: 0,
          totalCoinsEarned: 0,
          totalGemsEarned: 0,
          bestScore: 0,
          playTimeSeconds: 0,
        },
        missions: [],
        achievements: [],
        milestones: [],
        collectionState: {
          unlockedItemIds: ['tt_tropical_oasis', 'ts_classic_clean', 'bt_emerald_canopy', 'pf_novice_explorer', 'pf_star_seeker', 'tt_orchard_harvest'],
          ownedItemIds: ['tt_tropical_oasis', 'ts_classic_clean', 'bt_emerald_canopy', 'pf_novice_explorer'],
          customizations: {
            equippedTileTheme: 'tt_tropical_oasis',
            equippedTileSkin: 'ts_classic_clean',
            equippedBoardTheme: 'bt_emerald_canopy',
            equippedPlayerFrame: 'pf_novice_explorer',
          },
        },
        progressionState: {
          playerLevel: 1,
          playerXp: 0,
          lastLevelUpAcknowledged: 1,
        },
        economy: {
          coins: 1000,
          gems: 50,
          boosters: {
            undo: 3,
            shuffle: 2,
            magnet: 1,
            extra_slot: 1,
          },
        },
      },
      ...initialData,
    };
  }

  loadSave(): PlayerSaveData {
    return JSON.parse(JSON.stringify(this.data));
  }

  saveData(patch: Partial<PlayerSaveData>): boolean {
    this.data = { ...this.data, ...patch };
    return true;
  }

  completeLevel(levelId: number, stars: number, score: number): boolean {
    const existing = this.data.completedLevels[levelId] || { stars: 0, highScore: 0 };
    this.data.completedLevels[levelId] = {
      stars: Math.max(existing.stars, stars),
      highScore: Math.max(existing.highScore, score),
    };
    this.data.highestLevelUnlocked = Math.max(this.data.highestLevelUnlocked, levelId + 1);
    this.data.starsTotal = (Object.values(this.data.completedLevels) as { stars: number }[]).reduce(
      (sum, l) => sum + l.stars,
      0
    );
    return true;
  }

  resetSave(): void {
    this.data.currentLevel = 1;
    this.data.highestLevelUnlocked = 1;
  }
}

export class Phase19CommercialMetaTestFramework {
  public static runAllPhase19Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(this.testCollectionCatalogIntegrity());
    results.push(this.testCollectionUnlockAndEquipLifecycle());
    results.push(this.testShopCatalogAndCategoryIntegrity());
    results.push(this.testShopBoosterAndBundlePurchases());
    results.push(this.testDailyFreeGift24HourLogic());
    results.push(this.testPlayerXpProgressionAndLevelUp());
    results.push(this.testPackWorldAndFinaleCelebrationTriggers());
    results.push(this.testAuthoritativeRetentionLoopIntegrity());

    return results;
  }

  /**
   * 1. Test Collection Catalog contains rich, well-categorized items
   */
  private static testCollectionCatalogIntegrity(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const colService = new CollectionService(mockSave);

    const catalog = colService.getAllCollectibles();
    const categories = ['tile_theme', 'tile_skin', 'board_theme', 'player_frame', 'special_badge', 'world_memory'];
    const hasAllCategories = categories.every((cat) => catalog.some((item) => item.category === cat));
    const allHaveValidRarity = catalog.every((item) =>
      ['common', 'rare', 'epic', 'legendary'].includes(item.rarity)
    );
    const passed = catalog.length >= 15 && hasAllCategories && allHaveValidRarity;

    return {
      id: 'PHASE19_TEST_01_COLLECTION_CATALOG',
      name: 'Collection Catalog & Multi-Category Integrity',
      passed,
      message: passed
        ? `Passed: Catalog verified with ${catalog.length} items across all 6 cosmetic/memory categories.`
        : 'Failed: Collection catalog missing categories or contains invalid items.',
      durationMs: performance.now() - start,
    };
  }

  /**
   * 2. Test Collection Item Purchase, Unlocking, and Equip/Unequip
   */
  private static testCollectionUnlockAndEquipLifecycle(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const economy = new LocalEconomyService(mockSave);
    const colService = new CollectionService(mockSave, economy);

    // Initial state: pf_novice_explorer equipped
    const initialCustomizations = colService.getEquippedCustomizations();
    const isNoviceEquipped = initialCustomizations.equippedPlayerFrame === 'pf_novice_explorer';

    // Purchase rare frame 'pf_star_seeker' (costs 400 coins)
    const purchaseRes = colService.purchaseItem('pf_star_seeker', 'coins');
    const isPurchased = purchaseRes.success && colService.isItemOwned('pf_star_seeker');

    // Equip purchased frame
    const equipRes = colService.equipItem('pf_star_seeker');
    const updatedCustomizations = colService.getEquippedCustomizations();
    const isEquipped = equipRes && updatedCustomizations.equippedPlayerFrame === 'pf_star_seeker';

    const passed = isNoviceEquipped && isPurchased && isEquipped;

    return {
      id: 'PHASE19_TEST_02_COLLECTION_EQUIP_LIFECYCLE',
      name: 'Collection Purchase, Unlock & Equip Lifecycle',
      passed,
      message: passed
        ? 'Passed: Successfully purchased, unlocked, and equipped custom cosmetics.'
        : `Failed: isNoviceEquipped=${isNoviceEquipped}, isPurchased=${isPurchased}, isEquipped=${isEquipped}`,
      durationMs: performance.now() - start,
    };
  }

  /**
   * 3. Test Shop Catalog structure and category segregation
   */
  private static testShopCatalogAndCategoryIntegrity(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const shopService = new ShopService(mockSave);

    const catalog = shopService.getCatalog();
    const boosters = catalog.filter((i) => i.category === 'boosters');
    const bundles = catalog.filter((i) => i.category === 'bundles');
    const special = catalog.filter((i) => i.category === 'special');

    const passed = boosters.length >= 4 && bundles.length >= 2 && special.length >= 1;

    return {
      id: 'PHASE19_TEST_03_SHOP_CATALOG_STRUCTURE',
      name: 'Shop Marketplace Category Segregation',
      passed,
      message: passed
        ? `Passed: Shop verified with ${boosters.length} boosters, ${bundles.length} bundles, and daily blessings.`
        : 'Failed: Shop catalog missing required product categories.',
      durationMs: performance.now() - start,
    };
  }

  /**
   * 4. Test Booster and Bundle purchases with balance validation
   */
  private static testShopBoosterAndBundlePurchases(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const economy = new LocalEconomyService(mockSave);
    const shopService = new ShopService(mockSave, economy);

    const initialCoins = economy.getCoins(); // 1000
    const initialUndo = economy.getBoosterCount('undo'); // 3

    // Purchase 1 Undo booster for 100 coins
    const purchaseBoosterRes = shopService.purchaseItem('shop_booster_undo', 'coins');
    const coinsAfterBooster = economy.getCoins();
    const undoAfterBooster = economy.getBoosterCount('undo');

    // Purchase Oasis Starter Kit for 450 coins (+2 undo, +2 shuffle, +1 magnet)
    const purchaseBundleRes = shopService.purchaseItem('bundle_oasis_starter', 'coins');
    const undoAfterBundle = economy.getBoosterCount('undo');

    const passed =
      purchaseBoosterRes.success &&
      coinsAfterBooster === initialCoins - 100 &&
      undoAfterBooster === initialUndo + 1 &&
      purchaseBundleRes.success &&
      undoAfterBundle === undoAfterBooster + 2;

    return {
      id: 'PHASE19_TEST_04_SHOP_PURCHASE_TRANSACTIONS',
      name: 'Shop Booster & Bundle Authoritative Transactions',
      passed,
      message: passed
        ? 'Passed: Purchases correctly deducted currency and granted booster bundles.'
        : `Failed: Coins or Booster count mismatch. initial=${initialCoins}, after=${coinsAfterBooster}`,
      durationMs: performance.now() - start,
    };
  }

  /**
   * 5. Test Daily Free Gift 24h cooldown logic
   */
  private static testDailyFreeGift24HourLogic(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const economy = new LocalEconomyService(mockSave);
    const shopService = new ShopService(mockSave, economy);

    // Initial claim should succeed
    const initialCanClaim = shopService.canClaimDailyFreeGift();
    const claimRes = shopService.purchaseItem('shop_daily_free_gift', 'coins');
    const canClaimAgain = shopService.canClaimDailyFreeGift();

    // Immediate re-claim should be rejected
    const repeatRes = shopService.purchaseItem('shop_daily_free_gift', 'coins');

    const passed = initialCanClaim && claimRes.success && !canClaimAgain && !repeatRes.success;

    return {
      id: 'PHASE19_TEST_05_DAILY_FREE_GIFT_COOLDOWN',
      name: 'Daily Free Gift 24-Hour Cooldown Enforcement',
      passed,
      message: passed
        ? 'Passed: Daily gift allowed first claim and blocked immediate duplicate claim.'
        : `Failed: initialCanClaim=${initialCanClaim}, claimRes=${claimRes.success}, canClaimAgain=${canClaimAgain}`,
      durationMs: performance.now() - start,
    };
  }

  /**
   * 6. Test Player XP progression, Level Ups, and Promotion Rewards
   */
  private static testPlayerXpProgressionAndLevelUp(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const economy = new LocalEconomyService(mockSave);
    const progService = new PlayerProgressionService(mockSave, economy);

    const initialInfo = progService.getPlayerLevelInfo();
    // Grant 600 XP (threshold for Level 1 is 0-200 XP, Level 2 is 200-450, Level 3 is 450-750)
    const xpReport = progService.addXp(600, 'test_source');

    const updatedInfo = progService.getPlayerLevelInfo();
    const passed =
      initialInfo.level === 1 &&
      xpReport.leveledUp &&
      updatedInfo.level >= 3 &&
      xpReport.levelUpRewards.length > 0;

    return {
      id: 'PHASE19_TEST_06_PLAYER_XP_PROGRESSION',
      name: 'Player XP Progression & Level-Up Rewards',
      passed,
      message: passed
        ? `Passed: Player leveled up from Rank 1 to Rank ${updatedInfo.level} with ${xpReport.levelUpRewards.length} milestone rewards.`
        : `Failed: Level up failed. initial=${initialInfo.level}, updated=${updatedInfo.level}`,
      durationMs: performance.now() - start,
    };
  }

  /**
   * 7. Test Pack Completion, World Completion & Campaign Finale Triggers
   */
  private static testPackWorldAndFinaleCelebrationTriggers(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const economy = new LocalEconomyService(mockSave);
    const profileService = new PlayerProfileService(mockSave);
    const progIntegration = new ProgressionIntegration(
      mockSave,
      economy,
      profileService,
      undefined,
      undefined,
      undefined,
      new PlayerProgressionService(mockSave, economy),
      new CollectionService(mockSave, economy)
    );

    // Complete Level 25 (Pack 1 Boss)
    const pack25Result: LevelResult = {
      levelId: 25,
      worldId: 1,
      packId: 'world_1_pack_1',
      completed: true,
      score: 15000,
      stars: 3,
      movesUsed: 18,
      timeUsedSeconds: 45,
      tilesMatched: 45,
      objectivesCompleted: true,
      completionTimestamp: Date.now(),
      version: 'v1.0',
      boostersUsed: {},
      rewardsEarned: {
        coins: 200,
        gems: 10,
        stars: 3,
        boostersGranted: {},
        expPoints: 100,
      },
    };

    const report25 = progIntegration.processLevelCompletion(pack25Result);

    // Complete Level 100 (World 1 Finale)
    const world100Result: LevelResult = {
      levelId: 100,
      worldId: 1,
      packId: 'world_1_pack_4',
      completed: true,
      score: 25000,
      stars: 3,
      movesUsed: 22,
      timeUsedSeconds: 60,
      tilesMatched: 60,
      objectivesCompleted: true,
      completionTimestamp: Date.now(),
      version: 'v1.0',
      boostersUsed: {},
      rewardsEarned: {
        coins: 500,
        gems: 25,
        stars: 3,
        boostersGranted: {},
        expPoints: 250,
      },
    };

    const report100 = progIntegration.processLevelCompletion(world100Result);

    // Complete Level 9999 (Grand Campaign Finale)
    const finaleResult: LevelResult = {
      levelId: 9999,
      worldId: 100,
      packId: 'world_100_pack_4',
      completed: true,
      score: 99999,
      stars: 3,
      movesUsed: 30,
      timeUsedSeconds: 90,
      tilesMatched: 90,
      objectivesCompleted: true,
      completionTimestamp: Date.now(),
      version: 'v1.0',
      boostersUsed: {},
      rewardsEarned: {
        coins: 10000,
        gems: 500,
        stars: 3,
        boostersGranted: {},
        expPoints: 1000,
      },
    };

    const reportFinale = progIntegration.processLevelCompletion(finaleResult);

    const passed =
      report25.isPackComplete &&
      Boolean(report25.packInfo) &&
      report100.isWorldComplete &&
      Boolean(report100.worldInfo) &&
      reportFinale.isCampaignFinale;

    return {
      id: 'PHASE19_TEST_07_PACK_WORLD_FINALE_TRIGGERS',
      name: 'Pack Boss, World Master & Campaign Finale Celebrations',
      passed,
      message: passed
        ? 'Passed: Correctly flagged Level 25 Pack Boss, Level 100 World Master, and Level 9999 Grand Finale.'
        : 'Failed: Celebration flags not set correctly on milestone levels.',
      durationMs: performance.now() - start,
    };
  }

  /**
   * 8. Test Authoritative Complete Loop (Play -> Earn -> Collect -> Save Roundtrip)
   */
  private static testAuthoritativeRetentionLoopIntegrity(): TestResult {
    const start = performance.now();
    const mockSave = new MockSaveService();
    const economy = new LocalEconomyService(mockSave);
    const progService = new PlayerProgressionService(mockSave, economy);
    const colService = new CollectionService(mockSave, economy);

    // 1. Initial State
    const initCoins = economy.getCoins();

    // 2. Play & Win Level
    economy.addCoins(300);
    progService.addXp(150, 'level_1');

    // 3. Collect/Purchase Theme 'tt_orchard_harvest' (unlocked in mock save, costs 800 coins)
    const buyThemeRes = colService.purchaseItem('tt_orchard_harvest', 'coins');

    // 4. Equip & Save
    colService.equipItem('tt_orchard_harvest');

    // 5. Verify Save Roundtrip
    const reloadedSave = mockSave.loadSave();
    const savedCustomizations = (reloadedSave as any).metaProfile?.collectionState?.customizations;
    const isThemeEquipped = savedCustomizations?.equippedTileTheme === 'tt_orchard_harvest';

    const passed = buyThemeRes.success && isThemeEquipped;

    return {
      id: 'PHASE19_TEST_08_RETENTION_LOOP_INTEGRITY',
      name: 'Full Retention Loop & Authoritative Save State Roundtrip',
      passed,
      message: passed
        ? 'Passed: Seamless retention loop verified with full state persistence.'
        : `Failed: buyThemeRes=${buyThemeRes.success}, isThemeEquipped=${isThemeEquipped}`,
      durationMs: performance.now() - start,
    };
  }
}
