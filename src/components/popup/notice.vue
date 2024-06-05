<script setup lang="ts">
import notice from "@/stores/popup/notice";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  temp: typeof notice.temp;
  state: typeof notice.state;
}>();
</script>

<template>
  <transition>
    <div
      v-show="state.open"
      data-testid="NoticeRoot"
      class="theme-color-back theme-shadow-outer anime-slide-notice absolute inset-x-3 bottom-3 z-[80] flex items-center rounded p-3"
    >
      <div data-testid="NoticeMessage" class="flex-1 text-xs">{{ state.message }}</div>
      <InputButton data-testid="NoticeBack" class="flex-initial text-theme-fine" @click="temp.callback()">{{
        state.button
      }}</InputButton>
    </div>
  </transition>
</template>
