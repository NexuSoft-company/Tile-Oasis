import { GameState } from '../types/gameEngine';

export interface StateTransitionRule {
  from: GameState[];
  to: GameState;
  allowInput: boolean;
  allowBoosters: boolean;
  allowPause: boolean;
}

const TRANSITION_RULES: Record<GameState, StateTransitionRule> = {
  BOOT: {
    from: [],
    to: 'BOOT',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  LOADING: {
    from: ['BOOT', 'MAIN_MENU', 'TRANSITION', 'WIN', 'LOSE', 'COMPLETED', 'FAILED'],
    to: 'LOADING',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  MAIN_MENU: {
    from: ['BOOT', 'LOADING', 'WIN', 'LOSE', 'COMPLETED', 'FAILED', 'PAUSED', 'TRANSITION'],
    to: 'MAIN_MENU',
    allowInput: true,
    allowBoosters: false,
    allowPause: false,
  },
  LEVEL_LOADING: {
    from: ['MAIN_MENU', 'WIN', 'LOSE', 'COMPLETED', 'FAILED', 'PAUSED', 'TRANSITION', 'READY', 'LEVEL_READY', 'PLAYING', 'PLAYER_INPUT'],
    to: 'LEVEL_LOADING',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  LEVEL_READY: {
    from: ['LEVEL_LOADING', 'LOADING'],
    to: 'LEVEL_READY',
    allowInput: false,
    allowBoosters: false,
    allowPause: true,
  },
  READY: {
    from: ['LEVEL_LOADING', 'LOADING', 'LEVEL_READY'],
    to: 'READY',
    allowInput: false,
    allowBoosters: false,
    allowPause: true,
  },
  PLAYING: {
    from: ['LEVEL_READY', 'READY', 'PAUSED', 'MATCHING', 'BOOSTER_ACTIVE', 'PLAYER_INPUT', 'OBJECTIVE_CHECK', 'BOARD_UPDATE', 'MATCH_CHECK', 'MATCH_ANIMATION', 'TRAY_UPDATED'],
    to: 'PLAYING',
    allowInput: true,
    allowBoosters: true,
    allowPause: true,
  },
  PLAYER_INPUT: {
    from: ['PLAYING', 'LEVEL_READY', 'READY', 'PAUSED', 'OBJECTIVE_CHECK', 'BOARD_UPDATE', 'MATCH_CHECK', 'MATCH_ANIMATION', 'TRAY_UPDATED', 'BOOSTER_ACTIVE', 'MATCHING'],
    to: 'PLAYER_INPUT',
    allowInput: true,
    allowBoosters: true,
    allowPause: true,
  },
  TILE_SELECTED: {
    from: ['PLAYING', 'PLAYER_INPUT'],
    to: 'TILE_SELECTED',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  TILE_MOVING: {
    from: ['TILE_SELECTED', 'PLAYING', 'PLAYER_INPUT'],
    to: 'TILE_MOVING',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  TRAY_UPDATED: {
    from: ['TILE_MOVING', 'TILE_SELECTED', 'BOOSTER_ACTIVE', 'PLAYING', 'PLAYER_INPUT'],
    to: 'TRAY_UPDATED',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  MATCH_CHECK: {
    from: ['TRAY_UPDATED', 'TILE_MOVING', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'MATCH_CHECK',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  MATCH_ANIMATION: {
    from: ['MATCH_CHECK', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'MATCH_ANIMATION',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  BOARD_UPDATE: {
    from: ['MATCH_ANIMATION', 'MATCH_CHECK', 'TRAY_UPDATED', 'PLAYING', 'PLAYER_INPUT'],
    to: 'BOARD_UPDATE',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  OBJECTIVE_CHECK: {
    from: ['BOARD_UPDATE', 'MATCH_CHECK', 'TRAY_UPDATED', 'MATCH_ANIMATION', 'PLAYING', 'PLAYER_INPUT'],
    to: 'OBJECTIVE_CHECK',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  WINNING: {
    from: ['OBJECTIVE_CHECK', 'BOARD_UPDATE', 'MATCH_CHECK', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'WINNING',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  FAILING: {
    from: ['OBJECTIVE_CHECK', 'BOARD_UPDATE', 'TRAY_UPDATED', 'MATCH_CHECK', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'FAILING',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  PAUSED: {
    from: ['PLAYING', 'PLAYER_INPUT', 'MATCHING', 'BOOSTER_ACTIVE', 'LEVEL_READY', 'READY'],
    to: 'PAUSED',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  WIN: {
    from: ['WINNING', 'COMPLETED', 'OBJECTIVE_CHECK', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'WIN',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  COMPLETED: {
    from: ['WINNING', 'WIN', 'OBJECTIVE_CHECK', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'COMPLETED',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  LOSE: {
    from: ['FAILING', 'FAILED', 'OBJECTIVE_CHECK', 'TRAY_UPDATED', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'LOSE',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  FAILED: {
    from: ['FAILING', 'LOSE', 'OBJECTIVE_CHECK', 'TRAY_UPDATED', 'PLAYING', 'PLAYER_INPUT', 'MATCHING'],
    to: 'FAILED',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  MATCHING: {
    from: ['PLAYING', 'PLAYER_INPUT', 'MATCH_CHECK'],
    to: 'MATCHING',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  BOOSTER_ACTIVE: {
    from: ['PLAYING', 'PLAYER_INPUT'],
    to: 'BOOSTER_ACTIVE',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
  REWARD: {
    from: ['WIN', 'COMPLETED'],
    to: 'REWARD',
    allowInput: true,
    allowBoosters: false,
    allowPause: false,
  },
  TRANSITION: {
    from: ['PLAYING', 'PLAYER_INPUT', 'WIN', 'LOSE', 'COMPLETED', 'FAILED', 'REWARD', 'MAIN_MENU'],
    to: 'TRANSITION',
    allowInput: false,
    allowBoosters: false,
    allowPause: false,
  },
};

export class GameStateMachine {
  private currentState: GameState = 'BOOT';
  private listeners: Array<(state: GameState, prevState: GameState) => void> = [];

  constructor(initialState: GameState = 'BOOT') {
    this.currentState = initialState;
  }

  public getCurrentState(): GameState {
    return this.currentState;
  }

  public canTransitionTo(targetState: GameState): boolean {
    const rule = TRANSITION_RULES[targetState];
    if (!rule) return false;
    return rule.from.includes(this.currentState);
  }

  public transitionTo(targetState: GameState): boolean {
    if (!this.canTransitionTo(targetState)) {
      console.warn(`[GameStateMachine] Invalid state transition from ${this.currentState} to ${targetState}`);
      return false;
    }

    const prevState = this.currentState;
    this.currentState = targetState;

    this.listeners.forEach(listener => listener(targetState, prevState));
    return true;
  }

  public subscribe(listener: (state: GameState, prevState: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public canAcceptTileInput(): boolean {
    const rule = TRANSITION_RULES[this.currentState];
    return rule ? rule.allowInput : false;
  }

  public canUseBoosters(): boolean {
    const rule = TRANSITION_RULES[this.currentState];
    return rule ? rule.allowBoosters : false;
  }

  public canPause(): boolean {
    const rule = TRANSITION_RULES[this.currentState];
    return rule ? rule.allowPause : false;
  }
}
