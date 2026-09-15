import { ScoreSystem } from './src/engine/ScoreSystem';

const rules = {
  oneStarScore: 10 * 100, // 1000
  twoStarsScore: Math.floor(10 * 100 * 2.2), // 2200
  threeStarsScore: Math.floor(10 * 100 * 3.6) // 3600
};

const sys = new ScoreSystem();
console.log("No combos, base score = 150 * 10 = 1500");
console.log("No efficiency:", sys.calculateFinalStars(1500, rules));
console.log("1.5x efficiency:", sys.calculateFinalStars(1500 * 1.5, rules));
console.log("2x efficiency:", sys.calculateFinalStars(1500 * 2.0, rules));
console.log("2.25x efficiency:", sys.calculateFinalStars(1500 * 2.25, rules));
console.log("2.5x efficiency:", sys.calculateFinalStars(1500 * 2.5, rules));

console.log("Good combos, base score = 180 * 10 = 1800");
console.log("No efficiency:", sys.calculateFinalStars(1800, rules));
console.log("1.5x efficiency:", sys.calculateFinalStars(1800 * 1.5, rules));
console.log("2x efficiency:", sys.calculateFinalStars(1800 * 2.0, rules));
console.log("2.25x efficiency:", sys.calculateFinalStars(1800 * 2.25, rules));
