import { LevelResult } from '../types/runtimeContract';
import { LevelSession } from './LevelSession';
import { RewardSystem } from './RewardSystem';
import { PerformanceProfileCalculator, LevelPerformanceProfile, LevelStarsInput } from './LevelPerformanceProfile';

export class LevelResultSystem {
  /**
   * Authoritative calculation of stars based on dynamic level performance profile.
   * Result:
   *  3 -> excellent performance (within 3★ move budget & reasonable time)
   *  2 -> good/normal performance (within 2★ move budget)
   *  1 -> completed level
   *  0 -> uncompleted / failed level
   */
  public static calculateLevelStars(params: LevelStarsInput): number {
    return PerformanceProfileCalculator.calculateLevelStars(params);
  }

  /**
   * Constructs a standardized LevelResult from an active session and completion state.
   */
  public static createResult(
    session: LevelSession,
    completed: boolean,
    failureReason?: string
  ): LevelResult {
    const levelDef = session.levelDef;
    const score = session.state.score;
    const movesUsed = session.state.movesUsed;
    const timeUsedSeconds = session.getElapsedTimeSeconds();

    // 1. Calculate dynamic level performance profile
    const profile: LevelPerformanceProfile =
      (levelDef as any).performanceProfile ||
      PerformanceProfileCalculator.calculateProfile(levelDef);

    // 2. Calculate authoritatively evaluated stars (0 if failed, 1/2/3 if completed)
    let stars = 0;
    if (completed) {
      stars = PerformanceProfileCalculator.calculateLevelStars({
        levelId: levelDef.id,
        movesUsed,
        durationSeconds: timeUsedSeconds,
        boostersUsed: session.state.boosterUsage,
        isCompleted: true,
        score,
        profile,
        levelDef,
      });

      if (process.env.NODE_ENV !== 'production') {
        const specialMechanics: string[] = [];
        if (levelDef.tiles.some(t => t.specialProperty === 'frozen')) specialMechanics.push('Frozen');
        if (levelDef.tiles.some(t => t.specialProperty === 'chained')) specialMechanics.push('Chained');
        if (levelDef.tiles.some(t => t.specialProperty === 'rainbow')) specialMechanics.push('Rainbow');
        if (levelDef.tiles.some(t => t.specialProperty === 'golden')) specialMechanics.push('Golden');
        if (levelDef.tiles.some(t => t.specialProperty === 'bomb')) specialMechanics.push('Bomb');
        if (levelDef.tiles.some(t => t.specialProperty === 'key')) specialMechanics.push('Key');

        console.log(`\n========================================`);
        console.log(`LEVEL PERFORMANCE & STAR EVALUATION`);
        console.log(`Level: ${levelDef.id}`);
        console.log(`Minimum Moves: ${profile.minimumMoves}`);
        console.log(`Recommended Moves: ${profile.recommendedMoves}`);
        console.log(`3★ Threshold: ${profile.threeStarMoves}`);
        console.log(`2★ Threshold: ${profile.twoStarMoves}`);
        console.log(`Expected Time: ${profile.expectedDuration} sec`);
        console.log(`Difficulty: ${profile.difficulty}`);
        console.log(`Tile Count: ${profile.tileCount}`);
        console.log(`Mechanics: ${specialMechanics.length > 0 ? specialMechanics.join(' + ') : 'Standard'}`);
        console.log(`Player Moves Used: ${movesUsed}`);
        console.log(`Player Time Used: ${timeUsedSeconds}s`);
        console.log(`Player Score: ${score}`);
        console.log(`Calculated Stars: ${stars}`);
        console.log(`========================================\n`);
      }
    }

    // 3. Generate dynamic rewards if completed
    const rewardsEarned = completed
      ? RewardSystem.calculateLevelReward(levelDef, stars, score)
      : { coins: 0, gems: 0, boostersGranted: {}, stars: 0, expPoints: 0 };

    const result: LevelResult = {
      levelId: levelDef.id,
      worldId: levelDef.worldId,
      packId: levelDef.packId,
      completed,
      stars,
      score,
      movesUsed,
      timeUsedSeconds,
      boostersUsed: { ...session.state.boosterUsage },
      tilesMatched: session.state.tilesMatchedCount,
      objectivesCompleted: completed,
      rewardsEarned,
      completionTimestamp: Date.now(),
      version: levelDef.version || 'v1.0',
    };

    return result;
  }
}
