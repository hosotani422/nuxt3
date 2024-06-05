<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const prop = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    modelValue?: number;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    modelValue: 0,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();
const updateValue = (value: string): void => {
  emit(`update:modelValue`, Number(value));
};
const updateStyle = computed(() => () => {
  const rate = ((prop.modelValue - prop.min) / (prop.max - prop.min)) * 100;
  return `background: linear-gradient(to right, #18d ${rate}%, #959595 ${rate}%)`;
});
defineExpose({ updateStyle });
</script>

<template>
  <input
    type="range"
    data-testid="InputRange"
    class="h-[0.1rem] w-full appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme-fine"
    :style="updateStyle()"
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    v-bind="$attrs"
    @change="updateValue(($event.target as HTMLInputElement).value)"
  />
</template>
