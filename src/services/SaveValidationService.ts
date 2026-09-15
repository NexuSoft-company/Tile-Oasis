import { PlayerSaveData } from '../types/gameEngine';
import { globalErrorMonitoring } from './ErrorMonitoringService';

export interface ValidationReport {
  isValid: boolean;
  healed: boolean;
  anomaliesFound: string[];
  sanitizedData: PlayerSaveData;
}

export class SaveValidationService {
  public static validateAndSanitize(raw: any, fallbackDefault: PlayerSaveData): ValidationReport {
    const anomalies: string[] = [];
    let healed = false;

    if (!raw || typeof raw !== 'object') {
      anomalies.push('Raw save data is not a valid JSON object.');
      return {
        isValid: false,
        healed: true,
        anomaliesFound: anomalies,
        sanitizedData: { ...fallbackDefault, lastSavedTimestamp: Date.now() },
      };
    }

    const sanitized: PlayerSaveData = { ...fallbackDefault };

    // 1. Validate highestLevelUnlocked & currentLevel
    if (typeof raw.highestLevelUnlocked === 'number' && Number.isFinite(raw.highestLevelUnlocked)) {
      sanitized.highestLevelUnlocked = Math.max(1, Math.min(9999, Math.floor(raw.highestLevelUnlocked)));
      if (sanitized.highestLevelUnlocked !== raw.highestLevelUnlocked) {
        anomalies.push(`Clamped invalid highestLevelUnlocked (${raw.highestLevelUnlocked}) to ${sanitized.highestLevelUnlocked}`);
        healed = true;
      }
    } else if (raw.highestLevelUnlocked !== undefined) {
      anomalies.push('highestLevelUnlocked had non-numeric value; reset to 1.');
      sanitized.highestLevelUnlocked = 1;
      healed = true;
    }

    if (typeof raw.currentLevel === 'number' && Number.isFinite(raw.currentLevel)) {
      sanitized.currentLevel = Math.max(1, Math.min(9999, Math.floor(raw.currentLevel)));
    } else {
      sanitized.currentLevel = sanitized.highestLevelUnlocked;
      healed = true;
    }

    // 2. Validate Currencies
    if (typeof raw.coins === 'number' && Number.isFinite(raw.coins) && raw.coins >= 0) {
      sanitized.coins = Math.floor(raw.coins);
    } else {
      anomalies.push(`Invalid coins value (${raw.coins}); reset to default.`);
      sanitized.coins = fallbackDefault.coins;
      healed = true;
    }

    if (typeof raw.gems === 'number' && Number.isFinite(raw.gems) && raw.gems >= 0) {
      sanitized.gems = Math.floor(raw.gems);
    } else {
      anomalies.push(`Invalid gems value (${raw.gems}); reset to default.`);
      sanitized.gems = fallbackDefault.gems;
      healed = true;
    }

    // 3. Validate Booster Inventory
    sanitized.boosterInventory = { ...fallbackDefault.boosterInventory };
    if (raw.boosterInventory && typeof raw.boosterInventory === 'object') {
      const validKeys = ['undo', 'shuffle', 'magnet', 'extra_slot', 'freeze', 'hint', 'auto_match'];
      validKeys.forEach((k) => {
        const val = raw.boosterInventory[k];
        if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
          sanitized.boosterInventory[k as keyof typeof sanitized.boosterInventory] = Math.min(999, Math.floor(val));
        } else if (val !== undefined) {
          anomalies.push(`Invalid booster quantity for ${k}; reset to 0.`);
          sanitized.boosterInventory[k as keyof typeof sanitized.boosterInventory] = 0;
          healed = true;
        }
      });
    }

    // 4. Validate Completed Levels
    sanitized.completedLevels = {};
    let calculatedStars = 0;
    if (raw.completedLevels && typeof raw.completedLevels === 'object') {
      Object.entries(raw.completedLevels).forEach(([lvlStr, record]: [string, any]) => {
        const lvlNum = Number(lvlStr);
        if (Number.isFinite(lvlNum) && lvlNum >= 1 && lvlNum <= 9999 && record && typeof record === 'object') {
          const stars = typeof record.stars === 'number' ? Math.max(0, Math.min(3, Math.floor(record.stars))) : 0;
          const highScore = typeof record.highScore === 'number' && Number.isFinite(record.highScore) ? Math.max(0, Math.floor(record.highScore)) : 0;
          sanitized.completedLevels[lvlNum] = { stars, highScore };
          calculatedStars += stars;
        } else {
          anomalies.push(`Removed malformed completedLevel record for key "${lvlStr}".`);
          healed = true;
        }
      });
    }

    // 5. Total Stars Consistency
    sanitized.starsTotal = calculatedStars;
    if (raw.starsTotal !== undefined && raw.starsTotal !== calculatedStars) {
      anomalies.push(`Reconciled starsTotal from ${raw.starsTotal} to calculated ${calculatedStars}.`);
      healed = true;
    }

    // 6. Settings Booleans
    sanitized.soundEnabled = typeof raw.soundEnabled === 'boolean' ? raw.soundEnabled : true;
    sanitized.musicEnabled = typeof raw.musicEnabled === 'boolean' ? raw.musicEnabled : true;
    sanitized.hapticsEnabled = typeof raw.hapticsEnabled === 'boolean' ? raw.hapticsEnabled : true;
    sanitized.lastSavedTimestamp = Date.now();

    // Preserve metaProfile if present
    if (raw.metaProfile && typeof raw.metaProfile === 'object') {
      (sanitized as any).metaProfile = raw.metaProfile;
    }

    if (anomalies.length > 0) {
      globalErrorMonitoring.logError(
        'SAVE_ERROR',
        `Save data validation anomalies detected: ${anomalies.join('; ')}`,
        { anomalies, originalRaw: raw }
      );
    }

    return {
      isValid: anomalies.length === 0,
      healed,
      anomaliesFound: anomalies,
      sanitizedData: sanitized,
    };
  }
}
