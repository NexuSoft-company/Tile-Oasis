import { LevelSession } from './LevelSession';
import { LevelResult } from '../types/runtimeContract';
import { LevelResultSystem } from './LevelResultSystem';
import { globalAnalytics } from '../services/AnalyticsService';

export interface FailurePipelineOutput {
  result: LevelResult;
  reason: string;
  canRetry: boolean;
  canUseBoosterRecovery: boolean;
}

export class LevelFailurePipeline {
  /**
   * Executes the full failure pipeline without corrupting player progression.
   */
  public static execute(
    session: LevelSession,
    reason: string = 'Tray Overflow'
  ): FailurePipelineOutput {
    // 1. Mark session failed & stop input
    session.state.isFailed = true;
    session.endTime = Date.now();

    // 2. Create failure result
    const result = LevelResultSystem.createResult(session, false, reason);

    // 3. Log Analytics
    globalAnalytics.logEvent('level_failed', {
      levelId: result.levelId,
      worldId: result.worldId,
      packId: result.packId,
      failureReason: reason,
      durationSeconds: result.timeUsedSeconds,
      movesUsed: result.movesUsed,
    });

    return {
      result,
      reason,
      canRetry: true,
      canUseBoosterRecovery: session.state.trayOccupancy >= session.levelDef.trayCapacity,
    };
  }
}
