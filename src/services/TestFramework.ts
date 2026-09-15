import { MatchSystem } from '../engine/MatchSystem';
import { LevelValidator } from '../engine/LevelValidator';
import { GameStateMachine } from '../engine/GameStateMachine';
import { BoardAutoFitSystem } from '../engine/BoardAutoFitSystem';
import { DifficultySystem } from '../engine/DifficultySystem';
import { UndoBooster, ShuffleBooster, MagnetBooster } from '../engine/BoosterEngine';
import { generateLevelDefinition } from '../data/levelDefinitions';
import { BoardTile, TrayTileItem } from '../types/gameEngine';
import { MetaProgressionTestFramework } from './MetaProgressionTestFramework';
import { Phase13UIUXTestFramework } from '../tests/phase13UIUX.test';
import { TileInteractionTestFramework } from '../tests/tileInteractionFix.test';
import { Phase14ContentDesignTestFramework } from '../tests/phase14ContentDesign.test';
import { Phase15AdvancedMechanicsTestFramework } from '../tests/phase15AdvancedMechanics.test';
import { ProductionHardening9999TestFramework } from '../tests/productionHardening9999.test';
import { Phase16AAACampaignTestFramework } from '../tests/phase16AAACampaign.test';
import { Phase17PlayerExperienceTestFramework } from '../tests/phase17PlayerExperience.test';
import { Phase18ProductionAuditTestFramework } from '../tests/phase18ProductionAudit.test';
import { Phase19CommercialMetaTestFramework } from '../tests/phase19CommercialMeta.test';
import { Phase20ProductionReadinessTestFramework } from '../tests/phase20ProductionReadiness.test';
import { Phase21ProductionUXTestFramework } from '../tests/phase21ProductionUX.test';
import { Phase22MobileUXVisualAuditTestFramework } from '../tests/phase22MobileUXVisualAudit.test';
import { Phase22_5VisualQAFidelityTestFramework } from '../tests/phase22_5VisualQAFidelity.test';
import { Phase23DeepVisualFidelityTestFramework } from '../tests/phase23DeepVisualFidelity.test';
import { Phase24RenderedVisualQATestFramework } from '../tests/phase24RenderedVisualQA.test';
import { Phase25FinalVisualFidelityTestFramework } from '../tests/phase25FinalVisualFidelity.test';

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

export class TestFramework {
  public static runAllTests(): TestResult[] {
    const results: TestResult[] = [];

    // Phase 08–10 Core Tests
    results.push(TestFramework.testTileCountModulo3());
    results.push(TestFramework.testMatch3Logic());
    results.push(TestFramework.testTrayCapacityOverflow());
    results.push(TestFramework.testSolvabilitySimulation());
    results.push(TestFramework.testGameStateMachine());
    results.push(TestFramework.testBoardAutoFitSystem());
    results.push(TestFramework.testDifficultySystem());
    results.push(TestFramework.testUndoBooster());
    results.push(TestFramework.testShuffleBooster());
    results.push(TestFramework.testMagnetBooster());

    // Tile Interaction Pipeline Fix Tests
    const tileInteractionResults = TileInteractionTestFramework.runAllInteractionTests();
    results.push(...tileInteractionResults);

    // Phase 12 Meta Progression Tests
    const phase12Results = MetaProgressionTestFramework.runAllPhase12Tests();
    results.push(...phase12Results);

    // Phase 13 UI/UX Flow Tests
    const phase13Results = Phase13UIUXTestFramework.runAllPhase13Tests();
    results.push(...phase13Results);

    // Phase 14 Content Design & World Theming Tests
    const phase14Results = Phase14ContentDesignTestFramework.runAllPhase14Tests();
    results.push(...phase14Results);

    // Phase 15 Advanced Mechanics & Special Levels Tests
    const phase15Results = Phase15AdvancedMechanicsTestFramework.runAllPhase15Tests();
    results.push(...phase15Results);

    // Phase 16 / 9999 Production Hardening Tests
    const prodHardeningResults = ProductionHardening9999TestFramework.runAllProductionTests();
    results.push(...prodHardeningResults);

    // Phase 16 AAA Campaign Content & Difficulty Waves Tests
    const phase16Results = Phase16AAACampaignTestFramework.runAllPhase16Tests();
    results.push(...phase16Results);

    // Phase 17 AAA Player Experience & Game Feel Tests
    const phase17Results = Phase17PlayerExperienceTestFramework.runAllPhase17Tests();
    results.push(...phase17Results);

    // Phase 18 Production QA, UX Polish & Final System Integration Tests
    const phase18Results = Phase18ProductionAuditTestFramework.runAllPhase18Tests();
    results.push(...phase18Results);

    // Phase 19 Commercial Player Meta, Collection & Retention Tests
    const phase19Results = Phase19CommercialMetaTestFramework.runAllPhase19Tests();
    results.push(...phase19Results);

    // Phase 20 Live Ops Foundation, Analytics & Production Readiness Tests
    const phase20Results = Phase20ProductionReadinessTestFramework.runAllPhase20Tests();
    results.push(...phase20Results);

    // Phase 21 Final Production UX, Live-Ops UI & Release Candidate Tests
    const phase21Results = Phase21ProductionUXTestFramework.runAllPhase21Tests();
    results.push(...phase21Results);

    // Phase 22 Reference-Matched Mobile-First UI/UX & Visual Overhaul Tests
    const phase22Results = Phase22MobileUXVisualAuditTestFramework.runAllPhase22Tests();
    results.push(...phase22Results);

    // Phase 22.5 Visual QA, Reference Fidelity & Final Mobile Polish Tests
    const phase22_5Results = Phase22_5VisualQAFidelityTestFramework.runAllPhase22_5Tests();
    results.push(...phase22_5Results);

    // Phase 23 Deep Reference Fidelity, Mobile UI Reconstruction & AAA Visual Polish Tests
    const phase23Results = Phase23DeepVisualFidelityTestFramework.runAllPhase23Tests();
    results.push(...phase23Results);

    // Phase 24 Real Rendered UI Audit & Reference Fidelity QA Tests
    const phase24Results = Phase24RenderedVisualQATestFramework.runAllPhase24Tests();
    results.push(...phase24Results);

    // Phase 25 Final AAA Visual Fidelity & Real-Device UX Audit QA Tests
    const phase25Results = Phase25FinalVisualFidelityTestFramework.runAllPhase25Tests();
    results.push(...phase25Results);

    return results;
  }

  private static testTileCountModulo3(): TestResult {
    const start = performance.now();
    const lvl1 = generateLevelDefinition(1);
    const report = LevelValidator.validateLevel(lvl1);
    const passed = report.tileCount % 3 === 0 && report.isValid;

    return {
      id: 'TEST_01_MODULO_3',
      name: 'Level Tile Count Modulo 3 & Triplets Validation',
      passed,
      message: passed ? `Passed: Level 1 contains ${report.tileCount} tiles (${report.tripletCount} triplets).` : 'Failed: Tile count is not divisible by 3.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testMatch3Logic(): TestResult {
    const start = performance.now();
    const tray: TrayTileItem[] = [
      { id: 't1', typeId: 'fruit_apple', sourceTileId: 's1', placedAtTimestamp: 1 },
      { id: 't2', typeId: 'fruit_apple', sourceTileId: 's2', placedAtTimestamp: 2 },
      { id: 't3', typeId: 'fruit_apple', sourceTileId: 's3', placedAtTimestamp: 3 },
    ];

    const result = MatchSystem.evaluateTray(tray, { capacity: 7, maxCapacityLimit: 9, unlockedSlots: 7, isExtraSlotActive: false }, 0);
    const passed = result.hasMatched && result.updatedTray.length === 0 && result.matchedTypeId === 'fruit_apple';

    return {
      id: 'TEST_02_MATCH_3_LOGIC',
      name: 'Triple Match Detection & Tray Cleanup',
      passed,
      message: passed ? 'Passed: 3 identical tiles successfully detected and cleared.' : 'Failed: Match-3 evaluation failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testTrayCapacityOverflow(): TestResult {
    const start = performance.now();
    const tray: TrayTileItem[] = [
      { id: 't1', typeId: 'a', sourceTileId: 's1', placedAtTimestamp: 1 },
      { id: 't2', typeId: 'b', sourceTileId: 's2', placedAtTimestamp: 2 },
      { id: 't3', typeId: 'c', sourceTileId: 's3', placedAtTimestamp: 3 },
      { id: 't4', typeId: 'd', sourceTileId: 's4', placedAtTimestamp: 4 },
      { id: 't5', typeId: 'e', sourceTileId: 's5', placedAtTimestamp: 5 },
      { id: 't6', typeId: 'f', sourceTileId: 's6', placedAtTimestamp: 6 },
      { id: 't7', typeId: 'g', sourceTileId: 's7', placedAtTimestamp: 7 },
    ];

    const result = MatchSystem.evaluateTray(tray, { capacity: 7, maxCapacityLimit: 9, unlockedSlots: 7, isExtraSlotActive: false }, 0);
    const passed = result.isTrayFull && !result.hasMatched;

    return {
      id: 'TEST_03_TRAY_OVERFLOW',
      name: 'Tray Full Overflow Defeat Trigger',
      passed,
      message: passed ? 'Passed: Tray full condition correctly identified with 0 matches.' : 'Failed: Tray overflow check failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testSolvabilitySimulation(): TestResult {
    const start = performance.now();
    const lvl1 = generateLevelDefinition(1);
    const solvability = LevelValidator.simulateSolvability(lvl1.tiles, 7);

    return {
      id: 'TEST_04_SOLVABILITY',
      name: 'Deterministic Level Solvability Simulation',
      passed: solvability.solvable,
      message: solvability.solvable ? `Passed: Solved in ${solvability.steps} greedy steps.` : `Failed: Unsolvable level (${solvability.reason})`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testGameStateMachine(): TestResult {
    const start = performance.now();
    const fsm = new GameStateMachine('BOOT');
    const ok1 = fsm.transitionTo('LOADING');
    const ok2 = fsm.transitionTo('MAIN_MENU');
    const ok3 = fsm.transitionTo('LEVEL_LOADING');
    const ok4 = fsm.transitionTo('LEVEL_READY');
    const ok5 = fsm.transitionTo('PLAYING');

    const invalidTransitionBlocked = !fsm.canTransitionTo('BOOT');

    const passed = ok1 && ok2 && ok3 && ok4 && ok5 && invalidTransitionBlocked && fsm.canAcceptTileInput();

    return {
      id: 'TEST_05_FSM_TRANSITIONS',
      name: 'Game State Machine Guarded Transitions',
      passed,
      message: passed ? 'Passed: State machine transitions and input guards verified.' : 'Failed: FSM transition sequence failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testBoardAutoFitSystem(): TestResult {
    const start = performance.now();
    const phoneLayout = BoardAutoFitSystem.calculateLayout({
      width: 390,
      height: 700,
      safeAreaTop: 20,
      safeAreaBottom: 20,
      safeAreaLeft: 0,
      safeAreaRight: 0,
      deviceType: 'small_phone',
    });

    const passed = phoneLayout.tileSize > 30 && phoneLayout.boardWidth > 200 && phoneLayout.scaleFactor > 0.5;

    return {
      id: 'TEST_06_AUTOFIT_LAYOUT',
      name: 'Board Auto-Fit Viewport Responsive Calculations',
      passed,
      message: passed ? `Passed: Dynamic tile size ${phoneLayout.tileSize}px computed.` : 'Failed: Auto-fit calculation failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testDifficultySystem(): TestResult {
    const start = performance.now();
    const lvl5 = generateLevelDefinition(5);
    const diff = DifficultySystem.calculateDifficulty(lvl5);

    const passed = diff.score >= 1 && diff.score <= 100 && diff.label !== undefined;

    return {
      id: 'TEST_07_DIFFICULTY_MODEL',
      name: 'Numerical Difficulty Model Rating',
      passed,
      message: passed ? `Passed: Level 5 scored ${diff.score}/100 (${diff.label}).` : 'Failed: Difficulty calculation failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testUndoBooster(): TestResult {
    const start = performance.now();
    const booster = new UndoBooster();
    const board: BoardTile[] = [];
    const tray: TrayTileItem[] = [{ id: 'tr_1', typeId: 'fruit_apple', sourceTileId: 's_1', placedAtTimestamp: 1 }];
    const moveHistory = [{ tile: { id: 's_1', typeId: 'fruit_apple', x: 2, y: 2, layer: 0, state: 'IN_TRAY' as const }, trayItemId: 'tr_1' }];

    const res = booster.execute(board, tray, moveHistory);
    const passed = res.success && res.updatedBoardTiles.length === 1 && res.updatedTrayTiles.length === 0;

    return {
      id: 'TEST_08_UNDO_BOOSTER',
      name: 'Undo Booster Tile Restoration',
      passed,
      message: passed ? 'Passed: Tile restored from tray back to board.' : 'Failed: Undo booster execution failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testShuffleBooster(): TestResult {
    const start = performance.now();
    const booster = new ShuffleBooster();
    const board: BoardTile[] = [
      { id: '1', typeId: 'a', x: 1, y: 1, layer: 0, state: 'AVAILABLE' },
      { id: '2', typeId: 'b', x: 2, y: 1, layer: 0, state: 'AVAILABLE' },
      { id: '3', typeId: 'c', x: 3, y: 1, layer: 0, state: 'AVAILABLE' },
    ];

    const res = booster.execute(board, []);
    const passed = res.success && res.updatedBoardTiles.length === 3;

    return {
      id: 'TEST_09_SHUFFLE_BOOSTER',
      name: 'Shuffle Booster Tile Count & Integrity',
      passed,
      message: passed ? 'Passed: Tile count preserved during board shuffle.' : 'Failed: Shuffle booster failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testMagnetBooster(): TestResult {
    const start = performance.now();
    const booster = new MagnetBooster();
    const board: BoardTile[] = [
      { id: 'b1', typeId: 'fruit_grape', x: 1, y: 1, layer: 0, state: 'AVAILABLE' },
      { id: 'b2', typeId: 'fruit_grape', x: 2, y: 1, layer: 0, state: 'AVAILABLE' },
      { id: 'b3', typeId: 'fruit_grape', x: 3, y: 1, layer: 0, state: 'AVAILABLE' },
    ];

    const res = booster.execute(board, []);
    const passed = res.success && res.updatedBoardTiles.length === 0 && res.scoreGained === 300;

    return {
      id: 'TEST_10_MAGNET_BOOSTER',
      name: 'Magnet Booster Auto-Triplet Extraction',
      passed,
      message: passed ? 'Passed: Magnet extracted 3 matching tiles and awarded bonus points.' : 'Failed: Magnet booster failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }
}
