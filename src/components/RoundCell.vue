<script setup lang="ts">
import { type PropType } from 'vue';

import { LetterStatus } from '@/enums/letterStatus';

const props = defineProps({
  letter: {
    type: String,
    required: true
  },
  status: {
    type: String as PropType<LetterStatus>,
    required: true
  },
  rowIndex: {
    type: Number,
    required: true
  },
  cellIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits<{
  (event: 'click', payload: { status: LetterStatus; rowIndex: number; cellIndex: number }): void;
}>();

function onClick() {
  if (props.status === LetterStatus.DEFAULT) return;
  emit('click', {
    status: props.status,
    rowIndex: props.rowIndex,
    cellIndex: props.cellIndex
  });
}
</script>
<template>
  <div
    class="relative flex aspect-[0.92/1] max-w-[calc((100%_-_24px)_/_5)] grow items-center justify-center rounded-md border text-3xl select-none sm:text-xl"
    :class="{
      'border-[#ffdd2d]': status === LetterStatus.DEFAULT,
      'border-[#5f5f5f] bg-[#5f5f5f]': status === LetterStatus.NOT_IN_WORD,
      'border-white bg-white text-black': status === LetterStatus.WRONG_PLACE,
      'border-[#ffdd2d] bg-[#ffdd2d] text-black': status === LetterStatus.CORRECT
    }"
    @click="onClick"
  >
    {{ letter }}
    <slot name="tooltip" :position="{ rowIndex, cellIndex }" />
  </div>
</template>
