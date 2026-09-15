import { globalSaveService, ISaveService } from './SaveService';

export type RankingTierId = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER';

export interface RankingTierInfo {
  id: RankingTierId;
  name: string;
  minLevel: number;
  minStars: number;
  badgeColor: string;
  gradientFrom: string;
  gradientTo: string;
  perks: string[];
  iconName: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatarId: string;
  level: number;
  stars: number;
  score: number;
  tier: RankingTierId;
  isCurrentPlayer: boolean;
  countryCode?: string;
  change?: 'up' | 'down' | 'same';
}

export interface TournamentInfo {
  divisionName: string;
  seasonEndsInHours: number;
  playerRank: number;
  totalParticipants: number;
  topRewardGems: number;
  topRewardCoins: number;
  promotionThresholdRank: number;
  entries: LeaderboardEntry[];
}

export const RANKING_TIERS: RankingTierInfo[] = [
  {
    id: 'BRONZE',
    name: 'Bronze Sanctuary',
    minLevel: 1,
    minStars: 0,
    badgeColor: 'text-amber-600',
    gradientFrom: 'from-amber-700',
    gradientTo: 'to-amber-900',
    perks: ['Standard rewards', '5% Level Coin Bonus'],
    iconName: 'Shield',
  },
  {
    id: 'SILVER',
    name: 'Silver Sanctuary',
    minLevel: 11,
    minStars: 30,
    badgeColor: 'text-slate-300',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-slate-600',
    perks: ['10% Level Coin Bonus', '1 Free Daily Booster'],
    iconName: 'Shield',
  },
  {
    id: 'GOLD',
    name: 'Gold Sanctuary',
    minLevel: 26,
    minStars: 75,
    badgeColor: 'text-amber-400',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-yellow-600',
    perks: ['15% Level Coin Bonus', '2 Free Daily Boosters', 'Gold Profile Aura'],
    iconName: 'Award',
  },
  {
    id: 'PLATINUM',
    name: 'Platinum Sanctuary',
    minLevel: 51,
    minStars: 150,
    badgeColor: 'text-cyan-300',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-teal-600',
    perks: ['20% Level Coin Bonus', 'Free Weekly Mystery Chest', 'Exclusive Platinum Frame'],
    iconName: 'Award',
  },
  {
    id: 'DIAMOND',
    name: 'Diamond Sanctuary',
    minLevel: 101,
    minStars: 300,
    badgeColor: 'text-indigo-300',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-purple-600',
    perks: ['25% Level Coin Bonus', '5 Daily Free Gems', 'Diamond Tile Finish'],
    iconName: 'Trophy',
  },
  {
    id: 'MASTER',
    name: 'Master Sanctuary',
    minLevel: 251,
    minStars: 750,
    badgeColor: 'text-rose-400',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-pink-600',
    perks: ['30% Level Coin Bonus', '10 Daily Free Gems', 'Master Badge & Title'],
    iconName: 'Crown',
  },
  {
    id: 'GRANDMASTER',
    name: 'Grandmaster Legend',
    minLevel: 501,
    minStars: 1500,
    badgeColor: 'text-amber-300',
    gradientFrom: 'from-amber-300',
    gradientTo: 'to-rose-500',
    perks: ['40% Level Coin Bonus', 'Unlimited Revive Discount', 'Legendary Aura & Halo'],
    iconName: 'Crown',
  },
];

const BOT_NAMES = [
  'AuraMaster', 'ZenLily', 'TileWhisperer', 'EmeraldLotus', 'JadeDragon',
  'SolarPulse', 'VelvetMonk', 'SapphireWave', 'CelestialGamer', 'NovaPuzzler',
  'MysticFalcon', 'EchoSeeker', 'SilentTiger', 'PrismWalker', 'CosmicRider',
  'RadiantBloom', 'ShadowDancer', 'AmberPhoenix', 'ZenithDrifter', 'CrystalSage',
  'VortexNinja', 'LunaGleam', 'OasisKnight', 'ThunderStrike', 'SilverSerpent',
];

export class RankingService {
  private saveService: ISaveService;

  constructor(saveService: ISaveService = globalSaveService) {
    this.saveService = saveService;
  }

  public getPlayerTier(currentLevel: number, totalStars: number): RankingTierInfo {
    for (let i = RANKING_TIERS.length - 1; i >= 0; i--) {
      const tier = RANKING_TIERS[i];
      if (currentLevel >= tier.minLevel || totalStars >= tier.minStars) {
        return tier;
      }
    }
    return RANKING_TIERS[0];
  }

  public getNextTierProgress(currentLevel: number, totalStars: number): {
    currentTier: RankingTierInfo;
    nextTier: RankingTierInfo | null;
    levelProgressPercent: number;
    starsProgressPercent: number;
    overallPercent: number;
  } {
    const currentTier = this.getPlayerTier(currentLevel, totalStars);
    const currentIndex = RANKING_TIERS.findIndex(t => t.id === currentTier.id);
    const nextTier = currentIndex < RANKING_TIERS.length - 1 ? RANKING_TIERS[currentIndex + 1] : null;

    if (!nextTier) {
      return {
        currentTier,
        nextTier: null,
        levelProgressPercent: 100,
        starsProgressPercent: 100,
        overallPercent: 100,
      };
    }

    const levelSpan = nextTier.minLevel - currentTier.minLevel;
    const currentLevelInto = Math.max(0, currentLevel - currentTier.minLevel);
    const levelProgress = levelSpan > 0 ? Math.min(100, Math.round((currentLevelInto / levelSpan) * 100)) : 100;

    const starsSpan = nextTier.minStars - currentTier.minStars;
    const currentStarsInto = Math.max(0, totalStars - currentTier.minStars);
    const starsProgress = starsSpan > 0 ? Math.min(100, Math.round((currentStarsInto / starsSpan) * 100)) : 100;

    const overallPercent = Math.max(levelProgress, starsProgress);

    return {
      currentTier,
      nextTier,
      levelProgressPercent: levelProgress,
      starsProgressPercent: starsProgress,
      overallPercent,
    };
  }

  /**
   * Calculates player's realistic global rank based on total stars and current level.
   */
  public calculateGlobalRank(currentLevel: number, totalStars: number): number {
    // Formula: Top players have 1000+ stars. Player starts around rank 1200 - 1500 and climbs up
    const baseRank = Math.max(1, 1500 - (currentLevel * 12 + totalStars * 4));
    return Math.max(4, Math.min(1500, baseRank));
  }

  /**
   * Returns a populated Global Leaderboard list including Top 3 and surrounding competitors.
   */
  public getGlobalLeaderboard(): {
    entries: LeaderboardEntry[];
    playerEntry: LeaderboardEntry;
    top3: LeaderboardEntry[];
  } {
    const save = this.saveService.loadSave();
    const currentLevel = save.currentLevel || 1;
    const totalStars = save.starsTotal || 0;
    const playerTier = this.getPlayerTier(currentLevel, totalStars);
    const playerRank = this.calculateGlobalRank(currentLevel, totalStars);

    // Compute realistic top 3 players
    const top3: LeaderboardEntry[] = [
      {
        rank: 1,
        id: 'bot_p1',
        name: 'ZenithDrifter',
        avatarId: 'zen_crown',
        level: Math.max(120, currentLevel + 75),
        stars: Math.max(360, totalStars + 210),
        score: 148520,
        tier: 'GRANDMASTER',
        isCurrentPlayer: false,
        countryCode: 'JP',
      },
      {
        rank: 2,
        id: 'bot_p2',
        name: 'EmeraldLotus',
        avatarId: 'emerald_leaf',
        level: Math.max(105, currentLevel + 60),
        stars: Math.max(315, totalStars + 175),
        score: 129400,
        tier: 'MASTER',
        isCurrentPlayer: false,
        countryCode: 'US',
      },
      {
        rank: 3,
        id: 'bot_p3',
        name: 'MysticFalcon',
        avatarId: 'falcon_wings',
        level: Math.max(95, currentLevel + 45),
        stars: Math.max(285, totalStars + 130),
        score: 114800,
        tier: 'DIAMOND',
        isCurrentPlayer: false,
        countryCode: 'GB',
      },
    ];

    const playerEntry: LeaderboardEntry = {
      rank: playerRank,
      id: 'current_player',
      name: 'You (Explorer)',
      avatarId: 'player_avatar',
      level: currentLevel,
      stars: totalStars,
      score: totalStars * 450 + currentLevel * 800,
      tier: playerTier.id,
      isCurrentPlayer: true,
      countryCode: 'PK',
      change: 'up',
    };

    // Generate surrounding entries around the player
    const entries: LeaderboardEntry[] = [];

    // Add top 3
    entries.push(...top3);

    // Add competitors around player rank
    const startRank = Math.max(4, playerRank - 4);
    const endRank = playerRank + 5;

    for (let r = startRank; r <= endRank; r++) {
      if (r === playerRank) {
        entries.push(playerEntry);
      } else {
        const offset = playerRank - r;
        const botLevel = Math.max(1, currentLevel + offset);
        const botStars = Math.max(0, totalStars + offset * 3);
        const botName = BOT_NAMES[(r * 7) % BOT_NAMES.length];
        const botTier = this.getPlayerTier(botLevel, botStars);

        entries.push({
          rank: r,
          id: `bot_${r}`,
          name: botName,
          avatarId: `avatar_${r % 8}`,
          level: botLevel,
          stars: botStars,
          score: botStars * 420 + botLevel * 750,
          tier: botTier.id,
          isCurrentPlayer: false,
          countryCode: ['DE', 'CA', 'FR', 'BR', 'KR', 'AE', 'AU', 'ES'][r % 8],
          change: r % 3 === 0 ? 'up' : r % 3 === 1 ? 'same' : 'down',
        });
      }
    }

    // Sort by rank ascending
    entries.sort((a, b) => a.rank - b.rank);

    return {
      entries,
      playerEntry,
      top3,
    };
  }

  /**
   * Returns active weekly tournament information.
   */
  public getTournamentInfo(): TournamentInfo {
    const save = this.saveService.loadSave();
    const currentLevel = save.currentLevel || 1;
    const totalStars = save.starsTotal || 0;
    const tier = this.getPlayerTier(currentLevel, totalStars);

    // Tournament player rank: between #4 and #18 out of 50 in current division
    const playerTournamentRank = Math.max(2, Math.min(25, 20 - Math.floor(totalStars / 15)));

    const entries: LeaderboardEntry[] = [];
    for (let r = 1; r <= 30; r++) {
      if (r === playerTournamentRank) {
        entries.push({
          rank: r,
          id: 'player',
          name: 'You (Explorer)',
          avatarId: 'player',
          level: currentLevel,
          stars: Math.max(5, (totalStars % 45) + 12),
          score: 8500 + totalStars * 120,
          tier: tier.id,
          isCurrentPlayer: true,
          countryCode: 'PK',
          change: 'up',
        });
      } else {
        const diff = playerTournamentRank - r;
        const stars = Math.max(2, (totalStars % 45) + 12 + diff * 4);
        entries.push({
          rank: r,
          id: `tour_bot_${r}`,
          name: BOT_NAMES[(r * 5) % BOT_NAMES.length],
          avatarId: `tour_${r % 6}`,
          level: Math.max(1, currentLevel + diff),
          stars,
          score: stars * 250 + (30 - r) * 100,
          tier: tier.id,
          isCurrentPlayer: false,
          countryCode: ['US', 'DE', 'JP', 'BR', 'IN', 'PK', 'CA', 'GB'][r % 8],
          change: r % 4 === 0 ? 'up' : 'same',
        });
      }
    }

    // Sort by stars descending
    entries.sort((a, b) => b.stars - a.stars);
    // Re-assign ranks 1..30
    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    const calculatedPlayerRank = entries.findIndex(e => e.isCurrentPlayer) + 1;

    return {
      divisionName: `${tier.name} Division`,
      seasonEndsInHours: 42,
      playerRank: calculatedPlayerRank,
      totalParticipants: 50,
      topRewardGems: 50,
      topRewardCoins: 2500,
      promotionThresholdRank: 5,
      entries,
    };
  }
}

export const globalRankingService = new RankingService();
