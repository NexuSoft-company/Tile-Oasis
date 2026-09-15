import { LevelDefinition } from '../types/gameEngine';

export interface LevelSimilarityVector {
  levelId: number;
  layoutPattern: string;
  tileCount: number;
  tripletCount: number;
  layerCount: number;
  trayCapacity: number;
  numericalDifficulty: number;
  tileCategories: string[];
  specialMechanics: string[];
  specialLevelType: string;
  bossArchetype?: string;
  seed: number;
}

export interface SimilarityComparison {
  levelA: number;
  levelB: number;
  distance: number;
  isIdenticalShape: boolean;
  isIdenticalTileCount: boolean;
  isIdenticalLayers: boolean;
  isIdenticalCategories: boolean;
  isIdenticalDifficulty: boolean;
  isIdenticalMechanics: boolean;
  isRepetitiveStreak: boolean;
  score: number; // 0.0 (completely different) to 1.0 (identical)
}

export interface LevelNoveltyReport {
  levelId: number;
  noveltyScore: number; // 0 (stale/repetitive) to 100 (highly novel)
  isConsecutiveIdenticalLayout: boolean;
  isRepeatedMechanicCombo: boolean;
  isIdenticalTileCountRun: boolean;
  isMonotonicDifficultyStreak: boolean;
  averageHistorySimilarity: number;
  recommendation: 'APPROVE' | 'REJECT_AND_RETRY';
}

export interface RepetitionReport {
  analyzedCount: number;
  flaggedPairs: SimilarityComparison[];
  averageSimilarity: number;
  maxConsecutiveIdenticalLayouts: number;
  healthyVarietyDistribution: boolean;
  averageNoveltyScore: number;
}

export class ContentSimilarityAnalyzer {
  /**
   * Extracts a standardized similarity vector from a LevelDefinition.
   */
  public static extractVector(level: LevelDefinition): LevelSimilarityVector {
    const layerCount = level.tiles.reduce((max, t) => Math.max(max, t.layer), 0) + 1;
    const tileTypeIds = Array.from(new Set(level.tiles.map(t => t.typeId)));
    const specialMechanics = Array.from(
      new Set(
        level.tiles
          .map(t => t.specialProperty)
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
          .map(p => String(p))
      )
    );
    
    return {
      levelId: level.id,
      layoutPattern: level.layoutPattern || 'Pyramid',
      tileCount: level.tiles.length,
      tripletCount: Math.floor(level.tiles.length / 3),
      layerCount,
      trayCapacity: level.trayCapacity,
      numericalDifficulty: level.numericalDifficulty,
      tileCategories: tileTypeIds,
      specialMechanics,
      specialLevelType: level.specialLevelType || 'STANDARD',
      bossArchetype: level.bossArchetype,
      seed: level.seed,
    };
  }

  /**
   * Compares two level vectors across 8 weighted dimensions and produces a composite similarity score [0.0 - 1.0].
   */
  public static compare(a: LevelSimilarityVector, b: LevelSimilarityVector): SimilarityComparison {
    const isIdenticalShape = a.layoutPattern === b.layoutPattern;
    const isIdenticalTileCount = Math.abs(a.tileCount - b.tileCount) <= 3;
    const isIdenticalLayers = a.layerCount === b.layerCount;
    const isIdenticalDifficulty = Math.abs(a.numericalDifficulty - b.numericalDifficulty) < 4;

    // Jaccard similarity for tile categories / types
    const setA = new Set(a.tileCategories);
    const setB = new Set(b.tileCategories);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    const jaccardCategories = union.size > 0 ? intersection.size / union.size : 1.0;
    const isIdenticalCategories = jaccardCategories > 0.85;

    // Special mechanics overlap
    const mechA = new Set(a.specialMechanics);
    const mechB = new Set(b.specialMechanics);
    const mechInter = new Set([...mechA].filter(x => mechB.has(x)));
    const mechUnion = new Set([...mechA, ...mechB]);
    const jaccardMechanics = mechUnion.size > 0 ? mechInter.size / mechUnion.size : 1.0;
    const isIdenticalMechanics = jaccardMechanics > 0.8;

    // Multi-dimensional composite score (weights sum to 1.0)
    let score = 0;
    if (isIdenticalShape) score += 0.25;
    if (isIdenticalTileCount) score += 0.15;
    if (isIdenticalLayers) score += 0.10;
    score += jaccardCategories * 0.15;
    score += jaccardMechanics * 0.15;
    if (a.trayCapacity === b.trayCapacity) score += 0.05;
    if (a.specialLevelType === b.specialLevelType) score += 0.10;
    if (isIdenticalDifficulty) score += 0.05;

    const isRepetitiveStreak = isIdenticalShape && isIdenticalTileCount && isIdenticalLayers;

    return {
      levelA: a.levelId,
      levelB: b.levelId,
      distance: Math.abs(a.levelId - b.levelId),
      isIdenticalShape,
      isIdenticalTileCount,
      isIdenticalLayers,
      isIdenticalCategories,
      isIdenticalDifficulty,
      isIdenticalMechanics,
      isRepetitiveStreak,
      score: Number(score.toFixed(3)),
    };
  }

  /**
   * Evaluates the Novelty Score of a candidate level relative to a rolling window of recent levels.
   */
  public static calculateNoveltyScore(
    candidate: LevelDefinition,
    recentHistory: LevelDefinition[]
  ): LevelNoveltyReport {
    const candidateVec = this.extractVector(candidate);
    const validHistory = (recentHistory || [])
      .filter(l => l && l.id !== candidate.id)
      .slice(-5); // Check last 5 levels

    if (validHistory.length === 0) {
      return {
        levelId: candidate.id,
        noveltyScore: 100,
        isConsecutiveIdenticalLayout: false,
        isRepeatedMechanicCombo: false,
        isIdenticalTileCountRun: false,
        isMonotonicDifficultyStreak: false,
        averageHistorySimilarity: 0,
        recommendation: 'APPROVE',
      };
    }

    const previousLevel = validHistory[validHistory.length - 1];
    const prevVec = this.extractVector(previousLevel);
    const directComp = this.compare(candidateVec, prevVec);

    const isConsecutiveIdenticalLayout = candidateVec.layoutPattern === prevVec.layoutPattern;
    const isRepeatedMechanicCombo = directComp.isIdenticalMechanics && candidateVec.specialMechanics.length > 0;

    // Check for run of identical tile counts across history
    const tileCounts = [...validHistory.map(h => h.tiles.length), candidate.tiles.length];
    const isIdenticalTileCountRun = tileCounts.length >= 3 && tileCounts.every(tc => tc === candidate.tiles.length);

    // Check for flat monotonic difficulty streak
    const diffScores = [...validHistory.map(h => h.numericalDifficulty), candidate.numericalDifficulty];
    const isMonotonicDifficultyStreak = diffScores.length >= 3 && diffScores.every(d => Math.abs(d - candidate.numericalDifficulty) < 2);

    // Compute average similarity against recent window
    let totalSimilarity = 0;
    validHistory.forEach(h => {
      const comp = this.compare(candidateVec, this.extractVector(h));
      totalSimilarity += comp.score;
    });
    const averageHistorySimilarity = totalSimilarity / validHistory.length;

    // Calculate baseline novelty score (0-100)
    let noveltyScore = 100 - averageHistorySimilarity * 60;

    if (isConsecutiveIdenticalLayout) noveltyScore -= 25;
    if (isRepeatedMechanicCombo) noveltyScore -= 15;
    if (isIdenticalTileCountRun) noveltyScore -= 15;
    if (isMonotonicDifficultyStreak) noveltyScore -= 10;

    noveltyScore = Math.max(0, Math.min(100, Math.round(noveltyScore)));

    const recommendation: 'APPROVE' | 'REJECT_AND_RETRY' =
      noveltyScore >= 40 && !isConsecutiveIdenticalLayout ? 'APPROVE' : 'REJECT_AND_RETRY';

    return {
      levelId: candidate.id,
      noveltyScore,
      isConsecutiveIdenticalLayout,
      isRepeatedMechanicCombo,
      isIdenticalTileCountRun,
      isMonotonicDifficultyStreak,
      averageHistorySimilarity: Number(averageHistorySimilarity.toFixed(3)),
      recommendation,
    };
  }

  /**
   * Analyzes a contiguous sequence of levels for repetitive patterns.
   */
  public static analyzeSequence(levels: LevelDefinition[]): RepetitionReport {
    const validLevels = (levels || []).filter((l): l is LevelDefinition => Boolean(l && l.tiles));
    const vectors = validLevels.map(l => this.extractVector(l));
    const comparisons: SimilarityComparison[] = [];
    let totalScore = 0;
    let maxConsecutiveLayouts = 1;
    let currentConsecutive = 1;
    let totalNovelty = 0;

    for (let i = 0; i < vectors.length - 1; i++) {
      const comp = this.compare(vectors[i], vectors[i + 1]);
      comparisons.push(comp);
      totalScore += comp.score;

      if (vectors[i].layoutPattern === vectors[i + 1].layoutPattern) {
        currentConsecutive++;
        if (currentConsecutive > maxConsecutiveLayouts) {
          maxConsecutiveLayouts = currentConsecutive;
        }
      } else {
        currentConsecutive = 1;
      }
    }

    // Novelty calculation across sequence
    for (let i = 0; i < validLevels.length; i++) {
      const history = validLevels.slice(Math.max(0, i - 4), i);
      const novReport = this.calculateNoveltyScore(validLevels[i], history);
      totalNovelty += novReport.noveltyScore;
    }

    const flagged = comparisons.filter(c => c.isRepetitiveStreak && c.score >= 0.80);
    const averageSimilarity = comparisons.length > 0 ? Number((totalScore / comparisons.length).toFixed(3)) : 0;
    const averageNoveltyScore = validLevels.length > 0 ? Math.round(totalNovelty / validLevels.length) : 100;

    return {
      analyzedCount: levels.length,
      flaggedPairs: flagged,
      averageSimilarity,
      maxConsecutiveIdenticalLayouts: maxConsecutiveLayouts,
      healthyVarietyDistribution: averageSimilarity < 0.65 && maxConsecutiveLayouts <= 2,
      averageNoveltyScore,
    };
  }
}
