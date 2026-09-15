import { LevelPack, LevelConfig } from '../../types/levelPipeline';

export const TEST_LEVELS_CONFIGS: LevelConfig[] = [
  // 1. Simplest valid level (6 tiles / 2 triplets)
  {
    levelId: 9001,
    worldId: 99,
    worldName: 'Regression Test Realm',
    mode: 'HAND_AUTHORED',
    seed: 9001,
    explicitTiles: [
      { id: 'test_1a', typeId: 'fruit_apple', x: 0, y: 0, layer: 0, state: 'AVAILABLE' },
      { id: 'test_1b', typeId: 'fruit_apple', x: 1, y: 0, layer: 0, state: 'AVAILABLE' },
      { id: 'test_1c', typeId: 'fruit_apple', x: 2, y: 0, layer: 0, state: 'AVAILABLE' },
      { id: 'test_2a', typeId: 'fruit_banana', x: 0, y: 1, layer: 0, state: 'AVAILABLE' },
      { id: 'test_2b', typeId: 'fruit_banana', x: 1, y: 1, layer: 0, state: 'AVAILABLE' },
      { id: 'test_2c', typeId: 'fruit_banana', x: 2, y: 1, layer: 0, state: 'AVAILABLE' },
    ],
    trayCapacity: 7,
  },

  // 2. Small board (12 tiles / 4 triplets)
  {
    levelId: 9002,
    worldId: 99,
    worldName: 'Regression Test Realm',
    mode: 'PARAMETRIC',
    seed: 9002,
    tripletCount: 4,
    layerCount: 2,
    layoutPattern: 'Pyramid',
    trayCapacity: 7,
  },

  // 3. Large board (90 tiles / 30 triplets)
  {
    levelId: 9003,
    worldId: 99,
    worldName: 'Regression Test Realm',
    mode: 'PARAMETRIC',
    seed: 9003,
    tripletCount: 30,
    layerCount: 4,
    layoutPattern: 'Diamond',
    trayCapacity: 8,
  },

  // 4. Maximum tray pressure (tray capacity 6)
  {
    levelId: 9004,
    worldId: 99,
    worldName: 'Regression Test Realm',
    mode: 'PARAMETRIC',
    seed: 9004,
    tripletCount: 12,
    layerCount: 3,
    layoutPattern: 'Cross',
    trayCapacity: 7,
  },

  // 5. Maximum layer depth (5 layers)
  {
    levelId: 9005,
    worldId: 99,
    worldName: 'Regression Test Realm',
    mode: 'PARAMETRIC',
    seed: 9005,
    tripletCount: 18,
    layerCount: 5,
    layoutPattern: 'Spiral',
    trayCapacity: 7,
  },
];

export const TEST_LEVEL_PACK: LevelPack = {
  id: 'pack_test_regression',
  name: 'Permanent Regression Test Pack',
  worldId: 99,
  worldName: 'Regression Test Realm',
  startLevel: 9001,
  endLevel: 9005,
  difficultyProfile: 'Master',
  theme: 'Laboratory',
  version: 'v1.0',
  levelConfigs: TEST_LEVELS_CONFIGS,
};
