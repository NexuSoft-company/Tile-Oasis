import { globalAnalytics } from '../services/AnalyticsService';

export type LevelErrorCode =
  | 'MISSING_LEVEL'
  | 'INVALID_LEVEL'
  | 'REJECTED_LEVEL'
  | 'UNSUPPORTED_VERSION'
  | 'MISSING_TILE_DEF'
  | 'MISSING_ASSET'
  | 'BOARD_BUILD_FAILURE'
  | 'SAVE_FAILURE'
  | 'NETWORK_SYNC_FAILURE';

export interface LevelErrorInfo {
  code: LevelErrorCode;
  levelId: number;
  message: string;
  developerDetails?: string;
  recoverable: boolean;
  fallbackLevelId?: number;
}

export class LevelErrorRecovery {
  private static errorLog: LevelErrorInfo[] = [];

  public static handleError(info: LevelErrorInfo): {
    userMessage: string;
    action: 'RETRY' | 'FALLBACK_LEVEL' | 'RETURN_TO_MAP';
    targetLevelId: number;
  } {
    this.errorLog.push(info);

    console.error(`[LevelErrorRecovery] Error ${info.code} on Level ${info.levelId}: ${info.message}`, info.developerDetails);

    globalAnalytics.logEvent('level_load_failed', {
      levelId: info.levelId,
      failureReason: `${info.code}: ${info.message}`,
    });

    let userMessage = 'Unable to start level. Returning to Level Map.';
    let action: 'RETRY' | 'FALLBACK_LEVEL' | 'RETURN_TO_MAP' = 'RETURN_TO_MAP';
    let targetLevelId = info.fallbackLevelId || 1;

    switch (info.code) {
      case 'MISSING_LEVEL':
      case 'REJECTED_LEVEL':
      case 'UNSUPPORTED_VERSION':
        userMessage = 'This level is currently unavailable. Loading standard level.';
        action = 'FALLBACK_LEVEL';
        targetLevelId = 1;
        break;
      case 'BOARD_BUILD_FAILURE':
      case 'MISSING_TILE_DEF':
      case 'MISSING_ASSET':
        userMessage = 'Board configuration error. Returning to map.';
        action = 'RETURN_TO_MAP';
        break;
      case 'SAVE_FAILURE':
        userMessage = 'Progress save failed. Retrying...';
        action = 'RETRY';
        targetLevelId = info.levelId;
        break;
    }

    return {
      userMessage,
      action,
      targetLevelId,
    };
  }

  public static getErrorLog(): LevelErrorInfo[] {
    return [...this.errorLog];
  }

  public static clearLogs(): void {
    this.errorLog = [];
  }
}
