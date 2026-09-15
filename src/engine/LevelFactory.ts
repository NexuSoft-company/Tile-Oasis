import { LevelDefinition, BoardTile, TileTypeDefinition } from '../types/gameEngine';
import { LevelConfig, LevelReport, LevelGenerationMode } from '../types/levelPipeline';
import { BoardGenerator } from './BoardGenerator';
import { BoardLayouts, BoardLayoutPattern } from './BoardLayouts';
import { DifficultyCurve } from './DifficultyCurve';
import { DifficultyAnalyzer } from './DifficultyAnalyzer';
import { LevelSimulator } from './LevelSimulator';
import { LevelQualityScore } from './LevelQualityScore';
import { LevelValidator } from './LevelValidator';
import { SolvabilityValidator } from './SolvabilityValidator';
import { ContentSimilarityAnalyzer } from './ContentSimilarityAnalyzer';
import { ALL_TILE_TYPES } from '../data/levelDefinitions';
import { getWorldForLevel } from '../data/worldDefinitions';
import { PerformanceProfileCalculator } from './LevelPerformanceProfile';

export class LevelFactory {
  public static readonly VERSION = 'v1.1-pacing-wave';

  /**
   * Centralized production factory pipeline:
   * CONFIG -> GENERATE -> SOLVE -> ANALYZE -> QUALITY CHECK -> NOVELTY CHECK -> APPROVE / REJECT
   */
  public static createLevel(config: Partial<LevelConfig> & { levelId: number }): {
    level: LevelDefinition;
    report: LevelReport;
  } {
    const levelId = config.levelId;
    const mode: LevelGenerationMode = config.mode || 'SEEDED';
    const baseSeed = config.seed !== undefined ? config.seed : levelId * 10007 + 42;
    const version = config.version || this.VERSION;

    const worldDef = getWorldForLevel(levelId);
    const worldId = config.worldId || worldDef.id;
    const worldName = config.worldName || worldDef.name;

    // Retrieve wave-based level profile
    const profile = DifficultyCurve.getLevelPositionProfile(levelId);
    const specialType = profile.specialType;

    // Select layout pattern based on config, hand-authored choice, or difficulty curve shape rotation
    const layoutPattern: BoardLayoutPattern =
      config.layoutPattern || DifficultyCurve.getRotatedLayoutPattern(levelId);

    // Get unlocked tile categories for level progression combined with world affinity
    const unlockedCategories = DifficultyCurve.getUnlockedTileCategories(levelId);
    const worldAffinities = (worldDef.primaryTileCategories || []).filter(cat =>
      unlockedCategories.includes(cat as any)
    );
    const effectiveCategories =
      config.tileCategories ||
      (worldAffinities.length >= 2 ? worldAffinities : unlockedCategories);

    // CASUAL RETENTION TUNING:
    // Cap unique item types strictly between 3 and 7 so that matching triplets are always
    // readily available on the board, preventing tray clogging and maximizing player retention!
    const maxUniqueItemTypes = Math.max(3, Math.min(7, 3 + Math.floor(levelId / 12)));

    const tilePool = ALL_TILE_TYPES.filter(t => effectiveCategories.includes(t.category));
    let effectivePool = tilePool.length >= 2 ? tilePool : ALL_TILE_TYPES.slice(0, 4);

    // Deterministically shuffle and slice the pool based on max allowed unique items for this level
    let poolSeed = baseSeed;
    const getRandomForPool = () => {
      poolSeed = (poolSeed * 9301 + 49297) % 233280;
      return poolSeed / 233280;
    };
    effectivePool = [...effectivePool].sort(() => getRandomForPool() - 0.5).slice(0, maxUniqueItemTypes);

    let finalTiles: BoardTile[] = [];
    let trayCapacity = config.trayCapacity || profile.trayCapacity;

    let seedModifier = 0;
    let attempts = 0;
    const maxAttempts = 25;

    let simulation = LevelSimulator.simulate([], trayCapacity);
    let diffResult = DifficultyAnalyzer.analyze({}, simulation);
    let qualityResult = LevelQualityScore.calculateQualityScore({}, diffResult.score, simulation);
    let noveltyScore = 100;

    if (mode === 'HAND_AUTHORED' && config.explicitTiles) {
      finalTiles = config.explicitTiles;
      simulation = LevelSimulator.simulate(finalTiles, trayCapacity);
      diffResult = DifficultyAnalyzer.analyze({ tiles: finalTiles, trayCapacity }, simulation);
      qualityResult = LevelQualityScore.calculateQualityScore(
        { id: levelId, tiles: finalTiles, trayCapacity },
        diffResult.score,
        simulation
      );
    } else {
      // PARAMETRIC or SEEDED generation loop with wave-adjusted triplet & layer sizing
      const tripletCount = config.tripletCount || profile.tripletCount;
      const layerCount = config.layerCount || profile.layerCount;

      while (attempts < maxAttempts) {
        attempts++;
        const currentSeed = baseSeed + seedModifier * 997;
        const generated = BoardGenerator.generateBoardTiles(
          levelId,
          currentSeed,
          tripletCount,
          effectivePool,
          layoutPattern,
          layerCount,
          profile.bossArchetype
        );

        simulation = LevelSimulator.simulate(generated, trayCapacity);
        diffResult = DifficultyAnalyzer.analyze({ tiles: generated, trayCapacity }, simulation);
        qualityResult = LevelQualityScore.calculateQualityScore(
          { id: levelId, tiles: generated, trayCapacity },
          diffResult.score,
          simulation
        );

        if (simulation.isSolvable && qualityResult.qualityScore >= 45) {
          finalTiles = generated;
          break;
        }

        seedModifier++;
      }

      // Fallback if loop finishes without hitting quality threshold
      if (finalTiles.length === 0) {
        finalTiles = BoardGenerator.generateBoardTiles(
          levelId,
          baseSeed,
          tripletCount,
          effectivePool,
          layoutPattern,
          layerCount,
          profile.bossArchetype
        );
        simulation = LevelSimulator.simulate(finalTiles, trayCapacity);
        diffResult = DifficultyAnalyzer.analyze({ tiles: finalTiles, trayCapacity }, simulation);
        qualityResult = LevelQualityScore.calculateQualityScore(
          { id: levelId, tiles: finalTiles, trayCapacity },
          diffResult.score,
          simulation
        );
      }
    }

    // Ensure Pack Boss milestones (which feature dedicated boss archetypes) present as Hard difficulty
    if (profile.bossArchetype && (diffResult.label === 'Easy' || diffResult.label === 'Normal' || diffResult.label === 'Medium')) {
      diffResult.label = 'Hard';
      diffResult.score = Math.max(62, diffResult.score);
    }

    const starRules =
      config.explicitStarRules ||
      DifficultyCurve.getScaledStarRules(Math.floor(finalTiles.length / 3), diffResult.score);
    const rewardConfig =
      config.explicitReward || DifficultyCurve.getScaledRewardConfig(levelId, diffResult.score);

    const objectives =
      config.explicitObjectives || DifficultyCurve.getSpecialObjectives(levelId, finalTiles.length);

    const performanceProfile = PerformanceProfileCalculator.calculateProfile({
      id: levelId,
      difficulty: diffResult.label,
      tiles: finalTiles,
      layerCount: config.layerCount || profile.layerCount || 3,
      objectives,
    });

    const levelDef: LevelDefinition = {
      id: levelId,
      worldId,
      worldName,
      name: `Level ${levelId} - ${worldName}`,
      difficulty: diffResult.label,
      numericalDifficulty: diffResult.score,
      trayCapacity,
      tiles: finalTiles,
      objectives,
      starRules,
      rewardConfig,
      isGuaranteedSolvable: simulation.isSolvable,
      seed: baseSeed,
      layoutPattern,
      version,
      bossArchetype: profile.bossArchetype,
      specialLevelType: specialType,
      noveltyScore,
      performanceProfile,
    };

    // Run structural validator
    const validation = LevelValidator.validateLevel(levelDef);

    const report: LevelReport = {
      levelId,
      worldId,
      worldName,
      version,
      seed: baseSeed,
      mode,
      layoutPattern,
      tileCount: finalTiles.length,
      tripletCount: Math.floor(finalTiles.length / 3),
      layerCount: finalTiles.reduce((max, t) => Math.max(max, t.layer), 0) + 1,
      difficultyScore: diffResult.score,
      difficultyLabel: diffResult.label,
      qualityScore: qualityResult.qualityScore,
      isSolvable: simulation.isSolvable,
      simulationMetrics: simulation,
      rewards: rewardConfig,
      starRules,
      validationErrors: validation.errors,
      validationWarnings: [...validation.warnings, ...qualityResult.rejectionReasons],
      approved: validation.isValid && qualityResult.approved,
      createdAtTimestamp: Date.now(),
    };

    return {
      level: levelDef,
      report,
    };
  }
}
