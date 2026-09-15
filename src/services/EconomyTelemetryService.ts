import { EconomyTelemetryRecord, EconomySourceReason } from '../types/analytics';
import { BoosterType } from '../types/gameEngine';
import { AnalyticsService } from './AnalyticsService';

const MAX_TELEMETRY_LOGS = 300;

export interface LifetimeEconomySummary {
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  totalGemsEarned: number;
  totalGemsSpent: number;
  totalBoostersEarned: number;
  totalBoostersUsed: number;
  totalCosmeticsPurchased: number;
}

export class EconomyTelemetryService {
  private static instance: EconomyTelemetryService;
  private ledger: EconomyTelemetryRecord[] = [];
  private analytics: AnalyticsService;

  constructor(analytics: AnalyticsService = AnalyticsService.getInstance()) {
    this.analytics = analytics;
  }

  public static getInstance(): EconomyTelemetryService {
    if (!EconomyTelemetryService.instance) {
      EconomyTelemetryService.instance = new EconomyTelemetryService();
    }
    return EconomyTelemetryService.instance;
  }

  public recordTransaction(
    currency: 'coins' | 'gems' | 'booster' | 'cosmetic',
    type: 'EARN' | 'SPEND',
    amount: number,
    sourceReason: EconomySourceReason,
    balanceAfter: number,
    subType?: BoosterType | string
  ): EconomyTelemetryRecord {
    const timestamp = Date.now();
    const record: EconomyTelemetryRecord = {
      id: `eco_${timestamp}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp,
      currency,
      type,
      amount,
      subType,
      sourceReason,
      balanceAfter,
    };

    this.ledger.push(record);
    if (this.ledger.length > MAX_TELEMETRY_LOGS) {
      this.ledger.shift();
    }

    // Mirror to Centralized Analytics
    if (currency === 'coins') {
      if (type === 'EARN') {
        this.analytics.logEvent('currency_earned', { currency: 'coins', amount, source: sourceReason, balanceAfter });
      } else {
        this.analytics.logEvent('currency_spent', { currency: 'coins', amount, reason: sourceReason, balanceAfter });
      }
    } else if (currency === 'gems') {
      if (type === 'EARN') {
        this.analytics.logEvent('currency_earned', { currency: 'gems', amount, source: sourceReason, balanceAfter });
      } else {
        this.analytics.logEvent('currency_spent', { currency: 'gems', amount, reason: sourceReason, balanceAfter });
      }
    } else if (currency === 'booster') {
      if (type === 'SPEND') {
        this.analytics.logEvent('booster_consumed', { boosterType: subType, reason: sourceReason, balanceAfter });
      } else {
        this.analytics.logEvent('booster_rewarded', { boosterType: subType, amount, source: sourceReason, balanceAfter });
      }
    }

    return record;
  }

  public getLedger(): EconomyTelemetryRecord[] {
    return [...this.ledger];
  }

  public getLifetimeSummary(): LifetimeEconomySummary {
    let totalCoinsEarned = 0;
    let totalCoinsSpent = 0;
    let totalGemsEarned = 0;
    let totalGemsSpent = 0;
    let totalBoostersEarned = 0;
    let totalBoostersUsed = 0;
    let totalCosmeticsPurchased = 0;

    this.ledger.forEach((tx) => {
      if (tx.currency === 'coins') {
        if (tx.type === 'EARN') totalCoinsEarned += tx.amount;
        else totalCoinsSpent += tx.amount;
      } else if (tx.currency === 'gems') {
        if (tx.type === 'EARN') totalGemsEarned += tx.amount;
        else totalGemsSpent += tx.amount;
      } else if (tx.currency === 'booster') {
        if (tx.type === 'EARN') totalBoostersEarned += tx.amount;
        else totalBoostersUsed += tx.amount;
      } else if (tx.currency === 'cosmetic' && tx.type === 'SPEND') {
        totalCosmeticsPurchased++;
      }
    });

    return {
      totalCoinsEarned,
      totalCoinsSpent,
      totalGemsEarned,
      totalGemsSpent,
      totalBoostersEarned,
      totalBoostersUsed,
      totalCosmeticsPurchased,
    };
  }

  public clearLedger(): void {
    this.ledger = [];
  }
}

export const globalEconomyTelemetry = EconomyTelemetryService.getInstance();
