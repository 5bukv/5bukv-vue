<script setup lang="ts">
import { type PropType } from 'vue';

import vClickOutside from '@/directives/v-click-outside';
import type { Tooltip } from '@/types/Tooltip';

defineProps({
  config: {
    type: Object as PropType<Tooltip>,
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

const emit = defineEmits<{ (event: 'hide'): void }>();
function onClick() {
  emit('hide');
}
</script>

<template>
  <div
    v-click-outside="{
      active:
        config.show &&
        rowIndex === config.position.rowIndex &&
        cellIndex === config.position.cellIndex,
      handler: onClick
    }"
    :class="
      config.show &&
      rowIndex === config.position.rowIndex &&
      cellIndex === config.position.cellIndex
        ? '[transform:translateY(0)_translateZ(1px)_scale(1)] opacity-100'
        : 'pointer-events-none [transform:translateY(-4px)_translateZ(1px)_scale(0.5)] opacity-0'
    "
    class="absolute top-[calc(100%+15px)] z-20 h-auto min-w-32 rounded-lg bg-white p-2.5 text-center text-[13px] leading-[1.15] font-normal text-[#202020] duration-300 ease-[cubic-bezier(0.4,0.1,0.2,1)] before:absolute before:top-0 before:inline-block before:-translate-x-2/4 before:-translate-y-6 before:border-[12px] before:border-solid before:border-transparent before:border-b-[white] before:content-['']"
    @click.stop="onClick"
  >
    <span class="block" v-html="config.message"></span>
    <span class="mt-1 block">{{ config.emoji }}</span>
  </div>
</template>
