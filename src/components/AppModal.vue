<script setup lang="ts">
defineProps({
  value: {
    type: Boolean,
    default: false
  },
});
</script>

<template>
  <div
    :class="{ hidden: !value }"
    class="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-[#1C1C1E]/60 px-4"
  >
    <slot name="default" />
  </div>
</template>
