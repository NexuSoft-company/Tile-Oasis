import { LevelDefinition, TileTypeDefinition } from '../types/gameEngine';
import { LevelPackRegistry } from './levels/levelPackRegistry';

export const ALL_TILE_TYPES: TileTypeDefinition[] = [
  // FRUIT
  { id: 'fruit_apple', name: 'Apple', icon: '🍎', colorGradient: 'from-red-500 to-rose-600', category: 'Fruit' },
  { id: 'fruit_banana', name: 'Banana', icon: '🍌', colorGradient: 'from-amber-400 to-yellow-500', category: 'Fruit' },
  { id: 'fruit_grape', name: 'Grapes', icon: '🍇', colorGradient: 'from-purple-500 to-indigo-600', category: 'Fruit' },
  { id: 'fruit_orange', name: 'Orange', icon: '🍊', colorGradient: 'from-orange-400 to-amber-500', category: 'Fruit' },
  { id: 'fruit_watermelon', name: 'Watermelon', icon: '🍉', colorGradient: 'from-emerald-500 to-green-600', category: 'Fruit' },
  { id: 'fruit_strawberry', name: 'Strawberry', icon: '🍓', colorGradient: 'from-pink-500 to-rose-500', category: 'Fruit' },
  { id: 'fruit_avocado', name: 'Avocado', icon: '🥑', colorGradient: 'from-green-600 to-emerald-700', category: 'Fruit' },
  { id: 'fruit_cherry', name: 'Cherry', icon: '🍒', colorGradient: 'from-red-600 to-pink-600', category: 'Fruit' },
  { id: 'fruit_lemon', name: 'Lemon', icon: '🍋', colorGradient: 'from-yellow-400 to-amber-500', category: 'Fruit' },
  { id: 'fruit_peach', name: 'Peach', icon: '🍑', colorGradient: 'from-rose-300 to-pink-400', category: 'Fruit' },
  { id: 'fruit_pineapple', name: 'Pineapple', icon: '🍍', colorGradient: 'from-yellow-500 to-orange-500', category: 'Fruit' },
  { id: 'fruit_kiwi', name: 'Kiwi', icon: '🥝', colorGradient: 'from-lime-500 to-green-600', category: 'Fruit' },
  { id: 'fruit_coconut', name: 'Coconut', icon: '🥥', colorGradient: 'from-stone-500 to-stone-700', category: 'Fruit' },

  // FLOWER
  { id: 'flower_lotus', name: 'Lotus', icon: '🪷', colorGradient: 'from-pink-400 to-rose-500', category: 'Flower' },
  { id: 'flower_rose', name: 'Rose', icon: '🌹', colorGradient: 'from-rose-600 to-red-700', category: 'Flower' },
  { id: 'flower_sunflower', name: 'Sunflower', icon: '🌻', colorGradient: 'from-amber-400 to-yellow-600', category: 'Flower' },
  { id: 'flower_orchid', name: 'Orchid', icon: '🌺', colorGradient: 'from-fuchsia-500 to-pink-600', category: 'Flower' },
  { id: 'flower_tulip', name: 'Tulip', icon: '🌷', colorGradient: 'from-rose-400 to-pink-500', category: 'Flower' },
  { id: 'flower_blossom', name: 'Blossom', icon: '🌸', colorGradient: 'from-pink-300 to-rose-400', category: 'Flower' },
  { id: 'flower_hibiscus', name: 'Hibiscus', icon: '🌺', colorGradient: 'from-red-400 to-rose-500', category: 'Flower' },
  { id: 'flower_bouquet', name: 'Bouquet', icon: '💐', colorGradient: 'from-violet-400 to-fuchsia-500', category: 'Flower' },

  // LEAF
  { id: 'leaf_palm', name: 'Palm Leaf', icon: '🌴', colorGradient: 'from-emerald-500 to-teal-700', category: 'Leaf' },
  { id: 'leaf_clover', name: 'Clover', icon: '🍀', colorGradient: 'from-green-500 to-emerald-600', category: 'Leaf' },
  { id: 'leaf_maple', name: 'Maple Leaf', icon: '🍁', colorGradient: 'from-orange-500 to-red-600', category: 'Leaf' },
  { id: 'leaf_herb', name: 'Herb', icon: '🌿', colorGradient: 'from-emerald-400 to-green-600', category: 'Leaf' },
  { id: 'leaf_seedling', name: 'Seedling', icon: '🌱', colorGradient: 'from-lime-400 to-green-500', category: 'Leaf' },

  // GEM
  { id: 'gem_emerald', name: 'Emerald', icon: '💎', colorGradient: 'from-teal-400 to-emerald-600', category: 'Gem' },
  { id: 'gem_ruby', name: 'Ruby', icon: '🔻', colorGradient: 'from-rose-500 to-red-700', category: 'Gem' },
  { id: 'gem_sapphire', name: 'Sapphire', icon: '🔷', colorGradient: 'from-blue-500 to-indigo-700', category: 'Gem' },
  { id: 'gem_amethyst', name: 'Amethyst', icon: '🟪', colorGradient: 'from-purple-500 to-violet-700', category: 'Gem' },
  { id: 'gem_topaz', name: 'Topaz', icon: '🟧', colorGradient: 'from-orange-400 to-amber-600', category: 'Gem' },

  // SHELL
  { id: 'shell_pearl', name: 'Pearl Shell', icon: '🐚', colorGradient: 'from-slate-300 to-cyan-500', category: 'Shell' },
  { id: 'shell_starfish', name: 'Starfish', icon: '⭐', colorGradient: 'from-amber-300 to-orange-400', category: 'Shell' },
  { id: 'shell_conch', name: 'Conch', icon: '🦪', colorGradient: 'from-slate-400 to-stone-500', category: 'Shell' },

  // STONE
  { id: 'stone_zen', name: 'Zen Pebble', icon: '🪨', colorGradient: 'from-stone-400 to-stone-600', category: 'Stone' },
  { id: 'stone_meteor', name: 'Meteor', icon: '☄️', colorGradient: 'from-slate-500 to-slate-800', category: 'Stone' },

  // CRYSTAL
  { id: 'crystal_quartz', name: 'Quartz Prism', icon: '🔮', colorGradient: 'from-violet-400 to-purple-600', category: 'Crystal' },
  { id: 'crystal_ice', name: 'Ice Crystal', icon: '🧊', colorGradient: 'from-cyan-300 to-blue-400', category: 'Crystal' },

  // SPECIAL
  { id: 'special_golden', name: 'Golden Tile', icon: '✨', colorGradient: 'from-yellow-300 to-amber-500', category: 'Special' },
];

export const TILE_TYPE_MAP = Object.fromEntries(ALL_TILE_TYPES.map(t => [t.id, t]));

/**
 * Data-driven deterministic level definition pipeline wrapper.
 * Delegates to LevelPackRegistry and LevelFactory.
 */
export function generateLevelDefinition(levelId: number): LevelDefinition {
  return LevelPackRegistry.getLevelDefinition(levelId);
}

