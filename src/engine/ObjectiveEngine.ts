import { LevelDefinition, LevelObjective, StarRules, BoardTile } from '../types/gameEngine';

export interface ObjectiveEvaluationResult {
  allObjectivesMet: boolean;
  objectives: LevelObjective[];
  starsEarned: number;
}

export class ObjectiveEngine {
  /**
   * Calculates star rating earned for a level completion.
   */
  public static calculateStars(
    score: number,
    starRules?: StarRules,
    trayOccupied: number = 0,
    trayCapacity: number = 7
  ): number {
    const rules: StarRules = starRules || {
      oneStarScore: 300,
      twoStarsScore: 600,
      threeStarsScore: 1000,
    };
    let stars = 0;

    if (score >= rules.oneStarScore) {
      stars = 1;
    }
    if (score >= rules.twoStarsScore) {
      stars = 2;
    }
    if (score >= rules.threeStarsScore) {
      stars = 3;
    }

    // Bonus Star boost for clearing level with empty tray
    if (stars < 3 && score >= rules.oneStarScore && trayOccupied === 0) {
      stars = Math.min(3, stars + 1);
    }

    return Math.max(1, stars);
  }

  /**
   * Evaluates completion of level objectives.
   */
  public static evaluateObjectives(
    levelDef: LevelDefinition,
    currentScore: number,
    remainingBoardTilesCount: number,
    matchedGroupCounts: Record<string, number> = {},
    maxComboAchieved: number = 0,
    remainingSpecialTileCount: number = 0
  ): ObjectiveEvaluationResult {
    const objectives: LevelObjective[] = (levelDef.objectives || []).map(obj => {
      let currentCount = obj.currentCount || 0;
      let completed = false;

      switch (obj.type) {
        case 'clear_all_tiles':
          currentCount = levelDef.tiles.length - remainingBoardTilesCount;
          completed = remainingBoardTilesCount === 0;
          break;

        case 'score_target':
          currentCount = currentScore;
          completed = currentScore >= (obj.targetScore || 1000);
          break;

        case 'match_specific_types':
          if (obj.targetTypeId && matchedGroupCounts[obj.targetTypeId]) {
            currentCount = matchedGroupCounts[obj.targetTypeId] * 3;
          }
          completed = currentCount >= (obj.targetCount || 3);
          break;

        case 'clear_special_tiles': {
          const initialSpecialCount = levelDef.tiles.filter(t => t.specialProperty).length;
          currentCount = initialSpecialCount - remainingSpecialTileCount;
          completed = remainingSpecialTileCount === 0;
          break;
        }

        case 'combo_target':
          currentCount = maxComboAchieved;
          completed = maxComboAchieved >= (obj.targetCombo || 3);
          break;

        case 'move_limit':
          completed = remainingBoardTilesCount === 0;
          break;

        case 'time_trial':
          completed = remainingBoardTilesCount === 0;
          break;

        default:
          completed = remainingBoardTilesCount === 0;
          break;
      }

      return {
        ...obj,
        currentCount,
        completed,
      };
    });

    const allObjectivesMet = objectives.length > 0
      ? objectives.every(o => o.completed)
      : remainingBoardTilesCount === 0;
    const starsEarned = this.calculateStars(currentScore, levelDef.starRules);

    return {
      allObjectivesMet,
      objectives,
      starsEarned,
    };
  }
}
