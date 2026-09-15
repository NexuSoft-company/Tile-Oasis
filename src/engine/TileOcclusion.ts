import { BoardTile } from '../types/gameEngine';

export const TILE_WIDTH_UNITS = 0.95;
export const TILE_HEIGHT_UNITS = 0.95;

/**
 * Checks if a specific tile is blocked by any tile on a higher layer.
 * A tile is blocked if any tile with layer > tile.layer overlaps its bounding box on the X/Y plane.
 */
export function isTileOccluded(tile: BoardTile, allTiles: BoardTile[]): boolean {
  if (tile.state === 'IN_TRAY' || tile.state === 'REMOVED' || tile.state === 'REMOVING') {
    return false;
  }

  return allTiles.some(other => {
    // Only tiles in strictly higher layers can occlude
    if (other.layer <= tile.layer) return false;
    if (other.state === 'IN_TRAY' || other.state === 'REMOVED' || other.state === 'REMOVING') return false;

    const overlapX = Math.abs(other.x - tile.x) < TILE_WIDTH_UNITS;
    const overlapY = Math.abs(other.y - tile.y) < TILE_HEIGHT_UNITS;

    return overlapX && overlapY;
  });
}

/**
 * Updates the state of all board tiles (AVAILABLE vs BLOCKED).
 */
export function recalculateBoardTileStates(tiles: BoardTile[]): BoardTile[] {
  return tiles.map(tile => {
    if (tile.state === 'IN_TRAY' || tile.state === 'REMOVED' || tile.state === 'REMOVING' || tile.state === 'MATCHING') {
      return tile;
    }

    const blocked = isTileOccluded(tile, tiles);
    const newState = blocked ? 'BLOCKED' : 'AVAILABLE';

    if (tile.state !== newState) {
      return { ...tile, state: newState };
    }
    return tile;
  });
}
