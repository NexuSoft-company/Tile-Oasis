import { SolvabilityTestSuite } from '../src/engine/__tests__/SolvabilityTestSuite';

console.log('====================================================');
console.log('RUNNING 100-BOARD SOLVABILITY VALIDATION SUITE');
console.log('====================================================');

const report = SolvabilityTestSuite.run100BoardValidationSuite();

console.log('\n====================================================');
console.log('SOLVABILITY TEST SUITE RESULTS:');
console.log(`Total Boards Tested: ${report.totalBoardsTested}`);
console.log(`Passed (Solvable):   ${report.passedCount}`);
console.log(`Failed:              ${report.failedCount}`);
console.log(`Pass Rate:           ${report.passRatePercentage}%`);
console.log(`Execution Time:      ${report.executionTimeMs}ms`);

if (report.failures.length > 0) {
  console.log('\nFAILURES DETECTED:');
  report.failures.forEach(f => {
    console.log(` - Level ${f.levelId} (Seed ${f.seed}): ${f.reason}`);
  });
  process.exit(1);
} else {
  console.log('\nALL 100 BOARDS PASSED SOLVABILITY VALIDATION SUCCESSFULLY! PERFECT 100/100.');
  process.exit(0);
}
