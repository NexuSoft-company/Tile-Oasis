import { LevelDefinition } from '../types/gameEngine';
import { SimulationMetrics } from '../types/levelPipeline';
import { DifficultyCurve } from './DifficultyCurve';

export interface QualityScoreResult {
  qualityScore: number; // 0 - 100
  approved: boolean;    // Quality threshold >= 70
  breakdown: {
    solvabilityScore: number;    // Weight: 30
    difficultyFitScore: number;  // Weight: 25
    choiceQualityScore: number;  // Weight: 15
    trayPressureScore: number;   // Weight: 15
    varietyQualityScore: number; // Weight: 15
  };
  rejectionReasons: string[];
}

export class LevelQualityScore {
  public static readonly APPROVAL_THRESHOLD = 70;

  /**
   * Evaluates quality metrics and produces a 0-100 QualityScore.
   */
  public static calculateQualityScore(
    level: Partial<LevelDefinition>,
    difficultyScore: number,
    simulation: SimulationMetrics
  ): QualityScoreResult {
    const rejectionReasons: string[] = [];

    // 1. Solvability Score (30 pts max)
    const solvabilityScore = simulation.isSolvable ? 30 : 0;
    if (!simulation.isSolvable) {
      rejectionReasons.push('Level is unsolvable in simulation.');
    }

    // 2. Difficulty Fit Score (25 pts max)
    // Compare actual difficultyScore against target range for level ID
    const targetRange = DifficultyCurve.getTargetDifficultyRange(level.id || 1);
    let difficultyFitScore = 25;
    if (difficultyScore < targetRange.minScore) {
      const diff = targetRange.minScore - difficultyScore;
      difficultyFitScore = Math.max(5, 25 - diff * 1.5);
      rejectionReasons.push(`Difficulty score (${difficultyScore}) is below target min (${targetRange.minScore}).`);
    } else if (difficultyScore > targetRange.maxScore) {
      const diff = difficultyScore - targetRange.maxScore;
      difficultyFitScore = Math.max(5, 25 - diff * 1.5);
      rejectionReasons.push(`Difficulty score (${difficultyScore}) exceeds target max (${targetRange.maxScore}).`);
    }

    // 3. Choice Quality Score (15 pts max)
    // Reward levels with good initial choices (>= 3 moves) and balanced forced move ratio
    let choiceQualityScore = 15;
    if (simulation.initialAvailableMoves < 2) {
      choiceQualityScore -= 7;
      rejectionReasons.push(`Too few initial unblocked moves (${simulation.initialAvailableMoves}).`);
    }
    if (simulation.forcedMoveRatio > 0.85) {
      choiceQualityScore -= 8;
      rejectionReasons.push(`Excessive forced move ratio (${Math.round(simulation.forcedMoveRatio * 100)}%).`);
    }

    // 4. Tray Pressure Balance Score (15 pts max)
    // Peak tray occupancy should be challenging without immediately clogging tray on step 1
    let trayPressureScore = 15;
    const trayCap = level.trayCapacity || 7;
    if (simulation.peakTrayOccupancy >= trayCap && simulation.stepsTaken < 6) {
      trayPressureScore -= 10;
      rejectionReasons.push(`Tray reached capacity too quickly on step ${simulation.stepsTaken}.`);
    } else if (simulation.peakTrayOccupancy <= 2 && (level.tiles?.length || 0) > 24) {
      trayPressureScore -= 5; // Too trivial
    }

    // 5. Variety & Structure Quality Score (15 pts max)
    let varietyQualityScore = 15;
    const tiles = level.tiles || [];
    const tileTypesCount = new Set(tiles.map(t => t.typeId)).size;
    if (tileTypesCount < 2 && tiles.length > 12) {
      varietyQualityScore -= 10;
      rejectionReasons.push('Insufficient tile category variety on board.');
    }

    const totalQualityScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          solvabilityScore +
            difficultyFitScore +
            choiceQualityScore +
            trayPressureScore +
            varietyQualityScore
        )
      )
    );

    const approved = simulation.isSolvable && totalQualityScore >= this.APPROVAL_THRESHOLD;

    return {
      qualityScore: totalQualityScore,
      approved,
      breakdown: {
        solvabilityScore: Math.round(solvabilityScore),
        difficultyFitScore: Math.round(difficultyFitScore),
        choiceQualityScore: Math.round(choiceQualityScore),
        trayPressureScore: Math.round(trayPressureScore),
        varietyQualityScore: Math.round(varietyQualityScore),
      },
      rejectionReasons,
    };
  }
}
