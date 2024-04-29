<script setup lang="ts">
import i18next from "i18next";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  status: typeof main.state.status;
  listId: typeof app.getter.listId;
  classStatus: typeof main.getter.classStatus;
  classLimit: typeof main.getter.classLimit;
  textCount: typeof main.getter.textCount;
  listUnit: typeof list.action.getUnit;
  mainFull: typeof main.action.getFull;
  mainUnit: typeof main.action.getUnit;
}>();
const emit = defineEmits<{
  routerList: [];
  routerSub: [arg: { mainId: string }];
  routerConf: [];
  entryItem: [];
  copyItem: [arg: { mainId: string }];
  moveItem: [arg: { mainId: string }];
  deleteItem: [arg: { mainId: string }];
  editItem: [arg?: { mainId: string }];
  dragInit: [arg: { mainId: string; y: number }];
  dragStart: [];
  dragMove: [arg: { y: number }];
  dragEnd: [];
}>();
</script>

<template>
  <div
    data-testid="MainRoot"
    class="theme-color-grad absolute inset-0 z-[1] flex flex-col"
    @touchmove="
      emit(`dragStart`);
      emit(`dragMove`, { y: $event.changedTouches[0]!.clientY });
    "
    @mousemove="
      emit(`dragStart`);
      emit(`dragMove`, { y: $event.clientY });
    "
    @touchend="emit(`dragEnd`)"
    @mouseup="emit(`dragEnd`)"
    @click="emit(`editItem`)"
  >
    <div
      data-testid="MainHead"
      class="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
    >
      <IconList data-testid="MainList" class="flex-initial" @click="emit(`routerList`)" />
      <client-only>
        <InputTextbox
          v-model="listUnit().title"
          data-testid="MainTitle"
          class="flex-1 text-xl"
          :placeholder="i18next.t(`placeholder.list`)"
        />
      </client-only>
      <IconConf data-testid="MainConf" class="flex-initial" @click="emit(`routerConf`)" />
      <IconPlus data-testid="MainPlus" class="flex-initial" @click="emit(`entryItem`)" />
    </div>
    <ul data-id="MainBody" data-testid="MainBody" class="flex-1 select-none overflow-auto p-3">
      <client-only>
        <transition-group appear>
          <li
            v-for="mainId of mainFull().sort"
            :key="`list${listId()}main${mainId}`"
            :data-id="`MainItem${mainId}`"
            data-testid="MainItem"
            class="theme-color-border theme-color-back trans-select-label trans-edit-item trans-check-item anime-scale-item group relative flex h-16 items-center gap-3 overflow-hidden border-b-[0.1rem] border-solid p-3"
            :class="{ ...classStatus(mainId), ...classLimit(mainId) }"
            @contextmenu.prevent
            @longtouch="
              emit(`editItem`, { mainId });
              emit(`dragInit`, { mainId, y: $event.detail.changedTouches[0]!.clientY });
            "
            @longclick="
              emit(`editItem`, { mainId });
              emit(`dragInit`, { mainId, y: $event.detail.clientY });
            "
            @click="status[mainId] !== `edit` && emit(`routerSub`, { mainId })"
          >
            <InputCheck v-model="mainUnit({ mainId }).check" data-testid="MainCheck" class="flex-initial" @click.stop />
            <div data-testid="MainTask" class="line-clamp-1 flex-1">
              {{ mainUnit({ mainId }).title }}
            </div>
            <div data-testid="MainCount" class="flex-initial">
              {{ textCount(mainId) }}
            </div>
            <div class="theme-color-back trans-option-label absolute right-3 flex translate-x-[150%] gap-3">
              <IconClone data-testid="MainClone" class="flex-initial" @click.stop="emit(`copyItem`, { mainId })" />
              <IconMove data-testid="MainMove" class="flex-initial" @click.stop="emit(`moveItem`, { mainId })" />
              <IconTrash data-testid="MainTrash" class="flex-initial" @click.stop="emit(`deleteItem`, { mainId })" />
            </div>
          </li>
        </transition-group>
      </client-only>
    </ul>
    <router-view v-slot="slot">
      <transition>
        <component :is="slot?.Component" />
      </transition>
    </router-view>
  </div>
</template>
