<script setup lang="ts">
import { GameMode } from '@/services/GameServiceFactory';

const props = defineProps<{
  currentMode: GameMode;
}>();

const emit = defineEmits<{
  (e: 'change', mode: GameMode): void;
}>();

function toggleMode() {
  const newMode = props.currentMode === GameMode.LOCAL ? GameMode.API : GameMode.LOCAL;
  emit('change', newMode);
}
</script>

<template>
  <div class="mb-4 flex items-center space-x-2">
    <span class="text-sm text-gray-400">Режим игры:</span>
    <button
      @click="toggleMode"
      class="rounded-full px-4 py-1 text-sm font-medium transition"
      :class="{
        'bg-[#ffdd2d] text-black': currentMode === GameMode.API,
        'bg-[#444] text-white': currentMode === GameMode.LOCAL
      }"
    >
      {{ currentMode === GameMode.LOCAL ? 'Демо' : 'Онлайн' }}
    </button>
  </div>
</template>
