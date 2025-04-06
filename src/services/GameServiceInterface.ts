import type { CompareWordsResult } from '@/types/CompareWordsResult';
import type { GameData } from '@/types/GameData';
import type { ProposedLetter } from '@/types/ProposedLetter';

export interface GameServiceInterface {
  createGame(): Promise<GameData>;
  getGame(gameId: string): Promise<GameData>;
  submitAttempt(gameId: string | null, proposedWord: ProposedLetter[]): Promise<CompareWordsResult>;
}
