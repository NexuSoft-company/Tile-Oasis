export class ScoreSystem {
  private currentScore: number = 0;
  private currentCombo: number = 0;

  constructor(initialScore: number = 0) {
    this.currentScore = initialScore;
  }

  public getScore(): number {
    return this.currentScore;
  }

  public getCombo(): number {
    return this.currentCombo;
  }

  public resetCombo(): void {
    this.currentCombo = 0;
  }

  public addMatchScore(): { scoreAdded: number; newCombo: number } {
    this.currentCombo++;
    const baseMatchPoints = 150;
    const comboMultiplier = Math.min(this.currentCombo, 10);
    const scoreAdded = baseMatchPoints * comboMultiplier;

    this.currentScore += scoreAdded;

    return {
      scoreAdded,
      newCombo: this.currentCombo,
    };
  }

  public addBoosterBonus(bonusPoints: number): void {
    this.currentScore += bonusPoints;
  }

  public calculateFinalStars(score: number, starRules: { oneStarScore: number; twoStarsScore: number; threeStarsScore: number }): number {
    if (score >= starRules.threeStarsScore) return 3;
    if (score >= starRules.twoStarsScore) return 2;
    if (score >= starRules.oneStarScore) return 1;
    return 1; // Minimum 1 star for completion
  }
}
