<script setup lang="ts">
const buttons = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['apply', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'delete']
];
const emit = defineEmits(['input', 'apply', 'delete']);
const handleKeyClick = (symbol: string) => {
  emit('input', symbol);
};
</script>

<template>
  <div class="w-full overflow-x-hidden">
    <div
      :key="rowIndex"
      v-for="(buttonRow, rowIndex) in buttons"
      class="mb-6 flex justify-center space-x-0.5 last:mb-0 sm:space-x-2"
    >
      <template v-for="button in buttonRow">
        <button
          v-if="button !== 'delete' && button !== 'apply'"
          @click="handleKeyClick(button)"
          class="h-10 w-8 select-none rounded-md border border-white/25 p-0 sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
          :key="button"
        >
          {{ button }}
        </button>
        <button
          @click="emit('delete')"
          class="mb-6 mr-2 h-10 w-8 select-none rounded-md border border-gray-900 border-white/25 p-0 sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
          :key="button"
          v-if="button === 'delete'"
        >
          ⌫
        </button>
        <button
          @click="emit('apply')"
          class="mb-6 mr-2 h-10 w-8 select-none rounded-md border border-gray-900 border-white/25 p-0 sm:aspect-[0.88_/_1] sm:h-[60px] sm:w-auto"
          :key="button"
          v-if="button === 'apply'"
        >
          ⏎
        </button>
      </template>
    </div>
  </div>
</template>
