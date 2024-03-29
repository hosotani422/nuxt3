<script setup lang="ts">
import app from "@/stores/page/app";
import dialog from "@/stores/popup/dialog";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  state: typeof dialog.state;
  lang: typeof app.getter.lang;
  stateCheckAll: typeof dialog.getter.stateCheckAll;
}>();
const emit = defineEmits([`clickCheckAll`]);
</script>

<template>
  <BasePopup data-testid="DialogRoot" :open="state.open">
    <div v-if="state.title" data-testid="DialogTitle" class="flex-auto whitespace-pre-line">{{ state.title }}</div>
    <div class="flex flex-col gap-3 overflow-auto">
      <div v-if="state.message" data-testid="DialogMessage" class="whitespace-pre-line break-all">
        {{ state.message }}
      </div>
      <template v-if="state.mode === `text`">
        <InputTextbox
          v-model="state.text.value"
          v-focus
          data-testid="DialogText"
          class="border-b-[0.1rem] border-solid border-b-theme-fine"
          :placeholder="state.text.placeholder"
        />
      </template>
      <template v-else-if="state.mode === `check`">
        <InputCheck
          v-if="state.check.all"
          :model-value="stateCheckAll()"
          data-testid="DialogCheckAll"
          @change="emit(`clickCheckAll`, { checked: ($event.target as HTMLInputElement).checked })"
          >{{ lang().dialog.select.all }}</InputCheck
        >
        <InputCheck
          v-for="checkId of state.check.sort"
          :key="`check${checkId}`"
          v-model="state.check.data[checkId]!.check"
          data-testid="DialogCheck"
          >{{ state.check.data[checkId]!.title }}</InputCheck
        >
      </template>
      <template v-else-if="state.mode === `radio`">
        <InputRadio
          v-if="state.radio.none"
          data-testid="DialogRadioNone"
          value=""
          :checked="state.radio.select === ``"
          >{{ lang().dialog.select.none }}</InputRadio
        >
        <InputRadio
          v-for="radioId of state.radio.sort"
          :key="`radio${radioId}`"
          v-model="state.radio.select"
          data-testid="DialogRadio"
          :value="radioId"
          >{{ state.radio.data[radioId]!.title }}</InputRadio
        >
      </template>
    </div>
    <div class="flex items-center justify-end gap-4">
      <InputButton data-testid="DialogCancel" class="flex-auto text-theme-fine" @click="state.callback.cancel!()">{{
        state.cancel
      }}</InputButton>
      <InputButton
        v-if="state.mode !== `alert`"
        data-testid="DialogOk"
        class="flex-auto text-theme-warn"
        @click="state.callback.ok!()"
        >{{ state.ok }}</InputButton
      >
    </div>
  </BasePopup>
</template>
