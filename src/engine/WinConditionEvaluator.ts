import { LevelDefinition, BoardTile, TrayTileItem } from '../types/gameEngine';
import { ObjectiveEngine, ObjectiveEvaluationResult } from './ObjectiveEngine';

export interface WinEvaluationResult {
  isWin: boolean;
  reason: string;
  starsEarned: number;
  objectiveResult: ObjectiveEvaluationResult;
}

export class WinConditionEvaluator {
  public static evaluateWin(
    levelDef: LevelDefinition,
    boardTiles: BoardTile[],
    trayTiles: TrayTileItem[],
    currentScore: number
  ): WinEvaluationResult {
    const remainingCount = boardTiles.filter(
      t => t.state !== 'REMOVED' && t.state !== 'IN_TRAY'
    ).length;

    const matchedCounts: Record<string, number> = {};
    const objEval = ObjectiveEngine.evaluateObjectives(
      levelDef,
      currentScore,
      remainingCount,
      matchedCounts
    );

    // Primary win condition: Board is cleared and Tray has no pending un-matched tiles
    const isBoardCleared = remainingCount === 0 && trayTiles.length === 0;
    const isObjectivesComplete = objEval.allObjectivesMet;

    const isWin = isBoardCleared || isObjectivesComplete;
    let reason = '';
    if (isBoardCleared) {
      reason = 'Board Completely Cleared';
    } else if (isObjectivesComplete) {
      reason = 'All Level Objectives Satisfied';
    }

    const starsEarned = ObjectiveEngine.calculateStars(
      currentScore,
      levelDef.starRules,
      trayTiles.length,
      levelDef.trayCapacity
    );

    return {
      isWin,
      reason,
      starsEarned,
      objectiveResult: objEval,
    };
  }
}
