import { TrayTileItem, TrayConfiguration } from '../types/gameEngine';
import { MatchSystem, MatchResult, MatchSpecialEffects } from './MatchSystem';

export interface MatchDetectorResult {
  hasMatched: boolean;
  matchedTypeId: string | null;
  removedTrayTiles: TrayTileItem[];
  updatedTray: TrayTileItem[];
  isTrayFull: boolean;
  comboCount: number;
  scoreBonus: number;
  specialEffects?: MatchSpecialEffects;
}

export class MatchDetector {
  private minMatchSize: number = 3;

  constructor(minMatchSize: number = 3) {
    this.minMatchSize = minMatchSize;
  }

  /**
   * Evaluates the tray for matching tile triplets.
   */
  public evaluate(
    tray: TrayTileItem[],
    trayConfig: TrayConfiguration,
    currentCombo: number = 0
  ): MatchDetectorResult {
    const result: MatchResult = MatchSystem.evaluateTray(tray, trayConfig, currentCombo);

    return {
      hasMatched: result.hasMatched,
      matchedTypeId: result.matchedTypeId,
      removedTrayTiles: result.removedTrayTiles,
      updatedTray: result.updatedTray,
      isTrayFull: result.isTrayFull,
      comboCount: result.comboCount,
      scoreBonus: result.scoreBonus,
      specialEffects: result.specialEffects,
    };
  }
}
