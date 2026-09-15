import {
  BoardTile,
  TrayTileItem,
  LevelDefinition,
  TrayConfiguration,
  BoardStateSnapshot,
  GameState,
  LevelObjective
} from '../types/gameEngine';
import { isTileOccluded, recalculateBoardTileStates } from './TileOcclusion';
import { MatchSystem, MatchResult } from './MatchSystem';
import { SolvabilityValidator } from './SolvabilityValidator';

export interface BoardStateChangeEvent {
  boardTiles: BoardTile[];
  trayTiles: TrayTileItem[];
  gameState: GameState;
  score: number;
  combo: number;
  moveCount: number;
  lastMatchedTypeId: string | null;
  objectives: LevelObjective[];
  canUndo: boolean;
  isTrayFull: boolean;
}

/**
 * Centralized State Engine for managing board state, transactions, state snapshots, and state safety.
 */
export class BoardStateEngine {
  private levelDef: LevelDefinition;
  private boardTiles: BoardTile[] = [];
  private trayTiles: TrayTileItem[] = [];
  private trayConfig: TrayConfiguration;
  private gameState: GameState = 'LEVEL_READY';
  private score: number = 0;
  private combo: number = 0;
  private moveCount: number = 0;
  private historySnapshots: BoardStateSnapshot[] = [];
  private objectives: LevelObjective[] = [];
  private isProcessingAction: boolean = false;

  constructor(levelDef: LevelDefinition, trayConfig?: TrayConfiguration) {
    this.levelDef = levelDef;
    this.trayConfig = trayConfig || {
      capacity: levelDef.trayCapacity || 7,
      maxCapacityLimit: 9,
      unlockedSlots: levelDef.trayCapacity || 7,
      isExtraSlotActive: false,
    };
    this.resetState();
  }

  public resetState(): void {
    this.boardTiles = recalculateBoardTileStates(this.levelDef.tiles.map(t => ({ ...t })));
    this.trayTiles = [];
    this.score = 0;
    this.combo = 0;
    this.moveCount = 0;
    this.gameState = 'PLAYING';
    this.historySnapshots = [];
    this.objectives = (this.levelDef.objectives || []).map(o => ({
      ...o,
      currentCount: 0,
      completed: false,
    }));
    this.isProcessingAction = false;
  }

  /**
   * Centralized check for tile availability.
   */
  public isTileAvailable(tileId: string): boolean {
    const tile = this.boardTiles.find(t => t.id === tileId);
    if (!tile) return false;
    if (tile.state !== 'AVAILABLE' && tile.state !== 'BLOCKED') return false;
    return !isTileOccluded(tile, this.boardTiles);
  }

  /**
   * Atomic tile selection action handler. Prevents race conditions and duplicate inputs.
   */
  public selectTile(tileId: string): { success: boolean; event?: BoardStateChangeEvent; error?: string } {
    if (this.isProcessingAction) {
      return { success: false, error: 'Engine busy processing previous action.' };
    }
    if (this.gameState !== 'PLAYING') {
      return { success: false, error: `Cannot select tile in state: ${this.gameState}` };
    }

    const tile = this.boardTiles.find(t => t.id === tileId);
    if (!tile || !this.isTileAvailable(tileId)) {
      return { success: false, error: 'Tile is currently blocked or unavailable.' };
    }

    if (this.trayTiles.length >= this.trayConfig.capacity) {
      return { success: false, error: 'Tray is full.' };
    }

    this.isProcessingAction = true;

    // 1. Save Undo Snapshot before state change
    this.pushSnapshot();

    // 2. Remove selected tile from board & mark as IN_TRAY
    this.boardTiles = this.boardTiles.filter(t => t.id !== tileId);
    const updatedBoard = recalculateBoardTileStates(this.boardTiles);
    this.boardTiles = updatedBoard;

    // 3. Insert tile into tray using MatchSystem
    const { newTray } = MatchSystem.insertTileToTray(this.trayTiles, tile);
    this.trayTiles = newTray;
    this.moveCount++;

    // 4. Evaluate tray for match
    const matchResult: MatchResult = MatchSystem.evaluateTray(this.trayTiles, this.trayConfig, this.combo);

    if (matchResult.hasMatched) {
      this.trayTiles = matchResult.updatedTray;
      this.combo = matchResult.comboCount;
      this.score += matchResult.scoreBonus;
      this.updateObjectivesOnMatch(matchResult.matchedTypeId!);
    } else {
      this.combo = 0;
    }

    // 5. Check Win/Lose conditions
    if (this.boardTiles.length === 0 && this.trayTiles.length === 0) {
      this.gameState = 'WIN';
    } else if (this.trayTiles.length >= this.trayConfig.capacity && !matchResult.hasMatched) {
      this.gameState = 'LOSE';
    }

    this.isProcessingAction = false;

    const event: BoardStateChangeEvent = {
      boardTiles: this.boardTiles,
      trayTiles: this.trayTiles,
      gameState: this.gameState,
      score: this.score,
      combo: this.combo,
      moveCount: this.moveCount,
      lastMatchedTypeId: matchResult.matchedTypeId,
      objectives: this.objectives,
      canUndo: this.historySnapshots.length > 0,
      isTrayFull: this.trayTiles.length >= this.trayConfig.capacity,
    };

    return { success: true, event };
  }

  /**
   * Executes UNDO booster with state snapshot restoration.
   */
  public executeUndo(): { success: boolean; event?: BoardStateChangeEvent; message?: string } {
    if (this.historySnapshots.length === 0) {
      return { success: false, message: 'No move to undo.' };
    }

    const lastSnapshot = this.historySnapshots.pop()!;
    this.boardTiles = lastSnapshot.boardTiles;
    this.trayTiles = lastSnapshot.trayTiles;
    this.score = lastSnapshot.score;
    this.combo = lastSnapshot.combo;
    this.moveCount = lastSnapshot.moveCount;
    this.gameState = 'PLAYING';

    const event: BoardStateChangeEvent = {
      boardTiles: this.boardTiles,
      trayTiles: this.trayTiles,
      gameState: this.gameState,
      score: this.score,
      combo: this.combo,
      moveCount: this.moveCount,
      lastMatchedTypeId: null,
      objectives: this.objectives,
      canUndo: this.historySnapshots.length > 0,
      isTrayFull: this.trayTiles.length >= this.trayConfig.capacity,
    };

    return { success: true, event, message: 'Move undone.' };
  }

  /**
   * Executes SHUFFLE booster while preserving solvability.
   */
  public executeShuffle(): { success: boolean; event?: BoardStateChangeEvent; message?: string } {
    if (this.boardTiles.length <= 1) {
      return { success: false, message: 'Not enough tiles to shuffle.' };
    }

    // Extract current type IDs
    const typePool = this.boardTiles.map(t => t.typeId);

    // Attempt up to 20 shuffles to ensure solvability
    for (let attempt = 0; attempt < 20; attempt++) {
      for (let i = typePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [typePool[i], typePool[j]] = [typePool[j], typePool[i]];
      }

      const candidateBoard = this.boardTiles.map((tile, idx) => ({
        ...tile,
        typeId: typePool[idx],
      }));

      // Verify solvability
      const solvability = SolvabilityValidator.validateSolvability(candidateBoard, this.trayConfig.capacity - this.trayTiles.length);
      if (solvability.solvable) {
        this.boardTiles = recalculateBoardTileStates(candidateBoard);
        break;
      }
    }

    const event: BoardStateChangeEvent = {
      boardTiles: this.boardTiles,
      trayTiles: this.trayTiles,
      gameState: this.gameState,
      score: this.score,
      combo: this.combo,
      moveCount: this.moveCount,
      lastMatchedTypeId: null,
      objectives: this.objectives,
      canUndo: this.historySnapshots.length > 0,
      isTrayFull: this.trayTiles.length >= this.trayConfig.capacity,
    };

    return { success: true, event, message: 'Board shuffled successfully.' };
  }

  private pushSnapshot(): void {
    const snapshot: BoardStateSnapshot = {
      id: `snap_${Date.now()}_${this.moveCount}`,
      timestamp: Date.now(),
      boardTiles: this.boardTiles.map(t => ({ ...t })),
      trayTiles: this.trayTiles.map(t => ({ ...t })),
      score: this.score,
      combo: this.combo,
      moveCount: this.moveCount,
      objectiveProgress: {},
    };
    this.historySnapshots.push(snapshot);
    if (this.historySnapshots.length > 10) {
      this.historySnapshots.shift();
    }
  }

  private updateObjectivesOnMatch(matchedTypeId: string): void {
    this.objectives = this.objectives.map(obj => {
      let currentCount = obj.currentCount || 0;
      let completed = obj.completed || false;

      if (obj.type === 'clear_all_tiles') {
        currentCount += 3;
        if (this.boardTiles.length === 0) completed = true;
      } else if (obj.type === 'match_specific_types' && obj.targetTypeId === matchedTypeId) {
        currentCount += 3;
        if (obj.targetCount && currentCount >= obj.targetCount) completed = true;
      }

      return { ...obj, currentCount, completed };
    });
  }

  // Getters
  public getBoardTiles(): BoardTile[] { return this.boardTiles; }
  public getTrayTiles(): TrayTileItem[] { return this.trayTiles; }
  public getGameState(): GameState { return this.gameState; }
  public getScore(): number { return this.score; }
  public getCombo(): number { return this.combo; }
  public getMoveCount(): number { return this.moveCount; }
  public getObjectives(): LevelObjective[] { return this.objectives; }
  public getLevelDefinition(): LevelDefinition { return this.levelDef; }
}
