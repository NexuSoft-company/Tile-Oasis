import { BoardTile } from '../types/gameEngine';
import { isTileOccluded } from './TileOcclusion';
import { SimulationMetrics } from '../types/levelPipeline';
import { SolvabilityValidator } from './SolvabilityValidator';

export class LevelSimulator {
  /**
   * Runs multi-path simulation / solver on a board layout and collects comprehensive gameplay metrics.
   */
  public static simulate(tiles: BoardTile[], trayCapacity: number = 7): SimulationMetrics {
    if (tiles.length === 0) {
      return {
        isSolvable: true,
        stepsTaken: 0,
        initialAvailableMoves: 0,
        forcedMoveCount: 0,
        forcedMoveRatio: 0,
        meaningfulMoveCount: 0,
        avgTrayOccupancy: 0,
        peakTrayOccupancy: 0,
        estimatedSolutionLength: 0,
        searchNodesVisited: 1,
      };
    }

    // Measure initial available unblocked tiles
    const initialAvailableTiles = tiles.filter(t => !isTileOccluded(t, tiles));
    const initialAvailableMoves = initialAvailableTiles.length;

    // Simulation state tracking
    let currentBoard = tiles.map(t => ({ ...t, state: 'AVAILABLE' as const }));
    let tray: { id: string; typeId: string }[] = [];
    let stepsTaken = 0;
    let forcedMoveCount = 0;
    let totalTrayOccupancySum = 0;
    let peakTrayOccupancy = 0;
    let searchNodesVisited = 0;
    const maxSteps = tiles.length * 3;

    while (currentBoard.length > 0 && stepsTaken < maxSteps) {
      searchNodesVisited++;
      stepsTaken++;

      // Unblocked available tiles on current board state
      const unoccluded = currentBoard.filter(t => !isTileOccluded(t, currentBoard));
      if (unoccluded.length === 0) {
        break; // Deadlock
      }

      // If unoccluded chained tile exists, breaking it is an option
      const chained = unoccluded.find(t => t.specialProperty === 'chained');
      if (chained && tray.length < trayCapacity) {
        currentBoard = currentBoard.map(t => {
          if (t.id === chained.id) {
            return { ...t, specialProperty: undefined, chainCount: undefined };
          }
          return t;
        });
        continue;
      }

      const availableOnBoard = unoccluded.filter(t => t.specialProperty !== 'frozen' && t.specialProperty !== 'chained');
      if (availableOnBoard.length === 0) {
        break; // All remaining unoccluded tiles are frozen and need a match to thaw
      }

      // Group unblocked tiles by typeId
      const availableByType: Record<string, BoardTile[]> = {};
      availableOnBoard.forEach(t => {
        if (!availableByType[t.typeId]) availableByType[t.typeId] = [];
        availableByType[t.typeId].push(t);
      });

      // Check candidate moves that match items already in tray
      const trayTypeCounts: Record<string, number> = {};
      tray.forEach(item => {
        trayTypeCounts[item.typeId] = (trayTypeCounts[item.typeId] || 0) + 1;
      });

      // Priority 1: Pick a tile that immediately completes a triplet in tray
      let chosenTile: BoardTile | null = null;
      for (const tile of availableOnBoard) {
        if (trayTypeCounts[tile.typeId] === 2) {
          chosenTile = tile;
          break;
        }
      }

      // Priority 2: Pick a tile that matches 1 item already in tray
      if (!chosenTile) {
        for (const tile of availableOnBoard) {
          if (trayTypeCounts[tile.typeId] === 1 && tray.length < trayCapacity) {
            chosenTile = tile;
            break;
          }
        }
      }

      // Priority 3: Pick a tile from the type that has the most available tiles on board
      if (!chosenTile) {
        if (availableOnBoard.length === 1 || Object.keys(availableByType).length === 1) {
          forcedMoveCount++;
        }
        chosenTile = availableOnBoard[0];
      }

      if (tray.length >= trayCapacity && !trayTypeCounts[chosenTile.typeId]) {
        // Tray full & cannot match
        break;
      }

      // Move chosen tile to tray
      currentBoard = currentBoard.filter(t => t.id !== chosenTile!.id);
      tray.push({ id: chosenTile.id, typeId: chosenTile.typeId });

      // Track tray metrics
      peakTrayOccupancy = Math.max(peakTrayOccupancy, tray.length);
      totalTrayOccupancySum += tray.length;

      // Evaluate triplet match in tray
      const newTrayCounts: Record<string, number> = {};
      tray.forEach(item => {
        newTrayCounts[item.typeId] = (newTrayCounts[item.typeId] || 0) + 1;
      });

      for (const [typeId, count] of Object.entries(newTrayCounts)) {
        if (count >= 3) {
          // Remove 3 tiles of this typeId
          let removed = 0;
          tray = tray.filter(item => {
            if (item.typeId === typeId && removed < 3) {
              removed++;
              return false;
            }
            return true;
          });

          // Thaw unoccluded frozen tiles upon match
          currentBoard = currentBoard.map(t => {
            if (t.specialProperty === 'frozen' && !isTileOccluded(t, currentBoard)) {
              const nextFreeze = (t.freezeLevel || 1) - 1;
              return {
                ...t,
                specialProperty: nextFreeze > 0 ? ('frozen' as const) : undefined,
                freezeLevel: nextFreeze > 0 ? nextFreeze : undefined,
              };
            }
            return t;
          });

          break;
        }
      }
    }

    let isSolvable = currentBoard.length === 0 && tray.length === 0;
    if (!isSolvable) {
      // Run exhaustive A* / BFS search via SolvabilityValidator before concluding unsolvability
      const validationReport = SolvabilityValidator.validateSolvability(tiles, trayCapacity);
      if (validationReport.solvable) {
        isSolvable = true;
      }
    }
    const avgTrayOccupancy = stepsTaken > 0 ? Math.round((totalTrayOccupancySum / stepsTaken) * 10) / 10 : 0;
    const forcedMoveRatio = stepsTaken > 0 ? Math.round((forcedMoveCount / stepsTaken) * 100) / 100 : 0;
    const meaningfulMoveCount = Math.max(1, stepsTaken - forcedMoveCount);

    return {
      isSolvable,
      stepsTaken,
      initialAvailableMoves,
      forcedMoveCount,
      forcedMoveRatio,
      meaningfulMoveCount,
      avgTrayOccupancy,
      peakTrayOccupancy,
      estimatedSolutionLength: stepsTaken,
      searchNodesVisited,
    };
  }
}
