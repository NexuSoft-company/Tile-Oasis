import { RuntimeLevelDefinition, RuntimeTileData } from '../types/runtimeContract';
import { RuntimeTile } from './RuntimeTile';
import { isTileOccluded } from './TileOcclusion';

export interface BoardBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  maxLayer: number;
}

export interface RuntimeBoardBuildResult {
  runtimeTiles: RuntimeTile[];
  bounds: BoardBounds;
  totalTilesCount: number;
  availableTilesCount: number;
  blockedTilesCount: number;
}

export class RuntimeBoardBuilder {
  /**
   * Instantiates approved level data into runtime gameplay objects.
   * STRICT SEPARATION: Does NOT generate levels; only instantiates approved definitions.
   */
  public static buildBoard(level: RuntimeLevelDefinition): RuntimeBoardBuildResult {
    const rawTiles = level.tiles || [];
    if (rawTiles.length === 0) {
      return {
        runtimeTiles: [],
        bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, maxLayer: 0 },
        totalTilesCount: 0,
        availableTilesCount: 0,
        blockedTilesCount: 0,
      };
    }

    // 1. Create RuntimeTile instances
    const runtimeTiles = rawTiles.map((tile, index) => new RuntimeTile(tile, `rt_${level.id}_${index}`));

    // 2. Compute initial occlusion & tile state
    let availableCount = 0;
    let blockedCount = 0;

    runtimeTiles.forEach((tile) => {
      const occluded = isTileOccluded(
        { id: tile.contentTileId, typeId: tile.typeId, x: tile.x, y: tile.y, layer: tile.layer, state: 'AVAILABLE' },
        rawTiles
      );

      tile.setBlocked(occluded);
      if (occluded) {
        blockedCount++;
      } else {
        tile.transitionTo('AVAILABLE');
        availableCount++;
      }
    });

    // 3. Calculate board bounds
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let maxLayer = 0;

    runtimeTiles.forEach((tile) => {
      minX = Math.min(minX, tile.x);
      maxX = Math.max(maxX, tile.x);
      minY = Math.min(minY, tile.y);
      maxY = Math.max(maxY, tile.y);
      maxLayer = Math.max(maxLayer, tile.layer);
    });

    const bounds: BoardBounds = {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      maxLayer,
    };

    return {
      runtimeTiles,
      bounds,
      totalTilesCount: runtimeTiles.length,
      availableTilesCount: availableCount,
      blockedTilesCount: blockedCount,
    };
  }
}
