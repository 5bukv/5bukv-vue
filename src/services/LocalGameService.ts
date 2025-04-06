import compareWords from '@/libs/compareWords';
import getRandomNumber from '@/libs/getRandomNumber';
import reduceWord from '@/libs/reduceWord';
import words from '@/data/words.json';
import { GameStatus } from '@/enums/gameStatus';
import { MAX_ROUNDS } from '@/constants/gameConfig';
import type { GameServiceInterface } from './GameServiceInterface';
import type { GameData } from '@/types/GameData';
import type { CompareWordsResult } from '@/types/CompareWordsResult';
import type { ProposedLetter } from '@/types/ProposedLetter';

export class LocalGameService implements GameServiceInterface {
  private gameData: GameData | null = null;

  async createGame(): Promise<GameData> {
    const number = getRandomNumber(0, words.length - 1);
    const secretWord = words[number];

    this.gameData = {
      attemptsLeft: MAX_ROUNDS,
      attemptsCount: 0,
      attempts: [],
      gameStatus: GameStatus.PLAYING,
      secretWord
    };

    return this.gameData;
  }

  async getGame(gameId?: string): Promise<GameData> {
    if (!this.gameData) {
      return this.createGame();
    }
    return this.gameData;
  }

  async submitAttempt(
    gameId: string | null,
    proposedWord: ProposedLetter[]
  ): Promise<CompareWordsResult> {
    if (!this.gameData || !this.gameData.secretWord) {
      throw new Error('Игра не инициализирована');
    }

    const result = compareWords(proposedWord, this.gameData.secretWord);

    if (result.status !== 'NOT_FOUND') {
      this.gameData.attemptsCount++;
      this.gameData.attemptsLeft--;
      this.gameData.attempts.push({
        proposedWord: reduceWord(proposedWord),
        letters: result.proposedWord.map((letter) => ({
          letter: letter.letter,
          status: letter.status
        })),
        roundStatus: result.status
      });

      // Обновляем статус игры
      if (result.status === 'WIN') {
        this.gameData.gameStatus = GameStatus.WIN;
      } else if (this.gameData.attemptsLeft <= 0) {
        this.gameData.gameStatus = GameStatus.LOSE;
      }
    }

    return result;
  }
}
