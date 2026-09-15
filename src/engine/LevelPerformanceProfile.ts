import { DifficultyLevel, BoardTile, LevelDefinition } from '../types/gameEngine';
import { SimulationMetrics } from '../types/levelPipeline';
import { LevelSimulator } from './LevelSimulator';

export interface LevelPerformanceProfile {
  levelId: number;
  minimumMoves: number;
  recommendedMoves: number;
  threeStarMoves: number;
  twoStarMoves: number;
  oneStarMoves: number;
  expectedDuration: number;
  minimumDuration: number;
  difficulty: DifficultyLevel | string;
  tileCount: number;
  tripletCount: number;
  mechanicComplexity: number;

  // Legacy/Convenience aliases
  threeStarMoveThreshold?: number;
  twoStarMoveThreshold?: number;
  oneStarMoveThreshold?: number;
  expectedDurationSeconds?: number;
  twoStarTimeThresholdSeconds?: number;
  threeStarTimeThresholdSeconds?: number;
}

export interface LevelStarsInput {
  levelId: number;
  movesUsed: number;
  durationSeconds?: number;
  durationMs?: number;
  boostersUsed?: Record<string, number>;
  performanceData?: any;
  isCompleted?: boolean;
  score?: number;
  profile?: LevelPerformanceProfile;
  levelDef?: LevelDefinition | any;
}

export class LevelPerformanceCalculator {
  private static profileCache: Map<number, LevelPerformanceProfile> = new Map();

  /**
   * Clears cached profiles (useful for testing).
   */
  public static clearCache(): void {
    this.profileCache.clear();
  }

  /**
   * Deterministically calculates the LevelPerformanceProfile for a given level definition or tiles.
   */
  public static getProfile(
    levelDef: {
      id: number;
      tiles: BoardTile[];
      difficulty?: DifficultyLevel | string;
      numericalDifficulty?: number;
      layerCount?: number;
      objectives?: any[];
    },
    simulation?: SimulationMetrics
  ): LevelPerformanceProfile {
    const cached = this.profileCache.get(levelDef.id);
    if (cached && cached.tileCount === levelDef.tiles.length) {
      return cached;
    }

    const tileCount = levelDef.tiles.length;
    const tripletCount = Math.max(1, Math.floor(tileCount / 3));

    // 1. Calculate chain actions and mechanics
    let totalChainActions = 0;
    let frozenCount = 0;
    let specialMechanicsCount = 0;

    for (const tile of levelDef.tiles) {
      if (tile.specialProperty === 'chained' || (tile.chainCount && tile.chainCount > 0)) {
        totalChainActions += tile.chainCount || 1;
        specialMechanicsCount++;
      }
      if (tile.specialProperty === 'frozen' || (tile.freezeLevel && tile.freezeLevel > 0)) {
        frozenCount += tile.freezeLevel || 1;
        specialMechanicsCount++;
      }
      if (tile.specialProperty === 'bomb' || tile.specialProperty === 'key' || tile.specialProperty === 'rainbow') {
        specialMechanicsCount++;
      }
    }

    // 2. Minimum Moves Solver / Deterministic Analysis
    // Theoretical absolute minimum: each tile must be picked into the tray (or matched) + chain unlocks
    const theoreticalMinMoves = tileCount + totalChainActions;

    // Run simulation if not already provided
    const sim = simulation || LevelSimulator.simulate(levelDef.tiles, 7);
    const simSteps = sim.stepsTaken > 0 ? sim.stepsTaken : theoreticalMinMoves;

    // Minimum achievable moves: at least theoretical minimum, taking simulation steps into account
    const minimumMoves = Math.max(theoreticalMinMoves, simSteps);

    // 3. Mechanic Complexity score (0 - 100)
    const maxLayer = levelDef.tiles.reduce((max, t) => Math.max(max, t.layer || 0), 0);
    const mechanicComplexity = Math.min(
      100,
      Math.round(
        (specialMechanicsCount / Math.max(1, tileCount)) * 50 +
        (maxLayer * 8) +
        (frozenCount * 3) +
        (totalChainActions * 4)
      )
    );

    // 4. Calculate difficulty multiplier and thresholds
    const difficultyStr = (levelDef.difficulty || 'Normal').toString();
    const isEasy = difficultyStr === 'Easy';
    const isNormal = difficultyStr === 'Normal';
    const isHard = difficultyStr === 'Hard' || difficultyStr === 'Very Hard' || difficultyStr === 'Expert';
    const isBoss = levelDef.id % 25 === 0;

    let threeStarMultiplier = 1.22;
    let twoStarMultiplier = 1.52;
    let baseThreeStarBuffer = 2;
    let baseTwoStarBuffer = 4;

    if (isEasy || levelDef.id <= 5) {
      threeStarMultiplier = 1.28;
      twoStarMultiplier = 1.60;
      baseThreeStarBuffer = 3;
      baseTwoStarBuffer = 6;
    } else if (isNormal || levelDef.id <= 25) {
      threeStarMultiplier = 1.25;
      twoStarMultiplier = 1.55;
      baseThreeStarBuffer = 2;
      baseTwoStarBuffer = 5;
    } else if (isBoss) {
      threeStarMultiplier = 1.20;
      twoStarMultiplier = 1.48;
      baseThreeStarBuffer = 2;
      baseTwoStarBuffer = 5;
    } else if (isHard) {
      threeStarMultiplier = 1.18;
      twoStarMultiplier = 1.46;
      baseThreeStarBuffer = 2;
      baseTwoStarBuffer = 4;
    }

    // Dynamic Move Thresholds
    const threeStarMoves = Math.max(
      minimumMoves,
      Math.floor(minimumMoves * threeStarMultiplier) + baseThreeStarBuffer
    );
    const twoStarMoves = Math.max(
      threeStarMoves + 1,
      Math.floor(minimumMoves * twoStarMultiplier) + baseTwoStarBuffer
    );
    const oneStarMoves = twoStarMoves + Math.max(4, Math.floor(minimumMoves * 0.4));

    // Recommended moves for relaxed play limit
    const recommendedMoves = Math.max(
      twoStarMoves + 2,
      Math.floor(minimumMoves * (1.35 + Math.min(0.25, (levelDef.numericalDifficulty || 50) / 200)))
    );

    // 5. Expected and Minimum Completion Times (in seconds)
    const baseSecondsPerMatch = isEasy ? 2.5 : isNormal ? 3.0 : 3.6;
    const mechanicTimeBuffer = Math.round(frozenCount * 2.0 + totalChainActions * 1.5);
    const expectedDuration = Math.max(
      20,
      Math.round(tripletCount * baseSecondsPerMatch + mechanicTimeBuffer + (isBoss ? 20 : 10))
    );
    const minimumDuration = Math.max(5, Math.round(tripletCount * 0.9));

    const profile: LevelPerformanceProfile = {
      levelId: levelDef.id,
      minimumMoves,
      recommendedMoves,
      threeStarMoves,
      twoStarMoves,
      oneStarMoves,
      expectedDuration,
      minimumDuration,
      difficulty: levelDef.difficulty || 'Normal',
      tileCount,
      tripletCount,
      mechanicComplexity,

      // Convenient compatibility aliases
      threeStarMoveThreshold: threeStarMoves,
      twoStarMoveThreshold: twoStarMoves,
      oneStarMoveThreshold: oneStarMoves,
      expectedDurationSeconds: expectedDuration,
      twoStarTimeThresholdSeconds: expectedDuration,
      threeStarTimeThresholdSeconds: Math.round(expectedDuration * 0.8),
    };

    this.profileCache.set(levelDef.id, profile);
    return profile;
  }

  /**
   * Alias for calculateProfile to support various pipeline callers.
   */
  public static calculateProfile(
    levelDef: {
      id: number;
      tiles: BoardTile[];
      difficulty?: DifficultyLevel | string;
      numericalDifficulty?: number;
      layerCount?: number;
      objectives?: any[];
    },
    simulation?: SimulationMetrics
  ): LevelPerformanceProfile {
    return this.getProfile(levelDef, simulation);
  }

  /**
   * Authoritatively evaluates stars for a played level.
   */
  public static calculateLevelStars(params: LevelStarsInput): number {
    const isCompleted = params.isCompleted !== undefined ? params.isCompleted : true;
    if (!isCompleted) {
      return 0;
    }

    const { levelId, movesUsed } = params;
    const durationSeconds = params.durationSeconds !== undefined
      ? params.durationSeconds
      : Math.floor((params.durationMs || 0) / 1000);

    const profile = params.profile || (params.levelDef ? this.getProfile(params.levelDef) : this.getProfile({
      id: levelId,
      tiles: new Array(Math.max(12, Math.min(150, 12 + (levelId % 50) * 3))).fill({ id: 'dummy', typeId: 't1', x: 0, y: 0, layer: 0, state: 'AVAILABLE' }),
      difficulty: levelId % 25 === 0 ? 'Expert' : levelId > 50 ? 'Hard' : levelId > 10 ? 'Medium' : 'Easy',
    }));

    // 1. Check 3-Star achievement
    if (movesUsed <= profile.threeStarMoves) {
      // Generous time window (1.6x expected time) so slow/mobile players are never unfairly punished
      if (durationSeconds <= profile.expectedDuration * 1.6) {
        return 3;
      }
      return 2;
    }

    // 2. High-speed skill bonus for near-optimal play (moves = 3★ + 1 with fast time)
    if (movesUsed <= profile.threeStarMoves + 1 && durationSeconds <= profile.expectedDuration * 0.75) {
      return 3;
    }

    // 3. Check 2-Star achievement
    if (movesUsed <= profile.twoStarMoves) {
      return 2;
    }

    // 4. Completed level guarantees at least 1★
    return 1;
  }
}

export const PerformanceProfileCalculator = LevelPerformanceCalculator;
