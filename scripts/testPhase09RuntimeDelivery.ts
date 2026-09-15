import { RuntimeLevelRegistry } from '../src/engine/RuntimeLevelRegistry';
import { LevelLoader } from '../src/engine/LevelLoader';
import { RuntimeBoardBuilder } from '../src/engine/RuntimeBoardBuilder';
import { RuntimeTile } from '../src/engine/RuntimeTile';
import { LevelSession } from '../src/engine/LevelSession';
import { LevelCompletionPipeline } from '../src/engine/LevelCompletionPipeline';
import { LevelFailurePipeline } from '../src/engine/LevelFailurePipeline';
import { ProgressionIntegration } from '../src/engine/ProgressionIntegration';
import { WorldPackHierarchy } from '../src/engine/WorldPackHierarchy';
import { ContentCache } from '../src/engine/ContentCache';
import { LevelErrorRecovery } from '../src/engine/LevelErrorRecovery';
import { AnalyticsService } from '../src/services/AnalyticsService';
import { LocalSaveService } from '../src/services/SaveService';
import { LocalEconomyService } from '../src/services/EconomyService';
import { BatchLevelGenerator } from '../src/engine/BatchLevelGenerator';

console.log('====================================================');
console.log('PHASE 09 — RUNTIME LEVEL DELIVERY & INTEGRATION TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ TEST ${totalTests.toString().padStart(2, '0')}: [PASSED] ${testName}`);
  } else {
    console.error(`  ❌ TEST ${totalTests.toString().padStart(2, '0')}: [FAILED] ${testName}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

async function runTestSuite() {
  const saveService = new LocalSaveService();
  const economyService = new LocalEconomyService();

  console.log('--- 1. RUNTIME LEVEL REGISTRY & CONTRACT TESTS ---');

  // Test 1: Approved Level Loading
  const lvl1 = RuntimeLevelRegistry.getLevel(1);
  assert(lvl1 !== null && lvl1.id === 1 && lvl1.version === 'v1.0', '1. Approved level lookup from registry');

  // Test 2: Sequential Lookups
  const nextLvlId = RuntimeLevelRegistry.getNextLevelId(1);
  const prevLvlId = RuntimeLevelRegistry.getPreviousLevelId(2);
  assert(nextLvlId === 2 && prevLvlId === 1, '2. Sequential next/previous level lookups');

  // Test 3: Unapproved / Invalid Level Rejection
  const invalidLvl: any = { id: 9999, version: 'v99.0', tiles: [] };
  const approvalValidation = RuntimeLevelRegistry.validateLevelApproval(invalidLvl);
  assert(!approvalValidation.valid, '3. Invalid level rejected by approval validation');

  console.log('\n--- 2. LEVEL LOADER & VALIDATION TESTS ---');

  // Test 4: Modular LevelLoader Success
  const loader = new LevelLoader();
  const loadRes1 = await loader.loadLevel(1);
  assert(loadRes1.success && loadRes1.state === 'READY' && !!loadRes1.session, '4. LevelLoader successful level load flow');

  // Test 5: Loader Rejection for Non-existent Level
  const loadResFail = await loader.loadLevel(999999);
  assert(!loadResFail.success && loadResFail.state === 'FAILED', '5. LevelLoader safely handles non-existent level');

  console.log('\n--- 3. RUNTIME BOARD BUILDER & TILE TESTS ---');

  // Test 6: RuntimeBoardBuilder
  const boardBuildRes = RuntimeBoardBuilder.buildBoard(lvl1!);
  assert(
    boardBuildRes.runtimeTiles.length === lvl1!.tiles.length &&
      boardBuildRes.bounds.width > 0 &&
      boardBuildRes.bounds.height > 0,
    '6. RuntimeBoardBuilder converts level tiles and computes bounds'
  );

  // Test 7: RuntimeTile State & Lifecycle
  const sampleTile = boardBuildRes.runtimeTiles[0];
  const initialTileState = sampleTile.state;
  sampleTile.transitionTo('SELECTED');
  assert((initialTileState === 'AVAILABLE' || initialTileState === 'BLOCKED') && sampleTile.state === 'SELECTED', '7. RuntimeTile lifecycle transition');

  console.log('\n--- 4. LEVEL SESSION & PIPELINE TESTS ---');

  // Test 8: Level Session State & Reset
  const session = new LevelSession(lvl1!);
  session.recordMove();
  session.updateScore(500);
  const movesRecorded = session.state.movesUsed;
  session.reset();
  assert(movesRecorded === 1 && session.state.movesUsed === 0 && session.state.score === 0, '8. LevelSession initialization and clean reset');

  // Test 9: Level Completion Pipeline & Progression Integration
  session.updateScore(3000);
  const completionPipeline = new LevelCompletionPipeline(new ProgressionIntegration(saveService, economyService));
  const completionOutput = completionPipeline.execute(session);
  assert(
    completionOutput.result.completed &&
      completionOutput.result.stars >= 1 &&
      completionOutput.progressionReport.unlockedLevelId >= 2,
    '9. LevelCompletionPipeline processes completion and unlocks next level'
  );

  // Test 10: Level Failure Pipeline
  const failSession = new LevelSession(lvl1!);
  const failureOutput = LevelFailurePipeline.execute(failSession, 'Tray Overflow');
  assert(!failureOutput.result.completed && failureOutput.reason === 'Tray Overflow', '10. LevelFailurePipeline generates safe failure result');

  console.log('\n--- 5. WORLD / PACK HIERARCHY & MAP TESTS ---');

  // Test 11: World & Map Node Status
  const testSave = saveService.loadSave();
  const nodeStatusLvl1 = WorldPackHierarchy.getLevelNodeStatus(1, testSave);
  const nodeStatusLvl2 = WorldPackHierarchy.getLevelNodeStatus(2, testSave);
  assert(
    nodeStatusLvl1.status === 'COMPLETED' || nodeStatusLvl1.status === 'PERFECT',
    '11. WorldPackHierarchy calculates node status for completed Level 1'
  );
  assert(
    nodeStatusLvl2.status === 'CURRENT' || nodeStatusLvl2.status === 'UNLOCKED',
    '12. WorldPackHierarchy calculates node status for unlocked Level 2'
  );

  console.log('\n--- 6. CONTENT CACHE, ANALYTICS & ERROR RECOVERY ---');

  // Test 13: ContentCache
  ContentCache.setLevel(lvl1!);
  assert(ContentCache.hasLevel(1) && ContentCache.getLevel(1) !== null, '13. ContentCache stores and retrieves approved level');

  // Test 14: Analytics Logging
  const analytics = AnalyticsService.getInstance();
  analytics.logEvent('level_started', { levelId: 1 });
  const events = analytics.getEventLog();
  assert(events.some((e) => e.event === 'level_started'), '14. AnalyticsService logs runtime level events');

  // Test 15: Error Recovery
  const errRecovery = LevelErrorRecovery.handleError({
    code: 'MISSING_LEVEL',
    levelId: 999,
    message: 'Level not found',
    recoverable: true,
  });
  assert(errRecovery.action === 'FALLBACK_LEVEL' && errRecovery.targetLevelId === 1, '15. LevelErrorRecovery handles missing level gracefully');

  console.log('\n--- 7. END-TO-END INTEGRATION TEST ---');

  // Test 16: Complete E2E Production Flow
  console.log('Executing E2E Flow: Phase 08 Approved Level -> Registry -> Loader -> Board -> Gameplay -> Completion -> Save -> Next Level');
  const e2eLoader = new LevelLoader();
  const e2eLoadRes = await e2eLoader.loadLevel(2);
  let e2ePassed = false;

  if (e2eLoadRes.success && e2eLoadRes.session) {
    const e2eSession = e2eLoadRes.session;
    e2eSession.updateScore(4500);
    const e2ePipeline = new LevelCompletionPipeline(new ProgressionIntegration(saveService, economyService));
    const e2eOutput = e2ePipeline.execute(e2eSession);

    const updatedSave = saveService.loadSave();
    if (e2eOutput.result.completed && updatedSave.highestLevelUnlocked >= 3) {
      e2ePassed = true;
    }
  }
  assert(e2ePassed, '16. Complete End-to-End Production Flow verified');

  console.log('\n--- 8. PERFORMANCE BENCHMARK TESTS ---');

  // Test 17: Board Build Performance for Normal and 90-Tile Large Board
  const perfStart = performance.now();
  for (let i = 1; i <= 20; i++) {
    const lvl = RuntimeLevelRegistry.getLevel(i);
    if (lvl) {
      RuntimeBoardBuilder.buildBoard(lvl);
    }
  }
  const perfTimeMs = Math.round(performance.now() - perfStart);
  assert(perfTimeMs < 100, '17. Performance benchmark: 20 board builds executed', `Completed in ${perfTimeMs}ms`);

  console.log('\n====================================================');
  console.log(`PHASE 09 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('✅ ALL PHASE 09 TESTS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error('❌ PHASE 09 TESTS FAILED!');
    process.exit(1);
  }
}

runTestSuite();
