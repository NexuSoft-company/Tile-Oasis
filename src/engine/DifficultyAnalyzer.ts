import { LevelDefinition, DifficultyLevel, BoardTile } from '../types/gameEngine';
import { isTileOccluded } from './TileOcclusion';
import { SimulationMetrics } from '../types/levelPipeline';

export interface DifficultyAnalysisResult {
  score: number; // 0 - 100
  label: DifficultyLevel;
  breakdown: {
    tileCountScore: number;       // Max 25 pts
    layerDepthScore: number;      // Max 20 pts
    occlusionScore: number;       // Max 20 pts
    trayPressureScore: number;    // Max 15 pts
    forcedMovePenaltyScore: number; // Max 10 pts
    choiceScarcityScore: number;  // Max 10 pts
    specialMechanicsScore?: number; // Granular bonus for frozen/chained/special obstacles
  };
}

export class DifficultyAnalyzer {
  /**
   * Calculates a granular, measurable difficulty score (0 - 100) and maps to label.
   */
  public static analyze(
    level: Partial<LevelDefinition>,
    simulation?: SimulationMetrics
  ): DifficultyAnalysisResult {
    const tiles = level.tiles || [];
    const tileCount = tiles.length;
    const trayCapacity = level.trayCapacity || 7;

    if (tileCount === 0) {
      return {
        score: 0,
        label: 'Easy',
        breakdown: {
          tileCountScore: 0,
          layerDepthScore: 0,
          occlusionScore: 0,
          trayPressureScore: 0,
          forcedMovePenaltyScore: 0,
          choiceScarcityScore: 0,
          specialMechanicsScore: 0,
        },
      };
    }

    // 1. Tile Count Factor (0 to 25 points)
    // Scale: 18 tiles = 5 pts; 90 tiles = 25 pts
    const tileCountScore = Math.min(25, Math.max(2, (tileCount / 90) * 25));

    // 2. Layer Depth Factor (0 to 20 points)
    const maxLayer = tiles.reduce((max, t) => Math.max(max, t.layer), 0);
    const layerDepthScore = Math.min(20, Math.max(2, ((maxLayer + 1) / 5) * 20));

    // 3. Occlusion Ratio Factor (0 to 20 points)
    const blockedTiles = tiles.filter(t => isTileOccluded(t, tiles));
    const occlusionRatio = blockedTiles.length / tileCount;
    const occlusionScore = Math.min(20, Math.round(occlusionRatio * 20));

    // 4. Tray Pressure Factor (0 to 15 points)
    const baseTrayPressure = (8 - Math.min(8, trayCapacity)) * 3;
    const peakTrayFactor = simulation ? (simulation.peakTrayOccupancy / trayCapacity) * 6 : 3;
    const trayPressureScore = Math.min(15, Math.max(0, Math.round(baseTrayPressure + peakTrayFactor)));

    // 5. Forced Move Ratio Factor (0 to 10 points)
    const forcedRatio = simulation ? simulation.forcedMoveRatio : 0.3;
    const forcedMovePenaltyScore = Math.min(10, Math.round(forcedRatio * 10));

    // 6. Choice Scarcity Factor (0 to 10 points)
    const initialAvailable = simulation
      ? simulation.initialAvailableMoves
      : tiles.filter(t => !isTileOccluded(t, tiles) && t.specialProperty !== 'frozen' && t.specialProperty !== 'chained').length;
    const choiceScarcityRatio = Math.max(0, 1 - Math.min(1, initialAvailable / 12));
    const choiceScarcityScore = Math.min(10, Math.round(choiceScarcityRatio * 10));

    // 7. Special Mechanics Factor (Obstacles & Multipliers)
    const frozenCount = tiles.filter(t => t.specialProperty === 'frozen').length;
    const chainedCount = tiles.filter(t => t.specialProperty === 'chained').length;
    const specialMechanicsScore = Math.min(10, (frozenCount * 1.5) + (chainedCount * 1.0));

    const totalRawScore =
      tileCountScore +
      layerDepthScore +
      occlusionScore +
      trayPressureScore +
      forcedMovePenaltyScore +
      choiceScarcityScore +
      specialMechanicsScore;

    const score = Math.max(1, Math.min(100, Math.round(totalRawScore)));

    let label: DifficultyLevel = 'Easy';
    if (score >= 91) label = 'Expert';
    else if (score >= 76) label = 'Very Hard';
    else if (score >= 61) label = 'Hard';
    else if (score >= 41) label = 'Medium';
    else if (score >= 21) label = 'Normal';
    else label = 'Easy';

    return {
      score,
      label,
      breakdown: {
        tileCountScore: Math.round(tileCountScore),
        layerDepthScore: Math.round(layerDepthScore),
        occlusionScore: Math.round(occlusionScore),
        trayPressureScore: Math.round(trayPressureScore),
        forcedMovePenaltyScore: Math.round(forcedMovePenaltyScore),
        choiceScarcityScore: Math.round(choiceScarcityScore),
        specialMechanicsScore: Math.round(specialMechanicsScore),
      },
    };
  }
}
