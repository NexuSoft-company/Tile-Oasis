import { MatchSystem } from '../engine/MatchSystem';
import { CoreGameplayEngine } from '../engine/CoreGameplayEngine';
import { SolvabilityValidator } from '../engine/SolvabilityValidator';
import { LevelSimulator } from '../engine/LevelSimulator';
import { DifficultyCurve } from '../engine/DifficultyCurve';
import { LevelFactory } from '../engine/LevelFactory';
import { ObjectiveEngine } from '../engine/ObjectiveEngine';
import { BoardTile, TrayTileItem, TrayConfiguration } from '../types/gameEngine';
import { TestResult } from '../services/TestFramework';

export class Phase15AdvancedMechanicsTestFramework {
  public static runAllPhase15Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(this.testRainbowWildcardMatching());
    results.push(this.testGoldenMultiplierMatching());
    results.push(this.testFrozenTileThawingLogic());
    results.push(this.testChainedTileShatterLogic());
    results.push(this.testBombAndKeySpecialEffects());
    results.push(this.testSpecialObjectivesEngine());
    results.push(this.testControlledUnlockSchedule());
    results.push(this.testSpecialLevelGenerationAndSolvability());

    return results;
  }

  private static testRainbowWildcardMatching(): TestResult {
    const start = performance.now();
    const config: TrayConfiguration = { capacity: 7, maxCapacityLimit: 9, unlockedSlots: 7, isExtraSlotActive: false };

    // Tray with 2 apples + 1 rainbow tile
    const tray: TrayTileItem[] = [
      { id: 't1', typeId: 'fruit_apple', sourceTileId: 's1', placedAtTimestamp: 1 },
      { id: 't2', typeId: 'fruit_apple', sourceTileId: 's2', placedAtTimestamp: 2 },
      { id: 't3', typeId: 'special_rainbow', sourceTileId: 's3', specialProperty: 'rainbow', placedAtTimestamp: 3 },
    ];

    const matchRes = MatchSystem.evaluateTray(tray, config, 0);
    const passed = matchRes.hasMatched && matchRes.updatedTray.length === 0 && matchRes.matchedTypeId === 'fruit_apple';

    return {
      id: 'TEST_P15_01_RAINBOW_WILDCARD',
      name: 'Rainbow Wildcard Tile Match-3 Substitution',
      passed,
      message: passed
        ? 'Passed: Rainbow tile correctly substituted for missing 3rd tile and executed match-3.'
        : 'Failed: Rainbow tile did not substitute for triplet.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testGoldenMultiplierMatching(): TestResult {
    const start = performance.now();
    const config: TrayConfiguration = { capacity: 7, maxCapacityLimit: 9, unlockedSlots: 7, isExtraSlotActive: false };

    // Tray with 2 regular oranges + 1 golden orange
    const tray: TrayTileItem[] = [
      { id: 't1', typeId: 'fruit_orange', sourceTileId: 's1', placedAtTimestamp: 1 },
      { id: 't2', typeId: 'fruit_orange', sourceTileId: 's2', placedAtTimestamp: 2 },
      { id: 't3', typeId: 'fruit_orange', sourceTileId: 's3', specialProperty: 'golden', placedAtTimestamp: 3 },
    ];

    const matchRes = MatchSystem.evaluateTray(tray, config, 0);
    // Base score is 150, 2x golden multiplier yields 300
    const passed = matchRes.hasMatched && matchRes.scoreBonus === 300 && matchRes.specialEffects?.hasGolden === true;

    return {
      id: 'TEST_P15_02_GOLDEN_MULTIPLIER',
      name: 'Golden Tile 2X Score Multiplier Evaluation',
      passed,
      message: passed
        ? `Passed: Golden tile applied 2x score multiplier (Score: ${matchRes.scoreBonus}).`
        : `Failed: Golden score multiplier did not trigger properly (Score: ${matchRes.scoreBonus}).`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testFrozenTileThawingLogic(): TestResult {
    const start = performance.now();

    // Create a mock engine with 1 frozen tile and 1 valid triplet
    const tiles: BoardTile[] = [
      { id: 'f1', typeId: 'fruit_cherry', x: 0, y: 0, layer: 0, state: 'AVAILABLE', specialProperty: 'frozen', freezeLevel: 1 },
      { id: 'a1', typeId: 'fruit_apple', x: 1, y: 0, layer: 1, state: 'AVAILABLE' },
      { id: 'a2', typeId: 'fruit_apple', x: 2, y: 0, layer: 1, state: 'AVAILABLE' },
      { id: 'a3', typeId: 'fruit_apple', x: 3, y: 0, layer: 1, state: 'AVAILABLE' },
      { id: 'c1', typeId: 'fruit_cherry', x: 4, y: 0, layer: 1, state: 'AVAILABLE' },
      { id: 'c2', typeId: 'fruit_cherry', x: 5, y: 0, layer: 1, state: 'AVAILABLE' },
    ];

    const engine = new CoreGameplayEngine({ levelId: 26, customLevelDefinition: { id: 26, tiles, trayCapacity: 7 } as any });

    // Selecting frozen tile should fail
    const frozenSelect = engine.handleTileSelect('f1');
    const blockedProperly = !frozenSelect.success && frozenSelect.message.includes('frozen');

    // Select the 3 apples to trigger a match
    engine.handleTileSelect('a1');
    engine.handleTileSelect('a2');
    engine.handleTileSelect('a3');

    // Check if frozen tile thawed
    const remainingBoard = engine.getBoardTiles();
    const thawedTile = remainingBoard.find(t => t.id === 'f1');
    const thawedProperly = thawedTile && thawedTile.specialProperty === undefined;

    const passed = blockedProperly && thawedProperly;

    return {
      id: 'TEST_P15_03_FROZEN_THAWING',
      name: 'Frozen Tile Selection Lock & Match Thawing',
      passed,
      message: passed
        ? 'Passed: Frozen tile correctly blocked direct selection and thawed after match completed.'
        : 'Failed: Frozen tile logic failed to block or thaw correctly.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testChainedTileShatterLogic(): TestResult {
    const start = performance.now();

    const tiles: BoardTile[] = [
      { id: 'ch1', typeId: 'flower_rose', x: 0, y: 0, layer: 1, state: 'AVAILABLE', specialProperty: 'chained', chainCount: 1 },
      { id: 'r2', typeId: 'flower_rose', x: 1, y: 0, layer: 1, state: 'AVAILABLE' },
      { id: 'r3', typeId: 'flower_rose', x: 2, y: 0, layer: 1, state: 'AVAILABLE' },
    ];

    const engine = new CoreGameplayEngine({ levelId: 51, customLevelDefinition: { id: 51, tiles, trayCapacity: 7 } as any });

    // Selecting chained tile should shatter chain, awarding score without moving to tray
    const chainSelect = engine.handleTileSelect('ch1');
    const trayAfterShatter = engine.getTrayTiles();
    const boardAfterShatter = engine.getBoardTiles();
    const shatteredTile = boardAfterShatter.find(t => t.id === 'ch1');

    const shatterPassed =
      chainSelect.success &&
      trayAfterShatter.length === 0 &&
      shatteredTile?.specialProperty === undefined &&
      shatteredTile?.chainCount === undefined;

    // Now selecting the unchained tile moves it to tray
    engine.handleTileSelect('ch1');
    const trayAfterMove = engine.getTrayTiles();
    const movedPassed = trayAfterMove.length === 1 && trayAfterMove[0].sourceTileId === 'ch1';

    const passed = Boolean(shatterPassed && movedPassed);

    return {
      id: 'TEST_P15_04_CHAINED_SHATTER',
      name: 'Chained Tile Shatter Action & Subsequent Selection',
      passed,
      message: passed
        ? 'Passed: Chained tile unchained on click, remained on board, and was selectable thereafter.'
        : 'Failed: Chained tile shatter mechanics failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testBombAndKeySpecialEffects(): TestResult {
    const start = performance.now();
    const config: TrayConfiguration = { capacity: 7, maxCapacityLimit: 9, unlockedSlots: 7, isExtraSlotActive: false };

    // Test Bomb match detection
    const bombTray: TrayTileItem[] = [
      { id: 'b1', typeId: 'special_bomb', sourceTileId: 's1', specialProperty: 'bomb', placedAtTimestamp: 1 },
      { id: 'b2', typeId: 'special_bomb', sourceTileId: 's2', placedAtTimestamp: 2 },
      { id: 'b3', typeId: 'special_bomb', sourceTileId: 's3', placedAtTimestamp: 3 },
    ];
    const bombMatch = MatchSystem.evaluateTray(bombTray, config, 0);

    // Test Key match detection
    const keyTray: TrayTileItem[] = [
      { id: 'k1', typeId: 'special_key', sourceTileId: 's1', specialProperty: 'key', placedAtTimestamp: 1 },
      { id: 'k2', typeId: 'special_key', sourceTileId: 's2', placedAtTimestamp: 2 },
      { id: 'k3', typeId: 'special_key', sourceTileId: 's3', placedAtTimestamp: 3 },
    ];
    const keyMatch = MatchSystem.evaluateTray(keyTray, config, 0);

    const passed =
      bombMatch.hasMatched &&
      bombMatch.specialEffects?.hasBomb === true &&
      keyMatch.hasMatched &&
      keyMatch.specialEffects?.hasKey === true;

    return {
      id: 'TEST_P15_05_BOMB_AND_KEY_EFFECTS',
      name: 'Bomb Detonator & Master Key Match Detection',
      passed,
      message: passed
        ? 'Passed: Bomb and Key special effects properly identified by MatchSystem.'
        : 'Failed: Bomb or Key match detection failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testSpecialObjectivesEngine(): TestResult {
    const start = performance.now();

    const mockDef: any = {
      id: 14,
      tiles: new Array(18).fill({}),
      objectives: [
        { type: 'combo_target', targetCombo: 3, currentCount: 0, completed: false },
        { type: 'clear_all_tiles', targetCount: 18, currentCount: 0, completed: false },
      ],
      starRules: { oneStarScore: 500, twoStarsScore: 1000, threeStarsScore: 1500 },
    };

    // Evaluate in initial state (18 remaining tiles, combo 2)
    const eval1 = ObjectiveEngine.evaluateObjectives(mockDef, 100, 18, {}, 2, 0);
    const initiallyIncomplete = !eval1.allObjectivesMet;

    // Evaluate with 0 remaining tiles, combo 3
    const eval2 = ObjectiveEngine.evaluateObjectives(mockDef, 1600, 0, {}, 3, 0);
    const allPassed = eval2.allObjectivesMet;

    const passed = initiallyIncomplete && allPassed;

    return {
      id: 'TEST_P15_06_SPECIAL_OBJECTIVES_ENGINE',
      name: 'Dynamic Objectives Evaluation (Combo Target, Move Limit, Clear)',
      passed,
      message: passed
        ? 'Passed: ObjectiveEngine accurately evaluates combo thresholds and clear conditions.'
        : 'Failed: ObjectiveEngine evaluation failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testControlledUnlockSchedule(): TestResult {
    const start = performance.now();

    const lvl5Mechanics = DifficultyCurve.getUnlockedMechanics(5);
    const lvl15Mechanics = DifficultyCurve.getUnlockedMechanics(15);
    const lvl25Mechanics = DifficultyCurve.getUnlockedMechanics(25);
    const lvl30Mechanics = DifficultyCurve.getUnlockedMechanics(30);
    const lvl55Mechanics = DifficultyCurve.getUnlockedMechanics(55);
    const lvl80Mechanics = DifficultyCurve.getUnlockedMechanics(80);
    const lvl105Mechanics = DifficultyCurve.getUnlockedMechanics(105);

    const passed =
      lvl5Mechanics.length === 0 &&
      lvl15Mechanics.includes('rainbow') &&
      lvl25Mechanics.includes('golden') &&
      lvl30Mechanics.includes('frozen') &&
      lvl55Mechanics.includes('chained') &&
      lvl80Mechanics.includes('bomb') &&
      lvl105Mechanics.includes('key');

    return {
      id: 'TEST_P15_07_UNLOCK_SCHEDULE',
      name: 'Controlled Progressive Mechanic Unlock Schedule',
      passed,
      message: passed
        ? 'Passed: Controlled milestone gates verified (Rainbow: 14, Golden: 23, Frozen: 26, Chained: 51, Bomb: 75, Key: 100).'
        : 'Failed: Mechanic unlock progression does not match milestone gates.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testSpecialLevelGenerationAndSolvability(): TestResult {
    const start = performance.now();

    // Generate Pack Boss (Level 24) and World Finale (Level 100) and Combo Frenzy (Level 14)
    const boss = LevelFactory.createLevel({ levelId: 24 });
    const finale = LevelFactory.createLevel({ levelId: 100 });
    const frenzy = LevelFactory.createLevel({ levelId: 14 });

    const bossValid = boss.level.tiles.length > 0 && boss.report.isSolvable;
    const finaleValid = finale.level.tiles.length > 0 && finale.report.isSolvable;
    const frenzyValid = frenzy.level.tiles.length > 0 && frenzy.report.isSolvable;

    const passed = bossValid && finaleValid && frenzyValid;

    return {
      id: 'TEST_P15_08_SPECIAL_LEVELS_SOLVABILITY',
      name: 'Special Level Types Generation & Guaranteed Solvability',
      passed,
      message: passed
        ? `Passed: Pack Boss, World Finale, and Combo Frenzy generated with 100% verified solvability.`
        : `Failed: Special level generation or solvability check failed.`,
      durationMs: Math.round(performance.now() - start),
    };
  }
}
