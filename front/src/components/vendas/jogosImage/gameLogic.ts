export type Gender = 'homem' | 'mulher' | null;

export type Prize = {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};

export const gameData: Prize[] = [
  { option: '💝 Vale Night', style: { backgroundColor: '#FF1493', textColor: 'white' } },
  { option: '💆‍♂️ Massagem', style: { backgroundColor: '#9400D3', textColor: 'white' } },
  { option: '👗 Fantasia', style: { backgroundColor: '#FF69B4', textColor: 'white' } },
  { option: '🌹 Surpresa', style: { backgroundColor: '#8B008B', textColor: 'white' } },
  { option: '🛁 Banho Juntos', style: { backgroundColor: '#FF1493', textColor: 'white' } },
  { option: '☕ Café na Cama', style: { backgroundColor: '#9400D3', textColor: 'white' } },
  { option: '💆‍♀️ Spa Day', style: { backgroundColor: '#FF69B4', textColor: 'white' } },
  { option: '🍷 Jantar', style: { backgroundColor: '#8B008B', textColor: 'white' } },
];

export class GameController {
  private currentPrize: number = 0;
  private currentGender: Gender = null;
  private isSpinning: boolean = false;

  constructor() {}

  public selectGender(gender: Gender): void {
    this.currentGender = gender;
  }

  public selectRandomGender(): Gender {
    this.currentGender = Math.random() < 0.5 ? 'homem' : 'mulher';
    return this.currentGender;
  }

  public spin(): number {
    if (!this.currentGender || this.isSpinning) {
      return -1;
    }

    this.isSpinning = true;
    this.currentPrize = Math.floor(Math.random() * gameData.length);
    return this.currentPrize;
  }

  public stopSpinning(): void {
    this.isSpinning = false;
  }

  public reset(): void {
    this.currentGender = null;
    this.isSpinning = false;
    this.currentPrize = 0;
  }

  public getCurrentPrize(): Prize | null {
    return this.isSpinning ? null : gameData[this.currentPrize];
  }

  public getSelectedGender(): Gender {
    return this.currentGender;
  }

  public isCurrentlySpinning(): boolean {
    return this.isSpinning;
  }
} 