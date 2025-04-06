import { ref } from 'vue';
import type { GameServiceInterface } from './GameServiceInterface';
import { LocalGameService } from './LocalGameService';
import { ApiGameService } from './ApiGameService';

export enum GameMode {
  LOCAL = 'LOCAL',
  API = 'API'
}

export class GameServiceFactory {
  private static instance: GameServiceFactory;
  private _mode = ref<GameMode>(GameMode.LOCAL);
  private _baseApiUrl = import.meta.env.VITE_API_URL;
  private _apiAvailable: boolean;

  private readonly localService: LocalGameService;
  private apiService: ApiGameService | null = null;
  private _currentService = ref<GameServiceInterface>(); // Делаем сервис реактивным

  private constructor() {
    this._apiAvailable = Boolean(this._baseApiUrl);
    this.localService = new LocalGameService();
    if (this._apiAvailable) {
      this.apiService = new ApiGameService(this._baseApiUrl);
    }
    this._currentService.value = this.localService; // Начальное значение
  }

  public static getInstance(): GameServiceFactory {
    if (!GameServiceFactory.instance) {
      GameServiceFactory.instance = new GameServiceFactory();
    }
    return GameServiceFactory.instance;
  }

  get mode() {
    return this._mode.value;
  }

  set mode(newMode: GameMode) {
    if (newMode === GameMode.API && !this._apiAvailable) {
      console.warn(
        'Невозможно переключиться в API режим: URL API не задан в переменной окружения VITE_API_URL'
      );
      return; // Прерываем переключение
    }

    this._mode.value = newMode;
    this._currentService.value = newMode === GameMode.LOCAL ? this.localService : this.apiService!;
  }

  get service(): GameServiceInterface {
    return this._currentService.value!;
  }

  setApiBaseUrl(url: string) {
    if (!url) {
      this._apiAvailable = false;

      // Если сейчас используется API, переключаемся на локальный сервис
      if (this._mode.value === GameMode.API) {
        console.warn('API URL был сброшен. Переключение на локальный режим.');
        this._mode.value = GameMode.LOCAL;
        this._currentService.value = this.localService;
      }

      return;
    }

    this._baseApiUrl = url;
    this.apiService = new ApiGameService(url);
    this._apiAvailable = true;

    if (this._mode.value === GameMode.API) {
      this._currentService.value = this.apiService;
    }
  }
}

// Хук для доступа к фабрике сервисов
export function useGameServiceFactory() {
  return GameServiceFactory.getInstance();
}
