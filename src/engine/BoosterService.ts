import { BoosterType, BoardTile, TrayTileItem, TrayConfiguration } from '../types/gameEngine';
import { BoosterRegistry, BoosterDefinition } from './BoosterDefinition';
import { BOOSTER_STRATEGIES, BoosterExecutionResult } from './BoosterEngine';
import { BoosterActivationStateMachine, BoosterState } from './BoosterActivationStateMachine';
import { LocalEconomyService } from '../services/EconomyService';
import { AnalyticsService } from '../services/AnalyticsService';

export interface BoosterActivationRequest {
  boosterId: BoosterType;
  levelId: number;
  playerLevel: number;
  boardTiles: BoardTile[];
  trayTiles: TrayTileItem[];
  trayConfig: TrayConfiguration;
  moveHistoryCount: number;
  gameState: string;
  allowBoosters: boolean;
}

export interface BoosterActivationResponse {
  success: boolean;
  boosterId: BoosterType;
  state: BoosterState;
  message: string;
  updatedBoardTiles?: BoardTile[];
  updatedTrayTiles?: TrayTileItem[];
  updatedTrayCapacity?: number;
  scoreGained?: number;
  inventoryRemaining: number;
}

export class BoosterService {
  private economyService: LocalEconomyService;
  private analytics: AnalyticsService;

  constructor(economyService: LocalEconomyService = new LocalEconomyService()) {
    this.economyService = economyService;
    this.analytics = AnalyticsService.getInstance();
  }

  /**
   * Evaluates and executes a booster request through the full activation state machine contract.
   */
  public activateBooster(request: BoosterActivationRequest): BoosterActivationResponse {
    const { boosterId, levelId, playerLevel, boardTiles, trayTiles, trayConfig, moveHistoryCount, allowBoosters } = request;
    const fsm = new BoosterActivationStateMachine(boosterId);

    // 1. Definition & Availability Validation
    const def = BoosterRegistry.getDefinition(boosterId);
    if (!def || !def.isActive) {
      fsm.transitionTo('UNAVAILABLE', 'Booster disabled or not defined');
      this.analytics.logEvent('booster_activation_failed', { levelId, boosterType: boosterId, reason: 'booster_disabled' });
      return {
        success: false,
        boosterId,
        state: 'UNAVAILABLE',
        message: `Booster '${boosterId}' is currently unavailable.`,
        inventoryRemaining: this.economyService.getBoosterCount(boosterId),
      };
    }

    if (playerLevel < def.unlockLevel) {
      fsm.transitionTo('UNAVAILABLE', 'Level unlock requirement not met');
      this.analytics.logEvent('booster_activation_failed', { levelId, boosterType: boosterId, reason: 'level_locked' });
      return {
        success: false,
        boosterId,
        state: 'UNAVAILABLE',
        message: `Booster unlocked at Level ${def.unlockLevel}.`,
        inventoryRemaining: this.economyService.getBoosterCount(boosterId),
      };
    }

    // 2. Gameplay State Check
    if (!allowBoosters) {
      fsm.transitionTo('WRONG_STATE', 'GameState disallows booster usage');
      this.analytics.logEvent('booster_activation_failed', { levelId, boosterType: boosterId, reason: 'wrong_game_state' });
      return {
        success: false,
        boosterId,
        state: 'WRONG_STATE',
        message: 'Boosters cannot be used in current state.',
        inventoryRemaining: this.economyService.getBoosterCount(boosterId),
      };
    }

    fsm.transitionTo('SELECTED');

    // 3. Inventory Check
    const inventoryCount = this.economyService.getBoosterCount(boosterId);
    if (inventoryCount <= 0) {
      fsm.transitionTo('INSUFFICIENT_INVENTORY', 'Insufficient booster inventory');
      this.analytics.logEvent('booster_activation_failed', { levelId, boosterType: boosterId, reason: 'insufficient_inventory' });
      return {
        success: false,
        boosterId,
        state: 'INSUFFICIENT_INVENTORY',
        message: `No ${def.name} boosters remaining in inventory.`,
        inventoryRemaining: 0,
      };
    }

    fsm.transitionTo('VALIDATING');
    this.analytics.logEvent('booster_activation_started', { levelId, boosterType: boosterId });

    // 4. Target & Strategy Feasibility Check
    const strategy = BOOSTER_STRATEGIES[boosterId];
    if (!strategy) {
      fsm.transitionTo('INVALID', 'No strategy implementation registered');
      return {
        success: false,
        boosterId,
        state: 'INVALID',
        message: `Strategy for ${boosterId} not found.`,
        inventoryRemaining: inventoryCount,
      };
    }

    let canExecute = false;
    if (boosterId === 'undo') {
      canExecute = strategy.canExecute(boardTiles, trayTiles, moveHistoryCount);
    } else if (boosterId === 'shuffle') {
      canExecute = strategy.canExecute(boardTiles, trayTiles, moveHistoryCount);
    } else if (boosterId === 'magnet') {
      canExecute = strategy.canExecute(boardTiles, trayTiles, moveHistoryCount);
    } else if (boosterId === 'extra_slot') {
      canExecute = trayConfig.capacity < trayConfig.maxCapacityLimit;
    }

    if (!canExecute) {
      fsm.transitionTo('NO_TARGET', 'Validation failed: condition or target unavailable');
      this.analytics.logEvent('booster_activation_failed', { levelId, boosterType: boosterId, reason: 'no_target_or_invalid_condition' });
      return {
        success: false,
        boosterId,
        state: 'NO_TARGET',
        message: `Cannot activate ${def.name}: condition or targets not available.`,
        inventoryRemaining: inventoryCount,
      };
    }

    // 5. Activation & Execution
    fsm.transitionTo('ACTIVATING');

    let result: BoosterExecutionResult = {
      success: false,
      message: 'Execution error',
      updatedBoardTiles: boardTiles,
      updatedTrayTiles: trayTiles,
      scoreGained: 0,
    };

    if (boosterId === 'extra_slot') {
      result = {
        success: true,
        message: 'Extra slot added to tray.',
        updatedBoardTiles: boardTiles,
        updatedTrayTiles: trayTiles,
        scoreGained: 0,
      };
    } else if (boosterId === 'undo') {
      const mockHistory = Array(moveHistoryCount).fill({ tile: { id: trayTiles[trayTiles.length - 1]?.sourceTileId || 'tile_0' } });
      result = strategy.execute(boardTiles, trayTiles, mockHistory);
    } else {
      result = strategy.execute(boardTiles, trayTiles, []);
    }

    if (!result.success) {
      fsm.transitionTo('ACTIVATION_FAILED', result.message);
      this.analytics.logEvent('booster_activation_failed', { levelId, boosterType: boosterId, reason: 'execution_failed' });
      return {
        success: false,
        boosterId,
        state: 'ACTIVATION_FAILED',
        message: result.message,
        inventoryRemaining: inventoryCount,
      };
    }

    // 6. Success -> Consume Inventory -> Log Analytics
    fsm.transitionTo('SUCCESS');

    const consumed = this.economyService.consumeBooster(boosterId);
    if (!consumed) {
      // Safety check fallback
      fsm.transitionTo('INSUFFICIENT_INVENTORY');
      return {
        success: false,
        boosterId,
        state: 'INSUFFICIENT_INVENTORY',
        message: 'Failed to consume inventory.',
        inventoryRemaining: 0,
      };
    }

    fsm.transitionTo('CONSUMED');
    const remainingCount = this.economyService.getBoosterCount(boosterId);

    this.analytics.logEvent('booster_activation_success', { levelId, boosterType: boosterId });
    this.analytics.logEvent('booster_consumed', { levelId, boosterType: boosterId, quantityAfter: remainingCount });

    let updatedCapacity = trayConfig.capacity;
    if (boosterId === 'extra_slot') {
      updatedCapacity = Math.min(trayConfig.maxCapacityLimit, trayConfig.capacity + 1);
    }

    return {
      success: true,
      boosterId,
      state: 'CONSUMED',
      message: result.message,
      updatedBoardTiles: result.updatedBoardTiles,
      updatedTrayTiles: result.updatedTrayTiles,
      updatedTrayCapacity: updatedCapacity,
      scoreGained: result.scoreGained,
      inventoryRemaining: remainingCount,
    };
  }

  /**
   * Purchases a booster using coins or gems and adds it to inventory.
   */
  public purchaseBooster(boosterId: BoosterType, currency: 'coins' | 'gems'): { success: boolean; message: string; newInventory: number } {
    const def = BoosterRegistry.getDefinition(boosterId);
    if (!def) {
      return { success: false, message: 'Invalid booster type.', newInventory: 0 };
    }

    const currentInventory = this.economyService.getBoosterCount(boosterId);
    if (currentInventory >= def.maxInventory) {
      return { success: false, message: `Maximum inventory limit (${def.maxInventory}) reached for ${def.name}.`, newInventory: currentInventory };
    }

    let cost = 0;
    let deducted = false;

    if (currency === 'coins') {
      cost = def.coinCost;
      deducted = this.economyService.deductCoins(cost);
    } else {
      cost = def.gemCost;
      deducted = this.economyService.deductGems(cost);
    }

    if (!deducted) {
      return { success: false, message: `Insufficient ${currency} to purchase ${def.name}.`, newInventory: currentInventory };
    }

    this.economyService.addBooster(boosterId, 1);
    const newInventory = this.economyService.getBoosterCount(boosterId);

    this.analytics.logEvent('booster_purchased', { levelId: 0, boosterType: boosterId, currency, cost, newCount: newInventory });

    return {
      success: true,
      message: `Purchased 1 ${def.name}!`,
      newInventory,
    };
  }
}
