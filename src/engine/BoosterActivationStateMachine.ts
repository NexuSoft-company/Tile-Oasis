import { BoosterType } from '../types/gameEngine';

export type BoosterState =
  | 'AVAILABLE'
  | 'SELECTED'
  | 'VALIDATING'
  | 'ACTIVATING'
  | 'SUCCESS'
  | 'CONSUMED'
  | 'INVALID'
  | 'UNAVAILABLE'
  | 'NO_TARGET'
  | 'WRONG_STATE'
  | 'INSUFFICIENT_INVENTORY'
  | 'ACTIVATION_FAILED';

export interface BoosterStateTransitionResult {
  success: boolean;
  previousState: BoosterState;
  currentState: BoosterState;
  reason?: string;
}

export class BoosterActivationStateMachine {
  private currentState: BoosterState = 'AVAILABLE';
  private boosterId: BoosterType;

  constructor(boosterId: BoosterType) {
    this.boosterId = boosterId;
  }

  public getCurrentState(): BoosterState {
    return this.currentState;
  }

  public getBoosterId(): BoosterType {
    return this.boosterId;
  }

  public transitionTo(newState: BoosterState, reason?: string): BoosterStateTransitionResult {
    const prevState = this.currentState;

    // Transition matrix rules
    const allowedTransitions: Record<BoosterState, BoosterState[]> = {
      AVAILABLE: ['SELECTED', 'UNAVAILABLE', 'WRONG_STATE', 'INSUFFICIENT_INVENTORY'],
      SELECTED: ['VALIDATING', 'AVAILABLE', 'INVALID'],
      VALIDATING: ['ACTIVATING', 'NO_TARGET', 'WRONG_STATE', 'INSUFFICIENT_INVENTORY', 'INVALID'],
      ACTIVATING: ['SUCCESS', 'ACTIVATION_FAILED'],
      SUCCESS: ['CONSUMED'],
      CONSUMED: ['AVAILABLE'],
      INVALID: ['AVAILABLE'],
      UNAVAILABLE: ['AVAILABLE'],
      NO_TARGET: ['AVAILABLE'],
      WRONG_STATE: ['AVAILABLE'],
      INSUFFICIENT_INVENTORY: ['AVAILABLE'],
      ACTIVATION_FAILED: ['AVAILABLE'],
    };

    const validTargets = allowedTransitions[prevState] || [];
    if (!validTargets.includes(newState)) {
      return {
        success: false,
        previousState: prevState,
        currentState: this.currentState,
        reason: `Invalid transition from ${prevState} to ${newState}`,
      };
    }

    this.currentState = newState;
    return {
      success: true,
      previousState: prevState,
      currentState: this.currentState,
      reason,
    };
  }

  public reset(): void {
    this.currentState = 'AVAILABLE';
  }
}
