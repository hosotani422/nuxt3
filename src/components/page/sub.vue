<script setup lang="ts">
import i18next from "i18next";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  listId: typeof app.getter.listId;
  mainId: typeof app.getter.mainId;
  classStatus: typeof sub.getter.classStatus;
  classLimit: typeof sub.getter.classLimit;
  textMemo: typeof sub.getter.textMemo;
  textAlarm: typeof sub.getter.textAlarm;
  mainUnit: typeof main.action.getUnit;
  subFull: typeof sub.action.getFull;
  subUnit: typeof sub.action.getUnit;
}>();
const emit = defineEmits<{
  routerBack: [arg?: { listId: string }];
  toggleMode: [];
  convertItem: [arg: { text: string }];
  divideItem: [arg: { subId: string; caret: number }];
  connectItem: [arg: { subId: string }];
  deleteItem: [arg: { subId: string }];
  openCalendar: [];
  openClock: [];
  openAlarm: [];
  dragInit: [arg: { subId: string; y: number }];
  dragStart: [];
  dragMove: [arg: { y: number }];
  dragEnd: [];
  swipeInit: [arg: { x: number; y: number }];
  swipeStart: [arg: { x: number; y: number }];
  swipeMove: [arg: { x: number }];
  swipeEnd: [arg: { x: number }];
}>();
</script>

<template>
  <div
    data-id="SubRoot"
    data-testid="SubRoot"
    class="theme-color-mask anime-slide-sub absolute inset-y-0 right-0 z-10 w-[200%]"
    @touchmove="
      emit(`dragStart`);
      emit(`dragMove`, { y: $event.changedTouches[0]!.clientY });
      emit(`swipeStart`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY });
      emit(`swipeMove`, { x: $event.changedTouches[0]!.clientX });
    "
    @mousemove="
      emit(`dragStart`);
      emit(`dragMove`, { y: $event.clientY });
      emit(`swipeStart`, { x: $event.clientX, y: $event.clientY });
      emit(`swipeMove`, { x: $event.clientX });
    "
    @touchend="
      emit(`dragEnd`);
      emit(`swipeEnd`, { x: $event.changedTouches[0]!.clientX });
    "
    @mouseup="
      emit(`dragEnd`);
      emit(`swipeEnd`, { x: $event.clientX });
    "
  >
    <div
      data-testid="SubBack"
      class="absolute inset-y-0 left-0 z-[1] w-[57%]"
      @touchstart="emit(`swipeInit`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY })"
      @mousedown="emit(`swipeInit`, { x: $event.clientX, y: $event.clientY })"
    />
    <div
      data-id="SubHome"
      data-testid="SubHome"
      class="theme-color-grad theme-shadow-outer absolute inset-y-0 right-0 z-[1] flex w-[43%] flex-col"
    >
      <div
        data-testid="SubHead"
        class="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
      >
        <IconRight data-testid="SubRight" class="flex-initial" @click="emit(`routerBack`)" />
        <InputTextbox
          v-model="mainUnit().title"
          data-testid="SubTitle"
          class="flex-1 text-xl"
          :placeholder="i18next.t(`placeholder.main`)"
        />
        <IconMode data-testid="SubMode" class="flex-initial" @click="emit(`toggleMode`)" />
      </div>
      <div data-testid="SubBody" class="flex-1 overflow-auto p-3">
        <transition mode="out-in">
          <InputTextarea
            v-if="!mainUnit().task"
            data-testid="SubMemo"
            class="theme-color-back anime-fade-item size-full"
            :placeholder="i18next.t(`placeholder.memo`)"
            :model-value="textMemo()"
            @input="emit(`convertItem`, { text: ($event.target as HTMLInputElement).value })"
          />
          <ul v-else data-id="SubBody" class="anime-fade-item">
            <transition-group>
              <li
                v-for="(subId, index) of subFull().sort"
                :key="`list${listId()}main${mainId()}sub${subId}`"
                :data-id="`SubItem${subId}`"
                data-testid="SubItem"
                class="theme-color-border theme-color-back trans-select-text trans-edit-item trans-check-item anime-scale-item group relative flex items-start gap-3 overflow-hidden border-b-[0.1rem] border-solid p-3"
                :class="classStatus(subId)"
              >
                <InputCheck v-model="subUnit({ subId }).check" data-testid="SubCheck" class="peer/check flex-initial" />
                <InputTextarea
                  v-model="subUnit({ subId }).title"
                  :data-id="`SubTask${subId}`"
                  data-testid="SubTask"
                  class="peer/text flex-1 !p-0"
                  :placeholder="i18next.t(`placeholder.sub`)"
                  sizing="content"
                  @keydown.enter.prevent="
                    emit(`divideItem`, { subId, caret: ($event.target as HTMLInputElement).selectionStart! })
                  "
                  @keydown.backspace="
                    index > 0 &&
                      ($event.target as HTMLInputElement).selectionStart === 0 &&
                      ($event.target as HTMLInputElement).selectionEnd === 0 &&
                      ($event.preventDefault(), emit(`connectItem`, { subId }))
                  "
                />
                <IconDrag
                  data-testid="SubDrag"
                  class="flex-initial"
                  @touchstart="emit(`dragInit`, { subId, y: $event.changedTouches[0]?.clientY })"
                  @mousedown="emit(`dragInit`, { subId, y: $event.clientY })"
                />
                <transition>
                  <IconTrash
                    data-testid="SubTrash"
                    class="theme-color-back trans-option-text absolute right-3 translate-x-[150%]"
                    @click="emit(`deleteItem`, { subId })"
                  />
                </transition>
              </li>
            </transition-group>
          </ul>
        </transition>
      </div>
      <div
        data-testid="SubFoot"
        class="theme-color-grad theme-shadow-outer flex flex-initial items-center gap-3 p-3"
        :class="classLimit()"
      >
        <InputTextbox
          data-testid="SubCalendar"
          class="w-full flex-1"
          :placeholder="i18next.t(`placeholder.date`)"
          :model-value="mainUnit().date"
          readonly
          @click="emit(`openCalendar`)"
        />
        <InputTextbox
          data-testid="SubClock"
          class="w-full flex-1"
          :placeholder="i18next.t(`placeholder.time`)"
          :model-value="mainUnit().time"
          readonly
          @click="emit(`openClock`)"
        />
        <InputTextbox
          data-testid="SubDialog"
          class="w-full flex-1"
          :placeholder="i18next.t(`placeholder.alarm`)"
          :model-value="textAlarm()"
          readonly
          @click="emit(`openAlarm`)"
        />
      </div>
    </div>
  </div>
</template>
