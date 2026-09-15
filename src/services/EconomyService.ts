import { BoosterType } from '../types/gameEngine';
import { ISaveService, globalSaveService } from './SaveService';

export interface IEconomyService {
  getCoins(): number;
  getGems(): number;
  getBoosterCount(booster: BoosterType): number;
  addCoins(amount: number): void;
  deductCoins(amount: number): boolean;
  addGems(amount: number): void;
  deductGems(amount: number): boolean;
  addBooster(booster: BoosterType, count: number): void;
  consumeBooster(booster: BoosterType): boolean;
  setBoosterQuantity(booster: BoosterType, count: number): void;
}

export class LocalEconomyService implements IEconomyService {
  private saveService: ISaveService;

  constructor(saveService: ISaveService = globalSaveService) {
    this.saveService = saveService;
  }

  public getCoins(): number {
    return this.saveService.loadSave().coins;
  }

  public getGems(): number {
    return this.saveService.loadSave().gems;
  }

  public getBoosterCount(booster: BoosterType): number {
    const save = this.saveService.loadSave();
    return save.boosterInventory ? (save.boosterInventory[booster] ?? 0) : 0;
  }

  public addCoins(amount: number): void {
    if (amount <= 0) return;
    const save = this.saveService.loadSave();
    this.saveService.saveData({ coins: save.coins + amount });
  }

  public deductCoins(amount: number): boolean {
    if (amount <= 0) return false;
    const save = this.saveService.loadSave();
    if (save.coins >= amount) {
      this.saveService.saveData({ coins: save.coins - amount });
      return true;
    }
    return false;
  }

  public addGems(amount: number): void {
    if (amount <= 0) return;
    const save = this.saveService.loadSave();
    this.saveService.saveData({ gems: save.gems + amount });
  }

  public deductGems(amount: number): boolean {
    if (amount <= 0) return false;
    const save = this.saveService.loadSave();
    if (save.gems >= amount) {
      this.saveService.saveData({ gems: save.gems - amount });
      return true;
    }
    return false;
  }

  public addBooster(booster: BoosterType, count: number): void {
    if (count <= 0) return;
    const save = this.saveService.loadSave();
    const inv = { ...save.boosterInventory };
    inv[booster] = (inv[booster] || 0) + count;
    this.saveService.saveData({ boosterInventory: inv });
  }

  public consumeBooster(booster: BoosterType): boolean {
    const save = this.saveService.loadSave();
    const inv = { ...save.boosterInventory };
    const current = inv[booster] || 0;
    if (current > 0) {
      inv[booster] = current - 1;
      this.saveService.saveData({ boosterInventory: inv });
      return true;
    }
    return false;
  }

  public setBoosterQuantity(booster: BoosterType, count: number): void {
    const save = this.saveService.loadSave();
    const inv = { ...save.boosterInventory };
    inv[booster] = Math.max(0, count);
    this.saveService.saveData({ boosterInventory: inv });
  }
}

