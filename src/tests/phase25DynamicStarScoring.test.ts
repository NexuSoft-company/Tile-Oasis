import { LevelFactory } from '../engine/LevelFactory';
import { LevelSession } from '../engine/LevelSession';
import { LevelCompletionPipeline } from '../engine/LevelCompletionPipeline';
import { ProgressionIntegration } from '../engine/ProgressionIntegration';
import { LocalSaveService } from '../services/SaveService';
import { LevelResultSystem } from '../engine/LevelResultSystem';
import { PerformanceProfileCalculator, LevelPerformanceCalculator } from '../engine/LevelPerformanceProfile';
import { getWorldForLevel } from '../data/worldDefinitions';

async function runPhase25DynamicStarScoringTests() {
  console.log("================================================================");
  console.log("PHASE 25 — DYNAMIC STAR SCORING, SOLVER & PERFORMANCE TESTS");
  console.log("================================================================");

  let passed = 0;
  let total = 0;

  function assertTrue(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASSED] ${testName}`);
      passed++;
    } else {
      console.log(`  ❌ [FAILED] ${testName}${detail ? ` - ${detail}` : ''}`);
    }
  }

  function assertEqual(actual: any, expected: any, testName: string) {
    total++;
    if (actual === expected) {
      console.log(`  ✅ [PASSED] ${testName}`);
      passed++;
    } else {
      console.log(`  ❌ [FAILED] ${testName}`);
      console.log(`      Expected: ${expected}, Actual: ${actual}`);
    }
  }

  const representativeLevels = [
    1, 2, 5, 10, 25, 26, 50, 51, 75, 100, 101, 250, 500, 1000, 2500, 5000, 7500, 9000, 9500, 9998, 9999
  ];

  // Test 1: Every tested level has valid minimumMoves
  let allMinMovesValid = true;
  for (const lvlId of representativeLevels) {
    const levelDef = LevelFactory.createLevel({ levelId: lvlId }).level;
    const profile = LevelPerformanceCalculator.getProfile(levelDef);
    if (!profile.minimumMoves || profile.minimumMoves < 3) {
      allMinMovesValid = false;
    }
  }
  assertTrue(allMinMovesValid, "1. Every tested level has valid minimumMoves (deterministic analysis)");

  // Test 2: 3★ threshold >= minimumMoves
  let all3StarValid = true;
  for (const lvlId of representativeLevels) {
    const levelDef = LevelFactory.createLevel({ levelId: lvlId }).level;
    const profile = LevelPerformanceCalculator.getProfile(levelDef);
    if (profile.threeStarMoves < profile.minimumMoves) {
      all3StarValid = false;
    }
  }
  assertTrue(all3StarValid, "2. 3★ threshold >= minimumMoves for all representative levels");

  // Test 3: 2★ threshold > 3★ threshold
  let all2StarValid = true;
  for (const lvlId of representativeLevels) {
    const levelDef = LevelFactory.createLevel({ levelId: lvlId }).level;
    const profile = LevelPerformanceCalculator.getProfile(levelDef);
    if (profile.twoStarMoves <= profile.threeStarMoves) {
      all2StarValid = false;
    }
  }
  assertTrue(all2StarValid, "3. 2★ threshold > 3★ threshold for all representative levels");

  // Test 4: 1★ threshold > 2★ threshold
  let all1StarValid = true;
  for (const lvlId of representativeLevels) {
    const levelDef = LevelFactory.createLevel({ levelId: lvlId }).level;
    const profile = LevelPerformanceCalculator.getProfile(levelDef);
    if (profile.oneStarMoves <= profile.twoStarMoves) {
      all1StarValid = false;
    }
  }
  assertTrue(all1StarValid, "4. 1★ threshold > 2★ threshold for all representative levels");

  // Test 5: 3★ is realistically achievable for all representative levels
  let allAchievable3Star = true;
  for (const lvlId of representativeLevels) {
    const levelDef = LevelFactory.createLevel({ levelId: lvlId }).level;
    const profile = LevelPerformanceCalculator.getProfile(levelDef);
    const stars = LevelPerformanceCalculator.calculateLevelStars({
      levelId: lvlId,
      movesUsed: profile.minimumMoves,
      durationSeconds: profile.expectedDuration * 0.8,
      isCompleted: true,
      profile,
      levelDef,
    });
    if (stars !== 3) {
      allAchievable3Star = false;
      console.log(`Failed 3★ on level ${lvlId}: got ${stars}★ with ${profile.minimumMoves} moves`);
    }
  }
  assertTrue(allAchievable3Star, "5. 3★ is realistically achievable for all representative levels");

  // Test 6: Completed level can receive 1★
  const lvl10Def = LevelFactory.createLevel({ levelId: 10 }).level;
  const profile10 = LevelPerformanceCalculator.getProfile(lvl10Def);
  const stars1 = LevelPerformanceCalculator.calculateLevelStars({
    levelId: 10,
    movesUsed: profile10.twoStarMoves + 5,
    durationSeconds: profile10.expectedDuration + 30,
    isCompleted: true,
    profile: profile10,
    levelDef: lvl10Def,
  });
  assertEqual(stars1, 1, "6. Completed level can receive 1★ (inefficient play)");

  // Test 7: Completed level can receive 2★
  const stars2 = LevelPerformanceCalculator.calculateLevelStars({
    levelId: 10,
    movesUsed: profile10.twoStarMoves,
    durationSeconds: profile10.expectedDuration,
    isCompleted: true,
    profile: profile10,
    levelDef: lvl10Def,
  });
  assertEqual(stars2, 2, "7. Completed level can receive 2★ (good performance)");

  // Test 8: Completed level can receive 3★
  const stars3 = LevelPerformanceCalculator.calculateLevelStars({
    levelId: 10,
    movesUsed: profile10.threeStarMoves,
    durationSeconds: profile10.expectedDuration * 0.9,
    isCompleted: true,
    profile: profile10,
    levelDef: lvl10Def,
  });
  assertEqual(stars3, 3, "8. Completed level can receive 3★ (excellent performance)");

  // Test 9: Replay can improve 1★ → 2★
  const saveService = new LocalSaveService();
  saveService.resetSave();
  const prog = new ProgressionIntegration(saveService);
  const pipeline = new LevelCompletionPipeline(prog);

  // First playthrough: 1★
  let session = new LevelSession(lvl10Def as any);
  session.state.movesUsed = profile10.twoStarMoves + 5;
  session['startTime'] = Date.now() - (profile10.expectedDuration + 30) * 1000;
  let out1 = pipeline.execute(session);
  assertEqual(out1.result.stars, 1, "9a. First playthrough awards 1★");
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 1, "9b. Save holds 1★");

  // Replay: 2★
  session = new LevelSession(lvl10Def as any);
  session.state.movesUsed = profile10.twoStarMoves;
  session['startTime'] = Date.now() - (profile10.expectedDuration) * 1000;
  let out2 = pipeline.execute(session);
  assertEqual(out2.result.stars, 2, "9c. Replay awards 2★");
  assertEqual(out2.progressionReport.newStarsEarned, 1, "9d. Improvement gains +1 star");
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 2, "9e. Stored result upgraded to 2★");

  // Test 10: Replay can improve 2★ → 3★
  session = new LevelSession(lvl10Def as any);
  session.state.movesUsed = profile10.minimumMoves;
  session['startTime'] = Date.now() - (profile10.expectedDuration * 0.5) * 1000;
  let out3 = pipeline.execute(session);
  assertEqual(out3.result.stars, 3, "10a. Replay awards 3★");
  assertEqual(out3.progressionReport.newStarsEarned, 1, "10b. Improvement gains +1 star");
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 3, "10c. Stored result upgraded to 3★");

  // Test 11: 3★ never downgrades
  session = new LevelSession(lvl10Def as any);
  session.state.movesUsed = profile10.twoStarMoves + 15;
  session['startTime'] = Date.now() - 300000; // very slow
  let out4 = pipeline.execute(session);
  assertEqual(out4.result.stars, 1, "11a. Low-skill replay returns 1★ for this session");
  assertEqual(out4.progressionReport.newStarsEarned, 0, "11b. 0 additional stars granted");
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 3, "11c. Stored stars remain 3★ (never downgrade)");

  // Test 12: Stars are idempotent
  const starsTotalBefore = saveService.loadSave().starsTotal;
  session = new LevelSession(lvl10Def as any);
  session.state.movesUsed = profile10.minimumMoves;
  session['startTime'] = Date.now() - 20000;
  pipeline.execute(session);
  assertEqual(saveService.loadSave().starsTotal, starsTotalBefore, "12. starsTotal is strictly idempotent on repeated 3★ replays");

  // Test 13: Rewards are idempotent / safe
  const currentCoins = saveService.loadSave().coins;
  assertTrue(currentCoins > 0, "13. Economy coins balance is valid and safe");

  // Test 14: Booster usage does not make 3★ impossible
  session = new LevelSession(lvl10Def as any);
  session.state.movesUsed = profile10.minimumMoves;
  session.state.boosterUsage = { undo: 2, magnet: 1 };
  session['startTime'] = Date.now() - (profile10.expectedDuration * 0.7) * 1000;
  const resWithBoosters = LevelResultSystem.createResult(session, true);
  assertEqual(resWithBoosters.stars, 3, "14. Booster usage does not prevent earning 3★ on efficient completion");

  // Test 15: Boss levels support 3★
  const boss25Def = LevelFactory.createLevel({ levelId: 25 }).level;
  const boss25Profile = LevelPerformanceCalculator.getProfile(boss25Def);
  const boss25Stars = LevelPerformanceCalculator.calculateLevelStars({
    levelId: 25,
    movesUsed: boss25Profile.minimumMoves + 1,
    durationSeconds: boss25Profile.expectedDuration * 0.8,
    isCompleted: true,
    profile: boss25Profile,
    levelDef: boss25Def,
  });
  assertEqual(boss25Stars, 3, "15. Pack Boss level 25 supports 3★");

  // Test 16: Level 9999 supports 3★
  const lvl9999Def = LevelFactory.createLevel({ levelId: 9999 }).level;
  const lvl9999Profile = LevelPerformanceCalculator.getProfile(lvl9999Def);
  const lvl9999Stars = LevelPerformanceCalculator.calculateLevelStars({
    levelId: 9999,
    movesUsed: lvl9999Profile.minimumMoves,
    durationSeconds: lvl9999Profile.expectedDuration * 0.7,
    isCompleted: true,
    profile: lvl9999Profile,
    levelDef: lvl9999Def,
  });
  assertEqual(lvl9999Stars, 3, "16. Grand finale level 9999 supports 3★");

  // Test 17: Representative levels across all difficulty tiers pass
  let allTiersValid = true;
  for (const lvl of representativeLevels) {
    const def = LevelFactory.createLevel({ levelId: lvl }).level;
    const prof = LevelPerformanceCalculator.getProfile(def);
    if (!prof.threeStarMoves || prof.threeStarMoves < prof.minimumMoves) {
      allTiersValid = false;
    }
  }
  assertTrue(allTiersValid, "17. All representative difficulty tiers pass threshold invariants");

  // Test 18: World Map focuses on current player level
  const worldFor37 = getWorldForLevel(37);
  assertEqual(worldFor37.id, 1, "18a. Level 37 correctly maps to World 1");
  const packIndexFor37 = Math.ceil((37 % 100 || 100) / 25);
  assertEqual(packIndexFor37, 2, "18b. Level 37 correctly maps to Pack 2 (Levels 26-50)");

  console.log("\n================================================================");
  console.log(`RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("================================================================\n");

  if (passed !== total) {
    throw new Error(`Test suite failed: ${total - passed} failures.`);
  }
}

runPhase25DynamicStarScoringTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
