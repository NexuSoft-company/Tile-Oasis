export type GameState = 
  | 'BOOT'
  | 'LOADING'
  | 'MAIN_MENU'
  | 'LEVEL_LOADING'
  | 'LEVEL_READY'
  | 'READY'
  | 'PLAYING'
  | 'PLAYER_INPUT'
  | 'TILE_SELECTED'
  | 'TILE_MOVING'
  | 'TRAY_UPDATED'
  | 'MATCH_CHECK'
  | 'MATCH_ANIMATION'
  | 'BOARD_UPDATE'
  | 'OBJECTIVE_CHECK'
  | 'WINNING'
  | 'FAILING'
  | 'PAUSED'
  | 'WIN'
  | 'LOSE'
  | 'COMPLETED'
  | 'FAILED'
  | 'REWARD'
  | 'TRANSITION'
  | 'MATCHING'
  | 'BOOSTER_ACTIVE';

export type TileState = 
  | 'LOCKED'
  | 'BLOCKED'
  | 'AVAILABLE'
  | 'SELECTED'
  | 'MOVING'
  | 'IN_TRAY'
  | 'MATCHING'
  | 'REMOVING'
  | 'REMOVED';

export type DifficultyLevel = 'Easy' | 'Normal' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert';

export type TileCategory = 'Fruit' | 'Flower' | 'Leaf' | 'Gem' | 'Shell' | 'Stone' | 'Crystal' | 'Special';

export interface TileTypeDefinition {
  id: string;
  name: string;
  icon: string;
  colorGradient: string;
  category: TileCategory;
  matchGroupId?: string;
}

export type SpecialTileProperty = 'frozen' | 'chained' | 'rainbow' | 'golden' | 'bomb' | 'key';

export interface BoardTile {
  id: string;
  typeId: string;
  x: number; // Float grid coordinate X
  y: number; // Float grid coordinate Y
  layer: number; // Z-layer index (0 = bottom)
  state: TileState;
  specialProperty?: SpecialTileProperty;
  chainCount?: number; // For chained tiles: number of breaks needed before selectable
  freezeLevel?: number; // For frozen tiles: number of matches needed to thaw
  matchGroupId?: string;
}

export interface TrayTileItem {
  id: string;
  typeId: string;
  sourceTileId: string;
  placedAtTimestamp: number;
  specialProperty?: SpecialTileProperty;
}

export interface TrayConfiguration {
  capacity: number;
  maxCapacityLimit: number;
  unlockedSlots: number;
  isExtraSlotActive: boolean;
}

export interface LevelObjective {
  type: 
    | 'clear_all_tiles' 
    | 'match_specific_types' 
    | 'time_trial' 
    | 'score_target' 
    | 'clear_special_tiles'
    | 'combo_target'
    | 'move_limit';
  targetCount?: number;
  targetTypeId?: string;
  targetSpecialProperty?: SpecialTileProperty;
  targetCombo?: number;
  maxMoves?: number;
  timeLimitSeconds?: number;
  targetScore?: number;
  currentCount?: number;
  completed?: boolean;
}

export interface StarRules {
  oneStarScore: number;
  twoStarsScore: number;
  threeStarsScore: number;
}

export interface RewardDefinition {
  coins: number;
  gems: number;
  boostersGranted: Partial<Record<BoosterType, number>>;
  stars: number;
  expPoints: number;
}

export interface DifficultyParameters {
  tileCount: number;
  layerDepth: number;
  varietyCount: number;
  occlusionRatio: number;
  tripletCount: number;
  trayPressure: number;
}

export interface LevelDefinition {
  id: number;
  worldId: number;
  worldName: string;
  name: string;
  difficulty: DifficultyLevel;
  numericalDifficulty: number; // Calculated 0 - 100 rating
  trayCapacity: number;
  tiles: BoardTile[];
  objectives: LevelObjective[];
  starRules: StarRules;
  rewardConfig: RewardDefinition;
  isGuaranteedSolvable: boolean;
  seed: number;
  tileSetId?: string;
  layoutPattern?: string;
  availableBoosters?: BoosterType[];
  difficultyParameters?: DifficultyParameters;
  version?: string;
  bossArchetype?: string;
  specialLevelType?: string;
  noveltyScore?: number;
  performanceProfile?: any;
}

export interface BoardStateSnapshot {
  id: string;
  timestamp: number;
  boardTiles: BoardTile[];
  trayTiles: TrayTileItem[];
  score: number;
  combo: number;
  moveCount: number;
  objectiveProgress: Record<string, number>;
}

export type BoosterType = 'undo' | 'shuffle' | 'magnet' | 'extra_slot' | 'freeze' | 'hint' | 'auto_match';

export interface BoosterConfig {
  id: BoosterType;
  name: string;
  description: string;
  coinCost: number;
  gemCost: number;
  inventoryCount: number;
  maxUsesPerLevel: number;
}

export interface ActionRecord {
  tile: BoardTile;
  trayIndex: number;
  timestamp: number;
  previousBoardTiles: BoardTile[];
}

export interface PlayerSaveData {
  currentLevel: number;
  highestLevelUnlocked: number;
  coins: number;
  gems: number;
  starsTotal: number;
  boosterInventory: Record<BoosterType, number>;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  lastSavedTimestamp: number;
  completedLevels: Record<number, { stars: number; highScore: number }>;
  metaProfile?: any;
  unlockedTileSkins?: string[];
}

export type AudioGameEvent = 
  | 'TileSelected'
  | 'TileBlocked'
  | 'TileMatched'
  | 'TileRemoved'
  | 'BoosterActivated'
  | 'LevelStarted'
  | 'LevelWon'
  | 'LevelLost'
  | 'RewardReceived'
  | 'ButtonPressed'
  | 'ComboEscalated'
  | 'SpecialTileActivated'
  | 'TileThawed'
  | 'TileUnchained';

export interface ViewportDimensions {
  width: number;
  height: number;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  deviceType: 'small_phone' | 'iphone_notch' | 'large_phone' | 'tablet' | 'desktop';
}

export interface BoardAutoFitLayout {
  boardWidth: number;
  boardHeight: number;
  tileSize: number;
  tileSpacing: number;
  layerOffsetPixels: number;
  boardCenterX: number;
  boardCenterY: number;
  gridCenterX: number;
  gridCenterY: number;
  scaleFactor: number;
}

export interface DebugConfig {
  enabled: boolean;
  showTileIds: boolean;
  showLayerBadges: boolean;
  showBoundingBoxes: boolean;
  infiniteBoosters: boolean;
  autoSolveBot: boolean;
  simulatedDevice: 'responsive' | 'iphone_15_pro' | 'pixel_7' | 'ipad_air' | 'small_compact';
}
