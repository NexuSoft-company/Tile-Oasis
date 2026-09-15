/**
 * Cloud-Ready Architecture Contracts & Local-First Adapters
 * Tile Oasis: Sanctuary Match
 *
 * Provides typed interfaces and local fallback implementations for:
 * - Authentication & Player Identity
 * - Cloud Save Synchronization & Conflict Resolution
 * - Remote Configuration & Live-Ops Dynamic Overrides
 * - Authoritative Server-Side Receipt & Economy Validation
 * - Telemetry & Analytics Cloud Batch Upload
 * - Real-Time Live Events Synchronization
 */

import { PlayerSaveData } from '../../types/gameEngine';
import { LiveOpsConfiguration } from '../../types/liveOps';
import { AnalyticsEventRecord } from '../../types/analytics';
import { globalSaveService } from '../SaveService';
import { LiveOpsConfigService } from '../LiveOpsConfigService';

export interface CloudUser {
  userId: string;
  isAnonymous: boolean;
  displayName: string;
  avatarUrl?: string;
  createdAt: number;
}

export type CloudSyncState = 'IDLE' | 'SYNCING' | 'SYNCED' | 'CONFLICT' | 'OFFLINE' | 'ERROR';

export interface CloudSaveSyncResult {
  success: boolean;
  state: CloudSyncState;
  cloudTimestamp?: number;
  localTimestamp?: number;
  resolvedData?: PlayerSaveData;
  errorMessage?: string;
}

// 1. Auth Adapter Interface
export interface ICloudAuthAdapter {
  getCurrentUser(): CloudUser | null;
  signInAnonymously(): Promise<CloudUser>;
  signOut(): Promise<void>;
  linkProvider?(provider: 'google' | 'apple'): Promise<CloudUser>;
}

// 2. Cloud Save Adapter Interface
export interface ICloudSaveAdapter {
  getSyncState(): CloudSyncState;
  pullCloudSave(): Promise<PlayerSaveData | null>;
  pushLocalSave(localData: PlayerSaveData): Promise<CloudSaveSyncResult>;
  resolveConflict(localData: PlayerSaveData, remoteData: PlayerSaveData): PlayerSaveData;
}

// 3. Remote Config Adapter Interface
export interface IRemoteConfigAdapter {
  fetchLatestLiveOpsConfig(): Promise<LiveOpsConfiguration | null>;
  getLastFetchTimestamp(): number;
}

// 4. Server-Side Economy & Receipt Validation Interface
export interface IReceiptValidationResult {
  isValid: boolean;
  transactionId: string;
  grantedItems?: Record<string, number>;
  errorMessage?: string;
}

export interface IEconomyValidationAdapter {
  validatePurchaseReceipt(receiptToken: string, itemId: string): Promise<IReceiptValidationResult>;
  reconcileServerBalance?(userId: string, currentBalance: number): Promise<number>;
}

// 5. Cloud Telemetry Upload Adapter Interface
export interface ITelemetryUploadAdapter {
  enqueueBatch(events: AnalyticsEventRecord[]): Promise<boolean>;
  flush(): Promise<number>;
  getPendingCount(): number;
}

// ============================================================================
// Local-First Fallback Implementations (Client-Authoritative Safe Mode)
// ============================================================================

export class LocalFirstAuthAdapter implements ICloudAuthAdapter {
  private user: CloudUser = {
    userId: 'local_player_guest',
    isAnonymous: true,
    displayName: 'Sanctuary Explorer',
    createdAt: Date.now(),
  };

  public getCurrentUser(): CloudUser | null {
    return { ...this.user };
  }

  public async signInAnonymously(): Promise<CloudUser> {
    return { ...this.user };
  }

  public async signOut(): Promise<void> {
    // Local-first no-op
  }
}

export class LocalFirstCloudSaveAdapter implements ICloudSaveAdapter {
  private syncState: CloudSyncState = 'IDLE';

  public getSyncState(): CloudSyncState {
    return this.syncState;
  }

  public async pullCloudSave(): Promise<PlayerSaveData | null> {
    // In local-first mode, localStorage is the active store
    return globalSaveService.loadSave();
  }

  public async pushLocalSave(localData: PlayerSaveData): Promise<CloudSaveSyncResult> {
    this.syncState = 'SYNCING';
    const saved = globalSaveService.saveData(localData);
    this.syncState = saved ? 'SYNCED' : 'ERROR';
    return {
      success: saved,
      state: this.syncState,
      localTimestamp: localData.lastSavedTimestamp,
    };
  }

  public resolveConflict(localData: PlayerSaveData, remoteData: PlayerSaveData): PlayerSaveData {
    // Deterministic timestamp + highest progress resolution
    if ((remoteData.highestLevelUnlocked || 1) > (localData.highestLevelUnlocked || 1)) {
      return remoteData;
    }
    if ((remoteData.starsTotal || 0) > (localData.starsTotal || 0)) {
      return remoteData;
    }
    return localData;
  }
}

export class LocalFirstRemoteConfigAdapter implements IRemoteConfigAdapter {
  private lastFetch: number = Date.now();

  public async fetchLatestLiveOpsConfig(): Promise<LiveOpsConfiguration | null> {
    this.lastFetch = Date.now();
    return LiveOpsConfigService.getInstance().getConfig();
  }

  public getLastFetchTimestamp(): number {
    return this.lastFetch;
  }
}

export class LocalFirstEconomyValidationAdapter implements IEconomyValidationAdapter {
  public async validatePurchaseReceipt(receiptToken: string, itemId: string): Promise<IReceiptValidationResult> {
    return {
      isValid: true,
      transactionId: `local_val_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    };
  }
}

export class LocalFirstTelemetryUploadAdapter implements ITelemetryUploadAdapter {
  private queue: AnalyticsEventRecord[] = [];

  public async enqueueBatch(events: AnalyticsEventRecord[]): Promise<boolean> {
    this.queue.push(...events);
    if (this.queue.length > 500) {
      this.queue.splice(0, this.queue.length - 500);
    }
    return true;
  }

  public async flush(): Promise<number> {
    const count = this.queue.length;
    this.queue = [];
    return count;
  }

  public getPendingCount(): number {
    return this.queue.length;
  }
}

export const globalCloudAuth = new LocalFirstAuthAdapter();
export const globalCloudSave = new LocalFirstCloudSaveAdapter();
export const globalRemoteConfig = new LocalFirstRemoteConfigAdapter();
export const globalEconomyValidator = new LocalFirstEconomyValidationAdapter();
export const globalTelemetryUploader = new LocalFirstTelemetryUploadAdapter();
