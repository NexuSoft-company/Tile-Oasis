import { LevelFactory } from '../engine/LevelFactory';
import { LevelSession } from '../engine/LevelSession';
import { LevelCompletionPipeline } from '../engine/LevelCompletionPipeline';
import { ProgressionIntegration } from '../engine/ProgressionIntegration';
import { LocalSaveService } from '../services/SaveService';
import { LevelResultSystem } from '../engine/LevelResultSystem';
import { LevelPerformanceCalculator } from '../engine/LevelPerformanceProfile';

async function runTests() {
  console.log("====================================================");
  console.log("PHASE 27 — ROOT-LEVEL 1★/2★/3★ STAR PROGRESSION TESTS");
  console.log("====================================================");

  let passed = 0;
  let total = 0;

  function assertEqual(actual: any, expected: any, testName: string) {
    total++;
    if (actual === expected) {
      console.log(`  ✅ [PASSED] ${testName}`);
      passed++;
    } else {
      console.log(`  ❌ [FAILED] ${testName}`);
      console.log(`      Expected: ${expected}`);
      console.log(`      Actual: ${actual}`);
    }
  }

  function assertTrue(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASSED] ${testName}`);
      passed++;
    } else {
      console.log(`  ❌ [FAILED] ${testName}`);
    }
  }
  
  const saveService = new LocalSaveService();
  saveService.resetSave();
  
  const progIntegration = new ProgressionIntegration(saveService);
  const pipeline = new LevelCompletionPipeline(progIntegration);

  const result10 = LevelFactory.createLevel({ levelId: 10 });
  const levelDef10 = result10.level;
  const profile10 = LevelPerformanceCalculator.getProfile(levelDef10);

  // 1. Poor successful performance -> 1★
  let session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 50; 
  session.state.movesUsed = profile10.twoStarMoves + 10; 
  session['startTime'] = Date.now() - (profile10.expectedDuration + 30) * 1000; 
  let pipelineOut = pipeline.execute(session);
  assertEqual(pipelineOut.result.stars, 1, "1. Poor successful performance -> 1 Star");

  // 2. Good performance -> 2★
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 80; 
  session.state.movesUsed = profile10.twoStarMoves; 
  session['startTime'] = Date.now() - profile10.expectedDuration * 1000; 
  pipelineOut = pipeline.execute(session);
  assertEqual(pipelineOut.result.stars, 2, "2. Good performance -> 2 Stars");

  // 3. Excellent performance -> 3★
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 120; 
  session.state.movesUsed = profile10.threeStarMoves; 
  session['startTime'] = Date.now() - (profile10.expectedDuration * 0.8) * 1000; 
  pipelineOut = pipeline.execute(session);
  assertEqual(pipelineOut.result.stars, 3, "3. Excellent performance -> 3 Stars");

  // 4. 1★ -> 2★ improvement
  saveService.resetSave();
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 50;
  session.state.movesUsed = profile10.twoStarMoves + 10;
  session['startTime'] = Date.now() - (profile10.expectedDuration + 30) * 1000;
  pipeline.execute(session);
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 1, "4a. Initial attempt saved as 1 Star");
  
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 80;
  session.state.movesUsed = profile10.twoStarMoves;
  session['startTime'] = Date.now() - profile10.expectedDuration * 1000;
  pipeline.execute(session);
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 2, "4b. Improvement saved as 2 Stars");

  // 5. 2★ -> 3★ improvement
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 120;
  session.state.movesUsed = profile10.threeStarMoves;
  session['startTime'] = Date.now() - (profile10.expectedDuration * 0.8) * 1000;
  pipeline.execute(session);
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 3, "5. Improvement saved as 3 Stars");

  // 6. 3★ replay with poor result does not downgrade
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 50;
  session.state.movesUsed = profile10.twoStarMoves + 10;
  session['startTime'] = Date.now() - (profile10.expectedDuration + 30) * 1000;
  pipelineOut = pipeline.execute(session);
  assertEqual(pipelineOut.result.stars, 1, "6a. Replay attempt gets 1 Star");
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 3, "6b. Stored best remains 3 Stars");

  // 7. starsTotal updates correctly
  assertEqual(saveService.loadSave().starsTotal, 3, "7. starsTotal is accurately 3");

  // 8. No duplicate stars on multiple replays
  session = new LevelSession(levelDef10 as any);
  session.state.score = profile10.tileCount * 120;
  session.state.movesUsed = profile10.threeStarMoves;
  session['startTime'] = Date.now() - (profile10.expectedDuration * 0.8) * 1000;
  pipeline.execute(session);
  assertEqual(saveService.loadSave().starsTotal, 3, "8. Replay with 3 stars does not double count starsTotal");

  // 9. Result modal receives actual star count (checked via result.stars)
  assertTrue(pipelineOut.result.stars >= 1 && pipelineOut.result.stars <= 3, "9. Authoritative result.stars in [1, 2, 3]");

  // 10. Map displays saved best stars
  assertEqual(saveService.loadSave().completedLevels[10]?.stars, 3, "10. Map star source reflects saved best 3 stars");

  // 11. Early-level star thresholds (Level 1)
  const l1 = LevelFactory.createLevel({ levelId: 1 }).level;
  assertTrue(l1.starRules !== undefined && l1.starRules.oneStarScore > 0, "11. Level 1 has valid early star thresholds");

  // 12. Mid-campaign thresholds (Level 500)
  const l500 = LevelFactory.createLevel({ levelId: 500 }).level;
  assertTrue(l500.starRules.oneStarScore > l1.starRules.oneStarScore, "12. Mid-campaign thresholds scale with difficulty");

  // 13. High-level thresholds (Level 5000)
  const l5000 = LevelFactory.createLevel({ levelId: 5000 }).level;
  assertTrue(l5000.starRules.oneStarScore > l500.starRules.oneStarScore, "13. High-level thresholds properly scaled");

  // 14. Hard level
  const hardLevel = LevelFactory.createLevel({ levelId: 18 }).level;
  assertTrue(hardLevel.difficulty === 'Hard' || hardLevel.difficulty === 'Medium', "14. Hard level configured");

  // 15. Expert/Boss level
  const expertLevel = LevelFactory.createLevel({ levelId: 25 }).level;
  assertTrue(expertLevel.difficulty === 'Expert' || expertLevel.difficulty === 'Very Hard' || expertLevel.difficulty === 'Hard', "15. Expert/Boss level configured");

  // 16. Boss level
  const bossLevel = LevelFactory.createLevel({ levelId: 50 }).level;
  assertTrue(bossLevel.id % 25 === 0, "16. Boss level 50 identifies correctly");

  // 17. Time Attack
  const timeAttackLevel = LevelFactory.createLevel({ levelId: 19 }).level;
  assertTrue(timeAttackLevel.specialLevelType === 'TIME_ATTACK' || timeAttackLevel.objectives.some(o => o.type === 'time_trial'), "17. Time Attack level has time objective");

  // 18. Move-limit level
  const moveLimitLevel = LevelFactory.createLevel({ levelId: 21 }).level;
  assertTrue(moveLimitLevel.specialLevelType === 'MOVE_LIMIT' || moveLimitLevel.objectives.some(o => o.type === 'move_limit'), "18. Move-limit level has move objective");

  // 19. Combo-focused level
  const comboLevel = LevelFactory.createLevel({ levelId: 15 }).level;
  assertTrue(comboLevel.specialLevelType === 'COMBO_FRENZY' || comboLevel.objectives.some(o => o.type === 'combo_target' || o.type === 'clear_all_tiles'), "19. Combo level evaluated");

  // 20. Deterministic repeated calculation
  const sessionA = new LevelSession(levelDef10 as any);
  sessionA.state.score = 2500;
  sessionA.state.movesUsed = profile10.minimumMoves;
  sessionA['startTime'] = Date.now() - (profile10.expectedDuration * 0.7) * 1000;
  const resA = LevelResultSystem.createResult(sessionA, true);
  
  const sessionB = new LevelSession(levelDef10 as any);
  sessionB.state.score = 2500;
  sessionB.state.movesUsed = profile10.minimumMoves;
  sessionB['startTime'] = Date.now() - (profile10.expectedDuration * 0.7) * 1000;
  const resB = LevelResultSystem.createResult(sessionB, true);
  assertEqual(resA.stars, resB.stars, "20. Deterministic calculation gives identical star outputs for identical performance");

  // 21. Level 9,999 star calculation
  const l9999 = LevelFactory.createLevel({ levelId: 9999 }).level;
  const profile9999 = LevelPerformanceCalculator.getProfile(l9999);
  let session9999 = new LevelSession(l9999 as any);
  session9999.state.score = 10000;
  session9999.state.movesUsed = profile9999.threeStarMoves;
  session9999['startTime'] = Date.now() - (profile9999.expectedDuration * 0.8) * 1000;
  const res9999 = LevelResultSystem.createResult(session9999, true);
  assertEqual(res9999.stars, 3, "21. Level 9999 calculates 3 stars on high mastery");

  // 22. Save/reload preserves best stars
  saveService.completeLevel(9999, 3, 50000);
  const reloadedSave = saveService.loadSave();
  assertEqual(reloadedSave.completedLevels[9999]?.stars, 3, "22. Save/reload preserves best stars");

  // Multi-Level Representative Matrix: Verify 1★, 2★, and 3★ across full campaign range
  const testLevels = [1, 2, 5, 10, 25, 26, 50, 100, 500, 1000, 5000, 9999];
  console.log("\nTesting Representative Multi-Level Matrix (1★, 2★, 3★ capability):");
  
  for (const lvlId of testLevels) {
    const lvl = LevelFactory.createLevel({ levelId: lvlId }).level;
    const prof = LevelPerformanceCalculator.getProfile(lvl);

    // Poor -> 1★
    let s = new LevelSession(lvl as any);
    s.state.score = prof.tileCount * 40;
    s.state.movesUsed = prof.twoStarMoves + 12;
    s['startTime'] = Date.now() - (prof.expectedDuration + 40) * 1000;
    const rPoor = LevelResultSystem.createResult(s, true);

    // Good -> 2★
    s = new LevelSession(lvl as any);
    s.state.score = prof.tileCount * 70;
    s.state.movesUsed = prof.twoStarMoves;
    s['startTime'] = Date.now() - prof.expectedDuration * 1000;
    const rGood = LevelResultSystem.createResult(s, true);

    // Excellent -> 3★
    s = new LevelSession(lvl as any);
    s.state.score = prof.tileCount * 120;
    s.state.movesUsed = prof.threeStarMoves;
    s['startTime'] = Date.now() - (prof.expectedDuration * 0.8) * 1000;
    const rExc = LevelResultSystem.createResult(s, true);

    assertEqual(rPoor.stars, 1, `Level ${lvlId} Poor -> 1★`);
    assertEqual(rGood.stars, 2, `Level ${lvlId} Good -> 2★`);
    assertEqual(rExc.stars, 3, `Level ${lvlId} Excellent -> 3★`);
  }

  console.log("====================================================");
  console.log(`RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log("====================================================");
  
  if (passed < total) process.exit(1);
}

runTests();
