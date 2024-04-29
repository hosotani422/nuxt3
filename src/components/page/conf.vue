<script setup lang="ts">
import i18next from "i18next";
import constants from "@/utils/const";
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  constant: typeof constants;
  updateKey: typeof app.state.updateKey;
  state: typeof conf.state.data;
}>();
const emit = defineEmits<{
  routerBack: [];
  downloadBackup: [arg: { elem: HTMLElement }];
  uploadBackup: [arg: { files: FileList }];
  resetConf: [];
  resetList: [];
  swipeInit: [arg: { x: number; y: number }];
  swipeStart: [arg: { x: number; y: number }];
  swipeMove: [arg: { y: number }];
  swipeEnd: [arg: { y: number }];
}>();
</script>

<template>
  <div
    data-id="ConfRoot"
    data-testid="ConfRoot"
    class="theme-color-mask anime-slide-conf absolute inset-x-0 bottom-0 z-10 h-[200%] select-none"
    @touchmove="
      emit(`swipeStart`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY });
      emit(`swipeMove`, { y: $event.changedTouches[0]!.clientY });
    "
    @mousemove="
      emit(`swipeStart`, { x: $event.clientX, y: $event.clientY });
      emit(`swipeMove`, { y: $event.clientY });
    "
    @touchend="emit(`swipeEnd`, { y: $event.changedTouches[0]!.clientY })"
    @mouseup="emit(`swipeEnd`, { y: $event.clientY })"
  >
    <div
      data-testid="ConfBack"
      class="absolute inset-x-0 top-0 z-[1] h-[55%]"
      @touchstart="emit(`swipeInit`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY })"
      @mousedown="emit(`swipeInit`, { x: $event.clientX, y: $event.clientY })"
    />
    <div
      :key="`Conf${updateKey}`"
      data-testid="ConfHome"
      class="theme-color-grad theme-shadow-outer absolute inset-x-0 bottom-0 z-[1] flex h-[45%] flex-col"
    >
      <div
        data-testid="ConfHead"
        class="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
      >
        <IconDown data-testid="ConfDown" class="flex-initial" @click="emit(`routerBack`)" />
        <p data-testid="ConfTitle" class="flex-1 text-xl">{{ i18next.t(`conf.title`) }}</p>
        <p data-testid="ConfName" class="flex-initial">
          {{ `${constant.base.app.name} ${constant.base.app.version}` }}
        </p>
      </div>
      <ul data-testid="ConfBody" class="flex-1 overflow-auto p-3">
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfSizeTitle" class="flex-[0_1_5rem]">{{ i18next.t(`conf.size.title`) }}</p>
          <InputRange v-model="state.size" data-testid="ConfSizeValue" class="flex-1" :min="1" :max="3" :step="1" />
          <p data-testid="ConfSizeName" class="flex-initial">{{ i18next.t(`conf.size.value.${state.size}`) }}</p>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfSpeedTitle" class="flex-[0_1_5rem]">{{ i18next.t(`conf.speed.title`) }}</p>
          <InputRange v-model="state.speed" data-testid="ConfSpeedValue" class="flex-1" :min="1" :max="3" :step="1" />
          <p data-testid="ConfSpeedName" class="flex-initial">{{ i18next.t(`conf.speed.value.${state.speed}`) }}</p>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfThemeTitle" class="flex-1">{{ i18next.t(`conf.theme.title`) }}</p>
          <InputRadio v-model="state.theme" data-testid="ConfThemeLight" class="flex-initial" value="light">{{
            i18next.t(`conf.theme.value.light`)
          }}</InputRadio>
          <InputRadio v-model="state.theme" data-testid="ConfThemeDark" class="flex-initial" value="dark">{{
            i18next.t(`conf.theme.value.dark`)
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfLangTitle" class="flex-1">{{ i18next.t(`conf.lang.title`) }}</p>
          <InputRadio v-model="state.lang" data-testid="ConfLangEn" class="flex-initial" value="en">{{
            i18next.t(`conf.lang.value.en`)
          }}</InputRadio>
          <InputRadio v-model="state.lang" data-testid="ConfLangJa" class="flex-initial" value="ja">{{
            i18next.t(`conf.lang.value.ja`)
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfVibrateTitle" class="flex-1">{{ i18next.t(`conf.vibrate.title`) }}</p>
          <InputRadio v-model="state.vibrate" data-testid="ConfVibrateOff" class="flex-initial" value="off">{{
            i18next.t(`conf.vibrate.value.off`)
          }}</InputRadio>
          <InputRadio v-model="state.vibrate" data-testid="ConfVibrateOn" class="flex-initial" value="on">{{
            i18next.t(`conf.vibrate.value.on`)
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfSaveTitle" class="flex-1">{{ i18next.t(`conf.save.title`) }}</p>
          <InputRadio v-model="state.save" data-testid="ConfSaveLocal" class="flex-initial" value="local">{{
            i18next.t(`conf.save.value.local`)
          }}</InputRadio>
          <InputRadio v-model="state.save" data-testid="ConfSaveRest" class="flex-initial" value="rest">{{
            i18next.t(`conf.save.value.rest`)
          }}</InputRadio>
          <InputRadio v-model="state.save" data-testid="ConfSaveGql" class="flex-initial" value="gql">{{
            i18next.t(`conf.save.value.gql`)
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfBackupTitle" class="flex-1">{{ i18next.t(`conf.backup.title`) }}</p>
          <a
            class="flex-[0_1_2rem] text-theme-fine"
            data-testid="ConfBackupDownload"
            @click="emit(`downloadBackup`, { elem: $event.currentTarget as HTMLElement })"
          >
            <InputButton>{{ i18next.t(`conf.backup.download`) }}</InputButton>
          </a>
          <InputFile
            data-testid="ConfBackupUpload"
            class="flex-[0_1_2rem] text-theme-warn"
            @change="emit(`uploadBackup`, { files: $event.target.files })"
            >{{ i18next.t(`conf.backup.upload`) }}</InputFile
          >
        </li>
        <li
          data-testid="ConfItem"
          class="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
        >
          <p data-testid="ConfResetTitle" class="flex-1">{{ i18next.t(`conf.reset.title`) }}</p>
          <InputButton data-testid="ConfResetConf" class="flex-[0_1_2rem] text-theme-fine" @click="emit(`resetConf`)">{{
            i18next.t(`conf.reset.conf`)
          }}</InputButton>
          <InputButton data-testid="ConfResetList" class="flex-[0_1_2rem] text-theme-warn" @click="emit(`resetList`)">{{
            i18next.t(`conf.reset.list`)
          }}</InputButton>
        </li>
      </ul>
    </div>
  </div>
</template>
