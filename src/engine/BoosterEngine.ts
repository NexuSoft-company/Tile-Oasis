import { BoardTile, TrayTileItem, BoosterType, BoosterConfig } from '../types/gameEngine';
import { isTileOccluded } from './TileOcclusion';

export interface BoosterExecutionResult {
  success: boolean;
  message: string;
  updatedBoardTiles: BoardTile[];
  updatedTrayTiles: TrayTileItem[];
  scoreGained: number;
}

export interface IBooster {
  id: BoosterType;
  config: BoosterConfig;
  canExecute(boardTiles: BoardTile[], trayTiles: TrayTileItem[], moveHistoryCount: number): boolean;
  execute(boardTiles: BoardTile[], trayTiles: TrayTileItem[], moveHistory: any[]): BoosterExecutionResult;
}

export class UndoBooster implements IBooster {
  id: BoosterType = 'undo';
  config: BoosterConfig = {
    id: 'undo',
    name: 'Undo Move',
    description: 'Returns the last selected tile from the tray back to its board position.',
    coinCost: 50,
    gemCost: 5,
    inventoryCount: 3,
    maxUsesPerLevel: 5,
  };

  canExecute(boardTiles: BoardTile[], trayTiles: TrayTileItem[], moveHistoryCount: number): boolean {
    return moveHistoryCount > 0 && trayTiles.length > 0;
  }

  execute(boardTiles: BoardTile[], trayTiles: TrayTileItem[], moveHistory: any[]): BoosterExecutionResult {
    if (moveHistory.length === 0 || trayTiles.length === 0) {
      return { success: false, message: 'No move available to undo.', updatedBoardTiles: boardTiles, updatedTrayTiles: trayTiles, scoreGained: 0 };
    }

    const lastAction = moveHistory[moveHistory.length - 1];
    const restoredTile: BoardTile = {
      ...lastAction.tile,
      state: 'AVAILABLE',
    };

    // Remove from tray
    const updatedTray = trayTiles.filter(t => t.sourceTileId !== restoredTile.id && t.id !== lastAction.trayItemId);
    // Add back to board
    const updatedBoard = [...boardTiles, restoredTile];

    return {
      success: true,
      message: 'Last move undone successfully.',
      updatedBoardTiles: updatedBoard,
      updatedTrayTiles: updatedTray,
      scoreGained: 0,
    };
  }
}

export class ShuffleBooster implements IBooster {
  id: BoosterType = 'shuffle';
  config: BoosterConfig = {
    id: 'shuffle',
    name: 'Board Shuffle',
    description: 'Shuffles the positions and types of remaining board tiles while preserving layout integrity.',
    coinCost: 75,
    gemCost: 8,
    inventoryCount: 2,
    maxUsesPerLevel: 3,
  };

  canExecute(boardTiles: BoardTile[]): boolean {
    return boardTiles.length > 1;
  }

  execute(boardTiles: BoardTile[], trayTiles: TrayTileItem[]): BoosterExecutionResult {
    if (boardTiles.length <= 1) {
      return { success: false, message: 'Not enough tiles to shuffle.', updatedBoardTiles: boardTiles, updatedTrayTiles: trayTiles, scoreGained: 0 };
    }

    // Extract type IDs and shuffle them
    const typePool = boardTiles.map(t => t.typeId);
    for (let i = typePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [typePool[i], typePool[j]] = [typePool[j], typePool[i]];
    }

    const updatedBoard = boardTiles.map((tile, idx) => ({
      ...tile,
      typeId: typePool[idx],
    }));

    return {
      success: true,
      message: 'Board tiles shuffled.',
      updatedBoardTiles: updatedBoard,
      updatedTrayTiles: trayTiles,
      scoreGained: 0,
    };
  }
}

export class MagnetBooster implements IBooster {
  id: BoosterType = 'magnet';
  config: BoosterConfig = {
    id: 'magnet',
    name: 'Magnet Match',
    description: 'Instantly pulls 3 matching tiles from the board and tray to complete a match.',
    coinCost: 100,
    gemCost: 10,
    inventoryCount: 2,
    maxUsesPerLevel: 3,
  };

  canExecute(boardTiles: BoardTile[], trayTiles: TrayTileItem[]): boolean {
    const allTypes = [...boardTiles.map(t => t.typeId), ...trayTiles.map(t => t.typeId)];
    const counts: Record<string, number> = {};
    allTypes.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    const hasRainbow = boardTiles.some(t => t.specialProperty === 'rainbow') || trayTiles.some(t => t.specialProperty === 'rainbow');
    return Object.values(counts).some(c => c >= (hasRainbow ? 2 : 3));
  }

  execute(boardTiles: BoardTile[], trayTiles: TrayTileItem[]): BoosterExecutionResult {
    const allTypes = [...boardTiles.map(t => t.typeId), ...trayTiles.map(t => t.typeId)];
    const counts: Record<string, number> = {};
    allTypes.forEach(t => { counts[t] = (counts[t] || 0) + 1; });

    // Prioritize tiles that already exist in the tray first
    const trayTypes = trayTiles.map(t => t.typeId);
    let targetTypeId = trayTypes.find(t => (counts[t] || 0) >= 3);

    if (!targetTypeId) {
      targetTypeId = Object.keys(counts).find(typeId => counts[typeId] >= 3);
    }

    if (!targetTypeId) {
      return { success: false, message: 'No candidate triplet available for Magnet.', updatedBoardTiles: boardTiles, updatedTrayTiles: trayTiles, scoreGained: 0 };
    }

    let needed = 3;

    // First remove from tray if matching
    const updatedTray = trayTiles.filter(t => {
      if (t.typeId === targetTypeId && needed > 0) {
        needed--;
        return false;
      }
      return true;
    });

    // Remove remaining needed from board (prefer unblocked top layer)
    const boardCandidates = boardTiles
      .filter(t => t.typeId === targetTypeId)
      .sort((a, b) => b.layer - a.layer);

    const idsToRemove = new Set(boardCandidates.slice(0, needed).map(t => t.id));
    const updatedBoard = boardTiles.filter(t => !idsToRemove.has(t.id));

    return {
      success: true,
      message: 'Magnet pulled and matched 3 tiles!',
      updatedBoardTiles: updatedBoard,
      updatedTrayTiles: updatedTray,
      scoreGained: 300,
    };
  }
}

export class ExtraSlotBooster implements IBooster {
  id: BoosterType = 'extra_slot';
  config: BoosterConfig = {
    id: 'extra_slot',
    name: 'Extra Tray Slot',
    description: 'Temporarily unlocks +1 tray slot for the current level session.',
    coinCost: 120,
    gemCost: 12,
    inventoryCount: 1,
    maxUsesPerLevel: 2,
  };

  canExecute(boardTiles: BoardTile[], trayTiles: TrayTileItem[], moveHistoryCount: number, currentTrayCapacity: number = 7): boolean {
    return currentTrayCapacity < 9;
  }

  execute(boardTiles: BoardTile[], trayTiles: TrayTileItem[]): BoosterExecutionResult {
    return {
      success: true,
      message: 'Extra tray slot unlocked for current level!',
      updatedBoardTiles: boardTiles,
      updatedTrayTiles: trayTiles,
      scoreGained: 0,
    };
  }
}

export const BOOSTER_STRATEGIES: Record<string, IBooster> = {
  undo: new UndoBooster(),
  shuffle: new ShuffleBooster(),
  magnet: new MagnetBooster(),
  extra_slot: new ExtraSlotBooster(),
};

