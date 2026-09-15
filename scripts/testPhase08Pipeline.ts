import { BatchLevelGenerator } from '../src/engine/BatchLevelGenerator';

console.log('====================================================');
console.log('PHASE 08 — LEVEL CONTENT FACTORY & PRODUCTION PIPELINE TEST');
console.log('====================================================\n');

console.log('Executing 100-Level Batch Generation & Analytical Validation...');
const batchReport = BatchLevelGenerator.generateBatch(100, 1);

console.log('\n====================================================');
console.log('100-LEVEL BATCH VALIDATION METRICS:');
console.log(`Total Levels Generated: ${batchReport.totalGenerated}`);
console.log(`Passed (Approved):     ${batchReport.passedCount}`);
console.log(`Failed (Unsolvable):   ${batchReport.failedCount}`);
console.log(`Rejected (Quality):    ${batchReport.rejectedCount}`);
console.log(`Pass Rate Percentage:  ${batchReport.passRatePercentage}%`);
console.log(`Execution Time:        ${batchReport.executionTimeMs}ms`);

console.log('\nDIFFICULTY SCORE METRICS:');
console.log(`Average Difficulty:    ${batchReport.avgDifficultyScore} / 100`);
console.log(`Min Difficulty:        ${batchReport.minDifficultyScore}`);
console.log(`Max Difficulty:        ${batchReport.maxDifficultyScore}`);

console.log('\nQUALITY SCORE METRICS:');
console.log(`Average Quality Score: ${batchReport.avgQualityScore} / 100`);
console.log(`Min Quality Score:     ${batchReport.minQualityScore}`);
console.log(`Max Quality Score:     ${batchReport.maxQualityScore}`);

console.log('\nDIFFICULTY DISTRIBUTION:');
Object.entries(batchReport.difficultyDistribution).forEach(([label, count]) => {
  console.log(` - ${label.padEnd(10)}: ${count} levels (${count}%)`);
});

console.log('\nLAYOUT FAMILY DISTRIBUTION:');
Object.entries(batchReport.layoutDistribution).forEach(([layout, count]) => {
  console.log(` - ${layout.padEnd(10)}: ${count} levels (${count}%)`);
});

console.log('\n====================================================');
console.log('RUNNING DETERMINISM VERIFICATION TEST across 10 random seeds...');
let determinismPassed = true;
for (let id = 1; id <= 10; id++) {
  const isDeterministic = BatchLevelGenerator.verifyDeterminism(id, id * 777 + 42);
  if (!isDeterministic) {
    determinismPassed = false;
    console.error(`❌ Determinism failure on level ${id}!`);
  }
}

if (determinismPassed) {
  console.log('✅ DETERMINISM VERIFICATION: 100% IDENTICAL BOARDS PRODUCED ACROSS REPEATED RUNS!');
}

if (batchReport.failedCount > 0 || !determinismPassed) {
  console.error('\n❌ PIPELINE VERIFICATION FAILED!');
  process.exit(1);
} else {
  console.log('\n====================================================');
  console.log('✅ PHASE 08 PIPELINE VERIFICATION: PERFECT SUCCESS! STATUS: VERIFIED.');
  console.log('====================================================');
  process.exit(0);
}
