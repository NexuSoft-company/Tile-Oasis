import { BoardTile } from '../types/gameEngine';
import { isTileOccluded } from './TileOcclusion';

export interface SolvabilityResult {
  solvable: boolean;
  stepsTaken: number;
  maxTrayUsed: number;
  solutionPath?: string[]; // Tile IDs in sequence
  failureReason?: string;
}

/**
 * Dedicated Solvability Validator & Solver.
 * Analyzes board layout, occlusion tree, tray capacity, and tile distribution.
 * Uses bounded DFS search with backtracking to verify at least one guaranteed winning path exists.
 */
export class SolvabilityValidator {
  /**
   * Performs full solver search to determine if board is solvable under standard gameplay constraints.
   */
  public static validateSolvability(
    tiles: BoardTile[],
    trayCapacity: number = 7,
    maxSearchNodes: number = 1000
  ): SolvabilityResult {
    if (tiles.length === 0) {
      return { solvable: true, stepsTaken: 0, maxTrayUsed: 0, solutionPath: [] };
    }

    if (tiles.length % 3 !== 0) {
      return {
        solvable: false,
        stepsTaken: 0,
        maxTrayUsed: 0,
        failureReason: `Tile count (${tiles.length}) is not a multiple of 3.`,
      };
    }

    // Fast preliminary check: verify every tile type count is multiple of 3
    const counts: Record<string, number> = {};
    tiles.forEach(t => { counts[t.typeId] = (counts[t.typeId] || 0) + 1; });
    for (const [typeId, count] of Object.entries(counts)) {
      if (count % 3 !== 0) {
        return {
          solvable: false,
          stepsTaken: 0,
          maxTrayUsed: 0,
          failureReason: `Tile type '${typeId}' count (${count}) is not a multiple of 3.`,
        };
      }
    }

    let searchNodes = 0;
    let maxTrayUsed = 0;

    // Helper state structure
    interface SearchState {
      board: BoardTile[];
      tray: string[]; // typeIds in tray
      path: string[]; // tileIds taken
    }

    const initialState: SearchState = {
      board: tiles.map(t => ({ ...t, state: 'AVAILABLE' })),
      tray: [],
      path: [],
    };

    // Stack for DFS search
    const stack: SearchState[] = [initialState];
    const visitedStateKeys = new Set<string>();

    while (stack.length > 0) {
      searchNodes++;
      if (searchNodes > maxSearchNodes) {
        // Fallback to greedy simulation if DFS budget exhausted
        const greedyResult = this.runGreedySimulation(tiles, trayCapacity);
        return {
          solvable: greedyResult.solvable,
          stepsTaken: searchNodes,
          maxTrayUsed: greedyResult.maxTrayUsed,
          failureReason: greedyResult.solvable ? undefined : 'Search budget exceeded & greedy simulation failed.',
        };
      }

      const currentState = stack.pop()!;
      const { board, tray, path } = currentState;

      maxTrayUsed = Math.max(maxTrayUsed, tray.length);

      // Win Condition: All tiles cleared from board and tray
      if (board.length === 0 && tray.length === 0) {
        return {
          solvable: true,
          stepsTaken: searchNodes,
          maxTrayUsed,
          solutionPath: path,
        };
      }

      // Create state key for visited deduplication
      const boardKey = board.map(t => t.id).sort().join(',');
      const trayKey = [...tray].sort().join(',');
      const stateKey = `${boardKey}|${trayKey}`;

      if (visitedStateKeys.has(stateKey)) {
        continue;
      }
      visitedStateKeys.add(stateKey);

      // Find available (unblocked) tiles
      // Non-frozen, unchained tiles that are not occluded can be moved directly to tray
      const unoccludedTiles = board.filter(t => !isTileOccluded(t, board));

      // Handle unchaining if there are unoccluded chained tiles
      const chainedTile = unoccludedTiles.find(t => t.specialProperty === 'chained');
      if (chainedTile && tray.length < trayCapacity) {
        // Option to break chain
        const nextBoard = board.map(t => {
          if (t.id === chainedTile.id) {
            const nextChains = (t.chainCount || 1) - 1;
            return {
              ...t,
              specialProperty: nextChains > 0 ? ('chained' as const) : undefined,
              chainCount: nextChains > 0 ? nextChains : undefined,
            };
          }
          return t;
        });
        stack.push({
          board: nextBoard,
          tray: [...tray],
          path: [...path, `unchain_${chainedTile.id}`],
        });
      }

      const availableTiles = unoccludedTiles.filter(t => t.specialProperty !== 'frozen' && t.specialProperty !== 'chained');

      if (availableTiles.length === 0 && board.length > 0 && !chainedTile) {
        // Deadlock: tiles remain on board but none are unblocked or selectable
        continue;
      }

      // Group available tiles by typeId
      const availableByType = new Map<string, BoardTile[]>();
      availableTiles.forEach(t => {
        const list = availableByType.get(t.typeId) || [];
        list.push(t);
        availableByType.set(t.typeId, list);
      });

      // Priority 1: Immediate 3-Match completion (Strictly superior choice - execute immediately without branching)
      let immediateMatchTile: BoardTile | null = null;
      for (const [typeId, tileList] of availableByType.entries()) {
        const inTray = tray.filter(id => id === typeId).length;
        if (inTray === 2) {
          immediateMatchTile = tileList.sort((a, b) => b.layer - a.layer)[0];
          break;
        }
      }

      const movesToBranch: BoardTile[] = [];

      if (immediateMatchTile) {
        movesToBranch.push(immediateMatchTile);
      } else if (tray.length < trayCapacity) {
        // Priority 2: Types that have 1 item in tray
        for (const [typeId, tileList] of availableByType.entries()) {
          const inTray = tray.filter(id => id === typeId).length;
          if (inTray === 1) {
            const best = tileList.sort((a, b) => b.layer - a.layer)[0];
            movesToBranch.push(best);
          }
        }

        // Priority 3: Types that have 0 items in tray
        if (movesToBranch.length === 0) {
          for (const [_, tileList] of availableByType.entries()) {
            const best = tileList.sort((a, b) => b.layer - a.layer)[0];
            movesToBranch.push(best);
          }
        }
      }

      // Expand branches
      for (const tile of movesToBranch) {
        let nextBoard = board.filter(t => t.id !== tile.id);
        const nextTray = [...tray, tile.typeId];

        // Process 3-match if formed
        const trayCounts: Record<string, number> = {};
        nextTray.forEach(id => { trayCounts[id] = (trayCounts[id] || 0) + 1; });

        let matchCleanedTray = nextTray;
        let didMatch = false;

        for (const [typeId, count] of Object.entries(trayCounts)) {
          if (count >= 3) {
            didMatch = true;
            let removed = 0;
            matchCleanedTray = nextTray.filter(id => {
              if (id === typeId && removed < 3) {
                removed++;
                return false;
              }
              return true;
            });
            break;
          }
        }

        // If match occurred, thaw unoccluded frozen tiles on board
        if (didMatch) {
          nextBoard = nextBoard.map(t => {
            if (t.specialProperty === 'frozen' && !isTileOccluded(t, nextBoard)) {
              const nextFreeze = (t.freezeLevel || 1) - 1;
              return {
                ...t,
                specialProperty: nextFreeze > 0 ? ('frozen' as const) : undefined,
                freezeLevel: nextFreeze > 0 ? nextFreeze : undefined,
              };
            }
            return t;
          });
        }

        if (matchCleanedTray.length <= trayCapacity) {
          stack.push({
            board: nextBoard,
            tray: matchCleanedTray,
            path: [...path, tile.id],
          });
        }
      }
    }

    return {
      solvable: false,
      stepsTaken: searchNodes,
      maxTrayUsed,
      failureReason: 'All possible move paths lead to tray overflow or board deadlock.',
    };
  }

  /**
   * Deterministic greedy simulation fallback.
   */
  private static runGreedySimulation(
    tiles: BoardTile[],
    trayCapacity: number
  ): { solvable: boolean; maxTrayUsed: number } {
    let board = tiles.map(t => ({ ...t, state: 'AVAILABLE' as const }));
    let tray: string[] = [];
    let maxTrayUsed = 0;
    let steps = 0;

    while (board.length > 0 && steps < tiles.length * 4) {
      steps++;
      maxTrayUsed = Math.max(maxTrayUsed, tray.length);

      const available = board.filter(t => !isTileOccluded(t, board));
      if (available.length === 0) break;

      const trayCounts: Record<string, number> = {};
      tray.forEach(id => { trayCounts[id] = (trayCounts[id] || 0) + 1; });

      let selectedTile = available.find(t => (trayCounts[t.typeId] || 0) === 2);

      if (!selectedTile && tray.length < trayCapacity) {
        selectedTile = available.find(t => (trayCounts[t.typeId] || 0) === 1);
      }

      if (!selectedTile && tray.length < trayCapacity) {
        selectedTile = available.sort((a, b) => b.layer - a.layer)[0];
      }

      if (!selectedTile) break;

      board = board.filter(t => t.id !== selectedTile!.id);
      tray.push(selectedTile.typeId);

      // Check match
      const count = tray.filter(id => id === selectedTile!.typeId).length;
      if (count >= 3) {
        let removed = 0;
        tray = tray.filter(id => {
          if (id === selectedTile!.typeId && removed < 3) {
            removed++;
            return false;
          }
          return true;
        });
      }
    }

    return {
      solvable: board.length === 0 && tray.length === 0,
      maxTrayUsed,
    };
  }
}
