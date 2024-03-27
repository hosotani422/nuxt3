<script setup lang="ts">
import * as Vue from "vue";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  refer: typeof main.refer;
  status: typeof main.state.status;
  listId: typeof app.getter.listId;
  listUnit: typeof list.getter.stateUnit;
  stateFull: typeof main.getter.stateFull;
  stateUnit: typeof main.getter.stateUnit;
  classItem: typeof main.getter.classItem;
  classLimit: typeof main.getter.classLimit;
  textCount: typeof main.getter.textCount;
}>();
const emit = defineEmits([
  `routerList`,
  `routerSub`,
  `routerConf`,
  `insertItem`,
  `copyItem`,
  `moveItem`,
  `deleteItem`,
  `checkItem`,
  `switchEdit`,
  `dragInit`,
  `dragStart`,
  `dragMove`,
  `dragEnd`,
]);
const wrap = ref<Vue.ComponentPublicInstance<HTMLElement>>();
const items = ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>({});
props.refer.wrap = wrap;
props.refer.items = items;
</script>

<template>
  <div
    data-testid="MainRoot"
    class="theme-grad-color absolute inset-0 z-[1] flex flex-col"
    @click="emit(`switchEdit`)"
    @mousemove.prevent="
      emit(`dragStart`);
      emit(`dragMove`, { clientY: $event.clientY });
    "
    @mouseup="emit(`dragEnd`)"
    @touchmove.prevent="
      emit(`dragStart`);
      emit(`dragMove`, { clientY: $event.changedTouches[0]!.clientY });
    "
    @touchend="emit(`dragEnd`)"
  >
    <div
      data-testid="MainHead"
      class="theme-grad-color theme-shadow-normal relative z-[9] flex flex-auto items-center gap-3 p-3"
    >
      <IconList data-testid="MainList" class="flex-auto" @click="emit(`routerList`)" />
      <ClientOnly class="flex-even">
        <InputTextbox
          v-model="listUnit().title"
          data-testid="MainTitle"
          class="flex-even text-xl"
          :placeholder="$t(`placeholder.list`)"
        />
      </ClientOnly>
      <IconConf data-testid="MainConf" class="flex-auto" @click="emit(`routerConf`)" />
      <IconPlus data-testid="MainPlus" class="flex-auto" @click="emit(`insertItem`)" />
    </div>
    <ul ref="wrap" data-testid="MainBody" class="flex-even select-none overflow-auto p-3">
      <ClientOnly>
        <transition-group appear>
          <li
            v-for="mainId of stateFull().sort"
            :ref="
              (el: Vue.ComponentPublicInstance<any>) => {
                if (el) {
                  items[mainId] = el;
                }
              }
            "
            :key="`list${listId()}main${mainId}`"
            data-testid="MainItem"
            class="theme-back-color scale-up [&.select]:theme-shadow-inner [&.edit]:theme-shadow-outer [&.drag]:theme-shadow-outer relative flex h-16 items-center gap-3 overflow-hidden border-b-[0.1rem] border-solid border-b-font-dark p-3 [&.check]:line-through [&.check]:opacity-50 [&.drag]:z-[1] [&.drag]:scale-[1.03] [&.edit]:z-[1] [&.edit]:scale-[1.03] [&.hide]:invisible"
            :class="classItem(mainId)"
            @contextmenu.prevent
            @click="status[mainId] !== `edit` && emit(`routerSub`, { mainId })"
            @longclick="
              emit(`switchEdit`, { mainId });
              emit(`dragInit`, { mainId, clientY: $event.detail.clientY });
            "
            @longtouch="
              emit(`switchEdit`, { mainId });
              emit(`dragInit`, { mainId, clientY: $event.detail.changedTouches[0]!.clientY });
            "
          >
            <InputCheck
              data-testid="MainCheck"
              class="flex-auto"
              :model-value="stateUnit(``, mainId).check"
              @change="emit(`checkItem`, { event: $event, mainId, checked: $event.target.checked })"
              @click.stop
            />
            <div data-testid="MainTask" class="line-clamp-1 flex-even" :class="classLimit(mainId)">
              {{ stateUnit(``, mainId).title }}
            </div>
            <div data-testid="MainCount" class="flex-auto" :class="classLimit(mainId)">
              {{ textCount(mainId) }}
            </div>
            <transition>
              <div v-if="classItem(mainId).edit" class="slide-right theme-back-color absolute right-3 flex gap-3">
                <IconClone
                  data-testid="MainClone"
                  class="flex-auto"
                  :class="classLimit(mainId)"
                  @click.stop="emit(`copyItem`, { mainId })"
                />
                <IconMove
                  data-testid="MainMove"
                  class="flex-auto"
                  :class="classLimit(mainId)"
                  @click.stop="emit(`moveItem`, { mainId })"
                />
                <IconTrash
                  data-testid="MainTrash"
                  class="flex-auto"
                  :class="classLimit(mainId)"
                  @click.stop="emit(`deleteItem`, { mainId })"
                />
              </div>
            </transition>
          </li>
        </transition-group>
      </ClientOnly>
    </ul>
    <router-view v-slot="slot">
      <transition>
        <component :is="slot?.Component" />
      </transition>
    </router-view>
  </div>
</template>
