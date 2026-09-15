import { LevelSession } from './LevelSession';
import { LevelResult } from '../types/runtimeContract';
import { LevelResultSystem } from './LevelResultSystem';
import { ProgressionIntegration, ProgressionUpdateReport } from './ProgressionIntegration';
import { globalAnalytics } from '../services/AnalyticsService';

export interface CompletionPipelineOutput {
  result: LevelResult;
  progressionReport: ProgressionUpdateReport;
}

export class LevelCompletionPipeline {
  private progressionIntegration: ProgressionIntegration;

  constructor(progressionIntegration: ProgressionIntegration = new ProgressionIntegration()) {
    this.progressionIntegration = progressionIntegration;
  }

  /**
   * Executes the full completion pipeline from active session.
   */
  public execute(session: LevelSession): CompletionPipelineOutput {
    // 1. Mark session complete & stop input
    session.state.isCompleted = true;
    session.state.currentState = 'READY';
    session.endTime = Date.now();

    // 2. Calculate LevelResult
    const result = LevelResultSystem.createResult(session, true);

    // 3. Process Progression Integration
    const progressionReport = this.progressionIntegration.processLevelCompletion(result);

    // 4. Log Analytics
    globalAnalytics.logEvent('level_completed', {
      levelId: result.levelId,
      worldId: result.worldId,
      packId: result.packId,
      stars: result.stars,
      score: result.score,
      durationSeconds: result.timeUsedSeconds,
      movesUsed: result.movesUsed,
    });

    return {
      result,
      progressionReport,
    };
  }
}
