<script setup lang="ts">
import i18next from "i18next";
import dialog from "@/stores/popup/dialog";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  temp: typeof dialog.temp;
  state: typeof dialog.state;
  stateCheckAll: typeof dialog.getter.stateCheckAll;
  errorValidation: typeof dialog.getter.errorValidation;
}>();
const emit = defineEmits<{
  clickCheckAll: [arg: { check: boolean }];
}>();
</script>

<template>
  <BasePopup data-testid="DialogRoot" :open="state.open">
    <div v-if="state.title" data-testid="DialogTitle" class="flex-initial whitespace-pre-line">{{ state.title }}</div>
    <div class="flex flex-1 flex-col gap-3 overflow-auto">
      <div v-if="state.message" data-testid="DialogMessage" class="flex-initial whitespace-pre-line break-all">
        {{ state.message }}
      </div>
      <template v-if="state.mode === `text`">
        <InputTextbox
          v-model="state.text!.value"
          v-focus
          data-testid="DialogText"
          class="flex-initial border-b-[0.1rem] border-solid border-b-theme-fine"
          :placeholder="state.text!.placeholder"
          @input="state.init = false"
        />
      </template>
      <template v-else-if="state.mode === `check`">
        <InputCheck
          v-if="state.check!.all"
          :model-value="stateCheckAll()"
          data-testid="DialogCheckAll"
          class="flex-initial"
          @change="emit(`clickCheckAll`, { check: ($event.target as HTMLInputElement).checked })"
          >{{ i18next.t(`dialog.select.all`) }}</InputCheck
        >
        <InputCheck
          v-for="checkId of state.check!.sort"
          :key="`DialogCheck${checkId}`"
          v-model="state.check!.data[checkId]!.check"
          data-testid="DialogCheck"
          class="flex-initial"
          >{{ state.check!.data[checkId]!.title }}</InputCheck
        >
      </template>
      <template v-else-if="state.mode === `radio`">
        <InputRadio
          v-if="state.radio!.none"
          v-model="state.radio!.select"
          data-testid="DialogRadioNone"
          class="flex-initial"
          value=""
          >{{ i18next.t(`dialog.select.none`) }}</InputRadio
        >
        <InputRadio
          v-for="radioId of state.radio!.sort"
          :key="`radio${radioId}`"
          v-model="state.radio!.select"
          data-testid="DialogRadio"
          class="flex-initial"
          :value="radioId"
          >{{ state.radio!.data[radioId]!.title }}</InputRadio
        >
      </template>
    </div>
    <div v-if="!state.init && errorValidation()" data-testid="DialogError" class="flex-initial text-theme-warn">
      {{ errorValidation() }}
    </div>
    <div class="flex flex-initial items-center justify-end gap-3">
      <InputButton data-testid="DialogCancel" class="flex-initial text-theme-fine" @click="temp.callback.cancel!()">{{
        state.cancel
      }}</InputButton>
      <InputButton
        v-if="state.mode !== `alert`"
        data-testid="DialogOk"
        class="flex-initial text-theme-warn"
        :disabled="!!errorValidation()"
        @click="temp.callback.ok!()"
        >{{ state.ok }}</InputButton
      >
    </div>
  </BasePopup>
</template>
