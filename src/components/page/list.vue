<script setup lang="ts">
import constants from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  constant: typeof constants;
  status: typeof list.state.status;
  selectId: typeof app.getter.listId;
  classStatus: typeof list.getter.classStatus;
  classLimit: typeof list.getter.classLimit;
  typeIcon: typeof list.getter.typeIcon;
  textCount: typeof list.getter.textCount;
  listFull: typeof list.action.getFull;
  listUnit: typeof list.action.getUnit;
}>();
const emit = defineEmits<{
  routerBack: [arg?: { listId: string }];
  entryItem: [];
  copyItem: [arg: { listId: string }];
  deleteItem: [arg: { listId: string }];
  editItem: [arg?: { listId: string }];
  dragInit: [arg: { listId: string; y: number }];
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
    data-id="ListRoot"
    data-testid="ListRoot"
    class="theme-color-mask anime-slide-list absolute inset-y-0 left-0 z-10 w-[200%]"
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
    @click="emit(`editItem`)"
  >
    <div
      data-testid="ListBack"
      class="absolute inset-y-0 right-0 z-[1] w-[57%]"
      @touchstart="emit(`swipeInit`, { x: $event.changedTouches[0]!.clientX, y: $event.changedTouches[0]!.clientY })"
      @mousedown="emit(`swipeInit`, { x: $event.clientX, y: $event.clientY })"
    />
    <div
      data-testid="ListHome"
      class="theme-color-grad theme-shadow-outer absolute inset-y-0 left-0 z-[1] flex w-[43%] flex-col"
    >
      <div
        data-testid="ListHead"
        class="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
      >
        <IconPlus data-testid="ListPlus" class="flex-initial" @click="emit(`entryItem`)" />
        <p data-testid="ListTitle" class="line-clamp-1 flex-1 text-xl">{{ constant.base.app.name }}</p>
        <IconLeft data-testid="ListLeft" class="flex-initial" @click="emit(`routerBack`)" />
      </div>
      <ul data-id="ListBody" data-testid="ListBody" class="flex-1 select-none overflow-auto p-3">
        <transition-group>
          <li
            v-for="listId of listFull().sort"
            :key="`list${listId}`"
            :data-id="`ListItem${listId}`"
            data-testid="ListItem"
            class="theme-color-border theme-color-back trans-select-label trans-edit-item anime-scale-item group relative flex h-16 items-center gap-3 overflow-hidden border-b-[0.1rem] border-solid p-3"
            :class="{ ...classStatus(listId), ...classLimit(listId) }"
            @contextmenu.prevent
            @longtouch="
              emit(`editItem`, { listId });
              emit(`dragInit`, { listId, y: $event.detail.changedTouches[0]!.clientY });
            "
            @longclick="
              emit(`editItem`, { listId });
              emit(`dragInit`, { listId, y: $event.detail.clientY });
            "
            @click="status[listId] !== `edit` && emit(`routerBack`, { listId })"
          >
            <component :is="typeIcon(listId)" data-testid="ListIcon" class="flex-initial" />
            <p data-testid="ListTask" class="line-clamp-1 flex-1">
              {{ listUnit({ listId }).title }}
            </p>
            <p data-testid="ListCount" class="flex-initial">
              {{ textCount(listId) }}
            </p>
            <div class="theme-color-back trans-option-label absolute right-3 flex translate-x-[150%] gap-3">
              <IconClone
                v-if="listId !== constant.base.id.trash"
                data-testid="ListClone"
                class="flex-initial"
                @click.stop="emit(`copyItem`, { listId })"
              />
              <IconTrash
                v-if="listId !== selectId() && listId !== constant.base.id.trash"
                data-testid="ListTrash"
                class="flex-initial"
                @click.stop="emit(`deleteItem`, { listId })"
              />
            </div>
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>
