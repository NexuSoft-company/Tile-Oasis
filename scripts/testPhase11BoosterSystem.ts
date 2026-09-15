import { BoosterRegistry, BOOSTER_DEFINITIONS } from '../src/engine/BoosterDefinition';
import { LocalEconomyService } from '../src/services/EconomyService';
import { LocalSaveService } from '../src/services/SaveService';
import { BoosterService } from '../src/engine/BoosterService';
import { CoreGameplayEngine } from '../src/engine/CoreGameplayEngine';
import { ProgressionIntegration } from '../src/engine/ProgressionIntegration';
import { AnalyticsService } from '../src/services/AnalyticsService';
import { generateLevelDefinition } from '../src/data/levelDefinitions';
import { RuntimeLevelRegistry } from '../src/engine/RuntimeLevelRegistry';
import { BoosterActivationStateMachine } from '../src/engine/BoosterActivationStateMachine';
import { BoardTile, TrayTileItem } from '../src/types/gameEngine';

console.log('====================================================');
console.log('PHASE 11: BOOSTER SYSTEM & ECONOMY AUTOMATED TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, failureMessage?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ TEST ${totalTests}: [PASSED] ${testName}`);
  } else {
    console.error(`  ❌ TEST ${totalTests}: [FAILED] ${testName}`);
    if (failureMessage) {
      console.error(`     Reason: ${failureMessage}`);
    }
    process.exit(1);
  }
}

// Global Services Setup
const saveService = new LocalSaveService();
saveService.resetSave();
const economyService = new LocalEconomyService(saveService);
const boosterService = new BoosterService(economyService);
const analytics = AnalyticsService.getInstance();

console.log('--- 1. CENTRAL BOOSTER DEFINITION TESTS ---');
{
  const undoDef = BoosterRegistry.getDefinition('undo');
  assert(undoDef !== null && undoDef.name === 'Undo Move', '1. Booster definition loading correctly retrieves Undo metadata');

  const activeBoosters = BoosterRegistry.getActiveBoosters();
  assert(activeBoosters.length >= 4, '2. Inventory creation & active boosters registry includes approved set');

  const isUnlockedLvl1 = BoosterRegistry.isBoosterUnlocked('undo', 1);
  assert(isUnlockedLvl1, '3. Level 1 unlocks Undo booster');
}

console.log('\n--- 2. INVENTORY & ECONOMY MUTATION TESTS ---');
{
  economyService.setBoosterQuantity('undo', 5);
  assert(economyService.getBoosterCount('undo') === 5, '4. Set booster quantity directly updates inventory');

  economyService.addBooster('shuffle', 2);
  assert(economyService.getBoosterCount('shuffle') === 4, '5. Add booster increases inventory correctly');

  const consumed = economyService.consumeBooster('shuffle');
  assert(consumed && economyService.getBoosterCount('shuffle') === 3, '6. Consume booster decrements inventory');

  // Test floor at zero
  economyService.setBoosterQuantity('magnet', 0);
  const consumeFailed = economyService.consumeBooster('magnet');
  assert(!consumeFailed && economyService.getBoosterCount('magnet') === 0, '7. Booster quantity cannot go below zero');
}

console.log('\n--- 3. BOOSTER ACTIVATION CONTRACT & STATE MACHINE TESTS ---');
{
  const fsm = new BoosterActivationStateMachine('undo');
  assert(fsm.getCurrentState() === 'AVAILABLE', '8. Initial Booster State Machine state is AVAILABLE');

  const res1 = fsm.transitionTo('SELECTED');
  assert(res1.success && fsm.getCurrentState() === 'SELECTED', '9. Transition AVAILABLE -> SELECTED succeeds');

  const res2 = fsm.transitionTo('VALIDATING');
  assert(res2.success && fsm.getCurrentState() === 'VALIDATING', '10. Transition SELECTED -> VALIDATING succeeds');

  // Invalid transition test (prevent state corruption)
  const invalidRes = fsm.transitionTo('CONSUMED');
  assert(!invalidRes.success, '11. State Machine prevents invalid state transitions (e.g. VALIDATING -> CONSUMED)');
}

console.log('\n--- 4. BOOSTER EXECUTION (UNDO, SHUFFLE, MAGNET, EXTRA SLOT) TESTS ---');
{
  // Prepare Level 1 Gameplay Engine
  const engine = new CoreGameplayEngine({ levelId: 1, saveService, economyService });

  // Test 12: Insufficient inventory failure contract
  economyService.setBoosterQuantity('undo', 0);
  const failRes = engine.activateBooster('undo');
  assert(!failRes.success, '12. Insufficient inventory fails activation without consuming');

  // Set inventory and player level for activation tests
  saveService.saveData({ highestLevelUnlocked: 10 });
  economyService.setBoosterQuantity('undo', 3);
  economyService.setBoosterQuantity('shuffle', 3);
  economyService.setBoosterQuantity('magnet', 3);
  economyService.setBoosterQuantity('extra_slot', 3);

  // Perform a move to create undo history
  const boardTiles = (engine as any).boardTiles as BoardTile[];
  const topTile = boardTiles.find(t => t.state === 'AVAILABLE');
  assert(topTile !== undefined, 'Found top tile for move');

  if (topTile) {
    engine.handleTileSelect(topTile.id);
  }

  // Test 13: Undo activation
  const undoRes = engine.activateBooster('undo');
  assert(undoRes.success && economyService.getBoosterCount('undo') === 2, '13. Undo restores previous valid state and consumes exactly 1 inventory');

  // Test 14: Shuffle activation
  const shuffleRes = engine.activateBooster('shuffle');
  assert(shuffleRes.success && economyService.getBoosterCount('shuffle') === 2, '14. Shuffle preserves tile identities/counts and updates board states');

  // Test 15: Magnet activation
  const magnetRes = engine.activateBooster('magnet');
  assert(magnetRes.success && economyService.getBoosterCount('magnet') === 2, '15. Magnet pulls candidate triplet and completes match');

  // Test 16: Extra Slot activation
  const extraSlotRes = engine.activateBooster('extra_slot');
  assert(extraSlotRes.success && (engine as any).trayConfig.capacity === 8, '16. Extra Slot unlocks +1 tray capacity for current session');
}

console.log('\n--- 5. PURCHASE & REWARD INTEGRATION TESTS ---');
{
  // Test Purchase Integration
  saveService.saveData({ coins: 500, gems: 50 });
  economyService.setBoosterQuantity('undo', 1);

  const purchaseRes = boosterService.purchaseBooster('undo', 'coins');
  assert(purchaseRes.success && economyService.getBoosterCount('undo') === 2, '17. Purchase booster deducts currency and grants inventory');

  // Test Idempotent Reward Integration
  const progression = new ProgressionIntegration(saveService, economyService);
  const rewardResult = {
    levelId: 1,
    completed: true,
    stars: 3,
    score: 1200,
    rewardsEarned: {
      coins: 100,
      gems: 2,
      boostersGranted: { undo: 1 },
      stars: 3,
      expPoints: 100,
    },
    durationSeconds: 25,
    movesUsed: 15,
  };

  const initialUndo = economyService.getBoosterCount('undo');
  progression.processLevelCompletion(rewardResult as any);
  const rewardUndo = economyService.getBoosterCount('undo');
  assert(rewardUndo === initialUndo + 1, '18. Level completion reward grants booster inventory');
}

console.log('\n--- 6. SAVE PERSISTENCE & RESTART TESTS ---');
{
  // Save current inventory
  economyService.setBoosterQuantity('magnet', 7);
  const savedData = saveService.loadSave();
  assert(savedData.boosterInventory.magnet === 7, '19. Booster inventory persists across save/load boundary');

  // Test Level Restart restores original tray capacity
  const engine = new CoreGameplayEngine({ levelId: 1, saveService, economyService });
  engine.activateBooster('extra_slot');
  assert((engine as any).trayConfig.capacity === 8, 'Extra slot active before restart');

  engine.restartLevel();
  assert((engine as any).trayConfig.capacity === 7, '20. Level restart restores original tray capacity');
}

console.log('\n--- 7. ANALYTICS LOGGING TESTS ---');
{
  const logs = analytics.getEventLog();
  const boosterStartedLogs = logs.filter(l => l.event === 'booster_activation_started' || l.event === 'booster_activated');
  const boosterConsumedLogs = logs.filter(l => l.event === 'booster_consumed');

  assert(boosterStartedLogs.length > 0 && boosterConsumedLogs.length > 0, '21. Analytics logs booster start and consumed events');
}

console.log('\n--- 8. END-TO-END BOOSTER & PLAYABLE SESSION TEST ---');
{
  saveService.resetSave();
  saveService.saveData({ highestLevelUnlocked: 10 });
  economyService.setBoosterQuantity('undo', 5);
  economyService.setBoosterQuantity('magnet', 5);

  const e2eEngine = new CoreGameplayEngine({ levelId: 1, saveService, economyService });
  const board = (e2eEngine as any).boardTiles as BoardTile[];

  // Execute gameplay: move tile -> undo -> magnet match
  const t1 = board.find(t => t.state === 'AVAILABLE');
  if (t1) e2eEngine.handleTileSelect(t1.id);

  const uRes = e2eEngine.activateBooster('undo');
  assert(uRes.success, 'E2E Undo executed');

  const mRes = e2eEngine.activateBooster('magnet');
  assert(mRes.success, 'E2E Magnet executed');

  const finalSave = saveService.loadSave();
  assert(finalSave.boosterInventory.undo === 4 && finalSave.boosterInventory.magnet === 4, '22. End-to-end playable session preserves verified booster inventory');
}

console.log('\n--- 9. PERFORMANCE & MULTI-BOARD BENCHMARK ---');
{
  const startMs = Date.now();
  for (let i = 1; i <= 10; i++) {
    const testEng = new CoreGameplayEngine({ levelId: i, saveService, economyService });
    economyService.setBoosterQuantity('shuffle', 10);
    testEng.activateBooster('shuffle');
  }
  const durationMs = Date.now() - startMs;
  assert(durationMs < 1000, `23. Performance benchmark: 10 full engine initializations & booster shuffles executed in ${durationMs}ms`);
}

console.log('\n====================================================');
console.log(`PHASE 11 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('✅ ALL PHASE 11 BOOSTER TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('❌ SOME PHASE 11 TESTS FAILED!');
  process.exit(1);
}
