import { LevelPack, LevelConfig } from '../../types/levelPipeline';

export const WORLD_1_PACK_1: LevelPack = {
  id: 'world_1_pack_1',
  name: 'Emerald Sanctuary: The Awakening Trail',
  worldId: 1,
  worldName: 'Emerald Sanctuary',
  startLevel: 1,
  endLevel: 25,
  difficultyProfile: 'Gradual',
  theme: 'Foundation & Triplet Rhythm',
  version: 'v1.0',
  levelConfigs: Array.from({ length: 25 }, (_, i) => {
    const levelId = i + 1;
    return {
      levelId,
      worldId: 1,
      worldName: 'Emerald Sanctuary',
      mode: 'SEEDED' as const,
      seed: levelId * 10007 + 42,
      version: 'v1.0',
    };
  }),
};

export const WORLD_1_PACK_2: LevelPack = {
  id: 'world_1_pack_2',
  name: 'Emerald Sanctuary: Labyrinth of Echoes',
  worldId: 1,
  worldName: 'Emerald Sanctuary',
  startLevel: 26,
  endLevel: 50,
  difficultyProfile: 'Advanced',
  theme: 'Occlusion & Spatial Depth',
  version: 'v1.0',
  levelConfigs: Array.from({ length: 25 }, (_, i) => {
    const levelId = i + 26;
    return {
      levelId,
      worldId: 1,
      worldName: 'Emerald Sanctuary',
      mode: 'SEEDED' as const,
      seed: levelId * 10007 + 42,
      version: 'v1.0',
    };
  }),
};
