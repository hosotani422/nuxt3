<script setup lang="ts">
import * as Vue from "vue";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  refer: typeof list.refer;
  title: string;
  trashId: string;
  status: typeof list.state.status;
  getListId: typeof app.getter.listId;
  stateFull: typeof list.getter.stateFull;
  stateUnit: typeof list.getter.stateUnit;
  classItem: typeof list.getter.classItem;
  iconType: typeof list.getter.iconType;
  classLimit: typeof list.getter.classLimit;
  textCount: typeof list.getter.textCount;
}>();
const emit = defineEmits([
  `routerBack`,
  `insertItem`,
  `copyItem`,
  `deleteItem`,
  `switchEdit`,
  `dragInit`,
  `dragStart`,
  `dragMove`,
  `dragEnd`,
  `swipeInit`,
  `swipeStart`,
  `swipeMove`,
  `swipeEnd`,
]);
const wrap = ref<Vue.ComponentPublicInstance<HTMLElement>>();
const items = ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>({});
props.refer.wrap = wrap;
props.refer.items = items;
</script>

<template>
  <div
    data-testid="ListRoot"
    class="theme-mask-color absolute inset-y-0 left-0 z-[10] w-[200%] active:transition speed1:active:duration-1000 speed2:active:duration-500 speed3:active:duration-200 fromto:!translate-x-[-50%] fromto:!bg-transparent"
    @click="emit(`switchEdit`)"
    @touchstart.self="
      emit(`swipeInit`, {
        target: $event.currentTarget,
        clientX: $event.changedTouches ? $event.changedTouches[0]!.clientX : 0,
        clientY: $event.changedTouches ? $event.changedTouches[0]!.clientY : 0,
      })
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
    <div class="theme-grad-color theme-shadow-normal absolute inset-y-0 left-0 z-[1] flex w-[43%] flex-col">
      <div class="theme-grad-color theme-shadow-normal relative z-[9] flex flex-auto items-center gap-3 p-3">
        <IconPlus data-testid="ListPlus" class="flex-auto" @click="emit(`insertItem`)" />
        <p data-testid="ListTitle" class="line-clamp-1 flex-even text-xl">{{ title }}</p>
        <IconLeft data-testid="ListLeft" class="flex-auto" @click="emit(`routerBack`)" />
      </div>
      <ul ref="wrap" class="flex-even select-none overflow-auto p-3">
        <transition-group>
          <li
            v-for="listId of stateFull().sort"
            :key="`list${listId}`"
            :ref="
              (el: Vue.ComponentPublicInstance<any>) => {
                if (el) {
                  items[listId] = el;
                }
              }
            "
            data-testid="ListItem"
            class="theme-back-color scale-up [&.select]:theme-shadow-inner [&.edit]:theme-shadow-outer relative flex h-16 items-center gap-3 overflow-hidden border-b-[0.1rem] border-solid border-b-font-dark p-3 [&.edit]:z-[1] [&.edit]:scale-[1.03] [&.hide]:invisible"
            :class="classItem(listId)"
            @touchlong="
              emit(`switchEdit`, { listId });
              emit(`dragInit`, {
                listId,
                clientY: $event.detail ? $event.detail.changedTouches[0]!.clientY : 0,
              });
            "
            @click="status[listId] !== `edit` && emit(`routerBack`, { listId })"
            @contextmenu.prevent
          >
            <component :is="iconType(listId)" />
            <p data-testid="ListTask" class="line-clamp-1 flex-even" :class="classLimit(listId)">
              {{ stateUnit(listId).title }}
            </p>
            <p data-testid="ListCount" class="flex-auto" :class="classLimit(listId)">
              {{ textCount(listId) }}
            </p>
            <transition>
              <div v-if="classItem(listId).edit" class="slide-right theme-back-color absolute right-3 flex gap-3">
                <IconClone
                  v-if="listId !== trashId"
                  data-testid="ListClone"
                  :class="classLimit(listId)"
                  @click.stop="emit(`copyItem`, { listId })"
                />
                <IconTrash
                  v-if="listId !== getListId() && listId !== trashId"
                  data-testid="ListTrash"
                  :class="classLimit(listId)"
                  @click.stop="emit(`deleteItem`, { listId })"
                />
              </div>
            </transition>
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>
