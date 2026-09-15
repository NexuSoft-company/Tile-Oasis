import { RewardDefinition, LevelDefinition } from '../types/gameEngine';

export class RewardSystem {
  /**
   * Generates dynamic completion rewards based on level difficulty, stars earned, and combo performance.
   */
  public static calculateLevelReward(
    level: LevelDefinition,
    starsEarned: number,
    finalScore: number
  ): RewardDefinition {
    const difficultyMultiplier = 
      level.difficulty === 'Expert' ? 2.5 :
      level.difficulty === 'Very Hard' ? 2.0 :
      level.difficulty === 'Hard' ? 1.5 :
      level.difficulty === 'Medium' ? 1.2 : 1.0;

    const starBonusCoins = starsEarned * 25;
    const baseCoins = Math.round((100 + Math.floor(finalScore / 10)) * difficultyMultiplier);
    const totalCoins = baseCoins + starBonusCoins;

    const gemsEarned = starsEarned === 3 ? (level.difficulty === 'Expert' ? 5 : 2) : 0;

    return {
      coins: totalCoins,
      gems: gemsEarned,
      boostersGranted: starsEarned === 3 ? { undo: 1 } : {},
      stars: starsEarned,
      expPoints: Math.round(50 * difficultyMultiplier * starsEarned),
    };
  }
}
