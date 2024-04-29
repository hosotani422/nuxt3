<script setup lang="ts">
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
</script>

<template>
  <PageMain
    :status="main.state.status"
    :list-id="app.getter.listId"
    :class-status="main.getter.classStatus"
    :class-limit="main.getter.classLimit"
    :text-count="main.getter.textCount"
    :list-unit="list.action.getUnit"
    :main-full="main.action.getFull"
    :main-unit="main.action.getUnit"
    @router-list="app.action.routerList"
    @router-sub="app.action.routerSub"
    @router-conf="app.action.routerConf"
    @entry-item="main.action.entryItem"
    @copy-item="main.action.copyItem"
    @move-item="main.action.moveItem"
    @delete-item="main.action.deleteItem"
    @edit-item="main.action.editItem"
    @drag-init="main.action.dragInit"
    @drag-start="main.action.dragStart"
    @drag-move="main.action.dragMove"
    @drag-end="main.action.dragEnd"
  />
</template>
