import {
  AnalyticsEventType,
  AnalyticsEventParams,
  AnalyticsEventRecord,
  SessionData,
  LevelFunnelStage,
  LevelFunnelProgress,
  RetentionProfile,
} from '../types/analytics';

const RETENTION_STORAGE_KEY = 'tile_oasis_retention_profile_v1';
const MAX_BUFFERED_EVENTS = 500;

export class AnalyticsService {
  private static instance: AnalyticsService;
  private eventLog: AnalyticsEventRecord[] = [];
  private currentSession: SessionData | null = null;
  private funnelProgressLog: LevelFunnelProgress[] = [];
  private retentionProfile: RetentionProfile;
  private listeners: Array<(record: AnalyticsEventRecord) => void> = [];

  constructor() {
    this.retentionProfile = this.loadRetentionProfile();
    this.startSession();
    this.evaluateRetention();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // =========================================================
  // 1. Core Event Logging
  // =========================================================

  public logEvent(event: AnalyticsEventType, params: AnalyticsEventParams = {}): AnalyticsEventRecord {
    const timestamp = Date.now();
    const sessionId = this.currentSession ? this.currentSession.sessionId : 'session_initial';

    const record: AnalyticsEventRecord = {
      id: `evt_${timestamp}_${Math.random().toString(36).substr(2, 6)}`,
      event,
      params,
      timestamp,
      sessionId,
    };

    this.eventLog.push(record);
    if (this.eventLog.length > MAX_BUFFERED_EVENTS) {
      this.eventLog.shift();
    }

    if (this.currentSession) {
      this.currentSession.lastActiveTime = timestamp;
      this.currentSession.durationSeconds = Math.floor((timestamp - this.currentSession.startTime) / 1000);
    }

    // Notify registered telemetry listeners
    this.listeners.forEach((listener) => {
      try {
        listener(record);
      } catch (err) {
        console.warn('[AnalyticsService] Error in listener callback:', err);
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      // Clean, low-noise debug logging
      // console.log(`[Analytics] ${event}`, params);
    }

    return record;
  }

  public subscribe(listener: (record: AnalyticsEventRecord) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getEventLog(): AnalyticsEventRecord[] {
    return [...this.eventLog];
  }

  public getEventsByType(type: AnalyticsEventType): AnalyticsEventRecord[] {
    return this.eventLog.filter((r) => r.event === type);
  }

  public clearLog(): void {
    this.eventLog = [];
    this.funnelProgressLog = [];
  }

  // =========================================================
  // 2. Session Analytics
  // =========================================================

  public startSession(): SessionData {
    const now = Date.now();
    const sessionId = `ses_${now}_${Math.random().toString(36).substr(2, 6)}`;

    this.currentSession = {
      sessionId,
      startTime: now,
      lastActiveTime: now,
      durationSeconds: 0,
      levelsAttempted: 0,
      levelsCompleted: 0,
      levelsFailed: 0,
      boostersUsed: 0,
      rewardsEarned: {
        coins: 0,
        gems: 0,
        boosters: 0,
      },
      currentLevel: 1,
      isEnded: false,
    };

    this.logEvent('SESSION_STARTED', {
      sessionId,
      startTime: now,
    });

    return { ...this.currentSession };
  }

  public getSession(): SessionData | null {
    if (!this.currentSession) return null;
    const now = Date.now();
    this.currentSession.durationSeconds = Math.floor((now - this.currentSession.startTime) / 1000);
    return { ...this.currentSession };
  }

  public recordSessionLevelAttempt(levelId: number): void {
    if (this.currentSession) {
      this.currentSession.levelsAttempted++;
      this.currentSession.currentLevel = levelId;
    }
  }

  public recordSessionLevelComplete(levelId: number, stars: number = 3, score: number = 0): void {
    if (this.currentSession) {
      this.currentSession.levelsCompleted++;
      this.currentSession.currentLevel = Math.max(this.currentSession.currentLevel, levelId + 1);
    }
    this.logEvent('LEVEL_COMPLETED', { levelId, stars, score });
  }

  public recordSessionLevelFail(levelId: number, reason: string = 'tray_full'): void {
    if (this.currentSession) {
      this.currentSession.levelsFailed++;
    }
    this.logEvent('LEVEL_FAILED', { levelId, reason });
  }

  public recordSessionBoosterUsed(type: string): void {
    if (this.currentSession) {
      this.currentSession.boostersUsed++;
    }
    this.logEvent('BOOSTER_USED', { boosterType: type });
  }

  public recordSessionRewardEarned(coins: number = 0, gems: number = 0, boosters: number = 0): void {
    if (this.currentSession) {
      this.currentSession.rewardsEarned.coins += coins;
      this.currentSession.rewardsEarned.gems += gems;
      this.currentSession.rewardsEarned.boosters += boosters;
    }
  }

  public endSession(): SessionData | null {
    if (!this.currentSession || this.currentSession.isEnded) return null;

    const now = Date.now();
    this.currentSession.lastActiveTime = now;
    this.currentSession.durationSeconds = Math.floor((now - this.currentSession.startTime) / 1000);
    this.currentSession.isEnded = true;

    this.logEvent('SESSION_ENDED', {
      sessionId: this.currentSession.sessionId,
      durationSeconds: this.currentSession.durationSeconds,
      levelsAttempted: this.currentSession.levelsAttempted,
      levelsCompleted: this.currentSession.levelsCompleted,
      levelsFailed: this.currentSession.levelsFailed,
      boostersUsed: this.currentSession.boostersUsed,
    });

    const summary = { ...this.currentSession };
    return summary;
  }

  // =========================================================
  // 3. Level Funnel Analytics
  // =========================================================

  public recordFunnelStage(
    levelId: number,
    stage: LevelFunnelStage,
    percent: number = 0,
    movesUsed: number = 0,
    timeUsedSeconds: number = 0
  ): LevelFunnelProgress {
    const entry: LevelFunnelProgress = {
      levelId,
      stage,
      percent,
      movesUsed,
      timeUsedSeconds,
      timestamp: Date.now(),
    };

    this.funnelProgressLog.push(entry);

    this.logEvent('FUNNEL_STAGE_RECORDED', {
      levelId,
      stage,
      percent,
      moves: movesUsed,
      durationSeconds: timeUsedSeconds,
    });

    return entry;
  }

  public getFunnelRecordsForLevel(levelId: number): LevelFunnelProgress[] {
    return this.funnelProgressLog.filter((f) => f.levelId === levelId);
  }

  // =========================================================
  // 4. Retention Event Tracking
  // =========================================================

  private loadRetentionProfile(): RetentionProfile {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(RETENTION_STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      } catch (e) {
        // Fallback
      }
    }

    const initial: RetentionProfile = {
      firstInstallTimestamp: Date.now(),
      lastLoginTimestamp: Date.now(),
      totalDaysActive: 1,
      day1Tracked: false,
      day3Tracked: false,
      day7Tracked: false,
      day14Tracked: false,
      day30Tracked: false,
    };
    this.saveRetentionProfile(initial);
    return initial;
  }

  private saveRetentionProfile(profile: RetentionProfile): void {
    this.retentionProfile = profile;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(RETENTION_STORAGE_KEY, JSON.stringify(profile));
      } catch (e) {
        // Safe fallback
      }
    }
  }

  public evaluateRetention(now: number = Date.now()): void {
    const profile = { ...this.retentionProfile };
    const diffMs = now - profile.firstInstallTimestamp;
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays >= 1 && !profile.day1Tracked) {
      profile.day1Tracked = true;
      this.logEvent('RETENTION_DAY_1_RETURN', { daysSinceInstall: diffDays, timestamp: now });
    }
    if (diffDays >= 3 && !profile.day3Tracked) {
      profile.day3Tracked = true;
      this.logEvent('RETENTION_DAY_3_RETURN', { daysSinceInstall: diffDays, timestamp: now });
    }
    if (diffDays >= 7 && !profile.day7Tracked) {
      profile.day7Tracked = true;
      this.logEvent('RETENTION_DAY_7_RETURN', { daysSinceInstall: diffDays, timestamp: now });
    }
    if (diffDays >= 14 && !profile.day14Tracked) {
      profile.day14Tracked = true;
      this.logEvent('RETENTION_DAY_14_RETURN', { daysSinceInstall: diffDays, timestamp: now });
    }
    if (diffDays >= 30 && !profile.day30Tracked) {
      profile.day30Tracked = true;
      this.logEvent('RETENTION_DAY_30_RETURN', { daysSinceInstall: diffDays, timestamp: now });
    }

    profile.lastLoginTimestamp = now;
    this.saveRetentionProfile(profile);
  }

  public getRetentionProfile(): RetentionProfile {
    return { ...this.retentionProfile };
  }
}

export const globalAnalytics = AnalyticsService.getInstance();
