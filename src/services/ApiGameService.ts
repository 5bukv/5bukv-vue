import type { CompareWordsResult } from '@/types/CompareWordsResult';
import type { GameData } from '@/types/GameData';
import type { ProposedLetter } from '@/types/ProposedLetter';
import type { GameServiceInterface } from './GameServiceInterface';
import { RoundStatus } from '@/enums/roundStatus';
import reduceWord from '@/libs/reduceWord';
import { ResponseStatus } from '@/enums/responseStatus';
import type { ApiResponse } from '@/types/ApiResponse';

export class ApiGameService implements GameServiceInterface {
  private readonly baseUrl: string;
  private gameId: string | null = null;

  constructor(baseUrl: string = '/v1') {
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API запрос не удался: ${response.status}`);
    }

    return response.json();
  }

  async createGame(): Promise<GameData> {
    const response = await this.fetchApi<ApiResponse<GameData>>('/games', {
      method: 'POST'
    });

    if (response.status !== ResponseStatus.SUCCESS) {
      throw new Error('Не удалось создать игру');
    }

    if (response.data?.id) {
      this.gameId = response.data.id;
    }

    return response.data!;
  }

  async getGame(gameId?: string): Promise<GameData> {
    const id = gameId || this.gameId;

    if (!id) {
      return this.createGame();
    }

    const response = await this.fetchApi<ApiResponse<GameData>>(`/games/${id}`);

    if (response.status !== ResponseStatus.SUCCESS) {
      throw new Error('Не удалось получить данные игры');
    }

    return response.data!;
  }

  async submitAttempt(
    gameId: string | null,
    proposedWord: ProposedLetter[]
  ): Promise<CompareWordsResult> {
    const id = gameId || this.gameId;

    if (!id) {
      throw new Error('ID игры не указан');
    }

    const word = reduceWord(proposedWord);

    const response = await this.fetchApi<ApiResponse<any>>(`/games/${id}/attempts`, {
      method: 'POST',
      body: JSON.stringify({ proposedWord: word })
    });

    if (response.status === ResponseStatus.NOT_FOUND) {
      return {
        status: RoundStatus.NOT_FOUND,
        proposedWord
      };
    }

    if (response.status === ResponseStatus.REPEATED) {
      return {
        status: RoundStatus.NOT_FOUND, // Используем NOT_FOUND для единообразия
        proposedWord
      };
    }

    if (!response.data) {
      throw new Error('Неверный формат ответа от API');
    }

    // Адаптируем ответ от API к нашему формату CompareWordsResult
    return {
      status: response.data.roundStatus,
      proposedWord: response.data.letters.map((item: any) => ({
        letter: item.letter,
        status: item.status
      }))
    };
  }
}
