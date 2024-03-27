<script setup lang="ts">
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
</script>

<template>
  <PageSub
    :refer="sub.refer"
    :list-id="app.getter.listId"
    :main-id="app.getter.mainId"
    :main-unit="main.getter.stateUnit"
    :state-full="sub.getter.stateFull"
    :state-unit="sub.getter.stateUnit"
    :class-item="sub.getter.classItem"
    :text-memo="sub.getter.textMemo"
    :class-limit="sub.getter.classLimit"
    :text-alarm="sub.getter.textAlarm"
    @router-back="app.action.routerBack"
    @input-item="sub.action.inputItem"
    @enter-item="sub.action.enterItem"
    @back-item="sub.action.backItem"
    @delete-item="sub.action.deleteItem"
    @check-item="sub.action.checkItem"
    @switch-item="sub.action.switchItem"
    @switch-edit="sub.action.switchEdit"
    @input-memo="sub.action.inputMemo"
    @open-calendar="sub.action.openCalendar"
    @open-clock="sub.action.openClock"
    @open-alarm="sub.action.openAlarm"
    @drag-init="sub.action.dragInit"
    @drag-start="sub.action.dragStart"
    @drag-move="sub.action.dragMove"
    @drag-end="sub.action.dragEnd"
    @swipe-init="sub.action.swipeInit"
    @swipe-start="sub.action.swipeStart"
    @swipe-move="sub.action.swipeMove"
    @swipe-end="sub.action.swipeEnd"
  />
</template>
