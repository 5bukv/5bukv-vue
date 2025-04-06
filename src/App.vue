<script setup lang="ts">
import { onMounted } from 'vue';

import AppModal from '@/components/AppModal.vue';
import CellTooltip from '@/components/CellTooltip.vue';
import KeyboardKey from '@/components/KeyboardKey.vue';
import RoundCell from '@/components/RoundCell.vue';
import { GameStatus } from '@/enums/gameStatus';
import { GameMode } from '@/services/GameServiceFactory.ts';
import GameModeSwitch from '@/components/GameModeSwitch.vue';

import useGame from '@/composables/useGame';

const {
  grid,
  modal,
  buttons,
  gameStatus,
  errorState,
  round,
  tooltip,
  currentMode,
  hideTooltip,
  onStartGame,
  onInput,
  onClearLetter,
  onCheckWord,
  onCellClick,
  setGameMode
} = useGame();

function handleModeChange(mode: GameMode) {
  setGameMode(mode);
  onStartGame();
}

onMounted(() => {
  modal.value = true;
});
</script>
<template>
  <main
    class="min-h-screen justify-center text-white sm:flex sm:flex-col sm:items-center sm:bg-[#2C2C2E]"
  >
    <div class="w-full max-w-[1104px] bg-[#1c1c1e] px-4 py-4 sm:h-auto sm:rounded-3xl sm:py-24">
      <div class="mx-auto max-w-[655px]">
        <div class="mb-6 flex items-center justify-between">
          <img src="/logo.png" class="mb-6 h-6" alt="Игра «5 букв»" />
          <GameModeSwitch :current-mode="currentMode" @change="handleModeChange" />
        </div>

        <div class="relative mx-auto mb-[26px] max-w-[80%] space-y-1.5 sm:max-w-64">
          <div
            v-for="(row, rowIndex) in grid"
            :key="rowIndex"
            :class="{ 'animate-shake text-error-red': errorState.active && rowIndex === round }"
            class="flex space-x-1.5"
          >
            <template v-for="(_, cellIndex) in row" :key="cellIndex">
              <RoundCell
                :status="grid[rowIndex][cellIndex].status"
                :letter="grid[rowIndex][cellIndex].letter"
                :row-index="rowIndex"
                :cell-index="cellIndex"
                @click="onCellClick"
              >
                <template #tooltip="{ position }">
                  <CellTooltip
                    :config="tooltip"
                    :row-index="position.rowIndex"
                    :cell-index="position.cellIndex"
                    @hide="hideTooltip"
                  />
                </template>
              </RoundCell>
            </template>
          </div>
        </div>
      </div>
      <div class="w-full overflow-x-hidden">
        <div
          v-for="(buttonRow, rowIndex) in buttons"
          :key="rowIndex"
          class="mb-6 flex justify-center space-x-0.5 last:mb-0 sm:space-x-2"
        >
          <template v-for="button in buttonRow" :key="button.symbol">
            <KeyboardKey
              :keyboard-button="button"
              @input="onInput"
              @delete="onClearLetter"
              @apply="onCheckWord"
            />
          </template>
        </div>
      </div>
    </div>
    <AppModal :value="modal">
      <div class="w-full max-w-[616px] rounded-3xl bg-[#2c2c2e] px-20 py-12 text-center">
        <p class="mb-4 text-center text-xl font-semibold text-[#ffdd2d]">
          {{
            gameStatus === GameStatus.PLAYING
              ? 'Отгадайте первое слово'
              : gameStatus === GameStatus.WIN
                ? 'Вы отгадали слово!'
                : 'Вы не отгадали слово'
          }}
        </p>
        <button
          class="mx-auto rounded-2xl bg-white px-6 py-4 text-[17px] font-normal text-[#333]"
          @click="onStartGame"
        >
          {{ gameStatus === GameStatus.PLAYING ? 'Начать игру' : 'Играть снова' }}
        </button>
      </div>
    </AppModal>
  </main>
</template>
