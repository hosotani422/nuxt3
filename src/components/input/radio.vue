<script setup lang="ts">
import app from "@/stores/page/app";
defineOptions({
  inheritAttrs: false,
});
withDefaults(
  defineProps<{
    modelValue?: string;
  }>(),
  {
    modelValue: ``,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
const updateValue = (value: string): void => {
  emit(`update:modelValue`, value);
};
</script>

<template>
  <label
    data-testid="InputRadioLabel"
    class="flex select-none items-center gap-3"
    v-bind="app.getter.attrClass($attrs)"
  >
    <input
      data-testid="InputRadio"
      class="relative z-[2] size-8 appearance-none rounded-full border-[0.1rem] border-solid border-theme-half bg-transparent before:absolute before:left-2 before:top-2 before:z-[1] before:size-[0.8rem] before:rounded-full checked:before:bg-theme-fine"
      type="radio"
      :checked="modelValue === $attrs.value"
      v-bind="app.getter.attrAlmost($attrs)"
      @change="updateValue(($event.target as HTMLInputElement).value)"
    />
    <slot />
  </label>
</template>
