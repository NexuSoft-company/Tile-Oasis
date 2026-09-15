import { LevelFactory } from '../engine/LevelFactory';
import { LevelSession } from '../engine/LevelSession';
import { LevelCompletionPipeline } from '../engine/LevelCompletionPipeline';
import { ProgressionIntegration } from '../engine/ProgressionIntegration';
import { LocalSaveService } from '../services/SaveService';
import { LevelResultSystem } from '../engine/LevelResultSystem';
import { DifficultyCurve } from '../engine/DifficultyCurve';
import { PerformanceProfileCalculator } from '../engine/LevelPerformanceProfile';

async function runPhase25Tests() {
  console.log("================================================================");
  console.log("PHASE 25 — AUTHORITATIVE 1★/2★/3★ STAR PROGRESSION VERIFICATION");
  console.log("================================================================");

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

  function assertTrue(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASSED] ${testName}`);
      passed++;
    } else {
      console.log(`  ❌ [FAILED] ${testName} ${detail || ''}`);
    }
  }

  const saveService = new LocalSaveService();
  saveService.resetSave();
  
  const progIntegration = new ProgressionIntegration(saveService);
  const pipeline = new LevelCompletionPipeline(progIntegration);

  const lvl25Def = LevelFactory.createLevel({ levelId: 25 }).level;
  const tCount25 = Math.floor(lvl25Def.tiles.length / 3);

  // 1. Completed level always gives >= 1★
  let session = new LevelSession(lvl25Def as any);
  session.state.score = tCount25 * 100;
  session.state.movesUsed = Math.floor(tCount25 * 1.4);
  session['startTime'] = Date.now() - (tCount25 * 5.0 * 1000);
  let res = LevelResultSystem.createResult(session, true);
  assertTrue(res.stars >= 1, "1. Completed level always gives >= 1★");

  // 2. Good performance gives 2★
  const profile25 = PerformanceProfileCalculator.calculateProfile(lvl25Def);
  session = new LevelSession(lvl25Def as any);
  session.state.score = tCount25 * 180;
  session.state.movesUsed = profile25.twoStarMoveThreshold;
  session['startTime'] = Date.now() - (profile25.twoStarTimeThresholdSeconds * 1000);
  res = LevelResultSystem.createResult(session, true);
  assertEqual(res.stars, 2, "2. Good performance gives 2★");

  // 3. Excellent performance gives 3★
  session = new LevelSession(lvl25Def as any);
  session.state.score = tCount25 * 250;
  session.state.movesUsed = profile25.minimumMoves;
  session['startTime'] = Date.now() - (profile25.expectedDurationSeconds * 0.7 * 1000);
  res = LevelResultSystem.createResult(session, true);
  assertEqual(res.stars, 3, "3. Excellent performance gives 3★");

  // 4. 1★ cannot exceed 3★
  session = new LevelSession(lvl25Def as any);
  session.state.score = 9999999;
  session.state.movesUsed = 1;
  session['startTime'] = Date.now() - 1000;
  res = LevelResultSystem.createResult(session, true);
  assertTrue(res.stars <= 3, "4. Star count is clamped to max 3★");

  // 5. Replay cannot downgrade 3★
  saveService.resetSave();
  saveService.completeLevel(25, 3, 10000);
  saveService.completeLevel(25, 1, 3000);
  assertEqual(saveService.loadSave().completedLevels[25]?.stars, 3, "5. Replay cannot downgrade 3★");

  // 6. Replay cannot downgrade 2★
  saveService.resetSave();
  saveService.completeLevel(25, 2, 6000);
  saveService.completeLevel(25, 1, 3000);
  assertEqual(saveService.loadSave().completedLevels[25]?.stars, 2, "6. Replay cannot downgrade 2★");

  // 7. 1★ → 2★ increases starsTotal by exactly 1
  saveService.resetSave();
  saveService.completeLevel(1, 1, 1000);
  assertEqual(saveService.loadSave().starsTotal, 1, "7a. 1★ gives 1 starsTotal");
  saveService.completeLevel(1, 2, 2000);
  assertEqual(saveService.loadSave().starsTotal, 2, "7b. 1★ -> 2★ increases starsTotal by exactly 1");

  // 8. 2★ → 3★ increases starsTotal by exactly 1
  saveService.completeLevel(1, 3, 3000);
  assertEqual(saveService.loadSave().starsTotal, 3, "8. 2★ -> 3★ increases starsTotal by exactly 1");

  // 9. Same-star replay does not increase starsTotal
  saveService.completeLevel(1, 3, 3500);
  assertEqual(saveService.loadSave().starsTotal, 3, "9. Same-star replay does not increase starsTotal");

  // 10. Failed level gives 0★
  session = new LevelSession(lvl25Def as any);
  const failRes = LevelResultSystem.createResult(session, false, "Tray Overflow");
  assertEqual(failRes.stars, 0, "10. Failed level gives 0★");

  // 11. Time Attack star calculation works
  const timeAttackLvl = LevelFactory.createLevel({ levelId: 19 }).level;
  const profile19 = PerformanceProfileCalculator.calculateProfile(timeAttackLvl);
  let sTA = new LevelSession(timeAttackLvl as any);
  sTA.state.score = profile19.tileCount * 150;
  sTA.state.movesUsed = profile19.minimumMoves;
  sTA['startTime'] = Date.now() - 15000; // fast clear
  const taRes = LevelResultSystem.createResult(sTA, true);
  assertEqual(taRes.stars, 3, "11. Time Attack star calculation awards 3★ for fast clear");

  // 12. Different difficulty levels use appropriate thresholds
  const l1 = LevelFactory.createLevel({ levelId: 1 }).level;
  const l50 = LevelFactory.createLevel({ levelId: 50 }).level;
  assertTrue(l1.starRules.oneStarScore < l50.starRules.oneStarScore, "12. Harder levels scale star score requirements");

  // 13. Level Result Modal receives the actual calculated star count
  let pipelineOut = pipeline.execute(sTA);
  assertEqual(pipelineOut.result.stars, 3, "13. Level Result Modal receives actual calculated star count");

  // 14. World Map reads bestStars correctly
  saveService.completeLevel(25, 2, 6000);
  const savedData = saveService.loadSave();
  assertEqual(savedData.completedLevels[25]?.stars, 2, "14. World Map data reflects true saved best stars");

  // 15. Level 9,999 supports the same star system
  const l9999 = LevelFactory.createLevel({ levelId: 9999 }).level;
  const profile9999 = PerformanceProfileCalculator.calculateProfile(l9999);
  let s9999 = new LevelSession(l9999 as any);
  s9999.state.score = profile9999.tileCount * 150;
  s9999.state.movesUsed = profile9999.minimumMoves;
  s9999['startTime'] = Date.now() - (profile9999.expectedDurationSeconds * 0.7 * 1000);
  const r9999 = LevelResultSystem.createResult(s9999, true);
  assertEqual(r9999.stars, 3, "15. Level 9,999 supports 3★ achievement");

  // 16. Deterministic star calculation
  const sDet1 = new LevelSession(lvl25Def as any);
  sDet1.state.score = 3000;
  sDet1.state.movesUsed = 12;
  sDet1['startTime'] = Date.now() - 20000;
  const sDet2 = new LevelSession(lvl25Def as any);
  sDet2.state.score = 3000;
  sDet2.state.movesUsed = 12;
  sDet2['startTime'] = Date.now() - 20000;
  assertEqual(LevelResultSystem.createResult(sDet1, true).stars, LevelResultSystem.createResult(sDet2, true).stars, "16. Star calculation is 100% deterministic");

  // 17. No negative or invalid star values
  assertTrue(res.stars >= 0 && res.stars <= 3, "17. Stars bounded in [0, 3]");

  // 18. Save/reload preserves best stars
  saveService.completeLevel(9999, 3, 50000);
  const reloaded = saveService.loadSave();
  assertEqual(reloaded.completedLevels[9999]?.stars, 3, "18. Save/reload preserves best stars");

  // 19. Corrupted star values are sanitized
  const rawSave = saveService.loadSave();
  rawSave.completedLevels[50] = { levelId: 50, stars: 99, highScore: 1000 } as any;
  saveService.saveData(rawSave);
  const sanitized = saveService.loadSave();
  assertTrue(sanitized.completedLevels[50].stars <= 3, "19. Corrupted star values clamped to 3★");

  // 20. 100 representative campaign levels produce valid 1-3★ results
  console.log("\nTesting 100 representative campaign levels across worlds 1 to 100:");
  let repPassed = 0;
  for (let i = 1; i <= 100; i++) {
    const lvlId = i * 99; // sampling up to ~9900
    const lvl = LevelFactory.createLevel({ levelId: lvlId }).level;
    const tCount = Math.floor(lvl.tiles.length / 3);
    let s = new LevelSession(lvl as any);
    s.state.score = tCount * 180;
    s.state.movesUsed = Math.floor(tCount * 0.7);
    s['startTime'] = Date.now() - (tCount * 2500);
    const r = LevelResultSystem.createResult(s, true);
    if (r.stars >= 1 && r.stars <= 3) {
      repPassed++;
    }
  }
  assertEqual(repPassed, 100, "20. 100 representative campaign levels produce valid 1-3★ results");

  console.log("================================================================");
  console.log(`RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log("================================================================");

  if (passed < total) process.exit(1);
}

runPhase25Tests();
