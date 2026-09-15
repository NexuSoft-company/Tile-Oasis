import { CoreGameplayEngine } from '../engine/CoreGameplayEngine';
import { TestResult } from '../services/TestFramework';

export class TileInteractionTestFramework {
  public static runAllInteractionTests(): TestResult[] {
    const results: TestResult[] = [];
    results.push(TileInteractionTestFramework.testTileSelectionToTrayPipeline());
    results.push(TileInteractionTestFramework.testTileMatchClearsTrayAndUpdatesScore());
    return results;
  }

  public static testTileSelectionToTrayPipeline(): TestResult {
    const start = performance.now();
    try {
      let boardState: any[] = [];
      let trayState: any[] = [];

      const engine = new CoreGameplayEngine({
        levelId: 1,
        onBoardChange: (board, tray) => {
          boardState = board;
          trayState = tray;
        },
      });

      const initialBoardCount = engine.getBoardTiles().length;
      const initialTrayCount = engine.getTrayTiles().length;

      const firstTile = engine.getBoardTiles()[0];
      const res = engine.handleTileSelect(firstTile.id);

      const passed =
        res.success &&
        initialBoardCount === 18 &&
        initialTrayCount === 0 &&
        engine.getTrayTiles().length === 1 &&
        engine.getBoardTiles().length === 17;

      return {
        id: 'TEST_TILE_INTERACTION_SELECTION',
        name: 'Tile Pointer Selection & Tray Dock Entry Pipeline',
        passed,
        message: passed
          ? 'Passed: Selectable tile moves into Tray Dock and updates board/tray counts.'
          : 'Failed: Tile selection failed to update tray or board counts.',
        durationMs: Math.round(performance.now() - start),
      };
    } catch (err: any) {
      return {
        id: 'TEST_TILE_INTERACTION_SELECTION',
        name: 'Tile Pointer Selection & Tray Dock Entry Pipeline',
        passed: false,
        message: `Failed with exception: ${err?.message || err}`,
        durationMs: Math.round(performance.now() - start),
      };
    }
  }

  public static testTileMatchClearsTrayAndUpdatesScore(): TestResult {
    const start = performance.now();
    try {
      const engine = new CoreGameplayEngine({ levelId: 1 });
      const firstTile = engine.getBoardTiles()[0];

      // Select tile 1
      engine.handleTileSelect(firstTile.id);

      // Find 2 more tiles of same type
      const sameTypeTiles = engine
        .getBoardTiles()
        .filter((t) => t.typeId === firstTile.typeId);

      if (sameTypeTiles.length < 2) {
        return {
          id: 'TEST_TILE_INTERACTION_MATCHING',
          name: 'Match-3 Evaluation & Score Pipeline',
          passed: false,
          message: 'Failed: Not enough matching tiles available to test triplet match.',
          durationMs: Math.round(performance.now() - start),
        };
      }

      engine.handleTileSelect(sameTypeTiles[0].id);
      engine.handleTileSelect(sameTypeTiles[1].id);

      const scoreAfter = engine.getScore();
      const trayCountAfter = engine.getTrayTiles().length;

      const passed = scoreAfter > 0 && trayCountAfter === 0;

      return {
        id: 'TEST_TILE_INTERACTION_MATCHING',
        name: 'Match-3 Evaluation & Score Pipeline',
        passed,
        message: passed
          ? `Passed: 3 tiles matched and cleared from tray. Score updated to ${scoreAfter}.`
          : 'Failed: Tray was not cleared or score was not awarded after 3-tile match.',
        durationMs: Math.round(performance.now() - start),
      };
    } catch (err: any) {
      return {
        id: 'TEST_TILE_INTERACTION_MATCHING',
        name: 'Match-3 Evaluation & Score Pipeline',
        passed: false,
        message: `Failed with exception: ${err?.message || err}`,
        durationMs: Math.round(performance.now() - start),
      };
    }
  }
}
