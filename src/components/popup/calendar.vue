<script setup lang="ts">
import calendar from "@/stores/popup/calendar";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  temp: typeof calendar.temp;
  state: typeof calendar.state;
  classStatus: typeof calendar.getter.classStatus;
  getWeek: typeof calendar.action.getWeek;
  getDay: typeof calendar.action.getDay;
}>();
const emit = defineEmits<{
  close: [];
  pageMove: [arg: { mode: `prev` | `next` }];
  swipeInit: [arg: { x: number; y: number }];
  swipeStart: [arg: { x: number; y: number }];
  swipeMove: [arg: { x: number }];
  swipeEnd: [arg: { x: number }];
}>();
</script>

<template>
  <BasePopup
    data-id="CalendarRoot"
    data-testid="CalendarRoot"
    :open="state.open"
    @touchmove="
      emit(`swipeStart`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY });
      emit(`swipeMove`, { x: $event.changedTouches[0]!.clientX });
    "
    @mousemove="
      emit(`swipeStart`, { x: $event.clientX, y: $event.clientY });
      emit(`swipeMove`, { x: $event.clientX });
    "
    @touchend="emit(`swipeEnd`, { x: $event.changedTouches[0]!.clientX })"
    @mouseup="emit(`swipeEnd`, { x: $event.clientX })"
  >
    <div class="flex flex-initial flex-col gap-3">
      <div class="flex flex-initial items-center">
        <IconPrev data-testid="CalendarPrev" class="flex-initial" @click="emit(`pageMove`, { mode: `prev` })" />
        <p data-testid="CalendarCurrent" class="flex-1 text-center">{{ state.current }}</p>
        <IconNext data-testid="CalendarNext" class="flex-initial" @click="emit(`pageMove`, { mode: `next` })" />
      </div>
      <ul class="flex flex-initial">
        <li
          v-for="week of getWeek()"
          :key="`week${week}`"
          data-testid="CalendarWeek"
          class="flex-1 text-center text-xs"
        >
          {{ week }}
        </li>
      </ul>
    </div>
    <div data-id="CalendarBody" class="flex-initial overflow-x-hidden">
      <div
        data-id="CalendarArea"
        data-testid="CalendarArea"
        class="trans-slide-calendar flex h-64 w-[300%] translate-x-[-33.33%]"
        @touchstart="emit(`swipeInit`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY })"
        @mousedown="emit(`swipeInit`, { x: $event.clientX, y: $event.clientY })"
      >
        <ul
          v-for="month in getDay()"
          :key="`month${month.id}`"
          data-testid="CalendarMonth"
          class="flex flex-1 flex-wrap"
        >
          <li
            v-for="day in month.day"
            :key="`month${month.id}day${day.id}`"
            data-testid="CalendarDay"
            class="flex flex-[0_0_14.285%] items-center justify-center border-[0.1rem] border-solid border-transparent [&.hide]:invisible [&.select]:!border-theme-fine [&.today]:text-theme-fine"
            :class="classStatus(month.id, day.id)"
            @click="temp.callback(day.id)"
          >
            {{ day.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-initial justify-end gap-3">
      <InputButton data-testid="CalendarCancel" class="flex-initial text-theme-fine" @click="emit(`close`)">{{
        state.cancel
      }}</InputButton>
      <InputButton data-testid="CalendarClear" class="flex-initial text-theme-warn" @click="temp.callback(``)">{{
        state.clear
      }}</InputButton>
    </div>
  </BasePopup>
</template>
