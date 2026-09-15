import { globalMissionService } from '../services/MissionService';
import { globalSaveService } from '../services/SaveService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalProfileService } from '../services/PlayerProfileService';
import { globalPlayerProgressionService } from '../services/PlayerProgressionService';
import { INITIAL_MISSIONS } from '../data/metaDefinitions';

async function runTests() {
  console.log("====================================================");
  console.log("PHASE 26 — DAILY MISSION REWARD WALLET TESTS");
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

  // RESET
  globalSaveService.resetSave();
  const eco = new LocalEconomyService(globalSaveService);

  // Initial State
  const initialCoins = eco.getCoins();
  const initialGems = eco.getGems();
  const initialXp = globalPlayerProgressionService.getPlayerXp();
  
  // Test 1: Incomplete mission cannot be claimed
  let res = globalMissionService.claimMissionReward('m_complete_3_levels');
  assertEqual(res.success, false, "Incomplete mission cannot be claimed");

  // Complete mission
  // 'm_complete_3_levels' requires 3 levels
  globalMissionService.onGameplayEvent('level_completed', 3);
  
  const m1 = globalMissionService.getMissions().find(m => m.definition.id === 'm_complete_3_levels');
  assertEqual(m1?.state.isCompleted, true, "Mission marked completed after gameplay events");

  // Modify INITIAL_MISSIONS to include XP reward for the test
  const mDef = INITIAL_MISSIONS.find(m => m.id === 'm_complete_3_levels');
  if (mDef) mDef.rewardXp = 50;

  // Test 2: Completed mission can be claimed & rewards granted
  res = globalMissionService.claimMissionReward('m_complete_3_levels');
  assertEqual(res.success, true, "Completed mission can be claimed");
  
  // Verify economy
  assertEqual(eco.getCoins(), initialCoins + 150, "Coin reward increases authoritative wallet");
  assertEqual(eco.getGems(), initialGems + 10, "Gem reward increases authoritative wallet");
  assertEqual(eco.getBoosterCount('undo'), 3 + 1, "Booster reward increases authoritative inventory");
  assertEqual(globalPlayerProgressionService.getPlayerXp(), initialXp + 50, "XP reward increases player XP");

  // Test 3: Duplicate claim does not grant twice
  let res2 = globalMissionService.claimMissionReward('m_complete_3_levels');
  assertEqual(res2.success, false, "Duplicate claim returns false");
  assertEqual(eco.getCoins(), initialCoins + 150, "Duplicate claim does not increase coins");
  assertEqual(globalPlayerProgressionService.getPlayerXp(), initialXp + 50, "Duplicate claim does not increase XP");

  // Test 4: Reload app and verify persistence
  // Re-instantiate services to simulate reload
  const eco2 = new LocalEconomyService(globalSaveService);
  assertEqual(eco2.getCoins(), initialCoins + 150, "Coin reward persists after reload");
  assertEqual(eco2.getGems(), initialGems + 10, "Gem reward persists after reload");
  assertEqual(eco2.getBoosterCount('undo'), 4, "Booster reward persists after reload");
  
  const profile2 = globalProfileService.getProfile();
  const loadedMission = profile2.missionProgress['m_complete_3_levels'];
  assertEqual(loadedMission?.isClaimed, true, "Mission remains claimed after reload");
  
  // XP persistence check
  assertEqual(globalPlayerProgressionService.getPlayerXp(), initialXp + 50, "XP reward persists after reload");

  console.log("====================================================");
  console.log(`RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log("====================================================");
  
  if (passed < total) process.exit(1);
}

runTests();
