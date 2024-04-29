<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
withDefaults(
  defineProps<{
    open?: boolean;
    max?: boolean;
  }>(),
  {
    open: false,
    max: false,
  },
);
</script>

<template>
  <transition>
    <div
      v-if="open"
      class="theme-color-mask anime-fade-item absolute inset-0 z-[70] flex items-center justify-center"
      v-bind="$attrs"
    >
      <div
        :class="{ 'h-4/5': max }"
        class="theme-color-back theme-shadow-outer flex max-h-[80%] w-4/5 flex-col gap-3 rounded p-3"
      >
        <slot />
      </div>
    </div>
  </transition>
</template>
