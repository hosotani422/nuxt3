<script setup lang="ts">
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  title: string;
  state: (typeof conf)[`state`][`data`];
  lang: typeof app.getter.lang;
}>();
const emit = defineEmits([
  `routerBack`,
  `downloadBackup`,
  `uploadBackup`,
  `resetConf`,
  `resetList`,
  `swipeInit`,
  `swipeStart`,
  `swipeMove`,
  `swipeEnd`,
]);
</script>

<template>
  <div
    data-testid="ConfRoot"
    class="theme-mask-color absolute inset-x-0 bottom-0 z-[10] h-[200%] select-none active:transition speed1:active:duration-1000 speed2:active:duration-500 speed3:active:duration-200 fromto:!translate-y-[50%] fromto:!bg-transparent"
    @mousemove="
      emit(`swipeStart`, {
        clientX: $event.clientX,
        clientY: $event.clientY,
      });
      emit(`swipeMove`, { clientY: $event.clientY });
    "
    @mouseup="emit(`swipeEnd`, { clientY: $event.clientY })"
    @touchmove="
      emit(`swipeStart`, {
        clientX: $event.changedTouches ? $event.changedTouches[0]!.clientX : 0,
        clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0,
      });
      emit(`swipeMove`, { clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0 });
    "
    @touchend="emit(`swipeEnd`, { clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0 })"
  >
    <div
      data-testid="ConfBack"
      class="absolute left-0 top-0 z-[1] h-[55%] w-[100%]"
      @mousedown="
        emit(`swipeInit`, {
          target: ($event.currentTarget as HTMLElement).parentElement,
          clientX: $event.clientX,
          clientY: $event.clientY,
        })
      "
      @touchstart="
        emit(`swipeInit`, {
          target: ($event.currentTarget as HTMLElement).parentElement,
          clientX: $event.changedTouches ? $event.changedTouches[0]!.clientX : 0,
          clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0,
        })
      "
    />
    <div
      data-testid="ConfHome"
      class="theme-grad-color theme-shadow-normal absolute inset-x-0 bottom-0 z-[1] flex h-[45%] flex-col"
    >
      <div
        data-testid="ConfHead"
        class="theme-grad-color theme-shadow-normal relative z-[9] flex flex-auto items-center gap-3 p-3"
      >
        <IconDown data-testid="ConfDown" class="flex-auto" @click="emit(`routerBack`)" />
        <p data-testid="ConfTitle" class="flex-even text-xl">{{ lang().conf.title }}</p>
        <p data-testid="ConfName" class="flex-auto">{{ title }}</p>
      </div>
      <ul data-testid="ConfBody" class="flex-even overflow-auto p-3">
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfSizeTitle" class="flex-even">{{ lang().conf.size.title }}</p>
          <InputRange v-model="state.size" data-testid="ConfSizeValue" class="flex-even" :min="1" :max="3" :step="1" />
          <p data-testid="ConfSizeName" class="flex-auto">
            {{ lang().conf.size.value[state.size] }}
          </p>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfSpeedTitle" class="flex-even">{{ lang().conf.speed.title }}</p>
          <InputRange
            v-model="state.speed"
            data-testid="ConfSpeedValue"
            class="flex-even"
            :min="1"
            :max="3"
            :step="1"
          />
          <p data-testid="ConfSpeedName" class="flex-auto">{{ lang().conf.speed.value[state.speed] }}</p>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfVolumeTitle" class="flex-even">{{ lang().conf.volume.title }}</p>
          <InputRange
            v-model="state.volume"
            data-testid="ConfVolumeValue"
            class="flex-even"
            :min="0"
            :max="3"
            :step="1"
          />
          <p data-testid="ConfVolumeName" class="flex-auto">{{ lang().conf.volume.value[state.volume] }}</p>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfVibrateTitle" class="flex-even">{{ lang().conf.vibrate.title }}</p>
          <InputRadio v-model="state.vibrate" data-testid="ConfVibrateOff" class="flex-auto" value="off">{{
            lang().conf.vibrate.value.off
          }}</InputRadio>
          <InputRadio v-model="state.vibrate" data-testid="ConfVibrateOn" class="flex-auto" value="on">{{
            lang().conf.vibrate.value.on
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfThemeTitle" class="flex-even">{{ lang().conf.theme.title }}</p>
          <InputRadio v-model="state.theme" data-testid="ConfThemeLight" class="flex-auto" value="light">{{
            lang().conf.theme.value.light
          }}</InputRadio>
          <InputRadio v-model="state.theme" data-testid="ConfThemeDark" class="flex-auto" value="dark">{{
            lang().conf.theme.value.dark
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfLangTitle" class="flex-even">{{ lang().conf.lang.title }}</p>
          <InputRadio v-model="state.lang" data-testid="ConfLangEn" class="flex-auto" value="en">{{
            lang().conf.lang.value.en
          }}</InputRadio>
          <InputRadio v-model="state.lang" data-testid="ConfLangJp" class="flex-auto" value="jp">{{
            lang().conf.lang.value.jp
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfSaveTitle" class="flex-even">{{ lang().conf.save.title }}</p>
          <InputRadio v-model="state.save" data-testid="ConfSaveLocal" class="flex-auto" value="local">{{
            lang().conf.save.value.local
          }}</InputRadio>
          <InputRadio v-model="state.save" data-testid="ConfSaveRest" class="flex-auto" value="rest">{{
            lang().conf.save.value.rest
          }}</InputRadio>
          <InputRadio v-model="state.save" data-testid="ConfSaveGql" class="flex-auto" value="gql">{{
            lang().conf.save.value.gql
          }}</InputRadio>
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfBackupTitle" class="flex-even">{{ lang().conf.backup.title }}</p>
          <a class="flex-auto" data-testid="ConfBackupDownload" @click="emit(`downloadBackup`, { event: $event })">
            <InputButton class="flex-auto text-theme-fine">{{ lang().conf.backup.download }}</InputButton>
          </a>
          <InputFile
            data-testid="ConfBackupUpload"
            class="flex-auto text-theme-warn"
            @change="emit(`uploadBackup`, { event: $event })"
            >{{ lang().conf.backup.upload }}</InputFile
          >
        </li>
        <li
          data-testid="ConfItem"
          class="theme-back-color flex h-16 items-center gap-4 border-b-[0.1rem] border-solid border-b-font-dark p-3"
        >
          <p data-testid="ConfResetTitle" class="flex-even">{{ lang().conf.reset.title }}</p>
          <InputButton data-testid="ConfResetConf" class="flex-auto text-theme-fine" @click="emit(`resetConf`)">{{
            lang().conf.reset.conf
          }}</InputButton>
          <InputButton data-testid="ConfResetList" class="flex-auto text-theme-warn" @click="emit(`resetList`)">{{
            lang().conf.reset.list
          }}</InputButton>
        </li>
      </ul>
    </div>
  </div>
</template>
