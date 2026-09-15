import { WORLD_DEFINITIONS, WorldDefinition, isWorldUnlocked } from '../data/worldDefinitions';
import { LevelPackRegistry } from '../data/levels/levelPackRegistry';
import { LevelPack } from '../types/levelPipeline';
import { PlayerSaveData } from '../types/gameEngine';

export type MapNodeStatus = 'LOCKED' | 'UNLOCKED' | 'CURRENT' | 'COMPLETED' | 'PERFECT';

export interface WorldPackInfo {
  world: WorldDefinition;
  packs: LevelPack[];
  isUnlocked: boolean;
}

export class WorldPackHierarchy {
  /**
   * Retrieves full hierarchy metadata for all worlds and packs.
   */
  public static getHierarchy(saveData: PlayerSaveData): WorldPackInfo[] {
    return WORLD_DEFINITIONS.map((world) => {
      const unlockRes = isWorldUnlocked(world, saveData.highestLevelUnlocked, saveData.starsTotal);
      const isUnlocked = unlockRes.unlocked;
      const packs = LevelPackRegistry.getPacksForWorld(world.id);
      return {
        world,
        packs,
        isUnlocked,
      };
    });
  }

  /**
   * World lookup by level ID.
   */
  public static getWorldForLevel(levelId: number): WorldDefinition {
    const world = WORLD_DEFINITIONS.find(
      (w) => levelId >= w.levelRange[0] && levelId <= w.levelRange[1]
    );
    return world || WORLD_DEFINITIONS[0];
  }

  /**
   * Pack lookup by level ID.
   */
  public static getPackForLevel(levelId: number): LevelPack | undefined {
    return LevelPackRegistry.getPackForLevel(levelId);
  }

  /**
   * Evaluates exact map node status for a level given player save data.
   */
  public static getLevelNodeStatus(levelId: number, saveData: PlayerSaveData): {
    status: MapNodeStatus;
    stars: number;
    highScore: number;
  } {
    const completedInfo = saveData.completedLevels[levelId];
    const isCompleted = !!completedInfo;
    const stars = completedInfo ? completedInfo.stars : 0;
    const highScore = completedInfo ? completedInfo.highScore : 0;

    if (isCompleted) {
      return {
        status: stars === 3 ? 'PERFECT' : 'COMPLETED',
        stars,
        highScore,
      };
    }

    if (levelId === saveData.highestLevelUnlocked) {
      return { status: 'CURRENT', stars: 0, highScore: 0 };
    }

    if (levelId < saveData.highestLevelUnlocked) {
      return { status: 'UNLOCKED', stars: 0, highScore: 0 };
    }

    return { status: 'LOCKED', stars: 0, highScore: 0 };
  }
}
