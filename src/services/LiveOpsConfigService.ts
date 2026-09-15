import { LiveOpsConfiguration, LiveOpsEventConfig } from '../types/liveOps';

const DEFAULT_LIVEOPS_CONFIG: LiveOpsConfiguration = {
  version: '2026.1.0',
  activeEvents: [
    {
      id: 'event_oasis_bloom',
      name: 'Oasis Bloom Festival',
      description: 'Earn 1.5x Coins on all World Levels!',
      active: true,
      startTime: 0,
      endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
      coinMultiplier: 1.5,
      xpMultiplier: 1.25,
      specialShopDiscounts: {
        bundle_oasis_starter: 0.15,
        theme_emerald_eden: 0.2,
      },
    },
  ],
  dailyGiftCoins: 150,
  dailyGiftUndoBoosters: 1,
  boosterPriceMultiplier: 1.0,
  featuredCosmeticId: 'tt_tropical_oasis',
  maintenanceMode: false,
};

export class LiveOpsConfigService {
  private static instance: LiveOpsConfigService;
  private currentConfig: LiveOpsConfiguration;
  private listeners: Array<(config: LiveOpsConfiguration) => void> = [];

  constructor() {
    this.currentConfig = { ...DEFAULT_LIVEOPS_CONFIG };
  }

  public static getInstance(): LiveOpsConfigService {
    if (!LiveOpsConfigService.instance) {
      LiveOpsConfigService.instance = new LiveOpsConfigService();
    }
    return LiveOpsConfigService.instance;
  }

  public getConfig(): LiveOpsConfiguration {
    return { ...this.currentConfig };
  }

  public getActiveEvents(now: number = Date.now()): LiveOpsEventConfig[] {
    return this.currentConfig.activeEvents.filter(
      (e) => e.active && (e.startTime === 0 || e.startTime <= now) && (e.endTime === 0 || e.endTime >= now)
    );
  }

  public getCoinMultiplier(now: number = Date.now()): number {
    const active = this.getActiveEvents(now);
    if (active.length === 0) return 1.0;
    return active.reduce((max, e) => Math.max(max, e.coinMultiplier || 1.0), 1.0);
  }

  public getXpMultiplier(now: number = Date.now()): number {
    const active = this.getActiveEvents(now);
    if (active.length === 0) return 1.0;
    return active.reduce((max, e) => Math.max(max, e.xpMultiplier || 1.0), 1.0);
  }

  public getShopDiscountForItem(itemId: string, now: number = Date.now()): number {
    const active = this.getActiveEvents(now);
    let bestDiscount = 0;
    active.forEach((e) => {
      if (e.specialShopDiscounts && e.specialShopDiscounts[itemId]) {
        bestDiscount = Math.max(bestDiscount, e.specialShopDiscounts[itemId]);
      }
    });
    return bestDiscount;
  }

  public updateConfig(override: Partial<LiveOpsConfiguration>): void {
    this.currentConfig = {
      ...this.currentConfig,
      ...override,
    };
    this.notifyListeners();
  }

  public resetConfig(): void {
    this.currentConfig = { ...DEFAULT_LIVEOPS_CONFIG };
    this.notifyListeners();
  }

  public subscribe(listener: (config: LiveOpsConfiguration) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => {
      try {
        l(this.currentConfig);
      } catch (err) {
        console.warn('[LiveOpsConfigService] Error in listener:', err);
      }
    });
  }
}

export const globalLiveOpsConfigService = LiveOpsConfigService.getInstance();
