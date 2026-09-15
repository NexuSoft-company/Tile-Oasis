import { DifficultyLevel, TileCategory } from '../types/gameEngine';
import { BoardLayoutPattern, BoardLayouts } from './BoardLayouts';
import { getWorldForLevel } from '../data/worldDefinitions';

export type SpecialLevelType = 
  | 'STANDARD'
  | 'CHALLENGE'
  | 'COMBO_FRENZY'
  | 'TIME_ATTACK'
  | 'MOVE_LIMIT'
  | 'BONUS_REWARD'
  | 'PACK_BOSS'
  | 'WORLD_FINALE';

export type BossArchetype = 
  | 'FORTRESS_BOSS'
  | 'TIME_BOSS'
  | 'CHAIN_BOSS'
  | 'BOMB_BOSS'
  | 'KEY_BOSS'
  | 'MULTI_LAYER_BOSS'
  | 'COMBO_BOSS'
  | 'CHAOS_BOSS';

export type PackPacingPhase = 
  | 'ONBOARDING'
  | 'PRACTICE'
  | 'CHALLENGE'
  | 'INTRODUCTION'
  | 'COMBINATION'
  | 'DIFFICULTY_SPIKE'
  | 'SPECIAL_TRIAL'
  | 'MASTERY'
  | 'ADVANCED_CHALLENGE'
  | 'RECOVERY_BONUS'
  | 'PACK_BOSS';

export interface TargetDifficultyRange {
  minScore: number;
  maxScore: number;
  targetLabel: DifficultyLevel;
  specialType: SpecialLevelType;
}

export interface LevelPositionProfile {
  indexInPack: number; // 0..24
  phase: PackPacingPhase;
  tripletCount: number;
  tileCount: number;
  layerCount: number;
  trayCapacity: number;
  targetDifficulty: TargetDifficultyRange;
  specialType: SpecialLevelType;
  bossArchetype?: BossArchetype;
  mechanicFocus?: string;
}

export interface PackMetadata {
  id: string;
  packNum: number;
  title: string;
  subtitle: string;
  themeFocus: string;
  primaryLayout: BoardLayoutPattern;
  secondaryLayout: BoardLayoutPattern;
  gameplayFocus: string;
  milestoneTitle: string;
}

export class DifficultyCurve {
  public static readonly ALL_BOSS_ARCHETYPES: BossArchetype[] = [
    'FORTRESS_BOSS',
    'TIME_BOSS',
    'CHAIN_BOSS',
    'BOMB_BOSS',
    'KEY_BOSS',
    'MULTI_LAYER_BOSS',
    'COMBO_BOSS',
    'CHAOS_BOSS',
  ];

  /**
   * Configurable difficulty target ranges mapping 0-100 score to labels.
   */
  public static readonly TARGET_RANGES: Record<DifficultyLevel, { min: number; max: number }> = {
    Easy: { min: 0, max: 20 },
    Normal: { min: 21, max: 40 },
    Medium: { min: 41, max: 60 },
    Hard: { min: 61, max: 75 },
    'Very Hard': { min: 76, max: 90 },
    Expert: { min: 91, max: 100 },
  };

  /**
   * Evaluates special level classification for any level in the campaign.
   */
  public static getSpecialLevelType(levelId: number): SpecialLevelType {
    const clampedLevel = Math.max(1, Math.min(9999, levelId));
    if (clampedLevel === 9999) return 'WORLD_FINALE';

    const indexInPack = (clampedLevel - 1) % 25; // 0..24

    if (indexInPack === 24) return 'PACK_BOSS';
    if (indexInPack === 23) return 'BONUS_REWARD';
    if (indexInPack === 20) return 'MOVE_LIMIT';
    if (indexInPack === 18) return 'TIME_ATTACK';
    if (indexInPack === 14) return 'COMBO_FRENZY';
    if (indexInPack === 7) return 'CHALLENGE';

    return 'STANDARD';
  }

  /**
   * Deterministically returns the Boss Archetype for a pack or level.
   */
  public static getBossArchetype(levelId: number): BossArchetype {
    const clampedLevel = Math.max(1, Math.min(9999, levelId));
    if (clampedLevel === 9999) return 'CHAOS_BOSS';

    const worldId = Math.floor((clampedLevel - 1) / 100) + 1;
    const packNum = Math.floor(((clampedLevel - 1) % 100) / 25) + 1;
    const worldDef = getWorldForLevel(clampedLevel);

    if (worldDef.bossArchetypes && worldDef.bossArchetypes.length >= 4) {
      return worldDef.bossArchetypes[(packNum - 1) % worldDef.bossArchetypes.length] as BossArchetype;
    }

    const archetypeIndex = ((worldId - 1) * 4 + (packNum - 1)) % this.ALL_BOSS_ARCHETYPES.length;
    return this.ALL_BOSS_ARCHETYPES[archetypeIndex];
  }

  /**
   * Evaluates the comprehensive Level Position Profile for any level in the campaign.
   * Produces authentic difficulty waves:
   * TEACH -> PRACTICE -> INTRODUCE -> COMBINE -> MASTER -> CLIMAX -> RECOVERY -> CHALLENGE -> BOSS
   */
  public static getLevelPositionProfile(levelId: number): LevelPositionProfile {
    const clampedLevel = Math.max(1, Math.min(9999, levelId));
    const indexInPack = (clampedLevel - 1) % 25; // 0..24
    const worldId = Math.floor((clampedLevel - 1) / 100) + 1;
    const specialType = this.getSpecialLevelType(clampedLevel);

    // World progress tier: 0 (Worlds 1-5), 1 (6-15), 2 (16-35), 3 (36-65), 4 (66-85), 5 (86-100)
    const worldTier = worldId <= 5 ? 0 : worldId <= 15 ? 1 : worldId <= 35 ? 2 : worldId <= 65 ? 3 : worldId <= 85 ? 4 : 5;

    // Special Grand Finale for level 9999
    if (clampedLevel === 9999) {
      const tripletCount = 32; // 96 tiles
      const layerCount = 5;
      const targetDiff: TargetDifficultyRange = {
        minScore: 88,
        maxScore: 98,
        targetLabel: 'Expert',
        specialType: 'WORLD_FINALE',
      };
      return {
        indexInPack,
        phase: 'PACK_BOSS',
        tripletCount,
        tileCount: tripletCount * 3,
        layerCount,
        trayCapacity: 7,
        targetDifficulty: targetDiff,
        specialType: 'WORLD_FINALE',
        bossArchetype: 'CHAOS_BOSS',
        mechanicFocus: 'Cosmic Convergence',
      };
    }

    // Tutorial / Onboarding early campaign override (Levels 1-5)
    if (clampedLevel === 1) {
      return {
        indexInPack,
        phase: 'ONBOARDING',
        tripletCount: 6, // 18 tiles
        tileCount: 18,
        layerCount: 2,
        trayCapacity: 7,
        targetDifficulty: { minScore: 10, maxScore: 22, targetLabel: 'Easy', specialType: 'STANDARD' },
        specialType: 'STANDARD',
        mechanicFocus: 'Basic Triplet Matching',
      };
    }
    if (clampedLevel <= 3) {
      const triplets = 6 + (clampedLevel - 1) * 2; // 8 or 10 triplets
      return {
        indexInPack,
        phase: 'ONBOARDING',
        tripletCount: triplets,
        tileCount: triplets * 3,
        layerCount: 2,
        trayCapacity: 7,
        targetDifficulty: { minScore: 18, maxScore: 30, targetLabel: 'Easy', specialType: 'STANDARD' },
        specialType: 'STANDARD',
        mechanicFocus: 'Spatial Selection',
      };
    }
    if (clampedLevel <= 5) {
      return {
        indexInPack,
        phase: 'ONBOARDING',
        tripletCount: 10, // 30 tiles
        tileCount: 30,
        layerCount: 2,
        trayCapacity: 7,
        targetDifficulty: { minScore: 25, maxScore: 38, targetLabel: 'Normal', specialType: 'STANDARD' },
        specialType: 'STANDARD',
        mechanicFocus: 'Layer Unblocking',
      };
    }

    // Standard 25-Level Pack Profiles (Positions 0..24)
    let phase: PackPacingPhase = 'PRACTICE';
    let baseTriplets = 14;
    let layerCount = 3;
    let trayCapacity = 7;
    let targetMin = 45;
    let targetMax = 60;
    let targetLabel: DifficultyLevel = 'Medium';
    let bossArchetype: BossArchetype | undefined = undefined;
    let mechanicFocus = 'Standard Flow';

    if (indexInPack <= 2) {
      // 1–3: ONBOARDING / WARM-UP (Relaxed start of pack)
      phase = 'ONBOARDING';
      baseTriplets = 8 + worldTier * 1; // 8..13 triplets (24–39 tiles)
      layerCount = 2;
      trayCapacity = 7;
      targetMin = Math.max(18, 20 + worldTier * 4);
      targetMax = targetMin + 14;
      targetLabel = targetMin < 25 ? 'Easy' : targetMin < 42 ? 'Normal' : 'Medium';
      mechanicFocus = 'Pack Introduction & Warm-up';
    } else if (indexInPack <= 6) {
      // 4–7: PRACTICE & FLOW
      phase = 'PRACTICE';
      baseTriplets = 12 + worldTier * 1; // 12..17 triplets (36–51 tiles)
      layerCount = Math.min(3, 2 + Math.floor(worldTier / 3));
      trayCapacity = 7;
      targetMin = 32 + worldTier * 4;
      targetMax = targetMin + 14;
      targetLabel = targetMin < 42 ? 'Normal' : 'Medium';
      mechanicFocus = 'Practice Flow';
    } else if (indexInPack === 7) {
      // 8: CHALLENGE SPIKE
      phase = 'CHALLENGE';
      baseTriplets = 18 + worldTier * 1; // 18..23 triplets (54–69 tiles)
      layerCount = 3;
      trayCapacity = 7;
      targetMin = 58 + worldTier * 3;
      targetMax = Math.min(84, targetMin + 15);
      targetLabel = targetMin < 65 ? 'Hard' : 'Very Hard';
      mechanicFocus = 'Move Limit & Speed Challenge';
    } else if (indexInPack <= 11) {
      // 9–12: MECHANIC INTRODUCTION & EXPERIMENTATION
      phase = 'INTRODUCTION';
      baseTriplets = 14 + worldTier * 1; // 14..19 triplets (42–57 tiles)
      layerCount = 3;
      trayCapacity = 7;
      targetMin = 42 + worldTier * 4;
      targetMax = targetMin + 15;
      targetLabel = targetMin < 60 ? 'Medium' : 'Hard';
      mechanicFocus = 'Special Mechanic Experimentation';
    } else if (indexInPack <= 16) {
      // 13–17: COMBINATION PRACTICE (Frenzy on 14)
      phase = 'COMBINATION';
      baseTriplets = 16 + worldTier * 1; // 16..21 triplets (48–63 tiles)
      layerCount = 3;
      trayCapacity = 7;
      targetMin = 50 + worldTier * 4;
      targetMax = targetMin + 14;
      targetLabel = targetMin < 60 ? 'Medium' : 'Hard';
      mechanicFocus = 'Combo Chaining & Obstacle Interplay';
    } else if (indexInPack === 17) {
      // 18: GENTLE CHALLENGE
      phase = 'DIFFICULTY_SPIKE';
      baseTriplets = 14 + worldTier * 1; // 14..19 triplets (42–57 tiles)
      layerCount = Math.min(3, 2 + Math.floor(worldTier / 2));
      trayCapacity = 7;
      targetMin = 48 + worldTier * 2;
      targetMax = Math.min(68, targetMin + 14);
      targetLabel = 'Medium';
      mechanicFocus = 'Tactical Occlusion Wave';
    } else if (indexInPack === 18) {
      // 19: SPECIAL TRIAL (Casual Time Attack / Zen Rush)
      phase = 'SPECIAL_TRIAL';
      baseTriplets = 12 + worldTier * 1; // 12..17 triplets (36–51 tiles) - quick and satisfying
      layerCount = 3;
      trayCapacity = 7;
      targetMin = 42 + worldTier * 2;
      targetMax = Math.min(62, targetMin + 14);
      targetLabel = 'Medium';
      mechanicFocus = 'Relaxing Zen Rush';
    } else if (indexInPack <= 21) {
      // 20–22: MASTERY
      phase = 'MASTERY';
      baseTriplets = 14 + worldTier * 1; // 14..19 triplets (42–57 tiles)
      layerCount = Math.min(3, 2 + Math.floor(worldTier / 2));
      trayCapacity = 7;
      targetMin = 50 + worldTier * 2;
      targetMax = Math.min(70, targetMin + 14);
      targetLabel = 'Medium';
      mechanicFocus = 'Multi-Layer Mastery';
    } else if (indexInPack === 22) {
      // 23: ADVANCED CHALLENGE (Pre-Boss Climax)
      phase = 'ADVANCED_CHALLENGE';
      baseTriplets = 16 + worldTier * 1; // 16..21 triplets (48–63 tiles)
      layerCount = 3;
      trayCapacity = 7;
      targetMin = 58 + worldTier * 2;
      targetMax = Math.min(76, targetMin + 14);
      targetLabel = 'Medium';
      mechanicFocus = 'Advanced Climax Challenge';
    } else if (indexInPack === 23) {
      // 24: RECOVERY & BONUS REWARD (Breather before the Boss!)
      phase = 'RECOVERY_BONUS';
      baseTriplets = 10 + worldTier * 1; // 10..15 triplets (30–45 tiles)
      layerCount = 2;
      trayCapacity = 8; // Extra tray slot for high satisfaction!
      targetMin = Math.max(22, 28 + worldTier * 3);
      targetMax = targetMin + 14;
      targetLabel = targetMin < 42 ? 'Normal' : 'Medium';
      mechanicFocus = 'Bonus Golden Multipliers & Recovery';
    } else {
      // 25: PACK BOSS (Climax Boss of the Pack!)
      phase = 'PACK_BOSS';
      bossArchetype = this.getBossArchetype(clampedLevel);
      baseTriplets = 21 + worldTier * 1; // 21..26 triplets (63–78 tiles) - Large tile band for exciting pack boss encounters
      layerCount = 3;
      trayCapacity = 7; // Standard 7-slot tray capacity ensures fair and enjoyable puzzle flow
      targetMin = Math.min(88, 76 + worldTier * 2);
      targetMax = Math.min(94, targetMin + 12);
      targetLabel = 'Hard';
      mechanicFocus = `Boss Archetype: ${bossArchetype}`;
    }

    const tripletCount = Math.max(6, Math.min(32, baseTriplets));
    const targetDifficulty: TargetDifficultyRange = {
      minScore: targetMin,
      maxScore: targetMax,
      targetLabel,
      specialType,
    };

    return {
      indexInPack,
      phase,
      tripletCount,
      tileCount: tripletCount * 3,
      layerCount,
      trayCapacity,
      targetDifficulty,
      specialType,
      bossArchetype,
      mechanicFocus,
    };
  }

  /**
   * Non-linear difficulty curve mapping level ID to target score range.
   */
  public static getTargetDifficultyRange(levelId: number): TargetDifficultyRange {
    return this.getLevelPositionProfile(levelId).targetDifficulty;
  }

  /**
   * Progressive tile category unlock curve.
   */
  public static getUnlockedTileCategories(levelId: number): TileCategory[] {
    if (levelId <= 5) {
      return ['Fruit'];
    } else if (levelId <= 12) {
      return ['Fruit', 'Flower'];
    } else if (levelId <= 25) {
      return ['Fruit', 'Flower', 'Leaf'];
    } else if (levelId <= 50) {
      return ['Fruit', 'Flower', 'Leaf', 'Gem'];
    } else if (levelId <= 100) {
      return ['Fruit', 'Flower', 'Leaf', 'Gem', 'Shell', 'Stone'];
    } else {
      return ['Fruit', 'Flower', 'Leaf', 'Gem', 'Shell', 'Stone', 'Crystal', 'Special'];
    }
  }

  /**
   * Curated Pack Metadata Generator.
   */
  public static getPackMetadata(worldId: number, packNum: number): PackMetadata {
    const clampedWorldId = Math.max(1, Math.min(100, worldId));
    const clampedPackNum = Math.max(1, Math.min(4, packNum));

    const PACK_ARCHETYPES: Array<{
      title: string;
      subtitle: string;
      themeFocus: string;
      primaryLayout: BoardLayoutPattern;
      secondaryLayout: BoardLayoutPattern;
      gameplayFocus: string;
      milestoneTitle: string;
    }> = [
      {
        title: 'The Awakening Trail',
        subtitle: 'Foundation & Triplet Rhythm',
        themeFocus: 'Discovery',
        primaryLayout: 'Pyramid',
        secondaryLayout: 'Circle',
        gameplayFocus: 'Triplet Flow & Selection',
        milestoneTitle: 'Trail Pioneer',
      },
      {
        title: 'Labyrinth of Echoes',
        subtitle: 'Occlusion & Spatial Depth',
        themeFocus: 'Exploration',
        primaryLayout: 'Fortress',
        secondaryLayout: 'Diamond',
        gameplayFocus: 'Multi-Layer Occlusion Management',
        milestoneTitle: 'Labyrinth Delver',
      },
      {
        title: 'Ascent of Prisms',
        subtitle: 'Tactical Tray Navigation',
        themeFocus: 'Ascension',
        primaryLayout: 'Honeycomb',
        secondaryLayout: 'Spiral',
        gameplayFocus: 'High Choice Density & Combo Chains',
        milestoneTitle: 'Prism Adept',
      },
      {
        title: 'Sanctuary Pinnacle',
        subtitle: 'The Master Challenge',
        themeFocus: 'Climax',
        primaryLayout: 'Crown',
        secondaryLayout: 'Temple',
        gameplayFocus: 'Pinnacle Match Alchemy & Boss Puzzle',
        milestoneTitle: 'Sanctuary Master',
      },
    ];

    const archetype = PACK_ARCHETYPES[clampedPackNum - 1];
    return {
      id: `world_${clampedWorldId}_pack_${clampedPackNum}`,
      packNum: clampedPackNum,
      title: archetype.title,
      subtitle: archetype.subtitle,
      themeFocus: archetype.themeFocus,
      primaryLayout: archetype.primaryLayout,
      secondaryLayout: archetype.secondaryLayout,
      gameplayFocus: archetype.gameplayFocus,
      milestoneTitle: archetype.milestoneTitle,
    };
  }

  /**
   * Shape rotation logic incorporating 17 distinct layout patterns across levels.
   */
  public static getRotatedLayoutPattern(levelId: number): BoardLayoutPattern {
    const patterns = BoardLayouts.ALL_PATTERNS;
    const worldId = Math.floor((levelId - 1) / 100) + 1;
    const packNum = Math.floor(((levelId - 1) % 100) / 25) + 1;
    const packMeta = this.getPackMetadata(worldId, packNum);
    const worldDef = getWorldForLevel(levelId);

    const indexInPack = (levelId - 1) % 25;
    if (indexInPack === 0) {
      return packMeta.primaryLayout;
    }
    if (indexInPack === 24) {
      // Pack Boss layout preferred
      return packMeta.secondaryLayout;
    }

    if (worldDef.preferredLayouts && worldDef.preferredLayouts.length > 0 && indexInPack % 4 === 0) {
      const pref = worldDef.preferredLayouts[(indexInPack / 4) % worldDef.preferredLayouts.length];
      if (patterns.includes(pref as BoardLayoutPattern)) {
        return pref as BoardLayoutPattern;
      }
    }

    const rotationIndex = ((levelId - 1) * 7 + Math.floor((levelId - 1) / 13)) % patterns.length;
    return patterns[rotationIndex];
  }

  /**
   * Calculates balanced level reward scaling with special level multipliers.
   */
  public static getScaledRewardConfig(levelId: number, difficultyScore: number) {
    const clampedLevel = Math.max(1, Math.min(9999, levelId));
    const specialType = this.getSpecialLevelType(clampedLevel);

    const bonusMultiplier = specialType === 'BONUS_REWARD' ? 2.5 : specialType === 'PACK_BOSS' ? 2.0 : specialType === 'WORLD_FINALE' ? 5.0 : 1.0;

    const baseCoins = Math.round((100 + Math.min(500, Math.floor(clampedLevel * 1.5)) + Math.floor(difficultyScore * 1.2)) * bonusMultiplier);
    
    let baseGems = 0;
    if (specialType === 'WORLD_FINALE') {
      baseGems = 100;
    } else if (specialType === 'PACK_BOSS') {
      baseGems = 15;
    } else if (specialType === 'BONUS_REWARD') {
      baseGems = 10;
    } else if (clampedLevel % 10 === 0) {
      baseGems = 3;
    } else if (clampedLevel % 5 === 0) {
      baseGems = 1;
    }

    const expPoints = Math.round((50 + Math.min(250, clampedLevel * 3)) * bonusMultiplier);

    const boostersGranted = specialType === 'WORLD_FINALE'
      ? { undo: 5, shuffle: 5, magnet: 5 }
      : specialType === 'PACK_BOSS'
      ? { undo: 1, shuffle: 1 }
      : clampedLevel % 50 === 0
      ? { magnet: 1 }
      : clampedLevel % 25 === 0
      ? { shuffle: 1 }
      : clampedLevel % 10 === 0
      ? { undo: 1 }
      : {};

    return {
      coins: Math.min(5000, baseCoins),
      gems: baseGems,
      boostersGranted,
      stars: 3,
      expPoints,
    };
  }

  /**
   * Controlled unlock schedule for advanced mechanics.
   */
  public static getUnlockedMechanics(levelId: number): Array<'rainbow' | 'golden' | 'frozen' | 'chained' | 'bomb' | 'key'> {
    const mechanics: Array<'rainbow' | 'golden' | 'frozen' | 'chained' | 'bomb' | 'key'> = [];
    if (levelId >= 14) mechanics.push('rainbow');
    if (levelId >= 23) mechanics.push('golden');
    if (levelId >= 26) mechanics.push('frozen');
    if (levelId >= 51) mechanics.push('chained');
    if (levelId >= 75) mechanics.push('bomb');
    if (levelId >= 100) mechanics.push('key');
    return mechanics;
  }

  /**
   * Determines special level objectives based on level type.
   */
  public static getSpecialObjectives(levelId: number, totalTiles: number) {
    const specialType = this.getSpecialLevelType(levelId);

    if (specialType === 'COMBO_FRENZY') {
      return [
        { type: 'combo_target' as const, targetCombo: 3, currentCount: 0, completed: false },
        { type: 'clear_all_tiles' as const, targetCount: totalTiles, currentCount: 0, completed: false },
      ];
    }

    if (specialType === 'TIME_ATTACK') {
      const timeLimit = Math.max(480, Math.floor(totalTiles * 10));
      return [
        { type: 'time_trial' as const, timeLimitSeconds: timeLimit, targetCount: totalTiles, currentCount: 0, completed: false },
      ];
    }

    if (specialType === 'CHALLENGE') {
      const moveLimit = Math.max(150, Math.floor(totalTiles * 5));
      return [
        { type: 'move_limit' as const, maxMoves: moveLimit, targetCount: totalTiles, currentCount: 0, completed: false },
      ];
    }

    if (specialType === 'BONUS_REWARD') {
      return [
        { type: 'score_target' as const, targetScore: totalTiles * 180, currentCount: 0, completed: false },
        { type: 'clear_all_tiles' as const, targetCount: totalTiles, currentCount: 0, completed: false },
      ];
    }

    return [
      { type: 'clear_all_tiles' as const, targetCount: totalTiles, currentCount: 0, completed: false },
    ];
  }

  /**
   * Star thresholds scaled proportionately to triplet count and difficulty.
   */
  public static getScaledStarRules(tripletCount: number, difficultyScore: number) {
    const baseMultiplier = 150;
    const difficultyMod = Math.min(30, Math.floor(difficultyScore * 0.3));
    const oneStar = Math.max(100, tripletCount * (baseMultiplier - 30));
    const twoStars = Math.floor(tripletCount * (baseMultiplier + difficultyMod) * 1.8);
    const threeStars = Math.floor(tripletCount * (baseMultiplier + difficultyMod) * 3.0);
    return {
      oneStarScore: oneStar,
      twoStarsScore: twoStars,
      threeStarsScore: threeStars,
    };
  }
}
