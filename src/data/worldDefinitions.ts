export interface WorldUnlockStatus {
  unlocked: boolean;
  reason?: string;
}

export interface WorldDefinition {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  theme: string;
  themeCategory: string;
  levelRange: [number, number];
  unlockRequirement: {
    requiredWorldId?: number;
    requiredStars?: number;
    requiredLevel?: number;
  };
  rewards: {
    coins: number;
    gems: number;
    title: string;
  };
  bgGradient: string;
  accentColor: string;
  badgeColor: string;
  primaryTileCategories: string[];
  preferredLayouts?: string[];
  mechanicAffinities?: Array<'rainbow' | 'golden' | 'frozen' | 'chained' | 'bomb' | 'key'>;
  difficultyStyle?: 'Balanced' | 'Tactical' | 'Rapid' | 'Puzzle' | 'Endurance';
  bossArchetypes?: string[];
}

export const LEVELS_PER_WORLD = 100;
export const TOTAL_WORLDS = 100;
export const MAX_CAMPAIGN_LEVEL = 9999;

/**
 * Curated Thematic Master Directory for all 100 Worlds.
 * Each world features a bespoke narrative identity, biome archetype,
 * curated tile family affinity, and color palette.
 */
export const BESPOKE_WORLD_CATALOG: Array<{
  name: string;
  subtitle: string;
  description: string;
  themeCategory: string;
  bgGradient: string;
  accentColor: string;
  badgeColor: string;
  title: string;
  tileCategories: string[];
}> = [
  // 1-10: Verdant & Earthly Biomes
  { name: 'Emerald Hills', subtitle: 'Sunlit Palm Sanctuary', description: 'Gentle rolling hills, ancient stone ruins, and sweet tropical fruits.', themeCategory: 'Verdant', bgGradient: 'from-emerald-950 via-slate-900 to-slate-950', accentColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', title: 'Emerald Guardian', tileCategories: ['Fruit', 'Flower'] },
  { name: 'Sunlit Valley', subtitle: 'Golden Dunes & Oasis', description: 'Sun-drenched golden sands echoing with whispering desert winds.', themeCategory: 'Desert', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Valley Pioneer', tileCategories: ['Fruit', 'Flower', 'Leaf'] },
  { name: 'Crystal Caverns', subtitle: 'Sapphire & Quartz Grottoes', description: 'Illuminated underground caverns where crystalline prisms reflect pure light.', themeCategory: 'Crystalline', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Crystal Alchemist', tileCategories: ['Gem', 'Crystal', 'Stone'] },
  { name: 'Sacred Lotus Lagoon', subtitle: 'Water Lily & Koi Sanctuaries', description: 'Tranquil floating lotus blossoms nestled in emerald water pavilions.', themeCategory: 'Aquatic', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Lagoon Master', tileCategories: ['Flower', 'Leaf', 'Shell'] },
  { name: 'Obsidian Peaks', subtitle: 'Volcanic Springs & Ash Heights', description: 'Majestic volcanic mountain ridges sheltering geothermal crystal veins.', themeCategory: 'Volcanic', bgGradient: 'from-rose-950 via-slate-900 to-slate-950', accentColor: 'text-rose-400', badgeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300', title: 'Flame Explorer', tileCategories: ['Stone', 'Gem', 'Fruit'] },
  { name: 'Celestial Heights', subtitle: 'Starlight Peaks & Cloud Gardens', description: 'Floating sky islands bathed in the soft glow of distant constellations.', themeCategory: 'Celestial', bgGradient: 'from-purple-950 via-slate-900 to-slate-950', accentColor: 'text-purple-400', badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300', title: 'Star Navigator', tileCategories: ['Gem', 'Crystal', 'Special'] },
  { name: 'Mystical Forest', subtitle: 'Bioluminescent Glades', description: 'Enchanted ancient woodlands glowing with magical spores and flora.', themeCategory: 'Mystic', bgGradient: 'from-cyan-950 via-slate-900 to-slate-950', accentColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', title: 'Forest Whisperer', tileCategories: ['Leaf', 'Flower', 'Fruit'] },
  { name: 'Golden Citadel', subtitle: 'Sun Monarch Marble Palaces', description: 'Triumphant golden towers built by the ancient founding tilemasters.', themeCategory: 'Ancient', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Golden Monarch', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Tempest Ridge', subtitle: 'Thunder Peaks & Gale Winds', description: 'High-altitude crags charged with elemental storm energy.', themeCategory: 'Elemental', bgGradient: 'from-sky-950 via-slate-900 to-slate-950', accentColor: 'text-sky-400', badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300', title: 'Storm Conqueror', tileCategories: ['Stone', 'Crystal', 'Special'] },
  { name: 'Astral Sanctuary', subtitle: 'Eternal Zenith Observatory', description: 'A timeless sanctuary bridging the earthly realms with the cosmic unknown.', themeCategory: 'Cosmic', bgGradient: 'from-violet-950 via-slate-900 to-slate-950', accentColor: 'text-violet-400', badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300', title: 'Astral Scholar', tileCategories: ['Crystal', 'Gem', 'Special'] },

  // 11-20: Aquatic & Coral Realms
  { name: 'Azure Coral Reef', subtitle: 'Deep Sea Pearl Atolls', description: 'Vibrant coral beds teeming with radiant aquatic wonders and pearls.', themeCategory: 'Aquatic', bgGradient: 'from-blue-950 via-slate-900 to-slate-950', accentColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300', title: 'Reef Diver', tileCategories: ['Shell', 'Gem', 'Flower'] },
  { name: 'Sunken Atlantis', subtitle: 'Submerged Marble Temples', description: 'Ancient flooded palaces holding forgotten maritime secrets.', themeCategory: 'Ancient', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Tide Seeker', tileCategories: ['Shell', 'Stone', 'Special'] },
  { name: 'Whispering Bamboo', subtitle: 'Misty Zen Groves', description: 'Peaceful bamboo forests where dew drops chime in harmony.', themeCategory: 'Verdant', bgGradient: 'from-lime-950 via-slate-900 to-slate-950', accentColor: 'text-lime-400', badgeColor: 'bg-lime-500/20 border-lime-500/40 text-lime-300', title: 'Zen Sage', tileCategories: ['Leaf', 'Stone', 'Flower'] },
  { name: 'Amber Canyon', subtitle: 'Fossil Cliffs & Sunstone Spire', description: 'Towering terracotta gorges preserving prehistoric amber deposits.', themeCategory: 'Earth', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Amber Tracker', tileCategories: ['Stone', 'Gem', 'Leaf'] },
  { name: 'Frostfall Tundra', subtitle: 'Glacial Spires & Permafrost', description: 'Chilled crystalline ice fields sculpted by polar gales.', themeCategory: 'Glacial', bgGradient: 'from-cyan-950 via-slate-900 to-slate-950', accentColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', title: 'Frost Walker', tileCategories: ['Crystal', 'Stone', 'Shell'] },
  { name: 'Dragonfruit Orchard', subtitle: 'Sunset Blossom Terraces', description: 'Terraced hillside plantations heavy with sweet dragonfruits.', themeCategory: 'Verdant', bgGradient: 'from-fuchsia-950 via-slate-900 to-slate-950', accentColor: 'text-fuchsia-400', badgeColor: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300', title: 'Harvest Knight', tileCategories: ['Fruit', 'Flower', 'Leaf'] },
  { name: 'Clockwork Spire', subtitle: 'Brass Gears & Chrono Chambers', description: 'Intricate clockwork towers keeping time for the tile universe.', themeCategory: 'Mechanical', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Chrono Crafter', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Moonlit Marsh', subtitle: 'Silver Glades & Firefly Waters', description: 'Mysterious wetlands illuminated by swarms of luminescent fireflies.', themeCategory: 'Mystic', bgGradient: 'from-emerald-950 via-slate-900 to-slate-950', accentColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', title: 'Marsh Wanderer', tileCategories: ['Flower', 'Leaf', 'Shell'] },
  { name: 'Brimstone Foundry', subtitle: 'Molten Rivers & Forge Pillars', description: 'Ancient volcanic forges where unbreakable tiles are tempered.', themeCategory: 'Volcanic', bgGradient: 'from-red-950 via-slate-900 to-slate-950', accentColor: 'text-red-400', badgeColor: 'bg-red-500/20 border-red-500/40 text-red-300', title: 'Forge Master', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Aurora Borealis', subtitle: 'Polar Shimmer & Neon Skyways', description: 'Dancing ribbons of multi-colored magnetic light spanning the northern sky.', themeCategory: 'Celestial', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Aurora Weaver', tileCategories: ['Crystal', 'Gem', 'Flower'] },

  // 21-30: Mythic & Ancient Expanses
  { name: 'Jade Pagoda', subtitle: 'Sacred Emerald Pavilions', description: 'Spiritual mountain temples crafted from pure nephrite jade.', themeCategory: 'Ancient', bgGradient: 'from-emerald-950 via-slate-900 to-slate-950', accentColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', title: 'Jade Sentinel', tileCategories: ['Gem', 'Stone', 'Leaf'] },
  { name: 'Sapphire Fjord', subtitle: 'Deep Water Chasm & Glaciers', description: 'Steep sapphire cliffs framing tranquil coastal fjords.', themeCategory: 'Aquatic', bgGradient: 'from-blue-950 via-slate-900 to-slate-950', accentColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300', title: 'Fjord Voyager', tileCategories: ['Shell', 'Crystal', 'Gem'] },
  { name: 'Terracotta Dunes', subtitle: 'Caravan Oasis & Silk Pathways', description: 'Endless red sands guided by ancient merchant waystones.', themeCategory: 'Desert', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Dune Rider', tileCategories: ['Stone', 'Fruit', 'Leaf'] },
  { name: 'Prismatic Jungle', subtitle: 'Rainbow Canopy & Orchid Groves', description: 'Dense tropical rainforest shimmering with spectrum-refracting mist.', themeCategory: 'Verdant', bgGradient: 'from-green-950 via-slate-900 to-slate-950', accentColor: 'text-green-400', badgeColor: 'bg-green-500/20 border-green-500/40 text-green-300', title: 'Jungle King', tileCategories: ['Fruit', 'Flower', 'Leaf'] },
  { name: 'Ironwood Bastion', subtitle: 'Titan Trees & Wooden Fortress', description: 'Petrified ironwood groves that have stood for millennia.', themeCategory: 'Earth', bgGradient: 'from-stone-950 via-slate-900 to-slate-950', accentColor: 'text-stone-400', badgeColor: 'bg-stone-500/20 border-stone-500/40 text-stone-300', title: 'Bastion Warden', tileCategories: ['Stone', 'Leaf', 'Special'] },
  { name: 'Coraline Deep', subtitle: 'Abyssal Glow & Nautiloid Ruins', description: 'Mysterious ocean trenches where luminescent marine fossils shine.', themeCategory: 'Aquatic', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Deep Scourer', tileCategories: ['Shell', 'Gem', 'Crystal'] },
  { name: 'Ruby Caldera', subtitle: 'Crimson Lava Lakes', description: 'A grand volcanic caldera rimmed with priceless ruby crystals.', themeCategory: 'Volcanic', bgGradient: 'from-rose-950 via-slate-900 to-slate-950', accentColor: 'text-rose-400', badgeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300', title: 'Pyre Master', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Silverwood Hollow', subtitle: 'Moonlit Aspen & Silver Streams', description: 'Peaceful forests where the bark glows under starlight.', themeCategory: 'Mystic', bgGradient: 'from-slate-950 via-slate-900 to-slate-950', accentColor: 'text-slate-300', badgeColor: 'bg-slate-500/20 border-slate-500/40 text-slate-300', title: 'Silver Hermit', tileCategories: ['Flower', 'Leaf', 'Fruit'] },
  { name: 'Zephyr Peaks', subtitle: 'Windward Shrines & Sky Bells', description: 'Cloud-piercing peaks where ancient wind chimes sing eternal songs.', themeCategory: 'Elemental', bgGradient: 'from-sky-950 via-slate-900 to-slate-950', accentColor: 'text-sky-400', badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300', title: 'Zephyr Monk', tileCategories: ['Stone', 'Crystal', 'Flower'] },
  { name: 'Starlight Observatory', subtitle: 'Constellation Spires', description: 'Ancient astrological domes cataloging every puzzle in the galaxy.', themeCategory: 'Celestial', bgGradient: 'from-violet-950 via-slate-900 to-slate-950', accentColor: 'text-violet-400', badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300', title: 'Constellation Seer', tileCategories: ['Gem', 'Crystal', 'Special'] },

  // 31-40: Elemental Wonders
  { name: 'Opal Glade', subtitle: 'Refracting Falls & Opal Springs', description: 'Enchanted springs that coat surrounding stones in iridescent opal sheen.', themeCategory: 'Crystalline', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Opal Harvester', tileCategories: ['Gem', 'Crystal', 'Flower'] },
  { name: 'Sundew Marshlands', subtitle: 'Carnivorous Flora & Amber Sap', description: 'Exotic swamps where amber sap crystallizes into wondrous puzzle keys.', themeCategory: 'Verdant', bgGradient: 'from-lime-950 via-slate-900 to-slate-950', accentColor: 'text-lime-400', badgeColor: 'bg-lime-500/20 border-lime-500/40 text-lime-300', title: 'Flora Botanist', tileCategories: ['Leaf', 'Fruit', 'Stone'] },
  { name: 'Cinder Hollow', subtitle: 'Smoldering Caves & Magma Vents', description: 'Underground tunnels warmed by subterranean fires.', themeCategory: 'Volcanic', bgGradient: 'from-orange-950 via-slate-900 to-slate-950', accentColor: 'text-orange-400', badgeColor: 'bg-orange-500/20 border-orange-500/40 text-orange-300', title: 'Cinder Strider', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Mirage Oasis', subtitle: 'Shimmering Waters & Date Palms', description: 'An elusive desert sanctuary that rewards only the most focused travelers.', themeCategory: 'Desert', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Oasis Seeker', tileCategories: ['Fruit', 'Flower', 'Shell'] },
  { name: 'Cobalt Spires', subtitle: 'Magnetic Mountain Arches', description: 'Sheer cobalt bluffs aligned with natural planetary magnetic ley lines.', themeCategory: 'Elemental', bgGradient: 'from-blue-950 via-slate-900 to-slate-950', accentColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300', title: 'Magnet Master', tileCategories: ['Crystal', 'Stone', 'Special'] },
  { name: 'Whispering Dunes', subtitle: 'Singing Sands & Glass Temples', description: 'Desert sands that emit harmonic frequencies when winds sweep past.', themeCategory: 'Desert', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Dune Mystic', tileCategories: ['Stone', 'Leaf', 'Gem'] },
  { name: 'Crystal Cascade', subtitle: 'Mineral Falls & Emerald Basins', description: 'A breathtaking waterfall flowing over mineral-rich terraced basins.', themeCategory: 'Aquatic', bgGradient: 'from-cyan-950 via-slate-900 to-slate-950', accentColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', title: 'Cascade Runner', tileCategories: ['Shell', 'Crystal', 'Flower'] },
  { name: 'Dragon Spine Range', subtitle: 'Rugged Ridges & Wyrm Caverns', description: 'Jagged mountain ranges resembling the spine of a sleeping dragon.', themeCategory: 'Earth', bgGradient: 'from-stone-950 via-slate-900 to-slate-950', accentColor: 'text-stone-300', badgeColor: 'bg-stone-500/20 border-stone-500/40 text-stone-300', title: 'Wyrm Slayer', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Lapis Lazuli Vale', subtitle: 'Ultramarine Cliffs & Saffron Groves', description: 'Rich valleys prized for their ultramarine stones and fragrant blossoms.', themeCategory: 'Crystalline', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Lapis Artisan', tileCategories: ['Gem', 'Flower', 'Fruit'] },
  { name: 'Eclipse Plateau', subtitle: 'Twilight Mesas & Shadow Monoliths', description: 'A high plateau locked in permanent, majestic solar eclipse twilight.', themeCategory: 'Celestial', bgGradient: 'from-purple-950 via-slate-900 to-slate-950', accentColor: 'text-purple-400', badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300', title: 'Eclipse Weaver', tileCategories: ['Crystal', 'Stone', 'Special'] },

  // 41-50: Arcane & Forgotten Domains
  { name: 'Elysian Meadow', subtitle: 'Eternal Bloom & Nectar Streams', description: 'Blessed meadows where flowers never wilt and sweet aromas linger.', themeCategory: 'Verdant', bgGradient: 'from-emerald-950 via-slate-900 to-slate-950', accentColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', title: 'Elysian Walker', tileCategories: ['Flower', 'Fruit', 'Leaf'] },
  { name: 'Nautilus Trench', subtitle: 'Spiral Shell Crypts & Biolum', description: 'Deep ocean trenches lined with giant spiral nautilus formations.', themeCategory: 'Aquatic', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Nautilus Guide', tileCategories: ['Shell', 'Gem', 'Crystal'] },
  { name: 'Petrified Glade', subtitle: 'Stone Trees & Agate Groves', description: 'Forests transformed into precious agate and jasper over eons.', themeCategory: 'Earth', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Agate Sculptor', tileCategories: ['Stone', 'Gem', 'Leaf'] },
  { name: 'Glacial Rift', subtitle: 'Chasm of Frozen Time', description: 'A deep fissure in the polar ice sheet containing untouched ancient relics.', themeCategory: 'Glacial', bgGradient: 'from-sky-950 via-slate-900 to-slate-950', accentColor: 'text-sky-400', badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300', title: 'Rift Delver', tileCategories: ['Crystal', 'Stone', 'Shell'] },
  { name: 'Sunken Conservatory', subtitle: 'Glass Domes Beneath the Waves', description: 'Victorian-style botanical conservatories preserved beneath the ocean.', themeCategory: 'Aquatic', bgGradient: 'from-blue-950 via-slate-900 to-slate-950', accentColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300', title: 'Botanist diver', tileCategories: ['Flower', 'Leaf', 'Shell'] },
  { name: 'Basalt Pillars', subtitle: 'Hexagonal Volcanic Columns', description: 'Natural geometric stone pillars rising triumphantly from the sea.', themeCategory: 'Volcanic', bgGradient: 'from-stone-950 via-slate-900 to-slate-950', accentColor: 'text-stone-300', badgeColor: 'bg-stone-500/20 border-stone-500/40 text-stone-300', title: 'Pillar Mason', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Lotus Nirvana', subtitle: 'Floating Shrines of Peace', description: 'Sanctuaries suspended over serene reflective waters.', themeCategory: 'Mystic', bgGradient: 'from-pink-950 via-slate-900 to-slate-950', accentColor: 'text-pink-400', badgeColor: 'bg-pink-500/20 border-pink-500/40 text-pink-300', title: 'Nirvana Seeker', tileCategories: ['Flower', 'Stone', 'Leaf'] },
  { name: 'Copper Ridge', subtitle: 'Verdigris Bluffs & Ore Caves', description: 'Mineral-rich cliffs oxidised to a stunning green and copper patina.', themeCategory: 'Earth', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Copper Prospector', tileCategories: ['Stone', 'Gem', 'Fruit'] },
  { name: 'Aetherial Spire', subtitle: 'Pure Energy Conduits', description: 'Floating spires pulsing with pure puzzle energy.', themeCategory: 'Celestial', bgGradient: 'from-violet-950 via-slate-900 to-slate-950', accentColor: 'text-violet-400', badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300', title: 'Aether Adept', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Midway Zenith', subtitle: '50th World Grand Sanctuary', description: 'The historic midpoint of the Grand Tilemaster Odyssey.', themeCategory: 'Master', bgGradient: 'from-amber-950 via-purple-950 to-slate-950', accentColor: 'text-amber-300', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Grand Voyager', tileCategories: ['Gem', 'Crystal', 'Special'] },

  // 51-60: High Fantasy & Crystal Expanses
  { name: 'Moonstone Hollow', subtitle: 'Luminescent Mineral Caves', description: 'Grottoes filled with glowing moonstones that illuminate hidden paths.', themeCategory: 'Crystalline', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Moonstone Miner', tileCategories: ['Crystal', 'Gem', 'Stone'] },
  { name: 'Orchid Glade', subtitle: 'Exotic Bloom Terraces', description: 'Perpetual mist terraces where rare orchids bloom in brilliant hues.', themeCategory: 'Verdant', bgGradient: 'from-fuchsia-950 via-slate-900 to-slate-950', accentColor: 'text-fuchsia-400', badgeColor: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300', title: 'Orchid Guardian', tileCategories: ['Flower', 'Leaf', 'Fruit'] },
  { name: 'Gilded Ruins', subtitle: 'Sunken Treasure Chambers', description: 'Ancient vaults where gold and gems are fused into stone puzzles.', themeCategory: 'Ancient', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Treasure Scion', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Tidepool Atoll', subtitle: 'Crystal Pools & Starfish Bays', description: 'Shallow tropical atolls where sea life thrives in crystal waters.', themeCategory: 'Aquatic', bgGradient: 'from-cyan-950 via-slate-900 to-slate-950', accentColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', title: 'Atoll Scout', tileCategories: ['Shell', 'Flower', 'Fruit'] },
  { name: 'Bramble Maze', subtitle: 'Thorned Labyrinth of Ivy', description: 'A dense botanical hedge maze guarding lost secrets.', themeCategory: 'Verdant', bgGradient: 'from-green-950 via-slate-900 to-slate-950', accentColor: 'text-green-400', badgeColor: 'bg-green-500/20 border-green-500/40 text-green-300', title: 'Maze Master', tileCategories: ['Leaf', 'Fruit', 'Stone'] },
  { name: 'Garnet Ridge', subtitle: 'Crimson Crystal Precipice', description: 'Mountain ridges sparkling with deep red garnet deposits.', themeCategory: 'Crystalline', bgGradient: 'from-red-950 via-slate-900 to-slate-950', accentColor: 'text-red-400', badgeColor: 'bg-red-500/20 border-red-500/40 text-red-300', title: 'Garnet Climber', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Bioluminescent Bay', subtitle: 'Glowing Waters & Neon Flora', description: 'A secluded ocean cove that glows brilliant turquoise at touch.', themeCategory: 'Aquatic', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Bay Shimmerer', tileCategories: ['Shell', 'Crystal', 'Flower'] },
  { name: 'Zephyr Canyon', subtitle: 'Echoing Wind Flutes', description: 'Natural sandstone arches carved into wind flutes by centuries of breezes.', themeCategory: 'Elemental', bgGradient: 'from-sky-950 via-slate-900 to-slate-950', accentColor: 'text-sky-400', badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300', title: 'Wind Flutist', tileCategories: ['Stone', 'Flower', 'Leaf'] },
  { name: 'Amethyst Geode', subtitle: 'Giant Purple Crystal Dome', description: 'The hollow interior of a colossal volcanic geode lined with amethyst.', themeCategory: 'Crystalline', bgGradient: 'from-purple-950 via-slate-900 to-slate-950', accentColor: 'text-purple-400', badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300', title: 'Geode Delver', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Solarium Spires', subtitle: 'Solar Crystal Towers', description: 'Towers designed to focus the sun into radiant power prisms.', themeCategory: 'Celestial', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Solar Priest', tileCategories: ['Gem', 'Crystal', 'Special'] },

  // 61-70: Primal & Mythological Realities
  { name: 'Cherry Blossom Shrine', subtitle: 'Petal Snow & Torii Gates', description: 'Sacred mountain shrines surrounded by eternal falling cherry blossoms.', themeCategory: 'Verdant', bgGradient: 'from-pink-950 via-slate-900 to-slate-950', accentColor: 'text-pink-400', badgeColor: 'bg-pink-500/20 border-pink-500/40 text-pink-300', title: 'Petal Pilgrim', tileCategories: ['Flower', 'Leaf', 'Fruit'] },
  { name: 'Obsidian Forge', subtitle: 'Dragon Glass & Flame Altars', description: 'Ancient forge where volcanic glass was shaped into mystical artifacts.', themeCategory: 'Volcanic', bgGradient: 'from-rose-950 via-slate-900 to-slate-950', accentColor: 'text-rose-400', badgeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300', title: 'Obsidian Smith', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Sunken Pearl City', subtitle: 'Oyster Spires Beneath Deep Waters', description: 'A magnificent submerged civilization adorned with oversized pearls.', themeCategory: 'Aquatic', bgGradient: 'from-blue-950 via-slate-900 to-slate-950', accentColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300', title: 'Pearl Sovereign', tileCategories: ['Shell', 'Gem', 'Stone'] },
  { name: 'Fossil Ridge', subtitle: 'Petrified Behemoths & Ancient Shells', description: 'Limestone cliffs bearing the imprints of colossal ancient creatures.', themeCategory: 'Earth', bgGradient: 'from-stone-950 via-slate-900 to-slate-950', accentColor: 'text-stone-400', badgeColor: 'bg-stone-500/20 border-stone-500/40 text-stone-300', title: 'Fossil Hunter', tileCategories: ['Stone', 'Shell', 'Leaf'] },
  { name: 'Twilight Meadow', subtitle: 'Silver Thistle & Dusk Butterflies', description: 'A quiet meadow bathed in the perpetual purple light of evening.', themeCategory: 'Mystic', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Dusk Wanderer', tileCategories: ['Flower', 'Fruit', 'Leaf'] },
  { name: 'Krypton Caverns', subtitle: 'Emerald Gas & Radiant Crystals', description: 'Underground crystal networks pulsing with intense green illumination.', themeCategory: 'Crystalline', bgGradient: 'from-emerald-950 via-slate-900 to-slate-950', accentColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', title: 'Krypton Miner', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Saffron Dunes', subtitle: 'Golden Spice Sands', description: 'Warm rolling dunes infused with fragrant botanical minerals.', themeCategory: 'Desert', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Saffron Merchant', tileCategories: ['Fruit', 'Flower', 'Stone'] },
  { name: 'Thunderhead Spire', subtitle: 'Lightning Rods & Storm Altars', description: 'High lightning towers harnessing the infinite power of thunderstorms.', themeCategory: 'Elemental', bgGradient: 'from-sky-950 via-slate-900 to-slate-950', accentColor: 'text-sky-400', badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300', title: 'Storm Channeler', tileCategories: ['Stone', 'Crystal', 'Special'] },
  { name: 'Coral Lagoon', subtitle: 'Turquoise Reeds & Coral Arches', description: 'Shallow sheltered lagoons filled with bright natural sea arches.', themeCategory: 'Aquatic', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Lagoon Diver', tileCategories: ['Shell', 'Leaf', 'Flower'] },
  { name: 'Celestial Zenith', subtitle: 'Constellation Gates of the 70th Realm', description: 'A grand gateway marking entry into the upper tier of the universe.', themeCategory: 'Celestial', bgGradient: 'from-violet-950 via-slate-900 to-slate-950', accentColor: 'text-violet-400', badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300', title: 'Zenith Champion', tileCategories: ['Gem', 'Crystal', 'Special'] },

  // 71-80: Astral & Elemental Mastery
  { name: 'Verdant Canopy', subtitle: 'Cloud Forest & Titan Vines', description: 'Treetop aerial cities built among massive redwood canopies.', themeCategory: 'Verdant', bgGradient: 'from-green-950 via-slate-900 to-slate-950', accentColor: 'text-green-400', badgeColor: 'bg-green-500/20 border-green-500/40 text-green-300', title: 'Canopy Walker', tileCategories: ['Leaf', 'Fruit', 'Flower'] },
  { name: 'Pyrite Gorge', subtitle: 'Fools Gold Cliffs & Spark Mines', description: 'A glimmering golden canyon holding deceptive metallic secrets.', themeCategory: 'Earth', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Pyrite Prospector', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Frostbite Peak', subtitle: 'Glacier Crown & Howling Winds', description: 'The coldest mountain in the realm, where breath turns instantly to ice crystals.', themeCategory: 'Glacial', bgGradient: 'from-cyan-950 via-slate-900 to-slate-950', accentColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', title: 'Glacier Monarch', tileCategories: ['Crystal', 'Stone', 'Shell'] },
  { name: 'Lotus Oasis', subtitle: 'Sacred Water Shrines', description: 'An oasis sheltered by mountain peaks where golden lotuses bloom.', themeCategory: 'Aquatic', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Oasis Guardian', tileCategories: ['Flower', 'Shell', 'Leaf'] },
  { name: 'Magma Chamber', subtitle: 'Heart of the Volcanic Core', description: 'The central furnace of the planet, pulsing with raw primordial heat.', themeCategory: 'Volcanic', bgGradient: 'from-red-950 via-slate-900 to-slate-950', accentColor: 'text-red-400', badgeColor: 'bg-red-500/20 border-red-500/40 text-red-300', title: 'Magma Sovereign', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Silverleaf Glen', subtitle: 'Luminescent Foliage & Streams', description: 'Peaceful valleys where silver leaves whisper ancient puzzle solutions.', themeCategory: 'Mystic', bgGradient: 'from-slate-950 via-slate-900 to-slate-950', accentColor: 'text-slate-300', badgeColor: 'bg-slate-500/20 border-slate-500/40 text-slate-300', title: 'Silverleaf Sage', tileCategories: ['Leaf', 'Flower', 'Fruit'] },
  { name: 'Sunken Temple of Ra', subtitle: 'Submerged Sun Monuments', description: 'Subterranean golden chambers flooded with crystal clear waters.', themeCategory: 'Ancient', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Sun Disc Keeper', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Whispering Caverns', subtitle: 'Echoing Stalactite Halls', description: 'Deep underground caverns whose acoustic echoes guide puzzle solving.', themeCategory: 'Crystalline', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Echo Listener', tileCategories: ['Crystal', 'Stone', 'Gem'] },
  { name: 'Topaz Dunes', subtitle: 'Glistening Golden Grain Waves', description: 'Vast golden deserts whose sands sparkle like faceted topaz stones.', themeCategory: 'Desert', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Topaz Navigator', tileCategories: ['Gem', 'Fruit', 'Stone'] },
  { name: 'Starfall Basin', subtitle: 'Meteor Crater & Stardust Pools', description: 'A vast crater filled with cosmic stardust from falling shooting stars.', themeCategory: 'Celestial', bgGradient: 'from-purple-950 via-slate-900 to-slate-950', accentColor: 'text-purple-400', badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300', title: 'Stardust Seeker', tileCategories: ['Crystal', 'Gem', 'Special'] },

  // 81-90: Cosmic Horizons & Chrono Sanctuaries
  { name: 'Nebula Expanse', subtitle: 'Interstellar Gas Clouds & Stars', description: 'Cosmic clouds glowing with violet and teal light across the void.', themeCategory: 'Cosmic', bgGradient: 'from-violet-950 via-slate-900 to-slate-950', accentColor: 'text-violet-400', badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300', title: 'Nebula Walker', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Coraline Sanctum', subtitle: 'Abyssal Throne of Corals', description: 'The supreme sacred coral cathedral at the ocean bottom.', themeCategory: 'Aquatic', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Sanctum Diver', tileCategories: ['Shell', 'Gem', 'Flower'] },
  { name: 'Emerald Terraces', subtitle: 'Hanging Gardens of Babylon', description: 'Towering multi-tiered gardens lush with fruit and rare botanicals.', themeCategory: 'Verdant', bgGradient: 'from-emerald-950 via-slate-900 to-slate-950', accentColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', title: 'Terrace Architect', tileCategories: ['Fruit', 'Flower', 'Leaf'] },
  { name: 'Titan Spire', subtitle: 'Ancient Colossus Monuments', description: 'Mountain-sized stone statues holding ancient puzzle mechanisms.', themeCategory: 'Ancient', bgGradient: 'from-stone-950 via-slate-900 to-slate-950', accentColor: 'text-stone-300', badgeColor: 'bg-stone-500/20 border-stone-500/40 text-stone-300', title: 'Titan Awakener', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Helios Citadel', subtitle: 'Sun Palace of the First Masters', description: 'The radiant golden citadel built by the founders of tile match alchemy.', themeCategory: 'Ancient', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Helios Ascendant', tileCategories: ['Gem', 'Special', 'Stone'] },
  { name: 'Vortex Chasm', subtitle: 'Swirling Gravity Wells', description: 'A dimensional rift where puzzle tiles float in zero-gravity orbits.', themeCategory: 'Cosmic', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Vortex Tamer', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Crimson Peak', subtitle: 'Ruby Spire in the Clouds', description: 'A lone needle of pure ruby rock that punctures through the cloud deck.', themeCategory: 'Crystalline', bgGradient: 'from-rose-950 via-slate-900 to-slate-950', accentColor: 'text-rose-400', badgeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300', title: 'Crimson Victor', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Biolum Abyss', subtitle: 'Deep Water Starlight Trench', description: 'Ocean depths that glow brighter than the daytime sun with living light.', themeCategory: 'Aquatic', bgGradient: 'from-cyan-950 via-slate-900 to-slate-950', accentColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', title: 'Abyss Monarch', tileCategories: ['Shell', 'Crystal', 'Flower'] },
  { name: 'Chronos Labyrinth', subtitle: 'Temporal Time Gear Halls', description: 'Maze of golden gears where time loops rewind failed moves.', themeCategory: 'Mechanical', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-400', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Time Lord', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Pinnacle of Mastery', subtitle: '90th World Grand Arena', description: 'The legendary arena where only the top 1% of tile champions duel.', themeCategory: 'Master', bgGradient: 'from-purple-950 via-rose-950 to-slate-950', accentColor: 'text-purple-300', badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300', title: 'Grand Champion', tileCategories: ['Crystal', 'Gem', 'Special'] },

  // 91-100: The Final Ascended Realms (Pinnacle Odyssey)
  { name: 'Aetherial Core', subtitle: 'Floating Shards of Creation', description: 'The metaphysical birthplace of every geometric tile shape.', themeCategory: 'Cosmic', bgGradient: 'from-violet-950 via-slate-900 to-slate-950', accentColor: 'text-violet-400', badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300', title: 'Aether Sovereign', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Solaris Apex', subtitle: 'Solar Corona Sanctuary', description: 'A floating solar sanctuary bathed in radiant stellar warmth.', themeCategory: 'Celestial', bgGradient: 'from-yellow-950 via-slate-900 to-slate-950', accentColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', title: 'Solar Emperor', tileCategories: ['Gem', 'Special', 'Fruit'] },
  { name: 'Starlight Void', subtitle: 'Deep Space Constellation Spire', description: 'Platform suspended at the edge of the known tile cosmos.', themeCategory: 'Cosmic', bgGradient: 'from-indigo-950 via-slate-900 to-slate-950', accentColor: 'text-indigo-400', badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', title: 'Void Master', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Prism of Genesis', subtitle: 'The First Light of Tile Alchemy', description: 'The ancient prism through which all tile patterns were first projected.', themeCategory: 'Crystalline', bgGradient: 'from-teal-950 via-slate-900 to-slate-950', accentColor: 'text-teal-400', badgeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300', title: 'Genesis Crafter', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Omega Bastion', subtitle: 'The Fortified Gate to the Finale', description: 'The final fortress guarding the ultimate 5 worlds of the campaign.', themeCategory: 'Ancient', bgGradient: 'from-rose-950 via-slate-900 to-slate-950', accentColor: 'text-rose-400', badgeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300', title: 'Omega Guardian', tileCategories: ['Stone', 'Gem', 'Special'] },
  { name: 'Eternity Expanse', subtitle: 'Where Past, Present & Future Meet', description: 'A realm beyond time where ancient mastery harmonizes with destiny.', themeCategory: 'Cosmic', bgGradient: 'from-sky-950 via-slate-900 to-slate-950', accentColor: 'text-sky-400', badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300', title: 'Eternity Sage', tileCategories: ['Crystal', 'Stone', 'Special'] },
  { name: 'Cosmic Supernova', subtitle: 'Radiant Stellar Explosion', description: 'A sanctuary formed in the heart of a blossoming celestial supernova.', themeCategory: 'Cosmic', bgGradient: 'from-fuchsia-950 via-slate-900 to-slate-950', accentColor: 'text-fuchsia-400', badgeColor: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300', title: 'Supernova Master', tileCategories: ['Gem', 'Crystal', 'Special'] },
  { name: 'Singularity Threshold', subtitle: 'Event Horizon of Pure Logic', description: 'The absolute test of precision where every move shifts universal gravity.', themeCategory: 'Master', bgGradient: 'from-purple-950 via-slate-900 to-slate-950', accentColor: 'text-purple-300', badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300', title: 'Singularity Conqueror', tileCategories: ['Crystal', 'Gem', 'Special'] },
  { name: 'Olympus of Masters', subtitle: 'Hall of 9,900 Triumphs', description: 'The monumental pantheon commemorating every step of the 99-world journey.', themeCategory: 'Master', bgGradient: 'from-amber-950 via-slate-900 to-slate-950', accentColor: 'text-amber-300', badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300', title: 'Pantheon Sovereign', tileCategories: ['Gem', 'Stone', 'Special'] },
  { name: 'Infinity Apex', subtitle: 'The Grand Finale of Tile Mastery (Level 9999)', description: 'The 100th and final world of the campaign. The ultimate summit of all 9,999 levels.', themeCategory: 'Master', bgGradient: 'from-amber-950 via-rose-950 to-indigo-950', accentColor: 'text-amber-300', badgeColor: 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 border-amber-400/50 text-amber-200', title: 'Grand Tilemaster', tileCategories: ['Crystal', 'Gem', 'Special'] },
];

/**
 * Generates a full WorldDefinition for any world ID (1 to 100).
 */
export function generateWorldDefinition(worldId: number): WorldDefinition {
  const clampedWorldId = Math.max(1, Math.min(TOTAL_WORLDS, worldId));
  const catalogItem = BESPOKE_WORLD_CATALOG[clampedWorldId - 1];

  const startLevel = (clampedWorldId - 1) * LEVELS_PER_WORLD + 1;
  const endLevel = Math.min(MAX_CAMPAIGN_LEVEL, clampedWorldId * LEVELS_PER_WORLD);

  const isFirstWorld = clampedWorldId === 1;
  const reqLevel = isFirstWorld ? 0 : (clampedWorldId - 1) * LEVELS_PER_WORLD;
  const reqStars = isFirstWorld ? 0 : Math.floor(reqLevel * 1.25);

  const categoryMap: Record<string, {
    preferredLayouts: string[];
    mechanicAffinities: Array<'rainbow' | 'golden' | 'frozen' | 'chained' | 'bomb' | 'key'>;
    difficultyStyle: 'Balanced' | 'Tactical' | 'Rapid' | 'Puzzle' | 'Endurance';
    bossArchetypes: string[];
  }> = {
    Verdant: {
      preferredLayouts: ['Pyramid', 'Clover', 'Butterfly', 'Island'],
      mechanicAffinities: ['rainbow', 'golden'],
      difficultyStyle: 'Balanced',
      bossArchetypes: ['FORTRESS_BOSS', 'COMBO_BOSS', 'MULTI_LAYER_BOSS', 'CHAIN_BOSS'],
    },
    Desert: {
      preferredLayouts: ['Hourglass', 'Pyramid', 'ZenGarden', 'Diamond'],
      mechanicAffinities: ['golden', 'bomb'],
      difficultyStyle: 'Tactical',
      bossArchetypes: ['TIME_BOSS', 'BOMB_BOSS', 'FORTRESS_BOSS', 'KEY_BOSS'],
    },
    Crystalline: {
      preferredLayouts: ['Diamond', 'TwinPeaks', 'Helix', 'Temple'],
      mechanicAffinities: ['frozen', 'rainbow'],
      difficultyStyle: 'Puzzle',
      bossArchetypes: ['MULTI_LAYER_BOSS', 'CHAIN_BOSS', 'COMBO_BOSS', 'TIME_BOSS'],
    },
    Aquatic: {
      preferredLayouts: ['Wave', 'Circle', 'Spiral', 'Island'],
      mechanicAffinities: ['frozen', 'golden'],
      difficultyStyle: 'Rapid',
      bossArchetypes: ['TIME_BOSS', 'COMBO_BOSS', 'FORTRESS_BOSS', 'MULTI_LAYER_BOSS'],
    },
    Volcanic: {
      preferredLayouts: ['Fortress', 'Cross', 'Crown', 'Temple'],
      mechanicAffinities: ['bomb', 'chained'],
      difficultyStyle: 'Endurance',
      bossArchetypes: ['BOMB_BOSS', 'CHAIN_BOSS', 'FORTRESS_BOSS', 'CHAOS_BOSS'],
    },
    Celestial: {
      preferredLayouts: ['Crown', 'Helix', 'Circle', 'Diamond'],
      mechanicAffinities: ['rainbow', 'key', 'golden'],
      difficultyStyle: 'Puzzle',
      bossArchetypes: ['KEY_BOSS', 'MULTI_LAYER_BOSS', 'CHAOS_BOSS', 'COMBO_BOSS'],
    },
    Mystic: {
      preferredLayouts: ['ZenGarden', 'Butterfly', 'Spiral', 'Clover'],
      mechanicAffinities: ['rainbow', 'frozen', 'chained'],
      difficultyStyle: 'Tactical',
      bossArchetypes: ['CHAIN_BOSS', 'MULTI_LAYER_BOSS', 'TIME_BOSS', 'KEY_BOSS'],
    },
    Ancient: {
      preferredLayouts: ['Temple', 'Fortress', 'Honeycomb', 'Crown'],
      mechanicAffinities: ['chained', 'key', 'golden'],
      difficultyStyle: 'Endurance',
      bossArchetypes: ['KEY_BOSS', 'FORTRESS_BOSS', 'CHAIN_BOSS', 'CHAOS_BOSS'],
    },
    Elemental: {
      preferredLayouts: ['TwinPeaks', 'Wave', 'Cross', 'Hourglass'],
      mechanicAffinities: ['bomb', 'frozen', 'rainbow'],
      difficultyStyle: 'Rapid',
      bossArchetypes: ['TIME_BOSS', 'BOMB_BOSS', 'COMBO_BOSS', 'CHAOS_BOSS'],
    },
    Cosmic: {
      preferredLayouts: ['Crown', 'Diamond', 'Helix', 'Honeycomb'],
      mechanicAffinities: ['rainbow', 'golden', 'frozen', 'chained', 'bomb', 'key'],
      difficultyStyle: 'Tactical',
      bossArchetypes: ['CHAOS_BOSS', 'MULTI_LAYER_BOSS', 'KEY_BOSS', 'FORTRESS_BOSS'],
    },
  };

  const identity = categoryMap[catalogItem.themeCategory] || categoryMap.Verdant;

  return {
    id: clampedWorldId,
    name: catalogItem.name,
    subtitle: catalogItem.subtitle,
    description: catalogItem.description,
    theme: catalogItem.themeCategory,
    themeCategory: catalogItem.themeCategory,
    levelRange: [startLevel, endLevel],
    unlockRequirement: isFirstWorld
      ? {}
      : {
          requiredWorldId: clampedWorldId - 1,
          requiredLevel: reqLevel,
          requiredStars: reqStars,
        },
    rewards: {
      coins: 300 + clampedWorldId * 50,
      gems: 15 + clampedWorldId * 2,
      title: catalogItem.title,
    },
    bgGradient: catalogItem.bgGradient,
    accentColor: catalogItem.accentColor,
    badgeColor: catalogItem.badgeColor,
    primaryTileCategories: catalogItem.tileCategories,
    preferredLayouts: identity.preferredLayouts,
    mechanicAffinities: identity.mechanicAffinities,
    difficultyStyle: identity.difficultyStyle,
    bossArchetypes: identity.bossArchetypes,
  };
}

export const WORLD_DEFINITIONS: WorldDefinition[] = Array.from(
  { length: TOTAL_WORLDS },
  (_, i) => generateWorldDefinition(i + 1)
);

export function getWorldForLevel(levelId: number): WorldDefinition {
  const clampedLevel = Math.max(1, Math.min(MAX_CAMPAIGN_LEVEL, levelId));
  const worldId = Math.floor((clampedLevel - 1) / LEVELS_PER_WORLD) + 1;
  return WORLD_DEFINITIONS[worldId - 1] || generateWorldDefinition(worldId);
}

export function isWorldUnlocked(
  world: WorldDefinition,
  highestLevelUnlocked: number,
  starsTotal: number
): WorldUnlockStatus {
  if (world.id === 1) return { unlocked: true };
  const req = world.unlockRequirement;
  if (!req) return { unlocked: true };

  if (req.requiredLevel && highestLevelUnlocked < req.requiredLevel) {
    return {
      unlocked: false,
      reason: `Requires reaching Level ${req.requiredLevel}`,
    };
  }
  if (req.requiredStars && starsTotal < req.requiredStars) {
    return {
      unlocked: false,
      reason: `Requires ${req.requiredStars} Total Stars`,
    };
  }
  return { unlocked: true };
}
