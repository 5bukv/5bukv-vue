import { computed, reactive, ref } from 'vue';

import useButtons from '@/composables/useButtons';
import useTooltip from '@/composables/useTooltip';
import { MAX_ROUNDS, MAX_CELLS, ERROR_ANIMATION_DELAY } from '@/constants/gameConfig';
import words from '@/data/words.json';
import { ErrorStatus } from '@/enums/errorStatus';
import { GameStatus } from '@/enums/gameStatus';
import { LetterStatus } from '@/enums/letterStatus';
import { RoundStatus } from '@/enums/roundStatus';
import { TOOLTIP_MESSAGE } from '@/enums/tooltipMessage';
import getRandomNumber from '@/libs/getRandomNumber';
import type { Cell } from '@/types/Cell';
import type { CompareWordsResult } from '@/types/CompareWordsResult';
import { useGameServiceFactory, GameMode } from '@/services/GameServiceFactory';
import type { ProposedLetter } from '@/types/ProposedLetter';

export default function useGame() {
  const gameServiceFactory = useGameServiceFactory();
  const gameService = computed(() => gameServiceFactory.service);

  const { buttons, updateButtonStatus, resetButtons } = useButtons();
  const {
    tooltip,
    preventCloseTooltip,
    getTooltipMessageByLetterStatus,
    triggerTooltip,
    hideTooltip
  } = useTooltip();

  const modal = ref(false);
  const secretWord = ref<string>('');
  const gameId = ref<string | null>(null);
  const gameStatus = ref<GameStatus>(GameStatus.PLAYING);
  const grid = ref<Cell[][]>(fillGrid());
  const round = ref<0 | 1 | 2 | 3 | 4 | 5>(0);
  const cell = ref<0 | 1 | 2 | 3 | 4>(0);
  const errorState = reactive<{ active: boolean; type: ErrorStatus | null }>({
    active: false,
    type: null
  });

  const usedWords = computed(() => {
    return grid.value
      .slice(0, round.value)
      .map((row) => row.map((cell) => cell.letter).join(''))
      .filter((word) => word.trim().length === 5);
  });

  function fillGrid() {
    return Array(MAX_ROUNDS)
      .fill(null)
      .map(() =>
        Array(MAX_CELLS)
          .fill(null)
          .map(() => ({ letter: '', status: LetterStatus.DEFAULT }))
      );
  }
  async function onStartGame() {
    grid.value = fillGrid();
    round.value = 0;
    cell.value = 0;
    gameStatus.value = GameStatus.PLAYING;
    resetButtons();

    try {
      const gameData = await gameService.value.createGame();
      gameId.value = gameData.id || null;
      if (gameData.secretWord) {
        secretWord.value = gameData.secretWord;
      }
      modal.value = false;
    } catch (error) {
      console.error('Ошибка при создании игры:', error);
      // Обработка ошибки
    }

    const number = getRandomNumber(0, words.length - 1);
    secretWord.value = words[number];
    modal.value = false;
  }
  function onInput(letter: string) {
    if (grid.value[round.value][MAX_CELLS - 1].letter) return;
    grid.value[round.value][cell.value].letter = letter.toUpperCase();
    if (cell.value < MAX_CELLS - 1) {
      cell.value += 1;
    }
  }

  function onClearLetter() {
    if (cell.value === 0) return;
    if (cell.value === MAX_CELLS - 1 && grid.value[round.value][cell.value].letter !== '') {
      grid.value[round.value][cell.value].letter = '';
      return;
    }
    cell.value -= 1;
    grid.value[round.value][cell.value].letter = '';
  }

  function checkGameStatus(result: CompareWordsResult) {
    if (result.status === RoundStatus.WIN) {
      gameStatus.value = GameStatus.WIN;
      modal.value = true;
      return true;
    }
    if (round.value === MAX_ROUNDS - 1) {
      gameStatus.value = GameStatus.LOSE;
      modal.value = true;
      return true;
    }
    return false;
  }

  function updateStatuses(currentRow: Cell[], result: CompareWordsResult) {
    currentRow.forEach((cell, index) => {
      const status = result.proposedWord[index].status;
      cell.status = status;
      updateButtonStatus(cell.letter, status);
    });
  }

  function triggerErrorAnimation(): Promise<void> {
    tooltip.show = false;
    return new Promise((resolve) => {
      errorState.active = true;
      setTimeout(() => {
        errorState.active = false;
        errorState.type = null;
        resolve();
      }, ERROR_ANIMATION_DELAY);
    });
  }

  async function onCheckWord() {
    const currentRow = grid.value[round.value];
    const word = currentRow.map((cell) => cell.letter).join('');

    if (word.length !== MAX_CELLS) return;

    if (usedWords.value.includes(word)) {
      errorState.type = ErrorStatus.REPEATED;
      await triggerErrorAnimation();
      triggerTooltip(TOOLTIP_MESSAGE.WORD_ALREADY_USED, round.value, 0);
      return;
    }

    const proposedWord: ProposedLetter[] = currentRow.map((cell) => ({
      letter: cell.letter,
      status: LetterStatus.DEFAULT
    }));

    try {
      // Отправляем попытку через сервис
      const result = await gameService.value.submitAttempt(gameId.value, proposedWord);

      if (result.status === RoundStatus.NOT_FOUND) {
        triggerTooltip(TOOLTIP_MESSAGE.INVALID_WORD, round.value, 2);
        await triggerErrorAnimation();
        return;
      }

      // Обновляем статусы клеток и кнопок
      updateStatuses(currentRow, result);

      // Проверяем результат
      if (!checkGameStatus(result)) {
        round.value += 1;
        cell.value = 0;
      }
    } catch (error) {
      console.error('Ошибка при проверке слова:', error);
      // Обработка ошибки
    }
  }

  function onCellClick(data: { status: LetterStatus; rowIndex: number; cellIndex: number }) {
    if (
      tooltip.show &&
      tooltip.position.cellIndex === data.cellIndex &&
      tooltip.position.rowIndex === data.rowIndex
    ) {
      hideTooltip();
      return;
    }
    const message = getTooltipMessageByLetterStatus(data.status);
    triggerTooltip(message, data.rowIndex, data.cellIndex);
  }

  function setGameMode(mode: GameMode) {
    gameServiceFactory.mode = mode;
  }

  // Функция для установки базового URL для API
  function setApiBaseUrl(url: string) {
    gameServiceFactory.setApiBaseUrl(url);
  }

  return {
    grid,
    modal,
    buttons,
    gameStatus,
    errorState,
    round,
    tooltip,
    preventCloseTooltip,
    onCellClick,
    hideTooltip,
    onStartGame,
    onInput,
    onClearLetter,
    onCheckWord,
    triggerTooltip,
    setGameMode,
    setApiBaseUrl,
    currentMode: computed(() => gameServiceFactory.mode)
  };
}
