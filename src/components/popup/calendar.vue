<script setup lang="ts">
import Vue from "vue";
import calendar from "@/stores/popup/calendar";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  refer: typeof calendar.refer;
  state: typeof calendar.state;
  textWeek: typeof calendar.getter.textWeek;
  textDay: typeof calendar.getter.textDay;
  classDay: typeof calendar.getter.classDay;
}>();
const emit = defineEmits([`close`, `pageMove`, `swipeInit`, `swipeStart`, `swipeMove`, `swipeEnd`]);
const body = ref<Vue.ComponentPublicInstance<HTMLElement>>();
const area = ref<Vue.ComponentPublicInstance<HTMLElement>>();
props.refer.body = body;
props.refer.area = area;
</script>

<template>
  <BasePopup
    data-testid="CalendarRoot"
    :open="state.open"
    @mousemove="
      emit(`swipeStart`, { clientX: $event.clientX, clientY: $event.clientY });
      emit(`swipeMove`, { clientX: $event.clientX });
    "
    @mouseup="emit(`swipeEnd`, { clientX: $event.clientX })"
    @touchmove="
      emit(`swipeStart`, {
        clientX: $event.changedTouches[0]!.clientX,
        clientY: $event.changedTouches[0]!.clientY,
      });
      emit(`swipeMove`, { clientX: $event.changedTouches[0]!.clientX });
    "
    @touchend="emit(`swipeEnd`, { clientX: $event.changedTouches[0]!.clientX })"
  >
    <div class="flex flex-auto flex-col gap-4">
      <div class="flex items-center">
        <IconPrev data-testid="CalendarPrev" class="flex-auto" @click="emit(`pageMove`, { prev: true })" />
        <p data-testid="CalendarCurrent" class="flex-even text-center">{{ state.current }}</p>
        <IconNext data-testid="CalendarNext" class="flex-auto" @click="emit(`pageMove`, { prev: false })" />
      </div>
      <ul class="flex">
        <li
          v-for="week of textWeek()"
          :key="`week${week}`"
          data-testid="CalendarWeek"
          class="flex-even text-center text-xs"
        >
          {{ week }}
        </li>
      </ul>
    </div>
    <div ref="body" class="flex-auto overflow-hidden">
      <div
        ref="area"
        data-testid="CalendarArea"
        class="flex h-[15rem] w-[300%] translate-x-[-33.33%] current:transition-transform speed1:current:duration-1000 speed2:current:duration-500 speed3:current:duration-200 [&.back]:translate-x-[-33.333%] [&.next]:translate-x-[-66.666%] [&.prev]:translate-x-0"
        @mousedown="
          emit(`swipeInit`, {
            target: $event.currentTarget,
            clientX: $event.clientX,
            clientY: $event.clientY,
          })
        "
        @touchstart="
          emit(`swipeInit`, {
            target: $event.currentTarget,
            clientX: $event.changedTouches[0]!.clientX,
            clientY: $event.changedTouches[0]!.clientY,
          })
        "
      >
        <ul
          v-for="month in textDay()"
          :key="`month${month.id}`"
          data-testid="CalendarMonth"
          class="flex flex-even flex-wrap"
        >
          <li
            v-for="day in month.day"
            :key="`month${month.id}day${day.day}`"
            data-testid="CalendarDay"
            class="flex flex-[0_0_14.285%] items-center justify-center border-[0.1rem] border-solid border-transparent p-2 text-base [&.hide]:invisible [&.select]:!border-[0.1rem] [&.select]:!border-solid [&.select]:!border-[#303030] [&.select]:bg-theme-fine [&.select]:text-font-dark [&.select]:shadow-[0_0_0_0.1rem_#303030_inset] [&.today]:!border-[0.1rem] [&.today]:!border-solid [&.today]:!border-theme-fine"
            :class="classDay(month.id, day.day)"
            @click="state.callback(day.day)"
          >
            {{ day.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-auto justify-end gap-4">
      <InputButton data-testid="CalendarCancel" class="flex-auto text-theme-fine" @click="emit(`close`)">{{
        state.cancel
      }}</InputButton>
      <InputButton data-testid="CalendarClear" class="flex-auto text-theme-warn" @click="state.callback()">{{
        state.clear
      }}</InputButton>
    </div>
  </BasePopup>
</template>
