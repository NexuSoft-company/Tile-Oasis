import { LevelPack, LevelConfig } from '../../types/levelPipeline';
import { WORLD_1_PACK_1, WORLD_1_PACK_2 } from './world1Packs';
import { WORLD_2_PACK_1 } from './world2Packs';
import { TEST_LEVEL_PACK } from './testLevelPack';
import { LevelFactory } from '../../engine/LevelFactory';
import { LevelDefinition } from '../../types/gameEngine';
import { getWorldForLevel, generateWorldDefinition } from '../worldDefinitions';
import { DifficultyCurve } from '../../engine/DifficultyCurve';

export class LevelPackRegistry {
  private static handAuthoredPacks: LevelPack[] = [
    WORLD_1_PACK_1,
    WORLD_1_PACK_2,
    WORLD_2_PACK_1,
    TEST_LEVEL_PACK,
  ];

  public static getAllPacks(): LevelPack[] {
    return this.handAuthoredPacks;
  }

  public static getPackById(packId: string): LevelPack | undefined {
    const found = this.handAuthoredPacks.find(p => p.id === packId);
    if (found) return found;

    // Parse dynamic pack id like world_12_pack_2
    const match = packId.match(/^world_(\d+)_pack_(\d+)$/);
    if (match) {
      const worldId = parseInt(match[1], 10);
      const packNum = parseInt(match[2], 10);
      return this.generateDynamicPack(worldId, packNum);
    }
    return undefined;
  }

  public static getPacksForWorld(worldId: number): LevelPack[] {
    const clampedWorldId = Math.max(1, Math.min(100, worldId));
    const result: LevelPack[] = [];

    for (let packNum = 1; packNum <= 4; packNum++) {
      const startLevel = (clampedWorldId - 1) * 100 + (packNum - 1) * 25 + 1;
      const endLevel = Math.min(9999, (clampedWorldId - 1) * 100 + packNum * 25);
      
      const handAuthored = this.handAuthoredPacks.find(
        p => p.worldId === clampedWorldId && p.startLevel === startLevel
      );

      if (handAuthored) {
        result.push(handAuthored);
      } else {
        result.push(this.generateDynamicPack(clampedWorldId, packNum));
      }
    }

    return result;
  }

  public static getPackForLevel(levelId: number): LevelPack | undefined {
    if (levelId < 1 || levelId > 9999) return undefined;
    const handAuthored = this.handAuthoredPacks.find(p => levelId >= p.startLevel && levelId <= p.endLevel);
    if (handAuthored) return handAuthored;

    const worldDef = getWorldForLevel(levelId);
    const offsetInWorld = (levelId - 1) % 100;
    const packNum = Math.floor(offsetInWorld / 25) + 1;
    return this.generateDynamicPack(worldDef.id, packNum);
  }

  public static generateDynamicPack(worldId: number, packNum: number): LevelPack {
    const clampedWorldId = Math.max(1, Math.min(100, worldId));
    const clampedPackNum = Math.max(1, Math.min(4, packNum));
    const worldDef = generateWorldDefinition(clampedWorldId);
    const startLevel = (clampedWorldId - 1) * 100 + (clampedPackNum - 1) * 25 + 1;
    const endLevel = Math.min(9999, (clampedWorldId - 1) * 100 + clampedPackNum * 25);

    const packMeta = DifficultyCurve.getPackMetadata(clampedWorldId, clampedPackNum);

    const levelConfigs: LevelConfig[] = [];
    for (let lvl = startLevel; lvl <= endLevel; lvl++) {
      levelConfigs.push({
        levelId: lvl,
        worldId: clampedWorldId,
        worldName: worldDef.name,
        mode: 'SEEDED',
        seed: lvl * 10007 + 42,
        version: LevelFactory.VERSION,
      });
    }

    return {
      id: packMeta.id,
      name: `${worldDef.name}: ${packMeta.title}`,
      worldId: clampedWorldId,
      worldName: worldDef.name,
      startLevel,
      endLevel,
      difficultyProfile: clampedPackNum === 1 ? 'Gradual' : clampedPackNum === 4 ? 'Master' : 'Advanced',
      theme: packMeta.subtitle,
      version: LevelFactory.VERSION,
      levelConfigs,
    };
  }

  /**
   * Data-driven level instantiation pipeline.
   */
  public static getLevelDefinition(levelId: number): LevelDefinition {
    if (levelId < 1 || levelId > 9999) {
      throw new Error(`[LevelPackRegistry] Level ${levelId} is out of campaign bounds (1-9999).`);
    }
    const pack = this.getPackForLevel(levelId);
    if (pack) {
      const config = pack.levelConfigs.find(c => c.levelId === levelId);
      if (config) {
        return LevelFactory.createLevel(config).level;
      }
    }
    // Fallback to default factory pipeline for un-registered level IDs
    return LevelFactory.createLevel({ levelId, mode: 'SEEDED' }).level;
  }
}
