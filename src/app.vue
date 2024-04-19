<script setup lang="ts">
import Cordova from "@/utils/cordova/cordova";
import app from "@/stores/page/app";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";
await app.action.initPage();
onBeforeMount(() => {
  Cordova.Admob.mountBanner();
});
onMounted(() => {
  Cordova.Splash.hideMount();
});
</script>

<template>
  <Html data-testid="AppRoot" class="theme-font-color" :class="app.getter.classTop()">
    <Head>
      <Title data-testid="AppTitle">Memotea</Title>
      <Meta data-testid="AppCharset" charset="utf-8" />
      <Meta data-testid="AppViewport" name="viewport" content="width=device-width, initial-scale=1" />
      <Meta data-testid="AppDescription" name="description" content="メモ帳、TODOアプリ" />
      <Link data-testid="AppIcon" rel="icon" href="/favicon.png" />
      <NoScript data-testid="AppNoScript">JavaScript is required</NoScript>
    </Head>
    <Body>
      <div class="fixed inset-0 z-[1] flex flex-col">
        <div class="flex-even">
          <NuxtPage page-key="pageKey" />
          <PopupCalendar
            :refer="calendar.refer"
            :state="calendar.state"
            :text-week="calendar.getter.textWeek"
            :text-day="calendar.getter.textDay"
            :class-day="calendar.getter.classDay"
            @close="calendar.action.close"
            @page-move="calendar.action.pageMove"
            @swipe-init="calendar.action.swipeInit"
            @swipe-start="calendar.action.swipeStart"
            @swipe-move="calendar.action.swipeMove"
            @swipe-end="calendar.action.swipeEnd"
          />
          <PopupClock
            :refer="clock.refer"
            :state="clock.state"
            @close="clock.action.close"
            @input-hour="clock.action.inputHour"
            @input-minute="clock.action.inputMinute"
          />
          <PopupDialog
            :state="dialog.state"
            :state-check-all="dialog.getter.stateCheckAll"
            @validate-title="dialog.action.validateTitle"
            @click-check-all="dialog.action.clickCheckAll"
          />
          <PopupNotice :state="notice.state" />
        </div>
        <div
          v-if="app.getter.isApp()"
          data-testid="AppFoot"
          class="theme-back-color"
          :class="app.getter.classBottom()"
        />
      </div>
    </Body>
  </Html>
</template>
