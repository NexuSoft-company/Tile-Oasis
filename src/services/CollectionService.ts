import {
  CollectibleItem,
  CollectibleCategory,
  CollectionState,
  PlayerCustomizations,
} from '../types/collection';
import { COLLECTIBLE_ITEMS, DEFAULT_CUSTOMIZATIONS } from '../data/collectionDefinitions';
import { ISaveService, globalSaveService } from './SaveService';
import { LocalEconomyService } from './EconomyService';
import { PlayerProfile } from '../types/metaProgression';
import { AnalyticsService } from './AnalyticsService';

export class CollectionService {
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

  public getAllCollectibles(): CollectibleItem[] {
    return COLLECTIBLE_ITEMS;
  }

  public getCollectiblesByCategory(category: CollectibleCategory): CollectibleItem[] {
    return COLLECTIBLE_ITEMS.filter((item) => item.category === category);
  }

  public getItemById(id: string): CollectibleItem | undefined {
    return COLLECTIBLE_ITEMS.find((item) => item.id === id);
  }

  public getCollectionState(): CollectionState {
    const rawSave = this.saveService.loadSave() as any;
    const meta = rawSave.metaProfile || {};
    const state = meta.collectionState || {};

    const defaultUnlocked = COLLECTIBLE_ITEMS.filter(
      (item) => item.unlockRequirement.type === 'free'
    ).map((item) => item.id);

    const unlockedSet = new Set<string>([
      ...defaultUnlocked,
      ...(state.unlockedItemIds || []),
    ]);

    const ownedSet = new Set<string>([
      ...defaultUnlocked,
      ...(state.ownedItemIds || []),
    ]);

    const customizations: PlayerCustomizations = {
      ...DEFAULT_CUSTOMIZATIONS,
      ...(state.customizations || {}),
    };

    return {
      unlockedItemIds: Array.from(unlockedSet),
      ownedItemIds: Array.from(ownedSet),
      customizations,
    };
  }

  public saveCollectionState(state: CollectionState): boolean {
    const rawSave = this.saveService.loadSave() as any;
    const meta = rawSave.metaProfile || {};

    return this.saveService.saveData({
      metaProfile: {
        ...meta,
        collectionState: state,
      },
    } as any);
  }

  public isItemUnlocked(itemId: string): boolean {
    const state = this.getCollectionState();
    return state.unlockedItemIds.includes(itemId);
  }

  public isItemOwned(itemId: string): boolean {
    const state = this.getCollectionState();
    return state.ownedItemIds.includes(itemId);
  }

  public isItemEquipped(itemId: string): boolean {
    const state = this.getCollectionState();
    const item = this.getItemById(itemId);
    if (!item) return false;

    switch (item.category) {
      case 'tile_theme':
        return state.customizations.equippedTileTheme === itemId;
      case 'tile_skin':
        return state.customizations.equippedTileSkin === itemId;
      case 'board_theme':
        return state.customizations.equippedBoardTheme === itemId;
      case 'player_frame':
        return state.customizations.equippedPlayerFrame === itemId;
      default:
        return false;
    }
  }

  public checkAndUnlockEligible(profile: PlayerProfile): string[] {
    const currentState = this.getCollectionState();
    const newlyUnlocked: string[] = [];

    const unlockedSet = new Set<string>(currentState.unlockedItemIds);
    const ownedSet = new Set<string>(currentState.ownedItemIds);

    for (const item of COLLECTIBLE_ITEMS) {
      if (unlockedSet.has(item.id) && ownedSet.has(item.id)) continue;

      const req = item.unlockRequirement;
      let eligible = false;

      switch (req.type) {
        case 'free':
          eligible = true;
          break;
        case 'level':
          if (profile.highestLevelUnlocked >= (req.target as number)) {
            eligible = true;
          }
          break;
        case 'stars':
          if (profile.starsTotal >= (req.target as number)) {
            eligible = true;
          }
          break;
        case 'world':
          // World N requires highest level to reach or beat World N start level
          const worldStart = ((req.target as number) - 1) * 100 + 1;
          if (profile.highestLevelUnlocked >= worldStart) {
            eligible = true;
          }
          break;
        case 'pack':
          // E.g. world_1_pack_1 is Level 25 completed
          if (req.target === 'world_1_pack_1' && profile.highestLevelUnlocked > 25) {
            eligible = true;
          } else if (req.target === 'world_1_pack_2' && profile.highestLevelUnlocked > 50) {
            eligible = true;
          } else if (req.target === 'world_1_pack_3' && profile.highestLevelUnlocked > 75) {
            eligible = true;
          } else if (req.target === 'world_1_pack_4' && profile.highestLevelUnlocked > 100) {
            eligible = true;
          }
          break;
        case 'boss':
          if (req.target === 'campaign_finale') {
            if (profile.completedLevels[9999]?.stars > 0) {
              eligible = true;
            }
          } else if (req.target === 'world_1_pack_1' && profile.highestLevelUnlocked > 25) {
            eligible = true;
          } else if (req.target === 'world_1_pack_4' && profile.highestLevelUnlocked > 100) {
            eligible = true;
          }
          break;
        case 'achievement':
          const ach = profile.achievementProgress[req.target as string];
          if (ach && ach.isCompleted) {
            eligible = true;
          }
          break;
        case 'milestone':
          const ms = profile.milestoneProgress[req.target as string];
          if (ms && ms.isCompleted) {
            eligible = true;
          }
          break;
      }

      if (eligible) {
        if (!unlockedSet.has(item.id)) {
          unlockedSet.add(item.id);
          newlyUnlocked.push(item.id);
        }
        // If it does not require purchase (i.e. rewarded directly), also grant ownership
        if (!item.coinPrice && !item.gemPrice) {
          ownedSet.add(item.id);
        }
      }
    }

    if (newlyUnlocked.length > 0 || ownedSet.size > currentState.ownedItemIds.length) {
      const updatedState: CollectionState = {
        ...currentState,
        unlockedItemIds: Array.from(unlockedSet),
        ownedItemIds: Array.from(ownedSet),
      };
      this.saveCollectionState(updatedState);

      newlyUnlocked.forEach((id) => {
        this.analytics.logEvent('collection_item_unlocked' as any, { itemId: id });
      });
    }

    return newlyUnlocked;
  }

  public purchaseItem(
    itemId: string,
    currency: 'coins' | 'gems'
  ): { success: boolean; message: string } {
    const item = this.getItemById(itemId);
    if (!item) {
      return { success: false, message: 'Item not found in catalog.' };
    }

    const state = this.getCollectionState();
    if (state.ownedItemIds.includes(itemId)) {
      return { success: false, message: `${item.name} is already owned!` };
    }

    if (!state.unlockedItemIds.includes(itemId)) {
      return { success: false, message: `Unlock requirement not met: ${item.unlockRequirement.description}` };
    }

    if (currency === 'coins') {
      if (!item.coinPrice || item.coinPrice <= 0) {
        return { success: false, message: 'This item cannot be purchased with coins.' };
      }
      if (this.economyService.getCoins() < item.coinPrice) {
        return {
          success: false,
          message: `Insufficient coins. Need ${item.coinPrice}, have ${this.economyService.getCoins()}.`,
        };
      }

      const deducted = this.economyService.deductCoins(item.coinPrice);
      if (!deducted) {
        return { success: false, message: 'Payment transaction failed.' };
      }
    } else {
      if (!item.gemPrice || item.gemPrice <= 0) {
        return { success: false, message: 'This item cannot be purchased with gems.' };
      }
      if (this.economyService.getGems() < item.gemPrice) {
        return {
          success: false,
          message: `Insufficient gems. Need ${item.gemPrice}, have ${this.economyService.getGems()}.`,
        };
      }

      const deducted = this.economyService.deductGems(item.gemPrice);
      if (!deducted) {
        return { success: false, message: 'Payment transaction failed.' };
      }
    }

    // Grant ownership
    const updatedState: CollectionState = {
      ...state,
      ownedItemIds: Array.from(new Set([...state.ownedItemIds, itemId])),
    };
    this.saveCollectionState(updatedState);

    this.analytics.logEvent('shop_purchase_successful' as any, {
      itemId,
      currency,
      cost: currency === 'coins' ? item.coinPrice : item.gemPrice,
    });

    return { success: true, message: `Successfully purchased ${item.name}!` };
  }

  public equipItem(itemId: string): boolean {
    const item = this.getItemById(itemId);
    if (!item) return false;

    const state = this.getCollectionState();
    if (!state.ownedItemIds.includes(itemId)) {
      return false; // Cannot equip unowned item
    }

    const customizations: PlayerCustomizations = { ...state.customizations };

    switch (item.category) {
      case 'tile_theme':
        customizations.equippedTileTheme = itemId;
        break;
      case 'tile_skin':
        customizations.equippedTileSkin = itemId;
        break;
      case 'board_theme':
        customizations.equippedBoardTheme = itemId;
        break;
      case 'player_frame':
        customizations.equippedPlayerFrame = itemId;
        break;
      default:
        return false; // Badges and memories are decorative
    }

    const updatedState: CollectionState = {
      ...state,
      customizations,
    };

    return this.saveCollectionState(updatedState);
  }

  public getEquippedCustomizations(): PlayerCustomizations {
    return this.getCollectionState().customizations;
  }
}

export const globalCollectionService = new CollectionService();
