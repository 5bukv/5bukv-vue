<script setup lang="ts">
import { onMounted } from 'vue';

import { GameStatus } from '@/enums/gameStatus';

import AppModal from '@/components/AppModal.vue';
import KeyboardKey from '@/components/KeyboardKey.vue';

import useGame from '@/composables/useGame';
import RoundCell from '@/components/RoundCell.vue';

const { grid, modal, buttons, gameStatus, onStartGame, onInput, onClearLetter, onCheckWord } =
  useGame();

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
            <template :key="cellIndex" v-for="(_, cellIndex) in row">
              <RoundCell
                :status="grid[rowIndex][cellIndex].status"
                :letter="grid[rowIndex][cellIndex].letter"
              />
            </template>
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
