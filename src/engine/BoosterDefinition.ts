import { BoosterType } from '../types/gameEngine';

export type { BoosterType };

export type BoosterCategory = 'tactical' | 'board' | 'tray' | 'utility';
export type BoosterTargetType = 'board' | 'tray' | 'global' | 'none';

export interface BoosterDefinition {
  id: BoosterType;
  name: string;
  description: string;
  iconId: string;
  category: BoosterCategory;
  targetType: BoosterTargetType;
  coinCost: number;
  gemCost: number;
  defaultCurrency: 'coins' | 'gems';
  maxInventory: number;
  maxUsesPerLevel: number;
  unlockLevel: number;
  isActive: boolean;
  requiresConfirmation: boolean;
  version: string;
}

export const BOOSTER_DEFINITIONS: Record<BoosterType, BoosterDefinition> = {
  undo: {
    id: 'undo',
    name: 'Undo Move',
    description: 'Returns the last selected tile from the tray back to its board position.',
    iconId: 'RotateCcw',
    category: 'tactical',
    targetType: 'tray',
    coinCost: 50,
    gemCost: 5,
    defaultCurrency: 'coins',
    maxInventory: 99,
    maxUsesPerLevel: 5,
    unlockLevel: 1,
    isActive: true,
    requiresConfirmation: false,
    version: '1.0.0',
  },
  shuffle: {
    id: 'shuffle',
    name: 'Board Shuffle',
    description: 'Shuffles all remaining available and blocked tiles on the board.',
    iconId: 'Shuffle',
    category: 'board',
    targetType: 'board',
    coinCost: 75,
    gemCost: 8,
    defaultCurrency: 'coins',
    maxInventory: 99,
    maxUsesPerLevel: 3,
    unlockLevel: 2,
    isActive: true,
    requiresConfirmation: false,
    version: '1.0.0',
  },
  magnet: {
    id: 'magnet',
    name: 'Magnet Match',
    description: 'Instantly pulls 3 matching tiles from board and tray to complete a match.',
    iconId: 'Magnet',
    category: 'board',
    targetType: 'board',
    coinCost: 100,
    gemCost: 10,
    defaultCurrency: 'coins',
    maxInventory: 99,
    maxUsesPerLevel: 3,
    unlockLevel: 3,
    isActive: true,
    requiresConfirmation: false,
    version: '1.0.0',
  },
  extra_slot: {
    id: 'extra_slot',
    name: 'Extra Tray Slot',
    description: 'Temporarily unlocks +1 tray slot for the current level session.',
    iconId: 'PlusCircle',
    category: 'tray',
    targetType: 'global',
    coinCost: 120,
    gemCost: 12,
    defaultCurrency: 'coins',
    maxInventory: 99,
    maxUsesPerLevel: 2,
    unlockLevel: 4,
    isActive: true,
    requiresConfirmation: true,
    version: '1.0.0',
  },
  freeze: {
    id: 'freeze',
    name: 'Time Freeze',
    description: 'Pauses the level countdown timer for 15 seconds.',
    iconId: 'Snowflake',
    category: 'utility',
    targetType: 'global',
    coinCost: 80,
    gemCost: 8,
    defaultCurrency: 'coins',
    maxInventory: 99,
    maxUsesPerLevel: 2,
    unlockLevel: 5,
    isActive: false,
    requiresConfirmation: false,
    version: '1.0.0',
  },
  hint: {
    id: 'hint',
    name: 'Smart Hint',
    description: 'Highlights a tile on the board that can lead to an immediate match.',
    iconId: 'Lightbulb',
    category: 'tactical',
    targetType: 'board',
    coinCost: 40,
    gemCost: 4,
    defaultCurrency: 'coins',
    maxInventory: 99,
    maxUsesPerLevel: 5,
    unlockLevel: 1,
    isActive: false,
    requiresConfirmation: false,
    version: '1.0.0',
  },
  auto_match: {
    id: 'auto_match',
    name: 'Auto Match',
    description: 'Automatically selects and matches one complete triplet.',
    iconId: 'Target',
    category: 'board',
    targetType: 'board',
    coinCost: 150,
    gemCost: 15,
    defaultCurrency: 'gems',
    maxInventory: 99,
    maxUsesPerLevel: 1,
    unlockLevel: 10,
    isActive: false,
    requiresConfirmation: true,
    version: '1.0.0',
  },
};

export class BoosterRegistry {
  public static getDefinition(type: BoosterType): BoosterDefinition | null {
    return BOOSTER_DEFINITIONS[type] || null;
  }

  public static getActiveBoosters(): BoosterDefinition[] {
    return Object.values(BOOSTER_DEFINITIONS).filter(def => def.isActive);
  }

  public static isBoosterUnlocked(type: BoosterType, playerLevel: number): boolean {
    const def = BOOSTER_DEFINITIONS[type];
    if (!def) return false;
    return def.isActive && playerLevel >= def.unlockLevel;
  }
}
