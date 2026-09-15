import {
  BoardTile,
  TrayTileItem,
  TrayConfiguration,
  GameState,
  BoosterType,
} from '../types/gameEngine';
import { RuntimeLevelDefinition } from '../types/runtimeContract';
import { GameStateMachine } from './GameStateMachine';
import { LevelSession } from './LevelSession';
import { RuntimeBoardBuilder } from './RuntimeBoardBuilder';
import { RuntimeLevelRegistry } from './RuntimeLevelRegistry';
import { recalculateBoardTileStates, isTileOccluded } from './TileOcclusion';
import { MatchDetector } from './MatchDetector';
import { WinConditionEvaluator } from './WinConditionEvaluator';
import { LoseConditionEvaluator } from './LoseConditionEvaluator';
import { LevelCompletionPipeline, CompletionPipelineOutput } from './LevelCompletionPipeline';
import { LevelFailurePipeline, FailurePipelineOutput } from './LevelFailurePipeline';
import { ProgressionIntegration } from './ProgressionIntegration';
import { LocalSaveService } from '../services/SaveService';
import { LocalEconomyService } from '../services/EconomyService';
import { globalAudioService } from '../services/AudioService';
import { AnalyticsService } from '../services/AnalyticsService';
import { BoosterService } from './BoosterService';

export interface GameplayEngineConfig {
  levelId: number;
  customLevelDefinition?: RuntimeLevelDefinition;
  saveService?: LocalSaveService;
  economyService?: LocalEconomyService;
  onStateChange?: (state: GameState, prevState: GameState) => void;
  onBoardChange?: (boardTiles: BoardTile[], trayTiles: TrayTileItem[]) => void;
  onWin?: (output: CompletionPipelineOutput) => void;
  onLose?: (output: FailurePipelineOutput) => void;
}

export class CoreGameplayEngine {
  private levelDef: RuntimeLevelDefinition;
  private stateMachine: GameStateMachine;
  private session: LevelSession;
  private boardTiles: BoardTile[] = [];
  private trayTiles: TrayTileItem[] = [];
  private trayConfig: TrayConfiguration;
  private matchDetector: MatchDetector;
  private saveService: LocalSaveService;
  private economyService: LocalEconomyService;
  private analytics: AnalyticsService;

  private isActionInProgress: boolean = false;
  private isFinished: boolean = false;
  private timerInterval: any = null;
  private timeRemainingSeconds: number | undefined = undefined;
  private isPaused: boolean = false;
  private currentCombo: number = 0;
  private initialTotalTiles: number = 0;
  private hasTrackedFirstMove: boolean = false;
  private hasTracked25: boolean = false;
  private hasTracked50: boolean = false;
  private hasTracked75: boolean = false;

  // Undo Snapshot History
  private historySnapshots: Array<{
    boardTiles: BoardTile[];
    trayTiles: TrayTileItem[];
    score: number;
    combo: number;
    movesUsed: number;
  }> = [];

  private config: GameplayEngineConfig;

  constructor(config: GameplayEngineConfig) {
    this.config = config;
    this.saveService = config.saveService || new LocalSaveService();
    this.economyService = config.economyService || new LocalEconomyService();
    this.analytics = AnalyticsService.getInstance();

    // 1. Fetch level definition from Phase 09 Registry or custom
    const loadedDef = config.customLevelDefinition || RuntimeLevelRegistry.getLevel(config.levelId);
    if (!loadedDef) {
      throw new Error(`Level ID ${config.levelId} not found in RuntimeLevelRegistry.`);
    }
    this.levelDef = JSON.parse(JSON.stringify(loadedDef));

    // 2. Initialize State Machine
    this.stateMachine = new GameStateMachine('LOADING');
    if (config.onStateChange) {
      this.stateMachine.subscribe(config.onStateChange);
    }

    // 3. Initialize Tray Config - Minimum 7 slots standard
    const defaultCapacity = Math.max(7, this.levelDef.trayCapacity || 7);
    this.trayConfig = {
      capacity: defaultCapacity,
      maxCapacityLimit: 9,
      unlockedSlots: defaultCapacity,
      isExtraSlotActive: false,
    };

    // 4. Initialize Level Session & Match Detector
    this.session = new LevelSession(this.levelDef);
    this.matchDetector = new MatchDetector(3);

    // 5. Initialize Timer if level defines time limit
    const timeObj = (this.levelDef.objectives || []).find(o => o.type === 'time_trial');
    if (timeObj && timeObj.timeLimitSeconds) {
      this.timeRemainingSeconds = timeObj.timeLimitSeconds;
    }

    this.initializeEngine();
  }

  public restartLevel(): void {
    this.stopTimer();
    this.trayConfig.capacity = this.levelDef.trayCapacity || 7;
    this.trayConfig.isExtraSlotActive = false;
    this.stateMachine = new GameStateMachine('LOADING');
    this.initializeEngine();
  }

  private initializeEngine(): void {
    // Build initial board
    const boardBuild = RuntimeBoardBuilder.buildBoard(this.levelDef);
    this.boardTiles = recalculateBoardTileStates(boardBuild.runtimeTiles.map(rt => rt.toBoardTile()));
    this.trayTiles = [];
    this.historySnapshots = [];
    this.isFinished = false;
    this.isActionInProgress = false;
    this.currentCombo = 0;
    this.initialTotalTiles = this.boardTiles.length;
    this.hasTrackedFirstMove = false;
    this.hasTracked25 = false;
    this.hasTracked50 = false;
    this.hasTracked75 = false;

    this.stateMachine.transitionTo('READY');
    this.stateMachine.transitionTo('PLAYING');
    this.stateMachine.transitionTo('PLAYER_INPUT');

    this.startTimer();

    this.analytics.recordSessionLevelAttempt(this.levelDef.id);
    this.analytics.recordFunnelStage(this.levelDef.id, 'STARTED', 0, 0, 0);

    this.analytics.logEvent('level_started', {
      levelId: this.levelDef.id,
      worldId: this.levelDef.worldId,
      trayCapacity: this.trayConfig.capacity,
    });

    globalAudioService.emit('TileSelected');
    this.notifyBoardChange();
  }

  public handleTileSelect(tileId: string): { success: boolean; message?: string } {
    // 1. Rapid input / state safety check
    if (this.isActionInProgress || this.isFinished || this.isPaused) {
      this.analytics.logEvent('tile_selection_failed', { levelId: this.levelDef.id, reason: 'engine_busy_or_paused' });
      return { success: false, message: 'Engine busy or level paused/finished.' };
    }

    if (!this.stateMachine.canAcceptTileInput()) {
      this.analytics.logEvent('tile_selection_failed', { levelId: this.levelDef.id, reason: 'state_disallows_input' });
      return { success: false, message: `Input not accepted in state ${this.stateMachine.getCurrentState()}` };
    }

    const tile = this.boardTiles.find(t => t.id === tileId);
    if (!tile) {
      return { success: false, message: 'Tile not found.' };
    }

    // 2. Validate availability and occlusion
    if (tile.state === 'BLOCKED' || isTileOccluded(tile, this.boardTiles)) {
      globalAudioService.emit('TileBlocked');
      this.analytics.logEvent('tile_selection_failed', { levelId: this.levelDef.id, tileId, reason: 'tile_occluded' });
      return { success: false, message: 'Tile is blocked.' };
    }

    // Check Frozen mechanic: Cannot select frozen tiles directly until thawed by matches
    if (tile.specialProperty === 'frozen') {
      globalAudioService.emit('TileBlocked');
      this.analytics.logEvent('tile_selection_failed', { levelId: this.levelDef.id, tileId, reason: 'tile_frozen' });
      return { success: false, message: 'Tile is frozen! Make a match to thaw the ice.' };
    }

    if (tile.state === 'IN_TRAY' || tile.state === 'REMOVED' || tile.state === 'REMOVING' || tile.state === 'MOVING') {
      return { success: false, message: 'Tile cannot be selected.' };
    }

    // Check Chained mechanic: Clicking breaks 1 chain layer
    if (tile.specialProperty === 'chained' || (tile.chainCount !== undefined && tile.chainCount > 0)) {
      this.isActionInProgress = true;
      this.pushSnapshot();

      const currentChains = tile.chainCount !== undefined ? tile.chainCount : 1;
      if (currentChains > 1) {
        tile.chainCount = currentChains - 1;
      } else {
        tile.specialProperty = undefined;
        tile.chainCount = undefined;
      }

      this.session.recordMove();
      this.session.updateScore(50);
      globalAudioService.emit('TileUnchained');
      this.notifyBoardChange();

      this.isActionInProgress = false;
      return { success: true, message: 'Chain shattered!' };
    }

    // 3. Tray capacity check
    if (this.trayTiles.length >= this.trayConfig.capacity) {
      globalAudioService.emit('TileBlocked');
      this.analytics.logEvent('tile_selection_failed', { levelId: this.levelDef.id, reason: 'tray_full' });
      return { success: false, message: 'Tray is full.' };
    }

    // Lock engine during action pipeline execution
    this.isActionInProgress = true;

    // Transition state: PLAYER_INPUT -> TILE_SELECTED -> TILE_MOVING
    this.stateMachine.transitionTo('TILE_SELECTED');
    globalAudioService.emit('TileSelected');
    this.analytics.logEvent('tile_selected', { levelId: this.levelDef.id, tileId, typeId: tile.typeId });

    // Save Undo Snapshot
    this.pushSnapshot();

    // 4. Update Board: Remove selected tile from board & recalculate board occlusion
    this.stateMachine.transitionTo('TILE_MOVING');
    this.boardTiles = this.boardTiles.filter(t => t.id !== tileId);
    this.boardTiles = recalculateBoardTileStates(this.boardTiles);

    // 5. Update Tray: Insert tile
    const { newTray } = this.insertTileToTray(tile);
    this.trayTiles = newTray;
    this.session.recordMove();
    this.stateMachine.transitionTo('TRAY_UPDATED');

    // Funnel Milestone Evaluation
    const movesUsed = this.session.state.movesUsed;
    const timeUsed = this.session.getElapsedTimeSeconds();
    if (!this.hasTrackedFirstMove) {
      this.hasTrackedFirstMove = true;
      this.analytics.recordFunnelStage(this.levelDef.id, 'FIRST_MOVE', 5, movesUsed, timeUsed);
    }

    const totalRemaining = this.boardTiles.length + this.trayTiles.length;
    const clearedRatio = this.initialTotalTiles > 0 ? (this.initialTotalTiles - totalRemaining) / this.initialTotalTiles : 0;

    if (clearedRatio >= 0.25 && !this.hasTracked25) {
      this.hasTracked25 = true;
      this.analytics.recordFunnelStage(this.levelDef.id, 'PROGRESS_25', 25, movesUsed, timeUsed);
    }
    if (clearedRatio >= 0.5 && !this.hasTracked50) {
      this.hasTracked50 = true;
      this.analytics.recordFunnelStage(this.levelDef.id, 'PROGRESS_50', 50, movesUsed, timeUsed);
    }
    if (clearedRatio >= 0.75 && !this.hasTracked75) {
      this.hasTracked75 = true;
      this.analytics.recordFunnelStage(this.levelDef.id, 'PROGRESS_75', 75, movesUsed, timeUsed);
    }

    this.analytics.logEvent('tile_moved_to_tray', {
      levelId: this.levelDef.id,
      tileId,
      trayOccupancy: this.trayTiles.length,
    });

    // 6. Match Check
    this.stateMachine.transitionTo('MATCH_CHECK');
    const matchRes = this.matchDetector.evaluate(this.trayTiles, this.trayConfig, this.currentCombo);

    if (matchRes.hasMatched) {
      this.stateMachine.transitionTo('MATCH_ANIMATION');
      this.currentCombo = matchRes.comboCount;
      this.analytics.logEvent('match_started', { levelId: this.levelDef.id, typeId: matchRes.matchedTypeId });
      globalAudioService.emit('TileMatched', this.currentCombo);

      this.trayTiles = matchRes.updatedTray;
      this.session.updateScore(matchRes.scoreBonus);
      this.session.recordTilesMatched(3);

      // Thaw unoccluded frozen tiles on board upon successful match
      let thawedCount = 0;
      this.boardTiles.forEach(t => {
        if (t.specialProperty === 'frozen' && !isTileOccluded(t, this.boardTiles)) {
          if (t.freezeLevel && t.freezeLevel > 1) {
            t.freezeLevel--;
          } else {
            t.specialProperty = undefined;
            t.freezeLevel = undefined;
          }
          thawedCount++;
        }
      });
      if (thawedCount > 0) {
        globalAudioService.emit('TileThawed');
      }

      // Handle Bomb Special Effect
      if (matchRes.specialEffects?.hasBomb) {
        globalAudioService.emit('SpecialTileActivated');
        // Detonate bomb: remove up to 2 unblocked tiles from highest layer
        const bombTargets = this.boardTiles
          .filter(t => !isTileOccluded(t, this.boardTiles))
          .sort((a, b) => b.layer - a.layer)
          .slice(0, 2);

        if (bombTargets.length > 0) {
          const targetIds = new Set(bombTargets.map(t => t.id));
          this.boardTiles = this.boardTiles.filter(t => !targetIds.has(t.id));
          this.boardTiles = recalculateBoardTileStates(this.boardTiles);
          this.session.updateScore(300);
          this.session.recordTilesMatched(bombTargets.length);
        }
      }

      // Handle Key Special Effect: Unlock all chained / locked tiles
      if (matchRes.specialEffects?.hasKey) {
        globalAudioService.emit('SpecialTileActivated');
        this.boardTiles.forEach(t => {
          if (t.specialProperty === 'chained' || t.state === 'LOCKED') {
            t.specialProperty = undefined;
            t.chainCount = undefined;
            t.state = 'AVAILABLE';
          }
        });
        this.boardTiles = recalculateBoardTileStates(this.boardTiles);
      }

      if (matchRes.specialEffects?.hasGolden || matchRes.specialEffects?.hasRainbow) {
        globalAudioService.emit('SpecialTileActivated');
      }

      // Bonus time reward in Time Attack mode
      if (this.timeRemainingSeconds !== undefined) {
        this.timeRemainingSeconds += 3;
      }

      this.analytics.logEvent('match_completed', {
        levelId: this.levelDef.id,
        matchedTypeId: matchRes.matchedTypeId,
        combo: matchRes.comboCount,
        scoreBonus: matchRes.scoreBonus,
      });

      this.stateMachine.transitionTo('BOARD_UPDATE');
    } else {
      this.currentCombo = 0;
      this.stateMachine.transitionTo('BOARD_UPDATE');
    }

    // 7. Objective & Win/Lose Check
    this.stateMachine.transitionTo('OBJECTIVE_CHECK');
    this.notifyBoardChange();

    const winRes = WinConditionEvaluator.evaluateWin(
      this.levelDef,
      this.boardTiles,
      this.trayTiles,
      this.session.state.score
    );

    if (winRes.isWin) {
      this.handleWin(winRes.reason);
      this.isActionInProgress = false;
      return { success: true };
    }

    const loseRes = LoseConditionEvaluator.evaluateLose(
      this.levelDef,
      this.trayTiles,
      this.trayConfig.capacity,
      matchRes.hasMatched,
      this.session.state.movesUsed,
      this.timeRemainingSeconds
    );

    if (loseRes.isLose) {
      this.handleLose(loseRes.reason);
      this.isActionInProgress = false;
      return { success: true };
    }

    // Return to input ready state
    this.stateMachine.transitionTo('PLAYING');
    this.stateMachine.transitionTo('PLAYER_INPUT');
    this.isActionInProgress = false;

    return { success: true };
  }

  public activateBooster(type: BoosterType): { success: boolean; message: string } {
    if (this.isActionInProgress || this.isFinished || this.isPaused) {
      return { success: false, message: 'Engine busy or level ended.' };
    }

    if (!this.stateMachine.canUseBoosters()) {
      return { success: false, message: 'Boosters not allowed in current state.' };
    }

    this.isActionInProgress = true;
    this.stateMachine.transitionTo('BOOSTER_ACTIVE');

    const save = this.saveService.loadSave();
    const boosterService = new BoosterService(this.economyService);

    const response = boosterService.activateBooster({
      boosterId: type,
      levelId: this.levelDef.id,
      playerLevel: save.highestLevelUnlocked || save.currentLevel || 1,
      boardTiles: this.boardTiles,
      trayTiles: this.trayTiles,
      trayConfig: this.trayConfig,
      moveHistoryCount: this.historySnapshots.length,
      gameState: this.stateMachine.getCurrentState(),
      allowBoosters: true,
    });

    if (response.success) {
      if (type === 'undo') {
        const lastSnap = this.historySnapshots.pop();
        if (lastSnap) {
          this.boardTiles = lastSnap.boardTiles;
          this.trayTiles = lastSnap.trayTiles;
          this.session.state.score = lastSnap.score;
          this.currentCombo = lastSnap.combo;
        }
      } else if (type === 'shuffle' && response.updatedBoardTiles) {
        this.boardTiles = recalculateBoardTileStates(response.updatedBoardTiles);
      } else if (type === 'magnet') {
        if (response.updatedBoardTiles) {
          this.boardTiles = recalculateBoardTileStates(response.updatedBoardTiles);
        }
        if (response.updatedTrayTiles) {
          this.trayTiles = response.updatedTrayTiles;
        }
        if (response.scoreGained) {
          this.session.updateScore(response.scoreGained);
          this.session.recordTilesMatched(3);
        }
      } else if (type === 'extra_slot' && response.updatedTrayCapacity) {
        this.trayConfig.capacity = response.updatedTrayCapacity;
        this.trayConfig.isExtraSlotActive = true;
      }

      this.session.recordBoosterUsed(type);
      globalAudioService.emit('BoosterActivated');
      this.notifyBoardChange();
    }

    this.stateMachine.transitionTo('PLAYING');
    this.stateMachine.transitionTo('PLAYER_INPUT');
    this.isActionInProgress = false;

    return { success: response.success, message: response.message };
  }

  public pause(): void {
    if (this.isPaused || this.isFinished) return;
    this.isPaused = true;
    this.stopTimer();
    this.stateMachine.transitionTo('PAUSED');
    this.analytics.logEvent('level_paused', { levelId: this.levelDef.id });
  }

  public resume(): void {
    if (!this.isPaused || this.isFinished) return;
    this.isPaused = false;
    this.startTimer();
    this.stateMachine.transitionTo('PLAYING');
    this.stateMachine.transitionTo('PLAYER_INPUT');
    this.analytics.logEvent('level_resumed', { levelId: this.levelDef.id });
  }

  public restart(): void {
    this.stopTimer();
    this.session.reset();
    this.analytics.logEvent('level_restarted', { levelId: this.levelDef.id });
    this.initializeEngine();
  }

  private handleWin(reason: string): void {
    if (this.isFinished) return;
    this.isFinished = true;
    this.stopTimer();

    this.stateMachine.transitionTo('WINNING');
    globalAudioService.emit('LevelWon');

    const pipeline = new LevelCompletionPipeline(
      new ProgressionIntegration(this.saveService, this.economyService)
    );
    const output = pipeline.execute(this.session);

    this.analytics.recordFunnelStage(
      this.levelDef.id,
      'COMPLETED',
      100,
      this.session.state.movesUsed,
      this.session.getElapsedTimeSeconds()
    );
    this.analytics.recordSessionLevelComplete(this.levelDef.id, output.result.stars, output.result.score);

    this.stateMachine.transitionTo('COMPLETED');
    this.stateMachine.transitionTo('WIN');

    if (this.config.onWin) {
      this.config.onWin(output);
    }
  }

  private handleLose(reason: string): void {
    if (this.isFinished) return;
    this.isFinished = true;
    this.stopTimer();

    this.stateMachine.transitionTo('FAILING');
    globalAudioService.emit('LevelLost');

    const output = LevelFailurePipeline.execute(this.session, reason);

    const totalRemaining = this.boardTiles.length + this.trayTiles.length;
    const progressPercent = this.initialTotalTiles > 0 ? Math.round(((this.initialTotalTiles - totalRemaining) / this.initialTotalTiles) * 100) : 0;

    this.analytics.recordFunnelStage(
      this.levelDef.id,
      'FAILED',
      progressPercent,
      this.session.state.movesUsed,
      this.session.getElapsedTimeSeconds()
    );
    this.analytics.recordSessionLevelFail(this.levelDef.id, reason);

    this.stateMachine.transitionTo('FAILED');
    this.stateMachine.transitionTo('LOSE');

    if (this.config.onLose) {
      this.config.onLose(output);
    }
  }

  private insertTileToTray(tile: BoardTile): { newTray: TrayTileItem[]; insertedIndex: number } {
    const newTray = [...this.trayTiles];
    const lastSameIndex = newTray.map(t => t.typeId).lastIndexOf(tile.typeId);

    let insertIndex = newTray.length;
    if (lastSameIndex !== -1) {
      insertIndex = lastSameIndex + 1;
    }

    const item: TrayTileItem = {
      id: `tray_${tile.id}_${Date.now()}`,
      typeId: tile.typeId,
      sourceTileId: tile.id,
      placedAtTimestamp: Date.now(),
      specialProperty: tile.specialProperty,
    };

    newTray.splice(insertIndex, 0, item);
    return { newTray, insertedIndex: insertIndex };
  }

  private pushSnapshot(): void {
    this.historySnapshots.push({
      boardTiles: this.boardTiles.map(t => ({ ...t })),
      trayTiles: this.trayTiles.map(t => ({ ...t })),
      score: this.session.state.score,
      combo: this.currentCombo,
      movesUsed: this.session.state.movesUsed,
    });
    if (this.historySnapshots.length > 10) {
      this.historySnapshots.shift();
    }
  }

  private startTimer(): void {
    if (this.timeRemainingSeconds === undefined || this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.isFinished) return;
      if (this.timeRemainingSeconds! > 0) {
        this.timeRemainingSeconds!--;
        if (this.timeRemainingSeconds! <= 0) {
          this.timeRemainingSeconds = 0;
          this.stopTimer();
          // Relaxing Zen Gameplay: Timer expiration never terminates the game abruptly.
          // Player continues playing to clear the board and finish the level!
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private notifyBoardChange(): void {
    if (this.config.onBoardChange) {
      this.config.onBoardChange([...this.boardTiles], [...this.trayTiles]);
    }
  }

  /**
   * Recovers from defeat by clearing slots from tray and resetting engine state.
   */
  public revive(tilesToRemove: number = 3): { success: boolean; boardTiles: BoardTile[]; trayTiles: TrayTileItem[] } {
    this.isFinished = false;
    this.isActionInProgress = false;

    if (this.trayTiles.length > 0) {
      this.trayTiles = this.trayTiles.slice(0, Math.max(0, this.trayTiles.length - tilesToRemove));
    }

    this.stateMachine.transitionTo('PLAYING');
    this.stateMachine.transitionTo('PLAYER_INPUT');

    if (this.timeRemainingSeconds !== undefined && this.timeRemainingSeconds <= 0) {
      this.timeRemainingSeconds = 45;
      this.startTimer();
    }

    this.notifyBoardChange();

    return {
      success: true,
      boardTiles: [...this.boardTiles],
      trayTiles: [...this.trayTiles],
    };
  }

  public destroy(): void {
    this.stopTimer();
    if (!this.isFinished) {
      this.isFinished = true;
      const totalRemaining = this.boardTiles.length + this.trayTiles.length;
      const progressPercent = this.initialTotalTiles > 0 ? Math.round(((this.initialTotalTiles - totalRemaining) / this.initialTotalTiles) * 100) : 0;
      this.analytics.recordFunnelStage(
        this.levelDef.id,
        'ABANDONED',
        progressPercent,
        this.session.state.movesUsed,
        this.session.getElapsedTimeSeconds()
      );
    }
    this.historySnapshots = [];
    this.boardTiles = [];
    this.trayTiles = [];
  }

  // Getters
  public getLevelDefinition(): RuntimeLevelDefinition { return this.levelDef; }
  public getStateMachine(): GameStateMachine { return this.stateMachine; }
  public getBoardTiles(): BoardTile[] { return this.boardTiles; }
  public getTrayTiles(): TrayTileItem[] { return this.trayTiles; }
  public getTrayConfig(): TrayConfiguration { return this.trayConfig; }
  public getSession(): LevelSession { return this.session; }
  public getScore(): number { return this.session.state.score; }
  public getCombo(): number { return this.currentCombo; }
  public getTimeRemainingSeconds(): number | undefined { return this.timeRemainingSeconds; }
  public getIsFinished(): boolean { return this.isFinished; }
  public getIsPaused(): boolean { return this.isPaused; }
  public getHistoryCount(): number { return this.historySnapshots.length; }
}
