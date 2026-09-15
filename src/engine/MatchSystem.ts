import { TrayTileItem, BoardTile, TrayConfiguration, SpecialTileProperty } from '../types/gameEngine';

export interface MatchSpecialEffects {
  hasGolden: boolean;
  hasBomb: boolean;
  hasRainbow: boolean;
  hasKey: boolean;
}

export interface MatchResult {
  updatedTray: TrayTileItem[];
  matchedTypeId: string | null;
  removedTrayTiles: TrayTileItem[];
  hasMatched: boolean;
  isTrayFull: boolean;
  comboCount: number;
  scoreBonus: number;
  specialEffects?: MatchSpecialEffects;
}

export class MatchSystem {
  /**
   * Inserts a tile into the tray, placing it adjacent to existing tiles of the same type.
   */
  public static insertTileToTray(
    currentTray: TrayTileItem[],
    tile: BoardTile
  ): { newTray: TrayTileItem[]; insertedIndex: number } {
    const newTray = [...currentTray];
    const lastSameTypeIndex = newTray.map(t => t.typeId).lastIndexOf(tile.typeId);

    let insertIndex = newTray.length;
    if (lastSameTypeIndex !== -1) {
      insertIndex = lastSameTypeIndex + 1;
    }

    const trayItem: TrayTileItem = {
      id: `tray_${tile.id}_${Date.now()}`,
      typeId: tile.typeId,
      sourceTileId: tile.id,
      placedAtTimestamp: Date.now(),
      specialProperty: tile.specialProperty,
    };

    newTray.splice(insertIndex, 0, trayItem);

    return { newTray, insertedIndex: insertIndex };
  }

  /**
   * Evaluates the tray for a triple match (3 matching tile types or rainbow wildcard completion).
   */
  public static evaluateTray(
    tray: TrayTileItem[],
    trayConfig: TrayConfiguration,
    currentCombo: number
  ): MatchResult {
    // 1. Separate rainbow tiles and standard tiles
    const standardTiles = tray.filter(t => t.specialProperty !== 'rainbow');
    const rainbowTiles = tray.filter(t => t.specialProperty === 'rainbow');

    const counts: Record<string, number> = {};
    standardTiles.forEach(item => {
      counts[item.typeId] = (counts[item.typeId] || 0) + 1;
    });

    let matchedTypeId: string | null = null;
    let rainbowNeeded = 0;

    // Check Priority 1: Exact 3 matching standard tiles
    for (const [typeId, count] of Object.entries(counts)) {
      if (count >= 3) {
        matchedTypeId = typeId;
        rainbowNeeded = 0;
        break;
      }
    }

    // Check Priority 2: 2 matching standard tiles + 1 rainbow tile
    if (!matchedTypeId && rainbowTiles.length >= 1) {
      for (const [typeId, count] of Object.entries(counts)) {
        if (count === 2) {
          matchedTypeId = typeId;
          rainbowNeeded = 1;
          break;
        }
      }
    }

    // Check Priority 3: 1 standard tile + 2 rainbow tiles
    if (!matchedTypeId && rainbowTiles.length >= 2) {
      for (const [typeId, count] of Object.entries(counts)) {
        if (count === 1) {
          matchedTypeId = typeId;
          rainbowNeeded = 2;
          break;
        }
      }
    }

    // Check Priority 4: 3 rainbow tiles
    if (!matchedTypeId && rainbowTiles.length >= 3) {
      matchedTypeId = rainbowTiles[0].typeId;
      rainbowNeeded = 3;
    }

    if (matchedTypeId) {
      const newCombo = currentCombo + 1;
      const removedTrayTiles: TrayTileItem[] = [];
      const standardNeeded = 3 - rainbowNeeded;
      let standardRemoved = 0;
      let rainbowRemoved = 0;

      const updatedTray: TrayTileItem[] = [];

      for (const item of tray) {
        if (item.specialProperty === 'rainbow' && rainbowRemoved < rainbowNeeded) {
          rainbowRemoved++;
          removedTrayTiles.push(item);
        } else if (item.typeId === matchedTypeId && item.specialProperty !== 'rainbow' && standardRemoved < standardNeeded) {
          standardRemoved++;
          removedTrayTiles.push(item);
        } else {
          updatedTray.push(item);
        }
      }

      // Check special modifiers on matched items
      const hasGolden = removedTrayTiles.some(t => t.specialProperty === 'golden');
      const hasBomb = removedTrayTiles.some(t => t.specialProperty === 'bomb');
      const hasRainbow = removedTrayTiles.some(t => t.specialProperty === 'rainbow');
      const hasKey = removedTrayTiles.some(t => t.specialProperty === 'key');

      let scoreMultiplier = hasGolden ? 2 : 1;
      const scoreBonus = 150 * newCombo * scoreMultiplier;

      return {
        updatedTray,
        matchedTypeId,
        removedTrayTiles,
        hasMatched: true,
        isTrayFull: false,
        comboCount: newCombo,
        scoreBonus,
        specialEffects: {
          hasGolden,
          hasBomb,
          hasRainbow,
          hasKey,
        },
      };
    }

    // No match found
    const isTrayFull = tray.length >= trayConfig.capacity;

    return {
      updatedTray: tray,
      matchedTypeId: null,
      removedTrayTiles: [],
      hasMatched: false,
      isTrayFull,
      comboCount: 0,
      scoreBonus: 0,
    };
  }
}
