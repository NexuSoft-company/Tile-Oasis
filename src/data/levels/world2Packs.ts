import { LevelPack, LevelConfig } from '../../types/levelPipeline';

export const WORLD_2_PACK_1: LevelPack = {
  id: 'world_2_pack_1',
  name: 'Sunlit Dunes: The Awakening Trail',
  worldId: 2,
  worldName: 'Sunlit Dunes',
  startLevel: 101,
  endLevel: 125,
  difficultyProfile: 'Gradual',
  theme: 'Foundation & Triplet Rhythm',
  version: 'v1.0',
  levelConfigs: Array.from({ length: 25 }, (_, i) => {
    const levelId = i + 101;
    return {
      levelId,
      worldId: 2,
      worldName: 'Sunlit Dunes',
      mode: 'SEEDED' as const,
      seed: levelId * 10007 + 42,
      version: 'v1.0',
    };
  }),
};
