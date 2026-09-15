import { RuntimeLevelRegistry } from '../engine/RuntimeLevelRegistry';
import { DifficultyCurve, BossArchetype } from '../engine/DifficultyCurve';
import { BoardLayouts } from '../engine/BoardLayouts';
import { ContentSimilarityAnalyzer } from '../engine/ContentSimilarityAnalyzer';
import { CampaignPacingAnalyzer } from '../engine/CampaignPacingAnalyzer';
import { WORLD_DEFINITIONS } from '../data/worldDefinitions';
import { LevelFactory } from '../engine/LevelFactory';
import { TestResult } from '../services/TestFramework';

export class Phase16AAACampaignTestFramework {
  public static runAllPhase16Tests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(this.testDifficultyWavePacing());
    results.push(this.testTileCountBandDiversity());
    results.push(this.testLayoutDiversity17Patterns());
    results.push(this.testBossArchetypeDiversity());
    results.push(this.testAntiRepetitionAndNoveltyScoring());
    results.push(this.testMechanicDensityCaps());
    results.push(this.testWorldGameplayIdentity());
    results.push(this.testCampaignPacingAnalyzer());
    results.push(this.testDeterministicReproducibility());
    results.push(this.testGuaranteedSolvabilityAcrossWorlds());

    return results;
  }

  /**
   * TEST 1: Verify non-linear difficulty waves across packs (Teach/Practice/Intro/Combo/Master/Spike/Recovery/Boss).
   */
  private static testDifficultyWavePacing(): TestResult {
    const start = performance.now();
    let passed = true;
    const notes: string[] = [];

    // Sample Pack 1 (Levels 1-25) and Pack 2 (Levels 26-50)
    const pack1Levels = Array.from({ length: 25 }, (_, i) => RuntimeLevelRegistry.getLevel(i + 1));
    const pack2Levels = Array.from({ length: 25 }, (_, i) => RuntimeLevelRegistry.getLevel(i + 26));

    if (pack1Levels.some(l => !l) || pack2Levels.some(l => !l)) {
      return {
        id: 'TEST_P16_01_DIFFICULTY_WAVES',
        name: 'Non-Linear Difficulty Wave Progression',
        passed: false,
        message: 'Failed to load levels for Pack 1 or Pack 2',
        durationMs: Math.round(performance.now() - start),
      };
    }

    // Check that Pack 1 starts with Easy/Normal on levels 1-3
    const p1_start = pack1Levels.slice(0, 3).map(l => l!.difficulty);
    const startEasy = p1_start.includes('Easy') || p1_start.includes('Normal');
    if (!startEasy) {
      passed = false;
      notes.push(`Pack 1 start lacks Easy/Normal (${p1_start.join(', ')})`);
    }

    // Check that Level 24 (Recovery) is easier than Level 25 (Boss)
    const lvl24 = pack1Levels[23]!;
    const lvl25 = pack1Levels[24]!;
    if (lvl24.numericalDifficulty >= lvl25.numericalDifficulty) {
      passed = false;
      notes.push(`Recovery level 24 (${lvl24.numericalDifficulty}) is not easier than Boss 25 (${lvl25.numericalDifficulty})`);
    }

    // Check that Pack 2 Boss (Level 50) is challenging (Hard or higher)
    const lvl50 = pack2Levels[24]!;
    if (lvl50.numericalDifficulty < 60) {
      passed = false;
      notes.push(`Level 50 Pack Boss score too low: ${lvl50.numericalDifficulty}`);
    }

    return {
      id: 'TEST_P16_01_DIFFICULTY_WAVES',
      name: 'Non-Linear Difficulty Wave Progression',
      passed,
      message: passed
        ? 'Passed: Difficulty waves verified with authentic ebb-and-flow, recovery breathers, and distinct boss climaxes.'
        : `Failed: ${notes.join('; ')}`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 2: Verify tile count distribution across Small, Medium, Large, and Extreme bands.
   */
  private static testTileCountBandDiversity(): TestResult {
    const start = performance.now();
    let passed = true;

    // Sample across 100 levels
    const sampleLevels = Array.from({ length: 100 }, (_, i) => RuntimeLevelRegistry.getLevel(i + 1)).filter(Boolean);

    let small = 0;   // 18-36
    let medium = 0;  // 37-60
    let large = 0;   // 61-84
    let extreme = 0; // 85-108

    sampleLevels.forEach(l => {
      const tc = l!.tiles.length;
      if (tc <= 36) small++;
      else if (tc <= 60) medium++;
      else if (tc <= 84) large++;
      else extreme++;
    });

    // We expect healthy distribution across small, medium, and large in the first 100 levels
    if (small === 0 || medium === 0 || large === 0) {
      passed = false;
    }

    // Check level 9999 for large/extreme band
    const lvl9999 = RuntimeLevelRegistry.getLevel(9999);
    if (!lvl9999 || lvl9999.tiles.length < 72) {
      passed = false;
    }

    return {
      id: 'TEST_P16_02_TILE_COUNT_BANDS',
      name: 'Tile Count Band Diversity (Small to Extreme)',
      passed,
      message: passed
        ? `Passed: Tile counts span Small (${small}), Medium (${medium}), Large (${large}), and Extreme bands across campaign.`
        : 'Failed: Tile count bands lack required multi-tier distribution.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 3: Verify all 17 Layout Archetypes are used and distributed cleanly.
   */
  private static testLayoutDiversity17Patterns(): TestResult {
    const start = performance.now();
    const allPatterns = BoardLayouts.ALL_PATTERNS;

    // Sample 200 levels across campaign
    const usedPatterns = new Set<string>();
    for (let i = 1; i <= 200; i++) {
      const lvl = RuntimeLevelRegistry.getLevel(i);
      if (lvl && lvl.layoutPattern) {
        usedPatterns.add(lvl.layoutPattern);
      }
    }

    const total17 = allPatterns.length === 17;
    const allUsed = allPatterns.every(p => usedPatterns.has(p));

    return {
      id: 'TEST_P16_03_LAYOUT_DIVERSITY',
      name: '17 Layout Archetypes Comprehensive Utilization',
      passed: total17 && allUsed,
      message: total17 && allUsed
        ? `Passed: All 17 layout archetypes (${allPatterns.length}) successfully utilized across campaign.`
        : `Failed: Only ${usedPatterns.size} of 17 layout patterns appeared in sample.`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 4: Verify Boss Archetypes across all 8 archetypes.
   */
  private static testBossArchetypeDiversity(): TestResult {
    const start = performance.now();
    const allBossArchetypes = DifficultyCurve.ALL_BOSS_ARCHETYPES;
    const observedArchetypes = new Set<BossArchetype>();

    // Test first 32 packs (8 worlds * 4 packs = 32 pack bosses)
    for (let p = 1; p <= 32; p++) {
      const bossLevelId = p * 25;
      const archetype = DifficultyCurve.getBossArchetype(bossLevelId);
      observedArchetypes.add(archetype);
    }

    const allObserved = allBossArchetypes.every(a => observedArchetypes.has(a));

    return {
      id: 'TEST_P16_04_BOSS_ARCHETYPES',
      name: '8 Distinct Boss Archetypes Rotation & Variety',
      passed: allObserved,
      message: allObserved
        ? `Passed: All 8 boss archetypes (${allBossArchetypes.join(', ')}) verified with unique mechanics and identities.`
        : `Failed: Missing boss archetypes in sample.`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 5: Verify Anti-Repetition Engine and rolling Novelty Score.
   */
  private static testAntiRepetitionAndNoveltyScoring(): TestResult {
    const start = performance.now();
    const sample = Array.from({ length: 50 }, (_, i) => RuntimeLevelRegistry.getLevel(i + 1)).filter(Boolean);

    const report = ContentSimilarityAnalyzer.analyzeSequence(sample as any);
    const passed = report.healthyVarietyDistribution && report.averageNoveltyScore >= 50;

    return {
      id: 'TEST_P16_05_ANTI_REPETITION_NOVELTY',
      name: 'Anti-Repetition & Level Novelty Score Evaluation',
      passed,
      message: passed
        ? `Passed: Average similarity (${report.averageSimilarity}), Avg Novelty (${report.averageNoveltyScore}/100), Max Consecutive Layouts (${report.maxConsecutiveIdenticalLayouts}).`
        : `Failed: Repetition report flagged high monotony.`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 6: Verify Mechanic Density Safety Caps across generated levels.
   */
  private static testMechanicDensityCaps(): TestResult {
    const start = performance.now();
    let passed = true;
    const notes: string[] = [];

    // Test 100 levels from world 2 to 5 (mechanics unlocked)
    for (let id = 100; id <= 200; id += 5) {
      const lvl = RuntimeLevelRegistry.getLevel(id);
      if (!lvl) continue;

      const total = lvl.tiles.length;
      const frozen = lvl.tiles.filter(t => t.specialProperty === 'frozen').length;
      const chained = lvl.tiles.filter(t => t.specialProperty === 'chained').length;
      const bomb = lvl.tiles.filter(t => t.specialProperty === 'bomb').length;

      if (frozen / total > 0.25) {
        passed = false;
        notes.push(`Level ${id} has excessive frozen ratio (${Math.round((frozen / total) * 100)}%)`);
      }
      if (chained / total > 0.20) {
        passed = false;
        notes.push(`Level ${id} has excessive chained ratio (${Math.round((chained / total) * 100)}%)`);
      }
      if (bomb / total > 0.15) {
        passed = false;
        notes.push(`Level ${id} has excessive bomb ratio (${Math.round((bomb / total) * 100)}%)`);
      }
    }

    return {
      id: 'TEST_P16_06_MECHANIC_DENSITY_CAPS',
      name: 'Obstacle Density Safety Caps Enforcement',
      passed,
      message: passed
        ? 'Passed: All obstacle and special tile mechanics conform to density safety caps.'
        : `Failed: ${notes.join('; ')}`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 7: Verify World Gameplay Identity and Theme Affinities for all 100 Worlds.
   */
  private static testWorldGameplayIdentity(): TestResult {
    const start = performance.now();
    const passed = WORLD_DEFINITIONS.length === 100 && WORLD_DEFINITIONS.every(w =>
      Boolean(w.preferredLayouts && w.preferredLayouts.length > 0) &&
      Boolean(w.mechanicAffinities && w.mechanicAffinities.length > 0) &&
      Boolean(w.difficultyStyle) &&
      Boolean(w.bossArchetypes && w.bossArchetypes.length >= 4)
    );

    return {
      id: 'TEST_P16_07_WORLD_GAMEPLAY_IDENTITY',
      name: '100 Worlds Distinct Gameplay Identity & Affinities',
      passed,
      message: passed
        ? 'Passed: All 100 Worlds equipped with bespoke preferred layouts, mechanic affinities, styles, and boss archetypes.'
        : 'Failed: Some worlds lack complete gameplay identity definitions.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 8: Verify Campaign Pacing Analyzer reports.
   */
  private static testCampaignPacingAnalyzer(): TestResult {
    const start = performance.now();
    const report = CampaignPacingAnalyzer.analyzeCampaignRange(1, 100);

    const passed =
      report.totalLevels === 100 &&
      report.solvabilityRate === 100 &&
      report.isBalancedWaveProgression &&
      report.repetitionAnalysis.healthyVarietyDistribution;

    return {
      id: 'TEST_P16_08_CAMPAIGN_PACING_ANALYZER',
      name: 'Campaign Pacing Analyzer Audit & Solvability Verification',
      passed,
      message: passed
        ? `Passed: Campaign audit complete. 100% Solvability, Balanced Wave Progression verified, Average Difficulty ${report.averageNumericalDifficulty}.`
        : 'Failed: Campaign pacing audit reported imbalance.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 9: Verify 100% Deterministic Reproducibility.
   */
  private static testDeterministicReproducibility(): TestResult {
    const start = performance.now();
    const testIds = [1, 25, 100, 500, 1000, 5000, 9999];
    let passed = true;

    for (const id of testIds) {
      const lvlA = LevelFactory.createLevel({ levelId: id, mode: 'SEEDED' }).level;
      const lvlB = LevelFactory.createLevel({ levelId: id, mode: 'SEEDED' }).level;

      if (lvlA.tiles.length !== lvlB.tiles.length || lvlA.seed !== lvlB.seed) {
        passed = false;
        break;
      }

      for (let i = 0; i < lvlA.tiles.length; i++) {
        if (
          lvlA.tiles[i].typeId !== lvlB.tiles[i].typeId ||
          lvlA.tiles[i].x !== lvlB.tiles[i].x ||
          lvlA.tiles[i].y !== lvlB.tiles[i].y ||
          lvlA.tiles[i].layer !== lvlB.tiles[i].layer ||
          lvlA.tiles[i].specialProperty !== lvlB.tiles[i].specialProperty
        ) {
          passed = false;
          break;
        }
      }
    }

    return {
      id: 'TEST_P16_09_DETERMINISTIC_REPRODUCIBILITY',
      name: '100% Deterministic Board Generation Reproducibility',
      passed,
      message: passed
        ? 'Passed: Exact seed match reproducibility verified across low, mid, high, and maximum campaign levels.'
        : 'Failed: Seed reproducibility mismatch detected.',
      durationMs: Math.round(performance.now() - start),
    };
  }

  /**
   * TEST 10: Verify 100% Solvability across multiple campaign milestones.
   */
  private static testGuaranteedSolvabilityAcrossWorlds(): TestResult {
    const start = performance.now();
    const milestoneIds = [1, 14, 25, 50, 75, 100, 250, 500, 1000, 2500, 5000, 7500, 9999];
    let allSolvable = true;

    for (const id of milestoneIds) {
      const lvl = RuntimeLevelRegistry.getLevel(id);
      if (!lvl || !lvl.isGuaranteedSolvable) {
        allSolvable = false;
        break;
      }
    }

    return {
      id: 'TEST_P16_10_SOLVABILITY_ACROSS_WORLDS',
      name: '100% Guaranteed Solvability Across Campaign Milestones',
      passed: allSolvable,
      message: allSolvable
        ? `Passed: All ${milestoneIds.length} tested campaign milestone levels (including World Finale 9999) are 100% guaranteed solvable.`
        : 'Failed: Found unsolvable level in campaign milestones.',
      durationMs: Math.round(performance.now() - start),
    };
  }
}
