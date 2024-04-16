<script setup lang="ts">
import constant from "@/utils/const";
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";
</script>

<template>
  <PageConf
    :title="`${constant.base.title} ${constant.base.version}`"
    :state="conf.state.data"
    @router-back="app.action.routerBack"
    @react-lang="conf.action.reactLang"
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
