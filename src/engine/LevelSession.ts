import { RuntimeLevelDefinition } from '../types/runtimeContract';
import { LevelSessionState } from '../types/runtimeContract';
import { RuntimeTile } from './RuntimeTile';
import { RuntimeBoardBuilder } from './RuntimeBoardBuilder';
import { LevelObjective } from '../types/gameEngine';

export class LevelSession {
  public levelDef: RuntimeLevelDefinition;
  public runtimeTiles: RuntimeTile[] = [];
  public startTime: number;
  public endTime?: number;
  public state: LevelSessionState;

  constructor(levelDef: RuntimeLevelDefinition) {
    this.levelDef = levelDef;
    this.startTime = Date.now();

    const buildResult = RuntimeBoardBuilder.buildBoard(levelDef);
    this.runtimeTiles = buildResult.runtimeTiles;

    this.state = {
      levelId: levelDef.id,
      worldId: levelDef.worldId,
      packId: levelDef.packId,
      startTime: this.startTime,
      durationSeconds: 0,
      currentState: 'READY',
      isCompleted: false,
      isFailed: false,
      movesUsed: 0,
      score: 0,
      comboCount: 0,
      tilesMatchedCount: 0,
      trayOccupancy: 0,
      boosterUsage: {
        undo: 0,
        shuffle: 0,
        magnet: 0,
        extra_slot: 0,
        freeze: 0,
        hint: 0,
      },
      objectivesProgress: levelDef.objectives ? JSON.parse(JSON.stringify(levelDef.objectives)) : [],
    };
  }

  /**
   * Cleanly resets the level session for retries or reloads.
   */
  public reset(): void {
    this.startTime = Date.now();
    this.endTime = undefined;

    const buildResult = RuntimeBoardBuilder.buildBoard(this.levelDef);
    this.runtimeTiles = buildResult.runtimeTiles;

    this.state = {
      levelId: this.levelDef.id,
      worldId: this.levelDef.worldId,
      packId: this.levelDef.packId,
      startTime: this.startTime,
      durationSeconds: 0,
      currentState: 'READY',
      isCompleted: false,
      isFailed: false,
      movesUsed: 0,
      score: 0,
      comboCount: 0,
      tilesMatchedCount: 0,
      trayOccupancy: 0,
      boosterUsage: {
        undo: 0,
        shuffle: 0,
        magnet: 0,
        extra_slot: 0,
        freeze: 0,
        hint: 0,
      },
      objectivesProgress: this.levelDef.objectives ? JSON.parse(JSON.stringify(this.levelDef.objectives)) : [],
    };
  }

  public recordMove(): void {
    this.state.movesUsed++;
  }

  public recordBoosterUsed(boosterType: string): void {
    this.state.boosterUsage[boosterType] = (this.state.boosterUsage[boosterType] || 0) + 1;
  }

  public updateScore(points: number): void {
    this.state.score += points;
  }

  public recordTilesMatched(count: number = 3): void {
    this.state.tilesMatchedCount += count;
  }

  public getElapsedTimeSeconds(): number {
    const end = this.endTime || Date.now();
    return Math.floor((end - this.startTime) / 1000);
  }
}
