import { TrayTileItem, LevelDefinition } from '../types/gameEngine';

export interface LoseEvaluationResult {
  isLose: boolean;
  reason: string;
}

export class LoseConditionEvaluator {
  public static evaluateLose(
    levelDef: LevelDefinition,
    trayTiles: TrayTileItem[],
    trayCapacity: number,
    hasMatched: boolean,
    movesUsed: number,
    timeRemainingSeconds?: number
  ): LoseEvaluationResult {
    // Guaranteed minimum 7 slots - never trigger tray full if slots are open
    const effectiveCapacity = Math.max(7, trayCapacity);

    // 1. Tray Full check - ONLY when all slots are occupied and no match was formed
    // In casual Zen tile matching, this is the ONLY way a player can lose.
    // Timers and move counters are bonus score/star challenges and NEVER cause an abrupt game over.
    if (trayTiles.length >= effectiveCapacity && !hasMatched) {
      return {
        isLose: true,
        reason: 'Tray Full - No Moves Remaining',
      };
    }

    return {
      isLose: false,
      reason: '',
    };
  }
}
