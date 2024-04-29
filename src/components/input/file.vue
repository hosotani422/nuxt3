<script setup lang="ts">
import app from "@/stores/page/app";
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <label data-testid="InputFileLabel" class="relative z-[1]" v-bind="app.getter.attrClass($attrs)">
    <input
      data-testid="InputFile"
      class="absolute inset-0 z-[2] opacity-0"
      type="file"
      v-bind="app.getter.attrAlmost($attrs)"
    />
    <InputButton data-testid="InputFileButton">
      <slot>file</slot>
    </InputButton>
  </label>
</template>
