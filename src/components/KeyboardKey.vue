<script setup lang="ts">
import type { PropType } from 'vue';

import { BUTTON_APPLY, BUTTON_DELETE } from '@/constants/buttons';
import { KeyboardType } from '@/enums/keyboardType';
import { LetterStatus } from '@/enums/letterStatus';
import type { KeyboardButton } from '@/types/KeyboardButton';

defineProps({
  keyboardButton: {
    type: Object as PropType<KeyboardButton>,
    required: true
  }
});
const emit = defineEmits<{
  (e: 'input', payload: string): void;
  (e: 'apply'): void;
  (e: 'delete'): void;
}>();

const handleKeyClick = (key: KeyboardButton) => {
  if (key.type === KeyboardType.LETTER) {
    emit('input', key.symbol);
  } else if (key.symbol === BUTTON_DELETE) {
    emit('delete');
  } else if (key.symbol === BUTTON_APPLY) {
    emit('apply');
  }
};
</script>

<template>
  <button
    v-if="keyboardButton.symbol !== BUTTON_DELETE && keyboardButton.symbol !== BUTTON_APPLY"
    :key="keyboardButton.symbol"
    :class="{
      'border-white/25': keyboardButton.status === LetterStatus.DEFAULT,
      'border-[#ffdd2d] bg-[#ffdd2d] text-black': keyboardButton.status === LetterStatus.CORRECT,
      'border-white bg-white text-black': keyboardButton.status === LetterStatus.WRONG_PLACE,
      'border-[#5f5f5f] bg-[#5f5f5f] text-white': keyboardButton.status === LetterStatus.NOT_IN_WORD
    }"
    class="h-10 w-8 rounded-md border p-0 font-semibold select-none sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
    @click="handleKeyClick(keyboardButton)"
  >
    {{ keyboardButton.symbol }}
  </button>
  <button
    v-if="keyboardButton.symbol === BUTTON_DELETE"
    :key="keyboardButton.symbol"
    class="mr-2 mb-6 h-10 w-8 rounded-md border border-gray-900 border-white/25 p-0 select-none sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
    @click="handleKeyClick(keyboardButton)"
  >
    ⌫
  </button>
  <button
    v-if="keyboardButton.symbol === BUTTON_APPLY"
    :key="keyboardButton.symbol"
    class="mr-2 mb-6 h-10 w-8 rounded-md border border-gray-900 border-white/25 p-0 select-none sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
    @click="handleKeyClick(keyboardButton)"
  >
    ⏎
  </button>
</template>
