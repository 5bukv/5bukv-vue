import type { DirectiveBinding } from 'vue';

interface HTMLElementWithClickOutside extends HTMLElement {
  __handleOutsideClick__?: (event: MouseEvent | TouchEvent) => void;
}

const handleOutsideClick = (
  event: MouseEvent | TouchEvent,
  el: HTMLElementWithClickOutside,
  binding: DirectiveBinding
) => {
  const { handler } = binding.value;
  if (!(el === event.target || el.contains(event.target as Node))) {
    handler(event);
  }
};

export default {
  beforeMount(el: HTMLElementWithClickOutside, binding: DirectiveBinding) {
    el.__handleOutsideClick__ = (event: MouseEvent | TouchEvent) =>
      handleOutsideClick(event, el, binding);
    if (binding.value.active) {
      document.addEventListener('click', el.__handleOutsideClick__ as EventListener);
      document.addEventListener('touchstart', el.__handleOutsideClick__ as EventListener);
    }
  },
  updated(el: HTMLElementWithClickOutside, binding: DirectiveBinding) {
    if (binding.value.active) {
      document.addEventListener('click', el.__handleOutsideClick__ as EventListener);
      document.addEventListener('touchstart', el.__handleOutsideClick__ as EventListener);
    } else {
      document.removeEventListener('click', el.__handleOutsideClick__ as EventListener);
      document.removeEventListener('touchstart', el.__handleOutsideClick__ as EventListener);
    }
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.__handleOutsideClick__) {
      document.removeEventListener('click', el.__handleOutsideClick__ as EventListener);
      document.removeEventListener('touchstart', el.__handleOutsideClick__ as EventListener);
      delete el.__handleOutsideClick__;
    }
  }
};
