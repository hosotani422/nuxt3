<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
withDefaults(
  defineProps<{
    type?: `button` | `reset` | `submit`;
    disabled?: boolean;
  }>(),
  {
    type: `button`,
    disabled: false,
  },
);
</script>

<template>
  <button
    :type="type"
    data-testid="InputButton"
    class="h-8 select-none border-0 bg-transparent outline-0 disabled:opacity-50"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot>button</slot>
  </button>
</template>
