<script setup lang="ts">
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
</script>

<template>
  <PageSub
    :list-id="app.getter.listId"
    :main-id="app.getter.mainId"
    :class-status="sub.getter.classStatus"
    :class-limit="sub.getter.classLimit"
    :text-memo="sub.getter.textMemo"
    :text-alarm="sub.getter.textAlarm"
    :main-unit="main.action.getUnit"
    :sub-full="sub.action.getFull"
    :sub-unit="sub.action.getUnit"
    @router-back="app.action.routerBack"
    @toggle-mode="sub.action.toggleMode"
    @convert-item="sub.action.convertItem"
    @divide-item="sub.action.divideItem"
    @connect-item="sub.action.connectItem"
    @delete-item="sub.action.deleteItem"
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
