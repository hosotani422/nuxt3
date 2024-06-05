<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
withDefaults(
  defineProps<{
    type?: `text` | `password`;
    modelValue?: string;
  }>(),
  {
    type: `text`,
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
  <input
    :type="type"
    data-testid="InputTextbox"
    class="h-8 border-0 bg-transparent outline-0 placeholder:text-theme-half"
    :value="modelValue"
    v-bind="$attrs"
    @input="updateValue(($event.target as HTMLInputElement).value)"
  />
</template>
