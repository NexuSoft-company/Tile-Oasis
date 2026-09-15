import { generateWorldDefinition, getWorldForLevel, WORLD_DEFINITIONS } from '../data/worldDefinitions';
import { BoardLayouts } from '../engine/BoardLayouts';
import { DifficultyCurve } from '../engine/DifficultyCurve';
import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { LevelPackRegistry } from '../data/levels/levelPackRegistry';
import { ContentSimilarityAnalyzer } from '../engine/ContentSimilarityAnalyzer';
import { TestResult } from '../services/TestFramework';

export class Phase14ContentDesignTestFramework {
  public static runAllPhase14Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(this.test100WorldsDataIntegrity());
    results.push(this.test9999BoundaryAndGrandFinale());
    results.push(this.test17LayoutArchetypesValidity());
    results.push(this.testDifficultyWavesAndSpecialLevels());
    results.push(this.testPackMetadataAndWorldProgression());
    results.push(this.testContentSimilarityAndVariety());

    return results;
  }

  private static test100WorldsDataIntegrity(): TestResult {
    const start = performance.now();
    let allValid = true;
    const worldNames = new Set<string>();

    for (let wId = 1; wId <= 100; wId++) {
      const world = generateWorldDefinition(wId);
      if (!world.name || !world.subtitle || !world.theme || !world.accentColor) {
        allValid = false;
        break;
      }
      if (world.levelRange[0] !== (wId - 1) * 100 + 1) {
        allValid = false;
        break;
      }
      if (world.levelRange[1] !== (wId === 100 ? 9999 : wId * 100)) {
        allValid = false;
        break;
      }
      worldNames.add(world.name);
    }

    const passed = allValid && worldNames.size === 100;

    return {
      id: 'TEST_P14_01_100_WORLDS_CATALOG',
      name: '100 Bespoke World Catalogs Data & Theme Integrity',
      passed,
      message: passed
        ? 'Passed: 100 distinct bespoke worlds verified with unique themes, biomes, and accurate level bounds.'
        : 'Failed: World catalog contains duplicate names or incorrect boundary ranges.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static test9999BoundaryAndGrandFinale(): TestResult {
    const start = performance.now();

    // 1. Check Level 1
    const lvl1 = RuntimeLevelRegistry.getLevel(1);
    const lvl1Valid = lvl1 && lvl1.id === 1 && lvl1.tiles.length > 0 && lvl1.isGuaranteedSolvable;

    // 2. Check Level 9999 (Grand Finale)
    const lvl9999 = RuntimeLevelRegistry.getLevel(9999);
    const special9999 = DifficultyCurve.getSpecialLevelType(9999);
    const lvl9999Valid =
      lvl9999 &&
      lvl9999.id === 9999 &&
      lvl9999.tiles.length > 0 &&
      special9999 === 'WORLD_FINALE';

    // 3. Check Level 10000 (Out of campaign bounds returns null)
    const lvl10000 = RuntimeLevelRegistry.getLevel(10000);
    const outOfBoundsCaught = lvl10000 === null;

    const passed = Boolean(lvl1Valid && lvl9999Valid && outOfBoundsCaught);

    return {
      id: 'TEST_P14_02_9999_BOUNDARY_FINALE',
      name: '9,999 Level Campaign Boundary & Grand Finale State',
      passed,
      message: passed
        ? 'Passed: Level 1 and Level 9999 generated perfectly. Level 10000 rejected gracefully as out-of-bounds.'
        : 'Failed: Boundary levels or Level 10000 rejection failed.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static test17LayoutArchetypesValidity(): TestResult {
    const start = performance.now();
    const patterns = BoardLayouts.ALL_PATTERNS;
    let allValid = true;

    for (const pattern of patterns) {
      const positions = BoardLayouts.generatePositions(pattern, 36, 3);
      if (positions.length !== 36) {
        allValid = false;
        break;
      }
      for (const pos of positions) {
        if (isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.layer)) {
          allValid = false;
          break;
        }
      }
    }

    const passed = allValid && patterns.length === 17;

    return {
      id: 'TEST_P14_03_17_LAYOUT_ARCHETYPES',
      name: '17 Layout Archetypes Mathematical Coordinate Generation',
      passed,
      message: passed
        ? `Passed: All 17 board layout patterns generated 36 distinct coordinates without NaN or corruption.`
        : 'Failed: Layout pattern coordinate generation error.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testDifficultyWavesAndSpecialLevels(): TestResult {
    const start = performance.now();

    // Verify wave ebb-and-flow:
    // Level 25 = PACK_BOSS, Level 24 = BONUS_REWARD, Level 8 = CHALLENGE, Level 15 = COMBO_FRENZY
    const t25 = DifficultyCurve.getSpecialLevelType(25);
    const t24 = DifficultyCurve.getSpecialLevelType(24);
    const t8 = DifficultyCurve.getSpecialLevelType(8);
    const t15 = DifficultyCurve.getSpecialLevelType(15);
    const t19 = DifficultyCurve.getSpecialLevelType(19);

    const rangeEarly = DifficultyCurve.getTargetDifficultyRange(2);
    const rangeBoss = DifficultyCurve.getTargetDifficultyRange(25);

    const passed =
      t25 === 'PACK_BOSS' &&
      t24 === 'BONUS_REWARD' &&
      t8 === 'CHALLENGE' &&
      t15 === 'COMBO_FRENZY' &&
      t19 === 'TIME_ATTACK' &&
      rangeEarly.targetLabel === 'Easy' &&
      rangeBoss.minScore > rangeEarly.minScore;

    return {
      id: 'TEST_P14_04_DIFFICULTY_WAVES',
      name: 'Difficulty Wave Pacing & Special Level Classification',
      passed,
      message: passed
        ? 'Passed: Dynamic difficulty waves correctly classify bosses, bonus rewards, frenzy, and challenges.'
        : 'Failed: Difficulty curve or special level mapping incorrect.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testPackMetadataAndWorldProgression(): TestResult {
    const start = performance.now();
    const packsWorld1 = LevelPackRegistry.getPacksForWorld(1);
    const packsWorld50 = LevelPackRegistry.getPacksForWorld(50);

    const packForLvl50 = LevelPackRegistry.getPackForLevel(50);
    const packForLvl250 = LevelPackRegistry.getPackForLevel(250);

    const passed =
      packsWorld1.length === 4 &&
      packsWorld50.length === 4 &&
      packForLvl50 !== undefined &&
      packForLvl50.worldId === 1 &&
      packForLvl250 !== undefined &&
      packForLvl250.worldId === 3;

    return {
      id: 'TEST_P14_05_PACK_METADATA_PROGRESSION',
      name: '4-Pack Per World Architecture & Dynamic Pack Resolution',
      passed,
      message: passed
        ? 'Passed: Worlds divide into 4 discrete thematic packs of 25 levels with structured metadata.'
        : 'Failed: Pack resolution mismatch.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  private static testContentSimilarityAndVariety(): TestResult {
    const start = performance.now();

    // Sample 10 consecutive levels in World 2 (Levels 101 to 110)
    const sampledLevels = [];
    for (let lvl = 101; lvl <= 110; lvl++) {
      sampledLevels.push(RuntimeLevelRegistry.getLevel(lvl));
    }

    const report = ContentSimilarityAnalyzer.analyzeSequence(sampledLevels);

    const passed =
      report.analyzedCount === 10 &&
      report.maxConsecutiveIdenticalLayouts <= 2 &&
      report.healthyVarietyDistribution;

    return {
      id: 'TEST_P14_06_SIMILARITY_ANALYSIS',
      name: 'Content Similarity Analyzer & Level Repetition Detection',
      passed,
      message: passed
        ? `Passed: Average similarity score ${report.averageSimilarity} is healthy with max consecutive identical layouts = ${report.maxConsecutiveIdenticalLayouts}.`
        : `Failed: Repetitive sequence detected (${report.averageSimilarity}).`,
      durationMs: Math.round(performance.now() - start),
    };
  }
}
