<script setup lang="ts">
import type { PropType } from 'vue';
import type { KeyboardButton } from '@/types/KeyboardButton';
import { BUTTON_APPLY, BUTTON_DELETE } from '@/constants/buttons';
import { LetterStatus } from '@/enums/letterStatus';
import { KeyboardType } from '@/enums/keyboardType';

defineProps({
  keyboardButton: {
    type: Object as PropType<KeyboardButton>,
    required: true
  }
});
const emit = defineEmits(['input', 'apply', 'delete']);

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
    @click="handleKeyClick(keyboardButton)"
    class="h-10 w-8 select-none rounded-md border p-0 font-semibold sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
    :class="{
      'border-white/25': keyboardButton.status === LetterStatus.DEFAULT,
      'border-[#ffdd2d] bg-[#ffdd2d] text-black': keyboardButton.status === LetterStatus.CORRECT,
      'border-white bg-white text-black': keyboardButton.status === LetterStatus.WRONG_PLACE,
      'border-[#5f5f5f] bg-[#5f5f5f] text-white': keyboardButton.status === LetterStatus.NOT_IN_WORD
    }"
    :key="keyboardButton.symbol"
  >
    {{ keyboardButton.symbol }}
  </button>
  <button
    @click="handleKeyClick(keyboardButton)"
    class="mb-6 mr-2 h-10 w-8 select-none rounded-md border border-gray-900 border-white/25 p-0 sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
    :key="keyboardButton.symbol"
    v-if="keyboardButton.symbol === BUTTON_DELETE"
  >
    ⌫
  </button>
  <button
    @click="handleKeyClick(keyboardButton)"
    class="mb-6 mr-2 h-10 w-8 select-none rounded-md border border-gray-900 border-white/25 p-0 sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
    :key="keyboardButton.symbol"
    v-if="keyboardButton.symbol === BUTTON_APPLY"
  >
    ⏎
  </button>
</template>
