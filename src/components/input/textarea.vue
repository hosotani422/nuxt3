<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const prop = withDefaults(
  defineProps<{
    sizing?: `fixed` | `content`;
    modelValue?: string;
  }>(),
  {
    sizing: `fixed`,
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
  <textarea
    data-testid="InputTextarea"
    class="m-0 resize-none overflow-auto border-0 bg-transparent p-2 leading-8 outline-0 placeholder:text-theme-half"
    :style="`field-sizing: ${prop.sizing}`"
    v-bind="$attrs"
    :value="modelValue"
    @input="updateValue(($event.target as HTMLInputElement).value)"
  />
</template>
