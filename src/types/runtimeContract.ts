import {
  LevelDefinition,
  BoardTile,
  LevelObjective,
  StarRules,
  RewardDefinition,
  DifficultyLevel,
  TileCategory,
  SpecialTileProperty
} from './gameEngine';
import { BoardLayoutPattern } from '../engine/BoardLayouts';
import { LevelGenerationMode } from './levelPipeline';

export type RuntimeTileLifecycleState =
  | 'CREATED'
  | 'AVAILABLE'
  | 'BLOCKED'
  | 'LOCKED'
  | 'SELECTED'
  | 'MOVING'
  | 'IN_TRAY'
  | 'MATCHED'
  | 'REMOVED'
  | 'DISABLED'
  | 'HIDDEN';

export type LevelLoaderState =
  | 'IDLE'
  | 'REQUESTING'
  | 'VALIDATING'
  | 'LOADING_ASSETS'
  | 'BUILDING_BOARD'
  | 'INITIALIZING_GAMEPLAY'
  | 'READY'
  | 'FAILED';

export interface RuntimeLevelMetadata {
  version: string; // e.g. "v1.0"
  generationMode: LevelGenerationMode;
  seed: number;
  approvalStatus: 'APPROVED' | 'REJECTED' | 'PENDING';
  qualityScore: number; // 0 - 100
  difficultyScore: number; // 0 - 100
  difficultyLabel: DifficultyLevel;
  layoutPattern: BoardLayoutPattern;
  createdAtTimestamp: number;
}

export interface RuntimeLevelDefinition extends LevelDefinition {
  packId: string;
  metadata: RuntimeLevelMetadata;
  moveLimit?: number;
  timeLimitSeconds?: number;
  boosterRules?: {
    allowedBoosters: string[];
    freeBoostersGranted?: Record<string, number>;
  };
}

export interface ContentTileData extends BoardTile {
  category: TileCategory;
}

export interface RuntimeTileData {
  runtimeId: string;
  contentTileId: string;
  typeId: string;
  category: TileCategory;
  x: number;
  y: number;
  layer: number;
  state: RuntimeTileLifecycleState;
  specialProperty?: SpecialTileProperty;
  chainCount?: number;
  freezeLevel?: number;
  isBlocked: boolean;
  isLocked: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  visualIcon: string;
  visualName: string;
  colorGradient: string;
}

export interface LevelSessionState {
  levelId: number;
  worldId: number;
  packId: string;
  startTime: number;
  endTime?: number;
  durationSeconds: number;
  currentState: LevelLoaderState;
  isCompleted: boolean;
  isFailed: boolean;
  movesUsed: number;
  score: number;
  comboCount: number;
  tilesMatchedCount: number;
  trayOccupancy: number;
  boosterUsage: Record<string, number>;
  objectivesProgress: LevelObjective[];
}

export interface LevelResult {
  levelId: number;
  worldId: number;
  packId: string;
  completed: boolean;
  stars: number; // 0 - 3
  score: number;
  movesUsed: number;
  timeUsedSeconds: number;
  boostersUsed: Record<string, number>;
  tilesMatched: number;
  objectivesCompleted: boolean;
  rewardsEarned: RewardDefinition;
  completionTimestamp: number;
  version: string;
}
