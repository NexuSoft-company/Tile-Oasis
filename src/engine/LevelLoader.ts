import { LevelLoaderState, RuntimeLevelDefinition } from '../types/runtimeContract';
import { RuntimeLevelRegistry } from './RuntimeLevelRegistry';
import { LevelSession } from './LevelSession';
import { TILE_TYPE_MAP } from '../data/levelDefinitions';
import { WORLD_DEFINITIONS } from '../data/worldDefinitions';

export interface LevelLoaderResult {
  success: boolean;
  state: LevelLoaderState;
  session?: LevelSession;
  error?: string;
  developerLog?: string[];
}

export class LevelLoader {
  private currentState: LevelLoaderState = 'IDLE';
  private logs: string[] = [];

  private log(msg: string): void {
    const entry = `[LevelLoader:${this.currentState}] ${msg}`;
    this.logs.push(entry);
  }

  /**
   * Complete modular level loading flow with validation and state transitions.
   */
  public async loadLevel(levelId: number): Promise<LevelLoaderResult> {
    this.logs = [];
    this.currentState = 'REQUESTING';
    this.log(`Requesting Level ${levelId}...`);

    // 1. Fetch Level from Runtime Registry
    const levelDef = RuntimeLevelRegistry.getLevel(levelId);
    if (!levelDef) {
      this.currentState = 'FAILED';
      this.log(`Error: Level ${levelId} not found in RuntimeLevelRegistry or was rejected.`);
      return {
        success: false,
        state: 'FAILED',
        error: `Level ${levelId} is unavailable or rejected.`,
        developerLog: this.logs,
      };
    }

    // 2. Validate Level
    this.currentState = 'VALIDATING';
    this.log(`Validating Level ${levelId} specifications...`);
    const valError = this.validateLevelData(levelDef);
    if (valError) {
      this.currentState = 'FAILED';
      this.log(`Validation Failed: ${valError}`);
      return {
        success: false,
        state: 'FAILED',
        error: valError,
        developerLog: this.logs,
      };
    }

    // 3. Prepare Assets
    this.currentState = 'LOADING_ASSETS';
    this.log(`Preparing asset references for ${levelDef.tiles.length} tiles...`);
    const assetError = this.prepareAssets(levelDef);
    if (assetError) {
      this.currentState = 'FAILED';
      this.log(`Asset Loading Error: ${assetError}`);
      return {
        success: false,
        state: 'FAILED',
        error: assetError,
        developerLog: this.logs,
      };
    }

    // 4. Build Board & Initialize Gameplay
    this.currentState = 'BUILDING_BOARD';
    this.log(`Building runtime board and initializing tiles...`);
    const session = new LevelSession(levelDef);

    this.currentState = 'INITIALIZING_GAMEPLAY';
    this.log(`Initializing gameplay session context...`);
    session.state.currentState = 'READY';

    this.currentState = 'READY';
    this.log(`Level ${levelId} successfully loaded and READY for gameplay!`);

    return {
      success: true,
      state: 'READY',
      session,
      developerLog: this.logs,
    };
  }

  /**
   * Detailed validation of level parameters before building board.
   */
  private validateLevelData(level: RuntimeLevelDefinition): string | null {
    // 1. Level & Version
    if (!level.version || !RuntimeLevelRegistry.SUPPORTED_VERSIONS.includes(level.version)) {
      return `Unsupported level version '${level.version}'.`;
    }

    if (level.metadata?.approvalStatus !== 'APPROVED') {
      return `Level ${level.id} status is ${level.metadata?.approvalStatus || 'UNAPPROVED'}. Runtime only accepts APPROVED levels.`;
    }

    // 2. World Existence
    const worldExists = WORLD_DEFINITIONS.some((w) => w.id === level.worldId);
    if (!worldExists) {
      return `World ID ${level.worldId} does not exist in WORLD_DEFINITIONS.`;
    }

    // 3. Tray Capacity
    if (!level.trayCapacity || level.trayCapacity < 3) {
      return `Invalid tray capacity ${level.trayCapacity}. Minimum is 3.`;
    }

    // 4. Tile Definitions
    if (!level.tiles || level.tiles.length === 0) {
      return `Level ${level.id} contains 0 tiles.`;
    }

    if (level.tiles.length % 3 !== 0) {
      return `Level tile count (${level.tiles.length}) is not divisible by 3 (triplet constraint).`;
    }

    for (const tile of level.tiles) {
      if (!TILE_TYPE_MAP[tile.typeId]) {
        return `Tile ${tile.id} uses unregistered tile typeId '${tile.typeId}'.`;
      }
    }

    return null;
  }

  /**
   * Validates asset availability.
   */
  private prepareAssets(level: RuntimeLevelDefinition): string | null {
    // Verifies all required icon / tile assets are resolvable
    for (const tile of level.tiles) {
      const def = TILE_TYPE_MAP[tile.typeId];
      if (!def || !def.icon) {
        return `Asset missing for tile type ${tile.typeId}.`;
      }
    }
    return null;
  }
}
