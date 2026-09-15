import { PlayerSaveData } from '../types/gameEngine';
import { SaveValidationService } from './SaveValidationService';
import { globalErrorMonitoring } from './ErrorMonitoringService';

const SAVE_KEY = 'tile_oasis_player_save_v1';

export const DEFAULT_SAVE: PlayerSaveData = {
  currentLevel: 1,
  highestLevelUnlocked: 1,
  coins: 250,
  gems: 20,
  starsTotal: 0,
  boosterInventory: {
    undo: 3,
    shuffle: 2,
    magnet: 2,
    extra_slot: 1,
    freeze: 0,
    hint: 2,
    auto_match: 1,
  },
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  lastSavedTimestamp: Date.now(),
  completedLevels: {},
};

export interface ISaveService {
  loadSave(): PlayerSaveData;
  getSaveData?(): PlayerSaveData;
  saveData(data: Partial<PlayerSaveData>): boolean;
  completeLevel(levelId: number, stars: number, score: number): boolean;
  resetSave(): void;
  getDefaultSave?(): PlayerSaveData;
}

export class LocalSaveService implements ISaveService {
  private memoryStore: PlayerSaveData | null = null;

  public getDefaultSave(): PlayerSaveData {
    return { ...DEFAULT_SAVE };
  }

  public loadSave(): PlayerSaveData {
    if (typeof window === 'undefined' || !window.localStorage) {
      const source = this.memoryStore ? { ...this.memoryStore } : { ...DEFAULT_SAVE };
      return SaveValidationService.validateAndSanitize(source, DEFAULT_SAVE).sanitizedData;
    }

    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        const source = this.memoryStore ? { ...this.memoryStore } : { ...DEFAULT_SAVE };
        return SaveValidationService.validateAndSanitize(source, DEFAULT_SAVE).sanitizedData;
      }
      const parsed = JSON.parse(raw);
      const report = SaveValidationService.validateAndSanitize(parsed, DEFAULT_SAVE);
      if (report.healed) {
        // Auto-heal stored corrupted record
        this.saveData(report.sanitizedData);
      }
      return report.sanitizedData;
    } catch (e: any) {
      globalErrorMonitoring.logError('SAVE_ERROR', `Failed to parse localStorage save: ${e?.message || e}`, { error: e });
      const source = this.memoryStore ? { ...this.memoryStore } : { ...DEFAULT_SAVE };
      return SaveValidationService.validateAndSanitize(source, DEFAULT_SAVE).sanitizedData;
    }
  }

  public getSaveData(): PlayerSaveData {
    return this.loadSave();
  }

  public completeLevel(levelId: number, stars: number, score: number): boolean {
    const save = this.loadSave();
    const existing = save.completedLevels[levelId] || { stars: 0, highScore: 0 };
    const newStars = Math.max(existing.stars, stars);
    const newScore = Math.max(existing.highScore, score);

    const completedLevels = {
      ...save.completedLevels,
      [levelId]: { stars: newStars, highScore: newScore },
    };

    const totalStars = Object.values(completedLevels).reduce((sum, lvl) => sum + (lvl.stars || 0), 0);
    const highestLevelUnlocked = Math.min(9999, Math.max(save.highestLevelUnlocked, levelId + 1));

    return this.saveData({
      completedLevels,
      starsTotal: totalStars,
      highestLevelUnlocked,
    });
  }

  public saveData(data: Partial<PlayerSaveData>): boolean {
    const current = this.loadSave();
    const candidate: PlayerSaveData = {
      ...current,
      ...data,
      lastSavedTimestamp: Date.now(),
    };

    const validated = SaveValidationService.validateAndSanitize(candidate, DEFAULT_SAVE).sanitizedData;
    this.memoryStore = validated;

    if (typeof window === 'undefined' || !window.localStorage) {
      return true;
    }

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(validated));
      return true;
    } catch (e: any) {
      globalErrorMonitoring.logError('SAVE_ERROR', `Failed to persist data to localStorage: ${e?.message || e}`, { error: e });
      return false;
    }
  }

  public resetSave(): void {
    this.memoryStore = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(SAVE_KEY);
    }
  }
}

export const globalSaveService = new LocalSaveService();

