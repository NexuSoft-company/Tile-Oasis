import { ISaveService, globalSaveService } from './SaveService';
import { LocalEconomyService } from './EconomyService';
import { AnalyticsService } from './AnalyticsService';
import { BoosterType } from '../types/gameEngine';
import { RewardGrant } from '../types/metaProgression';

export interface LevelUpReward {
  level: number;
  coins: number;
  gems: number;
  boosters: Partial<Record<BoosterType, number>>;
  unlockedTitle: string;
}

export interface PlayerXpReport {
  previousXp: number;
  newTotalXp: number;
  previousLevel: number;
  currentLevel: number;
  leveledUp: boolean;
  levelsGained: number;
  levelUpRewards: LevelUpReward[];
  currentLevelXp: number;
  nextLevelXpRequired: number;
  progressPercent: number;
}

export class PlayerProgressionService {
  private saveService: ISaveService;
  private economyService: LocalEconomyService;
  private analytics: AnalyticsService;

  constructor(
    saveService: ISaveService = globalSaveService,
    economyService: LocalEconomyService = new LocalEconomyService(saveService),
    analytics: AnalyticsService = AnalyticsService.getInstance()
  ) {
    this.saveService = saveService;
    this.economyService = economyService;
    this.analytics = analytics;
  }

  /**
   * Linear-quadratic progressive XP threshold formula.
   * Level 1: 0 - 200 XP
   * Level 2: 200 - 450 XP (250 delta)
   * Level 3: 450 - 750 XP (300 delta)
   */
  public getCumulativeXpForLevel(level: number): number {
    if (level <= 1) return 0;
    let total = 0;
    for (let l = 1; l < level; l++) {
      total += 150 + l * 50;
    }
    return total;
  }

  public getXpRequiredForLevel(level: number): number {
    return 150 + level * 50;
  }

  public calculatePlayerLevel(totalXp: number): {
    level: number;
    currentLevelBaseXp: number;
    nextLevelBaseXp: number;
    xpIntoCurrentLevel: number;
    xpRequiredForNext: number;
    progressRatio: number;
  } {
    let level = 1;
    while (this.getCumulativeXpForLevel(level + 1) <= totalXp) {
      level++;
    }

    const currentLevelBaseXp = this.getCumulativeXpForLevel(level);
    const nextLevelBaseXp = this.getCumulativeXpForLevel(level + 1);
    const xpIntoCurrentLevel = Math.max(0, totalXp - currentLevelBaseXp);
    const xpRequiredForNext = nextLevelBaseXp - currentLevelBaseXp;
    const progressRatio = Math.min(1, Math.max(0, xpIntoCurrentLevel / xpRequiredForNext));

    return {
      level,
      currentLevelBaseXp,
      nextLevelBaseXp,
      xpIntoCurrentLevel,
      xpRequiredForNext,
      progressRatio,
    };
  }

  public getPlayerXp(): number {
    const rawSave = this.saveService.loadSave() as any;
    const meta = rawSave.metaProfile || {};
    return meta.playerProgression?.playerXp ?? 0;
  }

  public getPlayerLevelInfo() {
    const totalXp = this.getPlayerXp();
    return this.calculatePlayerLevel(totalXp);
  }

  public addXp(amount: number, source: string = 'gameplay'): PlayerXpReport {
    if (amount <= 0) {
      const info = this.getPlayerLevelInfo();
      return {
        previousXp: this.getPlayerXp(),
        newTotalXp: this.getPlayerXp(),
        previousLevel: info.level,
        currentLevel: info.level,
        leveledUp: false,
        levelsGained: 0,
        levelUpRewards: [],
        currentLevelXp: info.xpIntoCurrentLevel,
        nextLevelXpRequired: info.xpRequiredForNext,
        progressPercent: Math.round(info.progressRatio * 100),
      };
    }

    const rawSave = this.saveService.loadSave() as any;
    const meta = rawSave.metaProfile || {};
    const prog = meta.playerProgression || {
      playerXp: 0,
      playerLevel: 1,
      lastLevelUpAcknowledged: 1,
    };

    const previousXp = prog.playerXp || 0;
    const previousLevel = this.calculatePlayerLevel(previousXp).level;

    const newTotalXp = previousXp + amount;
    const newLevelInfo = this.calculatePlayerLevel(newTotalXp);
    const currentLevel = newLevelInfo.level;

    const leveledUp = currentLevel > previousLevel;
    const levelsGained = currentLevel - previousLevel;
    const levelUpRewards: LevelUpReward[] = [];

    // Process Level-Up Grants
    if (leveledUp) {
      for (let l = previousLevel + 1; l <= currentLevel; l++) {
        const reward = this.generateLevelUpReward(l);
        levelUpRewards.push(reward);

        // Authoritatively grant rewards
        if (reward.coins > 0) this.economyService.addCoins(reward.coins);
        if (reward.gems > 0) this.economyService.addGems(reward.gems);
        Object.entries(reward.boosters).forEach(([bType, count]) => {
          if (count && count > 0) {
            this.economyService.addBooster(bType as BoosterType, count);
          }
        });

        this.analytics.logEvent('player_level_up' as any, {
          newLevel: l,
          source,
          coinsGranted: reward.coins,
          gemsGranted: reward.gems,
        });
      }
    }

    // Persist new XP state
    this.saveService.saveData({
      metaProfile: {
        ...meta,
        playerProgression: {
          playerXp: newTotalXp,
          playerLevel: currentLevel,
          lastLevelUpAcknowledged: currentLevel,
        },
      },
    } as any);

    return {
      previousXp,
      newTotalXp,
      previousLevel,
      currentLevel,
      leveledUp,
      levelsGained,
      levelUpRewards,
      currentLevelXp: newLevelInfo.xpIntoCurrentLevel,
      nextLevelXpRequired: newLevelInfo.xpRequiredForNext,
      progressPercent: Math.round(newLevelInfo.progressRatio * 100),
    };
  }

  public calculateLevelCompletionXp(
    levelId: number,
    stars: number,
    isBoss: boolean = false
  ): number {
    const base = 100;
    const starBonus = stars * 40;
    const bossBonus = isBoss ? 250 : (levelId % 25 === 0 ? 250 : 0);
    return base + starBonus + bossBonus;
  }

  public generateLevelUpReward(level: number): LevelUpReward {
    const coins = 200 + level * 25;
    const gems = 10 + Math.floor(level / 2) * 5;
    const boosters: Partial<Record<BoosterType, number>> = {};

    if (level % 5 === 0) {
      boosters.extra_slot = 1;
      boosters.magnet = 1;
    } else if (level % 3 === 0) {
      boosters.shuffle = 1;
    } else {
      boosters.undo = 1;
    }

    let unlockedTitle = `Explorer Rank ${level}`;
    if (level >= 50) unlockedTitle = 'Sanctuary Grandmaster';
    else if (level >= 30) unlockedTitle = 'Master Matcher';
    else if (level >= 20) unlockedTitle = 'Oasis Guardian';
    else if (level >= 10) unlockedTitle = 'Seasoned Pioneer';

    return {
      level,
      coins,
      gems,
      boosters,
      unlockedTitle,
    };
  }
}

export const globalPlayerProgressionService = new PlayerProgressionService();
