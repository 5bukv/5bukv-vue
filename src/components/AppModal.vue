<template>
  <div
    :class="{ hidden: !props.modelValue }"
    @click.self.stop="closeSelf"
    class="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-[#1C1C1E]/60 px-4"
  >
    <slot name="default" />
  </div>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';
defineComponent({ name: 'AppModal' });
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  preventClose: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue']);
const closeSelf = () => {
  if (props.preventClose) return;
  emit('update:modelValue', false);
};
</script>
