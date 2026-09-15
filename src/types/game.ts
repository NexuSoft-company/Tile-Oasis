export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export interface FeatureItem {
  id: string;
  system: string;
  screen: string;
  featureName: string;
  purpose: string;
  playerAction: string;
  expectedResult: string;
  gameLogic: string;
  requiredUI: string;
  requiredAssets: string;
  requiredData: string;
  backendRequirement: string;
  databaseRequirement: string;
  monetizationRequirement: string;
  analyticsEvents: string[];
  securityConsiderations: string;
  dependencies: string[];
  priority: Priority;
}

export interface ScreenItem {
  id: string;
  name: string;
  category: 'Core Gameplay' | 'Meta & Progression' | 'Social & Clubs' | 'Economy & Shop' | 'Admin & System';
  description: string;
  keyComponents: string[];
  priority: Priority;
}

export interface SystemItem {
  id: number;
  name: string;
  description: string;
  scopeCategory: 'Core Engine' | 'Meta & Progression' | 'Social & LiveOps' | 'Platform & Infrastructure';
  priority: Priority;
}

export interface DatabaseEntity {
  tableName: string;
  description: string;
  fields: { name: string; type: string; constraints: string; description: string }[];
  indexes: string[];
}

export interface UnityFolderNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: UnityFolderNode[];
}

export interface TileType {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji fallback
  color: string;
  bgGradient: string;
}

export interface TileData {
  id: string;
  typeId: string;
  x: number; // grid position x
  y: number; // grid position y
  layer: number; // 0 is bottom, higher is stacked on top
  isBlocked?: boolean;
}

export interface TrayTile {
  id: string;
  typeId: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  worldName: string;
  trayCapacity: number;
  tiles: TileData[];
  targetStars: number;
}
