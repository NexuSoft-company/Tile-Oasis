import { LevelResultSystem } from '../src/engine/LevelResultSystem';
import { ScoreSystem } from '../src/engine/ScoreSystem';
import { ProgressionIntegration } from '../src/engine/ProgressionIntegration';
import { generateLevelDefinition } from '../src/data/levelDefinitions';
import { LocalSaveService } from '../src/services/SaveService';
import { LevelSession } from '../src/engine/LevelSession';

// Simple mock for LevelSession to test result generation
class MockSession {
  public levelDef: any;
  public state: any;
  public elapsedTime: number;
  
  constructor(levelId: number, score: number, moves: number, tilesCount: number = 30) {
    this.levelDef = generateLevelDefinition(levelId);
    // Remove predefined starRules so we test the dynamic fallback calculation
    delete this.levelDef.starRules;
    // Override tiles count for deterministic star math
    this.levelDef.tiles = Array(tilesCount).fill({ typeId: 1 });
    this.state = {
      score,
      movesUsed: moves,
      boosterUsage: {},
      tilesMatchedCount: tilesCount
    };
    this.elapsedTime = 30;
  }
  
  getElapsedTimeSeconds() { return this.elapsedTime; }
}

async function runTests() {
  console.log("====================================================");
  console.log("PHASE 25 — STAR RATING LOGIC & MAP FOCUS TEST SUITE");
  console.log("====================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`  ✅ TEST ${total < 10 ? '0'+total : total}: [PASSED] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ TEST ${total < 10 ? '0'+total : total}: [FAILED] ${message}`);
    }
  }

  // --- 1. STAR CALCULATION TESTS ---
  console.log("--- 1. STAR CALCULATION TESTS ---");
  
  // 30 tiles = 10 matches. Base points = 150. Max possible pure base = 1500.
  // 3 star threshold = 10 * 150 * 3 = 4500
  // 2 star threshold = 10 * 150 * 1.5 = 2250
  // We apply move efficiency.
  
  // Poor performance
  const sessionPoor = new MockSession(1, 1000, 30, 30) as any;
  const resPoor = LevelResultSystem.createResult(sessionPoor, true);
  assert(resPoor.stars === 1, "Successful poor-performance level -> 1 star");

  // Good performance
  const sessionGood = new MockSession(2, 2000, 20, 30) as any;
  const resGood = LevelResultSystem.createResult(sessionGood, true);
  assert(resGood.stars === 2, "Good performance -> 2 stars");

  // Excellent performance
  const sessionExcellent = new MockSession(3, 3000, 10, 30) as any; // move efficiency multiplier
  const resExcellent = LevelResultSystem.createResult(sessionExcellent, true);
  assert(resExcellent.stars === 3, "Excellent performance -> 3 stars");

  // --- 2. PROGRESSION & SAVED STARS TESTS ---
  console.log("\n--- 2. PROGRESSION & BEST STAR PERSISTENCE TESTS ---");
  const saveService = new LocalSaveService();
  const prog = new ProgressionIntegration(saveService);

  // Achieve 3 stars on Level 10
  saveService.completeLevel(10, 3, 5000);
  assert(saveService.loadSave().completedLevels[10].stars === 3, "Level 10 achieved 3 stars");
  
  // Replay Level 10, get 1 star
  saveService.completeLevel(10, 1, 1000);
  assert(saveService.loadSave().completedLevels[10].stars === 3, "Replay 3-star level with 1 star -> remains 3");

  // Achieve 1 star on Level 11
  saveService.completeLevel(11, 1, 1000);
  assert(saveService.loadSave().completedLevels[11].stars === 1, "Level 11 achieved 1 star");

  // Replay Level 11, get 2 stars
  saveService.completeLevel(11, 2, 2000);
  assert(saveService.loadSave().completedLevels[11].stars === 2, "Replay 1-star level with 2 stars -> upgrades to 2");

  // Replay Level 11, get 3 stars
  saveService.completeLevel(11, 3, 5000);
  assert(saveService.loadSave().completedLevels[11].stars === 3, "Replay 2-star level with 3 stars -> upgrades to 3");

  // Check starsTotal
  // Lvl 10 (3) + Lvl 11 (3) = 6
  assert(saveService.loadSave().starsTotal === 6, "starsTotal remains correct");

  // No duplicate rewards test (simulated by checking if the base progression report only grants new stars)
  const rep1 = prog.processLevelCompletion({ levelId: 12, stars: 3, completed: true, score: 5000, movesUsed: 10, timeUsedSeconds: 30, boostersUsed: {}, tilesMatched: 30, objectivesCompleted: true, rewardsEarned: { coins: 10, gems: 0, boostersGranted: {}, stars: 3, expPoints: 0 }, completionTimestamp: 0, version: 'v1.0', worldId: 1, packId: 'w1p1' });
  assert(rep1.newStarsEarned === 3, "New level grants 3 new stars");
  
  const rep2 = prog.processLevelCompletion({ levelId: 12, stars: 2, completed: true, score: 2000, movesUsed: 10, timeUsedSeconds: 30, boostersUsed: {}, tilesMatched: 30, objectivesCompleted: true, rewardsEarned: { coins: 10, gems: 0, boostersGranted: {}, stars: 2, expPoints: 0 }, completionTimestamp: 0, version: 'v1.0', worldId: 1, packId: 'w1p1' });
  assert(rep2.newStarsEarned === 0, "Replay with lower stars grants 0 new stars");

  // --- 3. MAP FOCUS LOGIC TESTS ---
  console.log("\n--- 3. MAP FOCUS LOGIC TESTS ---");
  
  // Logic from WorldMapView:
  // Math.ceil((saveData.highestLevelUnlocked % 100 || 100) / 25)
  const getPackIndex = (lvl: number) => {
     let worldLvl = lvl % 100;
     if (worldLvl === 0) worldLvl = 100;
     return Math.ceil(worldLvl / 25);
  };
  
  assert(getPackIndex(1) === 1, "Current level = 1 -> pack 1");
  assert(getPackIndex(25) === 1, "Current level = 25 -> pack 1");
  assert(getPackIndex(26) === 2, "Current level = 26 -> pack 2");
  assert(getPackIndex(50) === 2, "Current level = 50 -> pack 2");
  assert(getPackIndex(51) === 3, "Current level = 51 -> pack 3");
  assert(getPackIndex(100) === 4, "Current level = 100 -> pack 4");
  assert(getPackIndex(500) === 4, "Current level = 500 -> pack 4");
  assert(getPackIndex(1000) === 4, "Current level = 1000 -> pack 4");
  assert(getPackIndex(5000) === 4, "Current level = 5000 -> pack 4");
  assert(getPackIndex(9999) === 4, "Current level = 9999 -> pack 4");

  const getWorldIndex = (lvl: number) => Math.ceil(lvl / 100);
  assert(getWorldIndex(26) === 1, "Level 26 -> world 1");
  assert(getWorldIndex(101) === 2, "Level 101 -> world 2");
  assert(getWorldIndex(9999) === 100, "Level 9999 -> world 100");

  console.log("\n====================================================");
  console.log(`PHASE 25 TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log("====================================================");
  
  if (passed === total) {
    console.log("✅ ALL PHASE 25 TESTS PASSED PERFECTLY!");
    process.exit(0);
  } else {
    console.error("❌ SOME TESTS FAILED");
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
