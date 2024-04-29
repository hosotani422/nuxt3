<script setup lang="ts">
import app from "@/stores/page/app";
defineOptions({
  inheritAttrs: false,
});
withDefaults(
  defineProps<{
    modelValue?: boolean;
  }>(),
  {
    modelValue: false,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
const updateValue = (value: boolean): void => {
  emit(`update:modelValue`, value);
};
</script>

<template>
  <label
    data-testid="InputCheckLabel"
    class="flex select-none items-center gap-3"
    v-bind="app.getter.attrClass($attrs)"
  >
    <input
      data-testid="InputCheck"
      class="relative z-[2] size-8 appearance-none border-[0.1rem] border-solid border-theme-half bg-transparent before:absolute before:left-[0.56rem] before:top-[0.2rem] before:z-[1] before:h-[1.1rem] before:w-[0.7rem] before:rotate-45 before:border-solid before:border-theme-fine checked:before:border-b-[0.2rem] checked:before:border-r-[0.2rem]"
      type="checkbox"
      :checked="modelValue"
      v-bind="app.getter.attrAlmost($attrs)"
      @change="updateValue(($event.target as HTMLInputElement).checked)"
    />
    <slot />
  </label>
</template>
