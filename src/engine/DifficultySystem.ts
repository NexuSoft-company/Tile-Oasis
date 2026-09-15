import { LevelDefinition, DifficultyLevel } from '../types/gameEngine';
import { isTileOccluded } from './TileOcclusion';

export class DifficultySystem {
  /**
   * Calculates numerical difficulty score (0 to 100) and maps to DifficultyLevel label.
   */
  public static calculateDifficulty(level: Partial<LevelDefinition>): {
    score: number;
    label: DifficultyLevel;
    factors: {
      tileCountFactor: number;
      layerFactor: number;
      occlusionFactor: number;
      varietyFactor: number;
      trayCapacityFactor: number;
    };
  } {
    const tiles = level.tiles || [];
    const tileCount = tiles.length;
    if (tileCount === 0) {
      return {
        score: 0,
        label: 'Easy',
        factors: { tileCountFactor: 0, layerFactor: 0, occlusionFactor: 0, varietyFactor: 0, trayCapacityFactor: 0 },
      };
    }

    // 1. Tile Count Factor (0 - 30 points)
    const tileCountFactor = Math.min(30, (tileCount / 60) * 30);

    // 2. Layer Depth Factor (0 - 25 points)
    const maxLayer = tiles.reduce((max, t) => Math.max(max, t.layer), 0);
    const layerFactor = Math.min(25, (maxLayer / 5) * 25);

    // 3. Occlusion Ratio Factor (0 - 25 points)
    const blockedCount = tiles.filter(t => isTileOccluded(t, tiles)).length;
    const occlusionRatio = tileCount > 0 ? blockedCount / tileCount : 0;
    const occlusionFactor = occlusionRatio * 25;

    // 4. Tile Variety Factor (0 - 20 points)
    const uniqueTypes = new Set(tiles.map(t => t.typeId)).size;
    const varietyFactor = Math.min(20, (uniqueTypes / 8) * 20);

    // 5. Tray Capacity Modifier (-10 to +10 points)
    const trayCapacity = level.trayCapacity || 7;
    const trayCapacityFactor = (7 - trayCapacity) * 5; // Smaller tray increases difficulty

    const rawScore = tileCountFactor + layerFactor + occlusionFactor + varietyFactor + trayCapacityFactor;
    const score = Math.max(1, Math.min(100, Math.round(rawScore)));

    let label: DifficultyLevel = 'Easy';
    if (score >= 85) label = 'Expert';
    else if (score >= 70) label = 'Very Hard';
    else if (score >= 55) label = 'Hard';
    else if (score >= 40) label = 'Medium';
    else if (score >= 25) label = 'Normal';
    else label = 'Easy';

    return {
      score,
      label,
      factors: {
        tileCountFactor: Math.round(tileCountFactor),
        layerFactor: Math.round(layerFactor),
        occlusionFactor: Math.round(occlusionFactor),
        varietyFactor: Math.round(varietyFactor),
        trayCapacityFactor: Math.round(trayCapacityFactor),
      },
    };
  }
}
