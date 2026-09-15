import { ErrorCategory, ErrorLogRecord } from '../types/liveOps';

const MAX_ERROR_LOGS = 100;
const MAX_BREADCRUMBS = 50;

const DEFAULT_PLAYER_MESSAGES: Record<ErrorCategory, string> = {
  LEVEL_LOAD_ERROR: 'Unable to prepare sanctuary tiles. Please re-open the level.',
  GAMEPLAY_ERROR: 'A momentary visual sync occurred. Resuming sanctuary match.',
  SAVE_ERROR: 'Safe local progress backup active. Your sanctuary is secure.',
  REWARD_ERROR: 'Reward claiming is momentarily busy. Please try again.',
  ECONOMY_ERROR: 'Wallet balance check could not be completed. No currency was lost.',
  SHOP_ERROR: 'Shop transaction canceled safely. No currency was deducted.',
  PROGRESSION_ERROR: 'Player rank progress is safely preserved.',
  UI_ERROR: 'Interface refreshed smoothly.',
  ANALYTICS_ERROR: 'Telemetry telemetry buffered safely.',
};

export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;
  private errorLogs: ErrorLogRecord[] = [];
  private breadcrumbs: string[] = [];
  private listeners: Array<(record: ErrorLogRecord) => void> = [];

  public static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  public addBreadcrumb(crumb: string): void {
    const timestamp = new Date().toISOString().substring(11, 19);
    this.breadcrumbs.push(`[${timestamp}] ${crumb}`);
    if (this.breadcrumbs.length > MAX_BREADCRUMBS) {
      this.breadcrumbs.shift();
    }
  }

  public getBreadcrumbs(): string[] {
    return [...this.breadcrumbs];
  }

  public logError(
    category: ErrorCategory,
    error: Error | string,
    context?: Record<string, any>,
    playerFacingOverride?: string
  ): ErrorLogRecord {
    const timestamp = Date.now();
    const message = typeof error === 'string' ? error : error.message;
    const technicalDetails = typeof error === 'string' ? undefined : error.stack;
    const playerFacingMessage = playerFacingOverride || DEFAULT_PLAYER_MESSAGES[category] || 'An unexpected issue occurred.';

    const record: ErrorLogRecord = {
      id: `err_${timestamp}_${Math.random().toString(36).substr(2, 6)}`,
      category,
      message,
      technicalDetails,
      playerFacingMessage,
      timestamp,
      breadcrumbs: [...this.breadcrumbs],
      context,
    };

    this.errorLogs.push(record);
    if (this.errorLogs.length > MAX_ERROR_LOGS) {
      this.errorLogs.shift();
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ErrorMonitoring] [${category}] ${message}`, { context, technicalDetails });
    }

    this.listeners.forEach((l) => {
      try {
        l(record);
      } catch (err) {
        // Safe
      }
    });

    return record;
  }

  public getRecentErrors(): ErrorLogRecord[] {
    return [...this.errorLogs];
  }

  public getErrorsByCategory(category: ErrorCategory): ErrorLogRecord[] {
    return this.errorLogs.filter((e) => e.category === category);
  }

  public clearErrors(): void {
    this.errorLogs = [];
    this.breadcrumbs = [];
  }

  public subscribe(listener: (record: ErrorLogRecord) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const globalErrorMonitoring = ErrorMonitoringService.getInstance();
