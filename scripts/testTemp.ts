import { LevelResultSystem } from '../src/engine/LevelResultSystem';
import { generateLevelDefinition } from '../src/data/levelDefinitions';

class MockSession {
  public levelDef: any;
  public state: any;
  public elapsedTime: number;
  
  constructor(levelId: number, score: number, moves: number, tilesCount: number = 30) {
    this.levelDef = generateLevelDefinition(levelId);
    this.levelDef.tiles = Array(tilesCount).fill({ typeId: 1 });
    this.state = { score, movesUsed: moves, tilesMatchedCount: tilesCount };
    this.elapsedTime = 30;
  }
  getElapsedTimeSeconds() { return this.elapsedTime; }
}

const sessionGood = new MockSession(2, 2000, 20, 30) as any;
const resGood = LevelResultSystem.createResult(sessionGood, true);
console.log("resGood.stars:", resGood.stars);

const sessionExcellent = new MockSession(3, 3000, 10, 30) as any; 
const resExcellent = LevelResultSystem.createResult(sessionExcellent, true);
console.log("resExcellent.stars:", resExcellent.stars);
