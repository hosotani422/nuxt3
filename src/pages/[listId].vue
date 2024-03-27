<script setup lang="ts">
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
</script>

<template>
  <PageMain
    :refer="main.refer"
    :status="main.state.status"
    :list-id="app.getter.listId"
    :list-unit="list.getter.stateUnit"
    :state-full="main.getter.stateFull"
    :state-unit="main.getter.stateUnit"
    :class-item="main.getter.classItem"
    :class-limit="main.getter.classLimit"
    :text-count="main.getter.textCount"
    @router-list="app.action.routerList"
    @router-sub="app.action.routerSub"
    @router-conf="app.action.routerConf"
    @insert-item="main.action.insertItem"
    @copy-item="main.action.copyItem"
    @move-item="main.action.moveItem"
    @delete-item="main.action.deleteItem"
    @check-item="main.action.checkItem"
    @switch-edit="main.action.switchEdit"
    @drag-init="main.action.dragInit"
    @drag-start="main.action.dragStart"
    @drag-move="main.action.dragMove"
    @drag-end="main.action.dragEnd"
  />
</template>
