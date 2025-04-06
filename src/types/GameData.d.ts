import { GameStatus } from '@/enums/gameStatus';
import { RoundStatus } from '@/enums/roundStatus';
import { LetterStatus } from '@/enums/letterStatus';

export type AttemptResult = {
  id?: number;
  proposedWord: string;
  letters: {
    letter: string;
    status: LetterStatus;
  }[];
  roundStatus: RoundStatus;
  createdAt?: string;
};

export type GameData = {
  id?: string;
  secretWord?: string;
  attemptsLeft: number;
  attemptsCount: number;
  attempts: AttemptResult[];
  gameStatus: GameStatus;
};
