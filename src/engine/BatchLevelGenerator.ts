import { LevelFactory } from './LevelFactory';
import { BatchValidationReport, LevelReport, LevelConfig } from '../types/levelPipeline';
import { DifficultyLevel } from '../types/gameEngine';

export class BatchLevelGenerator {
  /**
   * Generates a batch of N levels and performs batch validation & analytical distribution reporting.
   */
  public static generateBatch(count: number = 100, startLevelId: number = 1): BatchValidationReport {
    const startTime = Date.now();
    const reports: LevelReport[] = [];

    const difficultyDistribution: Record<DifficultyLevel, number> = {
      Easy: 0,
      Normal: 0,
      Medium: 0,
      Hard: 0,
      'Very Hard': 0,
      Expert: 0,
    };

    const layoutDistribution: Record<string, number> = {};
    const categoryDistribution: Record<string, number> = {};

    let totalDiffScore = 0;
    let minDiffScore = 100;
    let maxDiffScore = 0;

    let totalQualityScore = 0;
    let minQualityScore = 100;
    let maxQualityScore = 0;

    let passedCount = 0;
    let failedCount = 0;
    let rejectedCount = 0;

    for (let i = 0; i < count; i++) {
      const levelId = startLevelId + i;
      const config: LevelConfig = {
        levelId,
        worldId: Math.floor((levelId - 1) / 5) + 1,
        mode: 'SEEDED',
        seed: levelId * 10007 + 42,
      };

      const { level, report } = LevelFactory.createLevel(config);
      reports.push(report);

      // Track distribution stats
      difficultyDistribution[report.difficultyLabel] =
        (difficultyDistribution[report.difficultyLabel] || 0) + 1;
      layoutDistribution[report.layoutPattern] =
        (layoutDistribution[report.layoutPattern] || 0) + 1;

      level.tiles.forEach(t => {
        categoryDistribution[t.typeId] = (categoryDistribution[t.typeId] || 0) + 1;
      });

      totalDiffScore += report.difficultyScore;
      minDiffScore = Math.min(minDiffScore, report.difficultyScore);
      maxDiffScore = Math.max(maxDiffScore, report.difficultyScore);

      totalQualityScore += report.qualityScore;
      minQualityScore = Math.min(minQualityScore, report.qualityScore);
      maxQualityScore = Math.max(maxQualityScore, report.qualityScore);

      if (report.approved) {
        passedCount++;
      } else if (!report.isSolvable) {
        failedCount++;
      } else {
        rejectedCount++;
      }
    }

    const executionTimeMs = Date.now() - startTime;

    return {
      totalGenerated: count,
      passedCount,
      failedCount,
      rejectedCount,
      passRatePercentage: Math.round((passedCount / count) * 100),
      avgDifficultyScore: Math.round((totalDiffScore / count) * 10) / 10,
      minDifficultyScore: minDiffScore,
      maxDifficultyScore: maxDiffScore,
      avgQualityScore: Math.round((totalQualityScore / count) * 10) / 10,
      minQualityScore,
      maxQualityScore,
      difficultyDistribution,
      layoutDistribution,
      categoryDistribution,
      reports,
      executionTimeMs,
    };
  }

  /**
   * Performs Determinism Test:
   * Generates level twice with identical config/seed and asserts 100% board equality.
   */
  public static verifyDeterminism(levelId: number, seed?: number): boolean {
    const config: LevelConfig = {
      levelId,
      worldId: Math.floor((levelId - 1) / 5) + 1,
      mode: 'SEEDED',
      seed: seed !== undefined ? seed : levelId * 10007 + 42,
    };

    const run1 = LevelFactory.createLevel(config);
    const run2 = LevelFactory.createLevel(config);

    if (run1.level.tiles.length !== run2.level.tiles.length) return false;

    for (let i = 0; i < run1.level.tiles.length; i++) {
      const t1 = run1.level.tiles[i];
      const t2 = run2.level.tiles[i];
      if (t1.id !== t2.id || t1.typeId !== t2.typeId || t1.x !== t2.x || t1.y !== t2.y || t1.layer !== t2.layer) {
        return false;
      }
    }

    return true;
  }
}
