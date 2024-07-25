<script setup lang="ts">
import { onMounted, ref } from 'vue';

import words from '@/data/words';

import type { Cell } from '@/types/Cell';

import { RoundStatus } from '@/enums/roundStatus';
import { GameStatus } from '@/enums/gameStatus';
import { LetterStatus } from '@/enums/letterStatus';

import getRandomNumber from '@/libs/getRandomNumber';
import compareWords from '@/libs/compareWords';

import AppModal from '@/components/AppModal.vue';
import KeyboardKey from '@/components/KeyboardKey.vue';

import useButtons from '@/composables/useButtons';

const { buttons, updateButtonStatus, resetButtons } = useButtons();

const modal = ref(false);
const secretWord = ref<string>('');
const isGameOver = ref<boolean>(false);
const gameStatus = ref<GameStatus>(GameStatus.PLAYING);

const grid = ref<Cell[][]>(fillGrid());

const round = ref<0 | 1 | 2 | 3 | 4 | 5>(0);
const cell = ref<0 | 1 | 2 | 3 | 4>(0);

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
function onCheckWord() {
  if (cell.value !== 4 || grid.value[round.value][cell.value].letter === '') return;

  const currentRow = grid.value[round.value];
  const result = compareWords(currentRow, secretWord.value);

  if (result.status === RoundStatus.NOT_FOUND) return;

  for (const index in currentRow) {
    const status = result.proposedWord[index].status;
    currentRow[index].status = status;
    const { letter } = currentRow[index];
    updateButtonStatus(letter, status);
  }

  if (result.status === RoundStatus.WIN) {
    isGameOver.value = true;
    gameStatus.value = GameStatus.WIN;
    modal.value = true;
    return;
  }
  if (round.value === 5) {
    isGameOver.value = true;
    gameStatus.value = GameStatus.LOSE;
    modal.value = true;
    return;
  }

  cell.value = 0;
  round.value += 1;
}

onMounted(() => {
  modal.value = true;
});
</script>
<template>
  <main
    class="h-screen justify-center text-white sm:flex sm:flex-col sm:items-center sm:bg-[#2C2C2E]"
  >
    <div class="w-full max-w-[1104px] bg-[#1c1c1e] px-4 py-4 sm:h-auto sm:rounded-3xl sm:py-24">
      <div class="mx-auto max-w-[655px]">
        <img src="/logo.png" class="mb-6 h-6" alt="Игра «5 букв»" />
        <div class="relative mx-auto mb-[26px] max-w-[80%] space-y-1.5 sm:max-w-[560px]">
          <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="flex space-x-1.5">
            <div
              v-for="(_, cellIndex) in row"
              :key="cellIndex"
              class="flex aspect-[0.92/1] max-w-[calc((100%_-_24px)_/_5)] flex-grow select-none items-center justify-center rounded-md border text-3xl leading-[62px] sm:text-6xl"
              :class="{
                'border-[#ffdd2d]': grid[rowIndex][cellIndex].status === LetterStatus.DEFAULT,
                'border-[#5f5f5f] bg-[#5f5f5f]':
                  grid[rowIndex][cellIndex].status === LetterStatus.NOT_IN_WORD,
                'border-white bg-white text-black':
                  grid[rowIndex][cellIndex].status === LetterStatus.WRONG_PLACE,
                'border-[#ffdd2d] bg-[#ffdd2d] text-black':
                  grid[rowIndex][cellIndex].status === LetterStatus.CORRECT
              }"
            >
              {{ grid[rowIndex][cellIndex].letter }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full overflow-x-hidden">
        <div
          :key="rowIndex"
          v-for="(buttonRow, rowIndex) in buttons"
          class="mb-6 flex justify-center space-x-0.5 last:mb-0 sm:space-x-2"
        >
          <template :key="button.symbol" v-for="button in buttonRow">
            <KeyboardKey
              @input="onInput"
              @delete="onClearLetter"
              @apply="onCheckWord"
              :keyboard-button="button"
            />
          </template>
        </div>
      </div>
    </div>
    <AppModal prevent-close :model-value="modal">
      <div class="w-full max-w-[616px] rounded-3xl bg-[#2c2c2e] px-20 py-12 text-center">
        <p class="mb-4 text-center text-xl font-semibold text-[#ffdd2d]">
          {{
            gameStatus === GameStatus.PLAYING
              ? 'Отгадайте первое слово 🤔'
              : gameStatus === GameStatus.WIN
                ? 'Вы отгадали слово! 😊'
                : 'Вы не отгадали слово 😞'
          }}
        </p>
        <button
          @click="onStartGame"
          class="mx-auto rounded-2xl bg-white px-6 py-4 text-[17px] font-normal text-[#333]"
        >
          {{ gameStatus === GameStatus.PLAYING ? 'Начать игру' : 'Играть снова' }}
        </button>
      </div>
    </AppModal>
  </main>
</template>
