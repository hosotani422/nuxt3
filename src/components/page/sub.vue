<script setup lang="ts">
import * as Vue from "vue";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  refer: typeof sub.refer;
  lang: typeof app.getter.lang;
  listId: typeof app.getter.listId;
  mainId: typeof app.getter.mainId;
  mainUnit: typeof main.getter.stateUnit;
  stateFull: typeof sub.getter.stateFull;
  stateUnit: typeof sub.getter.stateUnit;
  classItem: typeof sub.getter.classItem;
  textMemo: typeof sub.getter.textMemo;
  classLimit: typeof sub.getter.classLimit;
  textAlarm: typeof sub.getter.textAlarm;
}>();
const emit = defineEmits([
  `routerBack`,
  `inputItem`,
  `enterItem`,
  `backItem`,
  `deleteItem`,
  `checkItem`,
  `switchItem`,
  `switchEdit`,
  `inputMemo`,
  `openCalendar`,
  `openClock`,
  `openAlarm`,
  `dragInit`,
  `dragStart`,
  `dragMove`,
  `dragEnd`,
  `swipeInit`,
  `swipeStart`,
  `swipeMove`,
  `swipeEnd`,
]);
const home = ref<Vue.ComponentPublicInstance<HTMLElement>>();
const wrap = ref<Vue.ComponentPublicInstance<HTMLElement>>();
const items = ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>({});
const titles = ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>({});
props.refer.home = home;
props.refer.wrap = wrap;
props.refer.items = items;
props.refer.titles = titles;
</script>

<template>
  <div
    data-testid="SubRoot"
    class="theme-mask-color absolute inset-y-0 right-0 z-[10] w-[200%] active:transition speed1:active:duration-1000 speed2:active:duration-500 speed3:active:duration-200 fromto:!translate-x-[50%] fromto:!bg-transparent"
    @touchstart.capture="emit(`switchEdit`)"
    @mousemove.prevent="
      emit(`dragStart`);
      emit(`dragMove`, { clientY: $event.clientY });
    "
    @mousemove="
      emit(`swipeStart`, {
        clientX: $event.clientX,
        clientY: $event.clientY,
      });
      emit(`swipeMove`, { clientX: $event.clientX });
    "
    @mouseup="
      emit(`dragEnd`);
      emit(`swipeEnd`, { clientX: $event.clientX });
    "
    @touchmove.prevent="
      emit(`dragStart`);
      emit(`dragMove`, { clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0 });
    "
    @touchmove="
      emit(`swipeStart`, {
        clientX: $event.changedTouches ? $event.changedTouches[0]!.clientX : 0,
        clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0,
      });
      emit(`swipeMove`, { clientX: $event.changedTouches ? $event.changedTouches[0]!.clientX : 0 });
    "
    @touchend="
      emit(`dragEnd`);
      emit(`swipeEnd`, { clientX: $event.changedTouches ? $event.changedTouches[0]!.clientX : 0 });
    "
  >
    <div
      data-testid="SubBack"
      class="absolute left-0 top-0 z-[1] h-[100%] w-[57%]"
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
      ref="home"
      data-testid="SubHome"
      class="theme-grad-color theme-shadow-reverse absolute inset-y-0 left-[57%] z-[1] flex w-[43%] flex-col"
    >
      <div
        data-testid="SubHead"
        class="theme-grad-color theme-shadow-normal relative z-[9] flex flex-auto items-center gap-3 p-3"
      >
        <IconRight data-testid="SubRight" class="flex-auto" @click="emit(`routerBack`)" />
        <InputTextbox
          v-model="mainUnit().title"
          data-testid="SubTitle"
          class="flex-even text-xl"
          :placeholder="lang().placeholder.main"
        />
        <IconMode data-testid="SubMode" class="flex-auto" @click="emit(`switchItem`)" />
      </div>
      <div data-testid="SubBody" class="flex-even overflow-auto p-3">
        <transition mode="out-in">
          <InputTextarea
            v-if="!mainUnit().task"
            data-testid="SubMemo"
            class="theme-back-color fade-normal size-full"
            :placeholder="lang().placeholder.memo"
            :model-value="textMemo()"
            @input="emit(`inputMemo`, { value: ($event.target as HTMLInputElement).value })"
          />
          <ul v-else ref="wrap" class="fade-normal">
            <transition-group>
              <li
                v-for="(subId, index) of stateFull().sort"
                :ref="
                  (el: Vue.ComponentPublicInstance<any>) => {
                    if (el) {
                      items[subId] = el;
                    }
                  }
                "
                :key="`list${listId()}main${mainId()}sub${subId}`"
                data-testid="SubItem"
                class="theme-back-color scale-up [&.edit]:theme-shadow-outer [&.drag]:theme-shadow-outer relative flex items-start gap-3 overflow-hidden border-b-[0.1rem] border-solid border-b-font-dark p-3 [&.check]:line-through [&.check]:opacity-50 [&.drag]:z-[1] [&.drag]:scale-[1.03] [&.edit]:z-[1] [&.edit]:scale-[1.03] [&.hide]:invisible"
                :class="classItem(subId)"
              >
                <InputCheck
                  data-testid="SubCheck"
                  class="flex-auto"
                  :model-value="stateUnit(``, ``, subId).check"
                  @change="
                    emit(`checkItem`, {
                      subId,
                      checked: ($event.target as HTMLInputElement).checked,
                    })
                  "
                />
                <InputTextarea
                  :ref="
                    (el: Vue.ComponentPublicInstance<any>) => {
                      if (el) {
                        titles[subId] = el;
                      }
                    }
                  "
                  v-model="stateUnit(``, ``, subId).title"
                  v-height
                  data-testid="SubTask"
                  class="flex-even !p-0"
                  :placeholder="lang().placeholder.sub"
                  @click="emit(`switchEdit`, { subId })"
                  @keydown.enter.prevent="
                    emit(`enterItem`, {
                      subId,
                      selectionStart: ($event.target as HTMLInputElement).selectionStart,
                    })
                  "
                  @keydown.backspace="
                    index > 0 &&
                      ($event.target as HTMLInputElement).selectionStart === 0 &&
                      ($event.preventDefault(), emit(`backItem`, { subId }))
                  "
                  @input="emit(`inputItem`, { subId })"
                />
                <IconDrag
                  data-testid="SubDrag"
                  @mousedown="
                    emit(`dragInit`, {
                      subId,
                      clientY: $event.clientY,
                    })
                  "
                  @touchstart="
                    emit(`dragInit`, {
                      subId,
                      clientY: $event.changedTouches ? $event.changedTouches[0]?.clientY : 0,
                    })
                  "
                />
                <transition>
                  <IconTrash
                    v-if="stateFull().sort.length > 1 && classItem(subId).edit"
                    data-testid="SubTrash"
                    class="slide-right theme-back-color absolute right-3"
                    @touchstart="emit(`deleteItem`, { subId })"
                  />
                </transition>
              </li>
            </transition-group>
          </ul>
        </transition>
      </div>
      <div class="theme-grad-color theme-shadow-reverse relative z-[9] flex flex-auto items-center gap-3 p-3">
        <InputTextbox
          data-testid="SubCalendar"
          class="w-full flex-even"
          :class="classLimit()"
          :placeholder="lang().placeholder.date"
          :model-value="mainUnit().date"
          readonly
          @focus="emit(`openCalendar`, { date: mainUnit().date })"
        />
        <InputTextbox
          data-testid="SubClock"
          class="w-full flex-even"
          :class="classLimit()"
          :placeholder="lang().placeholder.time"
          :model-value="mainUnit().time"
          readonly
          @focus="emit(`openClock`, { time: mainUnit().time })"
        />
        <InputTextbox
          data-testid="SubDialog"
          class="w-full flex-even"
          :class="classLimit()"
          :placeholder="lang().placeholder.alarm"
          :model-value="textAlarm()"
          readonly
          @focus="emit(`openAlarm`)"
        />
      </div>
    </div>
  </div>
</template>
