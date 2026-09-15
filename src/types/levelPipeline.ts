import {
  LevelDefinition,
  BoardTile,
  LevelObjective,
  StarRules,
  RewardDefinition,
  DifficultyLevel,
  TileCategory
} from './gameEngine';
import { BoardLayoutPattern } from '../engine/BoardLayouts';

export type LevelGenerationMode = 'HAND_AUTHORED' | 'PARAMETRIC' | 'SEEDED';

export interface LevelConfig {
  levelId: number;
  worldId: number;
  worldName?: string;
  mode: LevelGenerationMode;
  seed?: number;
  version?: string; // e.g. "v1.0"
  layoutPattern?: BoardLayoutPattern;
  tripletCount?: number;
  layerCount?: number;
  tileCategories?: TileCategory[];
  trayCapacity?: number;
  specialRules?: string[];
  
  // Hand-authored or explicit overrides
  explicitTiles?: BoardTile[];
  explicitObjectives?: LevelObjective[];
  explicitStarRules?: StarRules;
  explicitReward?: RewardDefinition;
  targetDifficultyScore?: number;
}

export interface LevelPack {
  id: string;
  name: string;
  worldId: number;
  worldName: string;
  startLevel: number;
  endLevel: number;
  difficultyProfile: 'Tutorial' | 'Gradual' | 'Spike' | 'Advanced' | 'Master';
  theme: string;
  version: string;
  levelConfigs: LevelConfig[];
}

export interface SimulationMetrics {
  isSolvable: boolean;
  stepsTaken: number;
  initialAvailableMoves: number;
  forcedMoveCount: number;
  forcedMoveRatio: number;
  meaningfulMoveCount: number;
  avgTrayOccupancy: number;
  peakTrayOccupancy: number;
  estimatedSolutionLength: number;
  searchNodesVisited: number;
}

export interface LevelReport {
  levelId: number;
  worldId: number;
  worldName: string;
  version: string;
  seed: number;
  mode: LevelGenerationMode;
  layoutPattern: string;
  tileCount: number;
  tripletCount: number;
  layerCount: number;
  difficultyScore: number;
  difficultyLabel: DifficultyLevel;
  qualityScore: number; // 0 - 100
  isSolvable: boolean;
  simulationMetrics: SimulationMetrics;
  rewards: RewardDefinition;
  starRules: StarRules;
  validationErrors: string[];
  validationWarnings: string[];
  approved: boolean;
  createdAtTimestamp: number;
}

export interface BatchValidationReport {
  totalGenerated: number;
  passedCount: number;
  failedCount: number;
  rejectedCount: number;
  passRatePercentage: number;
  avgDifficultyScore: number;
  minDifficultyScore: number;
  maxDifficultyScore: number;
  avgQualityScore: number;
  minQualityScore: number;
  maxQualityScore: number;
  difficultyDistribution: Record<DifficultyLevel, number>;
  layoutDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  reports: LevelReport[];
  executionTimeMs: number;
}
