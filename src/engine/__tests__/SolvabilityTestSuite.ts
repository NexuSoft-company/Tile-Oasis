import { BoardGenerator } from '../BoardGenerator';
import { SolvabilityValidator, SolvabilityResult } from '../SolvabilityValidator';

export interface SolvabilityTestReport {
  totalBoardsTested: number;
  passedCount: number;
  failedCount: number;
  passRatePercentage: number;
  failures: Array<{
    levelId: number;
    seed: number;
    reason: string;
  }>;
  executionTimeMs: number;
}

/**
 * Automated Solvability Test Suite.
 * Generates and validates 100 deterministic boards across levels 1 to 100 to guarantee 100% solvability.
 */
export class SolvabilityTestSuite {
  public static run100BoardValidationSuite(): SolvabilityTestReport {
    const startTime = performance.now();
    const totalBoardsTested = 100;
    let passedCount = 0;
    let failedCount = 0;
    const failures: Array<{ levelId: number; seed: number; reason: string }> = [];

    console.log('[SolvabilityTestSuite] Launching 100-Board Solvability Validation Test Suite...');

    for (let i = 1; i <= totalBoardsTested; i++) {
      const levelId = i;
      const customSeed = levelId * 777 + 999;

      // 1. Generate Board
      const levelDef = BoardGenerator.generateLevel({
        levelId,
        seed: customSeed,
      });

      // 2. Validate Solvability
      const result: SolvabilityResult = SolvabilityValidator.validateSolvability(
        levelDef.tiles,
        levelDef.trayCapacity
      );

      if (result.solvable) {
        passedCount++;
      } else {
        failedCount++;
        failures.push({
          levelId,
          seed: levelDef.seed,
          reason: result.failureReason || 'Solver failed to clear board.',
        });
        console.error(`[SolvabilityTestSuite] Board Failure at Level ${levelId} (Seed: ${levelDef.seed}): ${result.failureReason}`);
      }
    }

    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);
    const passRatePercentage = Math.round((passedCount / totalBoardsTested) * 100);

    const report: SolvabilityTestReport = {
      totalBoardsTested,
      passedCount,
      failedCount,
      passRatePercentage,
      failures,
      executionTimeMs,
    };

    console.log(`[SolvabilityTestSuite] Completed: ${passedCount}/${totalBoardsTested} Passed (${passRatePercentage}%). Time: ${executionTimeMs}ms.`);

    return report;
  }
}
