export type CollectibleCategory =
  | 'tile_theme'
  | 'tile_skin'
  | 'board_theme'
  | 'player_frame'
  | 'special_badge'
  | 'world_memory';

export type CollectibleRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type UnlockRequirementType =
  | 'free'
  | 'level'
  | 'stars'
  | 'world'
  | 'pack'
  | 'boss'
  | 'achievement'
  | 'milestone'
  | 'shop';

export interface UnlockRequirement {
  type: UnlockRequirementType;
  target: number | string;
  description: string;
}

export interface CollectibleItem {
  id: string;
  name: string;
  description: string;
  category: CollectibleCategory;
  rarity: CollectibleRarity;
  icon: string;
  unlockRequirement: UnlockRequirement;
  coinPrice?: number;
  gemPrice?: number;
  previewColor?: string;
  visualEffect?: string;
}

export interface PlayerCustomizations {
  equippedTileTheme: string;
  equippedTileSkin: string;
  equippedBoardTheme: string;
  equippedPlayerFrame: string;
}

export interface CollectionState {
  unlockedItemIds: string[];
  ownedItemIds: string[];
  customizations: PlayerCustomizations;
}

export interface PlayerProgressionState {
  playerXp: number;
  playerLevel: number;
  lastLevelUpAcknowledged: number;
}
