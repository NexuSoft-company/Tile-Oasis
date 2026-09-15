import { SHOP_CATALOG, ShopItemDefinition } from '../data/shopDefinitions';
import { ISaveService, globalSaveService } from './SaveService';
import { LocalEconomyService } from './EconomyService';
import { CollectionService, globalCollectionService } from './CollectionService';
import { AnalyticsService } from './AnalyticsService';
import { EconomyTelemetryService } from './EconomyTelemetryService';
import { globalErrorMonitoring } from './ErrorMonitoringService';
import { BoosterType } from '../types/gameEngine';

export interface ShopPurchaseResult {
  success: boolean;
  message: string;
  item?: ShopItemDefinition;
  transactionId?: string;
}

export class ShopService {
  private saveService: ISaveService;
  private economyService: LocalEconomyService;
  private collectionService: CollectionService;
  private analytics: AnalyticsService;
  private telemetry: EconomyTelemetryService;
  private activeTransactionInProgress: boolean = false;
  private processedTransactions: Set<string> = new Set();

  constructor(
    saveService: ISaveService = globalSaveService,
    economyService: LocalEconomyService = new LocalEconomyService(saveService),
    collectionService: CollectionService = globalCollectionService,
    analytics: AnalyticsService = AnalyticsService.getInstance(),
    telemetry: EconomyTelemetryService = EconomyTelemetryService.getInstance()
  ) {
    this.saveService = saveService;
    this.economyService = economyService;
    this.collectionService = collectionService;
    this.analytics = analytics;
    this.telemetry = telemetry;
  }

  public getCatalog(): ShopItemDefinition[] {
    return SHOP_CATALOG;
  }

  public getItemsByCategory(category: string): ShopItemDefinition[] {
    return SHOP_CATALOG.filter((item) => item.category === category);
  }

  public getItemById(id: string): ShopItemDefinition | undefined {
    return SHOP_CATALOG.find((item) => item.id === id);
  }

  public canClaimDailyFreeGift(now: number = Date.now()): boolean {
    const rawSave = this.saveService.loadSave() as any;
    const meta = rawSave.metaProfile || {};
    const lastClaim = meta.lastDailyShopGiftTimestamp || 0;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - lastClaim >= twentyFourHours;
  }

  public getDailyFreeGiftCooldownRemainingMs(now: number = Date.now()): number {
    const rawSave = this.saveService.loadSave() as any;
    const meta = rawSave.metaProfile || {};
    const lastClaim = meta.lastDailyShopGiftTimestamp || 0;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const elapsed = now - lastClaim;
    return elapsed >= twentyFourHours ? 0 : twentyFourHours - elapsed;
  }

  public claimDailyFreeGift(now: number = Date.now()): ShopPurchaseResult {
    // 1. In-flight Lock & Cooldown Check
    if (this.activeTransactionInProgress) {
      return {
        success: false,
        message: 'A shop transaction is already in progress. Please wait.',
      };
    }

    if (!this.canClaimDailyFreeGift(now)) {
      this.analytics.logEvent('SHOP_PURCHASE_FAILED', {
        itemId: 'shop_daily_free_gift',
        reason: 'cooldown_active',
      });
      return {
        success: false,
        message: 'Daily Free Gift is on cooldown. Check back tomorrow!',
      };
    }

    this.activeTransactionInProgress = true;
    const transactionId = `tx_gift_${now}_${Math.random().toString(36).substr(2, 6)}`;

    try {
      const giftDef = this.getItemById('shop_daily_free_gift');
      if (!giftDef) {
        this.activeTransactionInProgress = false;
        return { success: false, message: 'Free gift definition not found.' };
      }

      // Grant Coins
      if (giftDef.coinsGrant) {
        this.economyService.addCoins(giftDef.coinsGrant);
        this.telemetry.recordTransaction(
          'coins',
          'EARN',
          giftDef.coinsGrant,
          'DAILY_SHOP_GIFT',
          this.economyService.getCoins()
        );
      }

      // Grant Boosters
      if (giftDef.boosterGrant) {
        Object.entries(giftDef.boosterGrant).forEach(([bType, count]) => {
          if (count && count > 0) {
            this.economyService.addBooster(bType as BoosterType, count);
            this.telemetry.recordTransaction(
              'booster',
              'EARN',
              count,
              'DAILY_SHOP_GIFT',
              this.economyService.getBoosterCount(bType as BoosterType),
              bType
            );
          }
        });
      }

      // Save claim timestamp
      const rawSave = this.saveService.loadSave() as any;
      const meta = rawSave.metaProfile || {};
      this.saveService.saveData({
        metaProfile: {
          ...meta,
          lastDailyShopGiftTimestamp: now,
        },
      } as any);

      this.analytics.logEvent('DAILY_REWARD_CLAIMED', {
        source: 'daily_free_gift',
        coins: giftDef.coinsGrant,
        boosters: giftDef.boosterGrant,
        transactionId,
      });

      this.activeTransactionInProgress = false;
      return {
        success: true,
        message: 'Claimed Daily Free Gift: +150 Coins & +1 Undo Booster!',
        item: giftDef,
        transactionId,
      };
    } catch (err: any) {
      this.activeTransactionInProgress = false;
      globalErrorMonitoring.logError('SHOP_ERROR', `Daily Gift Claim Failed: ${err?.message || err}`, { error: err });
      return {
        success: false,
        message: 'Unable to claim Daily Free Gift. Please try again.',
      };
    }
  }

  /**
   * Authoritative, Hardened Multi-Stage Shop Purchase Pipeline
   */
  public purchaseItem(
    itemId: string,
    currency: 'coins' | 'gems',
    idempotencyKey?: string
  ): ShopPurchaseResult {
    if (itemId === 'shop_daily_free_gift') {
      return this.claimDailyFreeGift();
    }

    // Check idempotency token to avoid duplicate processing
    if (idempotencyKey && this.processedTransactions.has(idempotencyKey)) {
      return {
        success: false,
        message: 'This transaction was already processed.',
      };
    }

    if (this.activeTransactionInProgress) {
      return {
        success: false,
        message: 'Another transaction is in progress. Please wait a moment.',
      };
    }

    this.activeTransactionInProgress = true;
    const now = Date.now();
    const transactionId = idempotencyKey || `tx_shop_${now}_${Math.random().toString(36).substr(2, 6)}`;

    this.analytics.logEvent('SHOP_PURCHASE_STARTED', {
      itemId,
      currency,
      transactionId,
    });

    try {
      // 1. STAGE: REQUEST & VALIDATE ITEM
      const item = this.getItemById(itemId);
      if (!item) {
        this.activeTransactionInProgress = false;
        this.analytics.logEvent('SHOP_PURCHASE_FAILED', { itemId, reason: 'item_not_found' });
        return { success: false, message: 'Item not found in catalog.' };
      }

      // 2. STAGE: CHECK INVENTORY CAPACITY
      if (item.category === 'boosters' && item.boosterGrant) {
        for (const [bType, count] of Object.entries(item.boosterGrant)) {
          const currentCount = this.economyService.getBoosterCount(bType as BoosterType);
          if (item.maxInventoryLimit && currentCount + (count || 0) > item.maxInventoryLimit) {
            this.activeTransactionInProgress = false;
            this.analytics.logEvent('SHOP_PURCHASE_FAILED', { itemId, reason: 'inventory_limit_reached' });
            return {
              success: false,
              message: `Max inventory limit reached (${item.maxInventoryLimit}) for ${bType}.`,
            };
          }
        }
      }

      // 3. STAGE: CHECK BALANCE & PROCESS PAYMENT DEDUCTION
      const cost = currency === 'coins' ? item.coinPrice : item.gemPrice;
      if (cost === undefined || cost === null || cost <= 0) {
        this.activeTransactionInProgress = false;
        this.analytics.logEvent('SHOP_PURCHASE_FAILED', { itemId, reason: 'invalid_price' });
        return { success: false, message: `Item cannot be purchased with ${currency}.` };
      }

      if (currency === 'coins') {
        const playerCoins = this.economyService.getCoins();
        if (playerCoins < cost) {
          this.activeTransactionInProgress = false;
          this.analytics.logEvent('SHOP_PURCHASE_FAILED', { itemId, reason: 'insufficient_coins', cost, balance: playerCoins });
          return {
            success: false,
            message: `Insufficient coins. Need ${cost}, have ${playerCoins}.`,
          };
        }

        const deducted = this.economyService.deductCoins(cost);
        if (!deducted) {
          this.activeTransactionInProgress = false;
          return { success: false, message: 'Failed to process coin payment.' };
        }

        this.telemetry.recordTransaction('coins', 'SPEND', cost, 'SHOP_PURCHASE', this.economyService.getCoins());
      } else {
        const playerGems = this.economyService.getGems();
        if (playerGems < cost) {
          this.activeTransactionInProgress = false;
          this.analytics.logEvent('SHOP_PURCHASE_FAILED', { itemId, reason: 'insufficient_gems', cost, balance: playerGems });
          return {
            success: false,
            message: `Insufficient gems. Need ${cost}, have ${playerGems}.`,
          };
        }

        const deducted = this.economyService.deductGems(cost);
        if (!deducted) {
          this.activeTransactionInProgress = false;
          return { success: false, message: 'Failed to process gem payment.' };
        }

        this.telemetry.recordTransaction('gems', 'SPEND', cost, 'SHOP_PURCHASE', this.economyService.getGems());
      }

      // 4. STAGE: GRANT PURCHASED GOODS
      if (item.coinsGrant) {
        this.economyService.addCoins(item.coinsGrant);
        this.telemetry.recordTransaction('coins', 'EARN', item.coinsGrant, 'SHOP_PURCHASE', this.economyService.getCoins());
      }
      if (item.gemsGrant) {
        this.economyService.addGems(item.gemsGrant);
        this.telemetry.recordTransaction('gems', 'EARN', item.gemsGrant, 'SHOP_PURCHASE', this.economyService.getGems());
      }
      if (item.boosterGrant) {
        Object.entries(item.boosterGrant).forEach(([bType, count]) => {
          if (count && count > 0) {
            this.economyService.addBooster(bType as BoosterType, count);
            this.telemetry.recordTransaction(
              'booster',
              'EARN',
              count,
              'SHOP_PURCHASE',
              this.economyService.getBoosterCount(bType as BoosterType),
              bType
            );
          }
        });
      }

      // 5. STAGE: SAVE & RECORD IDEMPOTENCY
      if (idempotencyKey) {
        this.processedTransactions.add(idempotencyKey);
      }

      // 6. STAGE: EMIT ANALYTICS
      this.analytics.logEvent('SHOP_PURCHASE_COMPLETED', {
        itemId: item.id,
        currency,
        cost,
        transactionId,
      });

      this.activeTransactionInProgress = false;
      return {
        success: true,
        message: `Purchased ${item.name} successfully!`,
        item,
        transactionId,
      };
    } catch (err: any) {
      this.activeTransactionInProgress = false;
      globalErrorMonitoring.logError('SHOP_ERROR', `Shop transaction failed: ${err?.message || err}`, { itemId, currency, error: err });
      return {
        success: false,
        message: 'An error occurred while completing your purchase.',
      };
    }
  }
}

export const globalShopService = new ShopService();
