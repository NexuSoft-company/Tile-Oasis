import { BoardTile, TileCategory, SpecialTileProperty } from '../types/gameEngine';
import { RuntimeTileData, RuntimeTileLifecycleState } from '../types/runtimeContract';
import { TILE_TYPE_MAP, ALL_TILE_TYPES } from '../data/levelDefinitions';

export class RuntimeTile implements RuntimeTileData {
  public runtimeId: string;
  public contentTileId: string;
  public typeId: string;
  public category: TileCategory;
  public x: number;
  public y: number;
  public layer: number;
  public state: RuntimeTileLifecycleState;
  public specialProperty?: SpecialTileProperty;
  public chainCount?: number;
  public freezeLevel?: number;
  public isBlocked: boolean;
  public isLocked: boolean;
  public isDisabled: boolean;
  public isHidden: boolean;
  public visualIcon: string;
  public visualName: string;
  public colorGradient: string;

  constructor(contentTile: BoardTile, runtimePrefix: string = 'rt') {
    this.contentTileId = contentTile.id;
    this.runtimeId = `${runtimePrefix}_${contentTile.id}`;
    this.typeId = contentTile.typeId;

    const tileDef = TILE_TYPE_MAP[contentTile.typeId] || ALL_TILE_TYPES[0];
    this.category = tileDef.category;
    this.visualIcon = tileDef.icon;
    this.visualName = tileDef.name;
    this.colorGradient = tileDef.colorGradient;

    this.x = contentTile.x;
    this.y = contentTile.y;
    this.layer = contentTile.layer;
    this.specialProperty = contentTile.specialProperty;
    this.chainCount = contentTile.chainCount;
    this.freezeLevel = contentTile.freezeLevel;

    this.state = 'CREATED';
    this.isBlocked = false;
    this.isLocked = (contentTile.chainCount !== undefined && contentTile.chainCount > 0) || contentTile.state === 'LOCKED';
    this.isDisabled = false;
    this.isHidden = false;
  }

  /**
   * Safe lifecycle state transition method.
   */
  public transitionTo(newState: RuntimeTileLifecycleState): void {
    const validTransitions: Record<RuntimeTileLifecycleState, RuntimeTileLifecycleState[]> = {
      CREATED: ['AVAILABLE', 'BLOCKED', 'LOCKED', 'DISABLED', 'HIDDEN'],
      AVAILABLE: ['SELECTED', 'BLOCKED', 'LOCKED', 'DISABLED', 'HIDDEN'],
      BLOCKED: ['AVAILABLE', 'LOCKED', 'DISABLED'],
      LOCKED: ['AVAILABLE', 'BLOCKED'],
      SELECTED: ['MOVING', 'AVAILABLE', 'IN_TRAY'],
      MOVING: ['IN_TRAY', 'AVAILABLE'],
      IN_TRAY: ['MATCHED', 'AVAILABLE', 'REMOVED'],
      MATCHED: ['REMOVED'],
      REMOVED: [],
      DISABLED: ['AVAILABLE', 'BLOCKED'],
      HIDDEN: ['AVAILABLE', 'BLOCKED'],
    };

    if (validTransitions[this.state]?.includes(newState) || newState === this.state) {
      this.state = newState;
    } else {
      console.warn(
        `[RuntimeTile] Warning: Invalid tile state transition for ${this.runtimeId} from ${this.state} -> ${newState}`
      );
      this.state = newState; // Enforce state transition safely
    }
  }

  /**
   * Updates tile occlusion blocked flag.
   */
  public setBlocked(blocked: boolean): void {
    this.isBlocked = blocked;
    if (this.state === 'AVAILABLE' && blocked) {
      this.state = 'BLOCKED';
    } else if (this.state === 'BLOCKED' && !blocked) {
      this.state = 'AVAILABLE';
    }
  }

  public toBoardTile(): BoardTile {
    return {
      id: this.contentTileId,
      typeId: this.typeId,
      x: this.x,
      y: this.y,
      layer: this.layer,
      state: this.state as any,
      specialProperty: this.specialProperty,
      chainCount: this.chainCount,
      freezeLevel: this.freezeLevel,
    };
  }
}
