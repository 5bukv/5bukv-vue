import words from '@/data/words.json';

import { computed, reactive, ref } from 'vue';

import type { Cell } from '@/types/Cell';
import type { CompareWordsResult } from '@/types/CompareWordsResult';

import { GameStatus } from '@/enums/gameStatus';
import { LetterStatus } from '@/enums/letterStatus';
import { RoundStatus } from '@/enums/roundStatus';

import useButtons from '@/composables/useButtons';
import getRandomNumber from '@/libs/getRandomNumber';
import reduceWord from '@/libs/reduceWord';
import compareWords from '@/libs/compareWords';
import { ErrorStatus } from '@/enums/errorStatus';
import { TOOLTIP_MESSAGE } from '@/enums/tooltipMessage';
import useTooltip from '@/composables/useTooltip';

export default function useGame() {
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
  const isGameOver = ref<boolean>(false);
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
    return Array(6)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => ({ letter: '', status: LetterStatus.DEFAULT }))
      );
  }
  function onStartGame() {
    grid.value = fillGrid();
    round.value = 0;
    cell.value = 0;
    isGameOver.value = false;
    gameStatus.value = GameStatus.PLAYING;
    resetButtons();
    const number = getRandomNumber(0, words.length - 1);
    secretWord.value = words[number];
    modal.value = false;
  }
  function onInput(letter: string) {
    if (grid.value[round.value][4].letter) return;
    grid.value[round.value][cell.value].letter = letter.toUpperCase();
    if (cell.value < 4) {
      cell.value += 1;
    }
  }
  function onClearLetter() {
    if (cell.value === 0) return;
    if (cell.value === 4 && grid.value[round.value][cell.value].letter !== '') {
      grid.value[round.value][cell.value].letter = '';
      return;
    }
    cell.value -= 1;
    grid.value[round.value][cell.value].letter = '';
  }
  function checkGameStatus(result: CompareWordsResult) {
    if (result.status === RoundStatus.WIN) {
      isGameOver.value = true;
      gameStatus.value = GameStatus.WIN;
      modal.value = true;
      return true;
    }
    if (round.value === 5) {
      isGameOver.value = true;
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
      }, 500);
    });
  }
  function getTargetPosition({ proposedWord }: CompareWordsResult) {
    let cellIndex = 0;
    for (let index = 0; index < proposedWord.length; index++) {
      if (proposedWord[index].status === LetterStatus.WRONG_PLACE) {
        cellIndex = index;
      } else if (proposedWord[index].status === LetterStatus.NOT_IN_WORD) {
        cellIndex = index;
        break;
      }
    }
    return cellIndex;
  }
  async function onCheckWord() {
    const currentRow = grid.value[round.value];

    if (cell.value !== 4 || currentRow[cell.value].letter === '') return;

    const reducedWord = reduceWord(currentRow);
    if (usedWords.value.includes(reducedWord)) {
      errorState.type = ErrorStatus.REPEATED;
      await triggerErrorAnimation();
      triggerTooltip(TOOLTIP_MESSAGE.WORD_ALREADY_USED, round.value, 0);
      return;
    }

    const result = compareWords(currentRow, secretWord.value);
    if (result.status === RoundStatus.NOT_FOUND) {
      errorState.type = ErrorStatus.NOT_FOUND;
      await triggerErrorAnimation();
      triggerTooltip(TOOLTIP_MESSAGE.INVALID_WORD, round.value, 0);
      return;
    }

    updateStatuses(currentRow, result);
    if (checkGameStatus(result)) return;

    const cellIndex = getTargetPosition(result);
    const tooltipStatus = getTooltipMessageByLetterStatus(result.proposedWord[cellIndex].status);
    triggerTooltip(tooltipStatus, round.value, cellIndex);
    cell.value = 0;
    round.value += 1;
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
    triggerTooltip
  };
}
