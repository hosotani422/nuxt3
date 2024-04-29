<script setup lang="ts">
import constant from "@/utils/const";
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";
</script>

<template>
  <PageConf
    :update-key="app.state.updateKey"
    :constant="constant"
    :state="conf.state.data"
    @router-back="app.action.routerBack"
    @download-backup="conf.action.downloadBackup"
    @upload-backup="conf.action.uploadBackup"
    @reset-conf="conf.action.resetConf"
    @reset-list="conf.action.resetList"
    @swipe-init="conf.action.swipeInit"
    @swipe-start="conf.action.swipeStart"
    @swipe-move="conf.action.swipeMove"
    @swipe-end="conf.action.swipeEnd"
  />
</template>
