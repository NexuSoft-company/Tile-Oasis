import { LevelDefinition, DifficultyLevel } from '../types/gameEngine';
import { BoardLayoutPattern, BoardLayouts } from './BoardLayouts';
import { DifficultyCurve, BossArchetype, SpecialLevelType } from './DifficultyCurve';
import { ContentSimilarityAnalyzer, RepetitionReport } from './ContentSimilarityAnalyzer';
import { RuntimeLevelRegistry } from './RuntimeLevelRegistry';

export interface CampaignPacingReport {
  levelRange: [number, number];
  totalLevels: number;
  difficultyDistribution: Record<DifficultyLevel, { count: number; percentage: number }>;
  averageNumericalDifficulty: number;
  tileCountBands: {
    small_18_36: { count: number; percentage: number };
    medium_37_60: { count: number; percentage: number };
    large_61_84: { count: number; percentage: number };
    extreme_85_108: { count: number; percentage: number };
  };
  layoutDistribution: Record<string, { count: number; percentage: number }>;
  bossArchetypeDistribution: Record<BossArchetype, number>;
  specialLevelDistribution: Record<SpecialLevelType, number>;
  mechanicPresence: {
    frozen: number;
    chained: number;
    golden: number;
    rainbow: number;
    bomb: number;
    key: number;
  };
  repetitionAnalysis: RepetitionReport;
  solvabilityRate: number; // Percentage 0 - 100
  isBalancedWaveProgression: boolean;
}

export class CampaignPacingAnalyzer {
  /**
   * Analyzes a sample or range of levels across the campaign.
   */
  public static analyzeCampaignRange(startLevel: number, endLevel: number): CampaignPacingReport {
    const start = Math.max(1, startLevel);
    const end = Math.min(9999, endLevel);
    const totalLevels = end - start + 1;

    const diffCounts: Record<DifficultyLevel, number> = {
      Easy: 0,
      Normal: 0,
      Medium: 0,
      Hard: 0,
      'Very Hard': 0,
      Expert: 0,
    };

    let totalDiffScore = 0;
    let smallCount = 0;
    let mediumCount = 0;
    let largeCount = 0;
    let extremeCount = 0;

    const layoutCounts: Record<string, number> = {};
    BoardLayouts.ALL_PATTERNS.forEach(p => {
      layoutCounts[p] = 0;
    });

    const bossCounts: Record<BossArchetype, number> = {
      FORTRESS_BOSS: 0,
      TIME_BOSS: 0,
      CHAIN_BOSS: 0,
      BOMB_BOSS: 0,
      KEY_BOSS: 0,
      MULTI_LAYER_BOSS: 0,
      COMBO_BOSS: 0,
      CHAOS_BOSS: 0,
    };

    const specialCounts: Record<SpecialLevelType, number> = {
      STANDARD: 0,
      CHALLENGE: 0,
      COMBO_FRENZY: 0,
      TIME_ATTACK: 0,
      MOVE_LIMIT: 0,
      BONUS_REWARD: 0,
      PACK_BOSS: 0,
      WORLD_FINALE: 0,
    };

    const mechanics = {
      frozen: 0,
      chained: 0,
      golden: 0,
      rainbow: 0,
      bomb: 0,
      key: 0,
    };

    const levels: LevelDefinition[] = [];
    let solvableCount = 0;

    for (let id = start; id <= end; id++) {
      const level = RuntimeLevelRegistry.getLevel(id);
      levels.push(level);

      if (level.isGuaranteedSolvable) {
        solvableCount++;
      }

      diffCounts[level.difficulty] = (diffCounts[level.difficulty] || 0) + 1;
      totalDiffScore += level.numericalDifficulty;

      const tc = level.tiles.length;
      if (tc <= 36) smallCount++;
      else if (tc <= 60) mediumCount++;
      else if (tc <= 84) largeCount++;
      else extremeCount++;

      const pattern = level.layoutPattern || 'Pyramid';
      layoutCounts[pattern] = (layoutCounts[pattern] || 0) + 1;

      const profile = DifficultyCurve.getLevelPositionProfile(id);
      specialCounts[profile.specialType] = (specialCounts[profile.specialType] || 0) + 1;

      if (profile.bossArchetype) {
        bossCounts[profile.bossArchetype] = (bossCounts[profile.bossArchetype] || 0) + 1;
      }

      level.tiles.forEach(t => {
        if (t.specialProperty === 'frozen') mechanics.frozen++;
        if (t.specialProperty === 'chained') mechanics.chained++;
        if (t.specialProperty === 'golden') mechanics.golden++;
        if (t.specialProperty === 'rainbow') mechanics.rainbow++;
        if (t.specialProperty === 'bomb') mechanics.bomb++;
        if (t.specialProperty === 'key') mechanics.key++;
      });
    }

    const calcPct = (cnt: number) => ({
      count: cnt,
      percentage: Number(((cnt / totalLevels) * 100).toFixed(1)),
    });

    const repetitionAnalysis = ContentSimilarityAnalyzer.analyzeSequence(levels);

    const difficultyDistribution: Record<DifficultyLevel, { count: number; percentage: number }> = {
      Easy: calcPct(diffCounts.Easy),
      Normal: calcPct(diffCounts.Normal),
      Medium: calcPct(diffCounts.Medium),
      Hard: calcPct(diffCounts.Hard),
      'Very Hard': calcPct(diffCounts['Very Hard']),
      Expert: calcPct(diffCounts.Expert),
    };

    const layoutDistribution: Record<string, { count: number; percentage: number }> = {};
    Object.entries(layoutCounts).forEach(([k, v]) => {
      layoutDistribution[k] = calcPct(v);
    });

    // Check whether the curve has authentic ebb-and-flow waves (no single tier dominates > 65%)
    const maxDifficultyTierPct = Math.max(...Object.values(difficultyDistribution).map(d => d.percentage));
    const isBalancedWaveProgression = maxDifficultyTierPct <= 65 && repetitionAnalysis.healthyVarietyDistribution;

    return {
      levelRange: [start, end],
      totalLevels,
      difficultyDistribution,
      averageNumericalDifficulty: Number((totalDiffScore / totalLevels).toFixed(1)),
      tileCountBands: {
        small_18_36: calcPct(smallCount),
        medium_37_60: calcPct(mediumCount),
        large_61_84: calcPct(largeCount),
        extreme_85_108: calcPct(extremeCount),
      },
      layoutDistribution,
      bossArchetypeDistribution: bossCounts,
      specialLevelDistribution: specialCounts,
      mechanicPresence: mechanics,
      repetitionAnalysis,
      solvabilityRate: Number(((solvableCount / totalLevels) * 100).toFixed(1)),
      isBalancedWaveProgression,
    };
  }
}
