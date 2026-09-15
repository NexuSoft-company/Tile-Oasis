import { BoosterType } from '../types/gameEngine';

export type ShopItemCategory = 'boosters' | 'bundles' | 'cosmetics' | 'themes' | 'special';

export interface ShopItemDefinition {
  id: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  coinPrice?: number;
  gemPrice?: number;
  icon: string;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  boosterGrant?: Partial<Record<BoosterType, number>>;
  coinsGrant?: number;
  gemsGrant?: number;
  collectibleId?: string;
  maxInventoryLimit?: number;
}

export const SHOP_CATALOG: ShopItemDefinition[] = [
  // ==========================================
  // 1. SINGLE POWER-UPS / BOOSTERS
  // ==========================================
  {
    id: 'shop_booster_undo',
    name: 'Undo Move',
    description: 'Reverse your last tile placement back into the board grid.',
    category: 'boosters',
    coinPrice: 100,
    gemPrice: 5,
    icon: 'RotateCcw',
    boosterGrant: { undo: 1 },
    maxInventoryLimit: 99,
  },
  {
    id: 'shop_booster_shuffle',
    name: 'Board Shuffle',
    description: 'Rearrange accessible board tiles to uncover fresh triplets.',
    category: 'boosters',
    coinPrice: 150,
    gemPrice: 8,
    icon: 'Shuffle',
    boosterGrant: { shuffle: 1 },
    maxInventoryLimit: 99,
  },
  {
    id: 'shop_booster_magnet',
    name: 'Triple Magnet',
    description: 'Instantly pull an available triplet directly into the tray.',
    category: 'boosters',
    coinPrice: 200,
    gemPrice: 10,
    icon: 'Magnet',
    boosterGrant: { magnet: 1 },
    maxInventoryLimit: 99,
  },
  {
    id: 'shop_booster_extra_slot',
    name: 'Extra Tray Slot',
    description: 'Expand your holding tray capacity by +1 slot for the level.',
    category: 'boosters',
    coinPrice: 300,
    gemPrice: 15,
    icon: 'PlusSquare',
    boosterGrant: { extra_slot: 1 },
    maxInventoryLimit: 99,
  },
  {
    id: 'shop_booster_freeze',
    name: 'Freeze Time',
    description: 'Thaw frozen tiles and pause time pressure obstacles.',
    category: 'boosters',
    coinPrice: 150,
    gemPrice: 8,
    icon: 'Snowflake',
    boosterGrant: { freeze: 1 },
    maxInventoryLimit: 99,
  },
  {
    id: 'shop_booster_hint',
    name: 'Tactical Hint',
    description: 'Highlight the optimal sequence of matching tiles on the board.',
    category: 'boosters',
    coinPrice: 100,
    gemPrice: 5,
    icon: 'Lightbulb',
    boosterGrant: { hint: 1 },
    maxInventoryLimit: 99,
  },
  {
    id: 'shop_booster_auto_match',
    name: 'Auto-Match Strike',
    description: 'Clear an entire matched triplet with zero tray footprint.',
    category: 'boosters',
    coinPrice: 250,
    gemPrice: 12,
    icon: 'Zap',
    boosterGrant: { auto_match: 1 },
    maxInventoryLimit: 99,
  },

  // ==========================================
  // 2. VALUE BUNDLES
  // ==========================================
  {
    id: 'bundle_oasis_starter',
    name: 'Oasis Starter Kit',
    description: '2 Undos, 2 Shuffles, and 1 Magnet power-up.',
    category: 'bundles',
    coinPrice: 450,
    gemPrice: 20,
    icon: 'Gift',
    badge: 'SAVE 25%',
    isPopular: true,
    boosterGrant: {
      undo: 2,
      shuffle: 2,
      magnet: 1,
    },
  },
  {
    id: 'bundle_tactical_master',
    name: 'Tactical Master Kit',
    description: '3 Undos, 3 Shuffles, 3 Magnets, and 2 Extra Slots.',
    category: 'bundles',
    coinPrice: 1100,
    gemPrice: 50,
    icon: 'Boxes',
    badge: 'BEST VALUE',
    isBestValue: true,
    boosterGrant: {
      undo: 3,
      shuffle: 3,
      magnet: 3,
      extra_slot: 2,
    },
  },
  {
    id: 'bundle_gemstone_vault',
    name: 'Grand Sanctuary Vault',
    description: '5 of EVERY power-up plus 1,000 bonus coins!',
    category: 'bundles',
    gemPrice: 85,
    icon: 'Crown',
    badge: 'MEGA BUNDLE',
    coinsGrant: 1000,
    boosterGrant: {
      undo: 5,
      shuffle: 5,
      magnet: 5,
      extra_slot: 5,
      freeze: 5,
      hint: 5,
      auto_match: 5,
    },
  },

  // ==========================================
  // 3. DAILY FREE GIFT & SPECIAL OFFERS
  // ==========================================
  {
    id: 'shop_daily_free_gift',
    name: 'Daily Sanctuary Gift',
    description: '150 Free Coins + 1 Free Undo Booster every 24 hours!',
    category: 'special',
    coinPrice: 0,
    gemPrice: 0,
    icon: 'Gift',
    badge: 'FREE DAILY',
    coinsGrant: 150,
    boosterGrant: { undo: 1 },
  },
];
