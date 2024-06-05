<script setup lang="ts">
import app from "@/stores/page/app";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";
await app.action.init();
</script>

<template>
  <Html
    data-testid="AppRoot"
    class="theme-color-font"
    :class="[app.getter.classTheme(), app.getter.classSize(), app.getter.classSpeed()]"
  >
    <Head>
      <Title data-testid="AppTitle">Memosuku</Title>
      <Meta data-testid="AppCharset" charset="utf-8" />
      <Meta data-testid="AppViewport" name="viewport" content="width=device-width, initial-scale=1" />
      <Meta data-testid="AppDescription" name="description" content="メモ帳、TODOアプリ" />
      <Link data-testid="AppIcon" rel="icon" href="/favicon.png" />
      <NoScript data-testid="AppNoScript">JavaScript is required</NoScript>
    </Head>
    <Body class="fixed inset-0 z-[1]">
      <NuxtPage page-key="pageKey" />
      <PopupCalendar
        :temp="calendar.temp"
        :state="calendar.state"
        :class-status="calendar.getter.classStatus"
        :get-week="calendar.action.getWeek"
        :get-day="calendar.action.getDay"
        @close="calendar.action.close"
        @page-move="calendar.action.pageMove"
        @swipe-init="calendar.action.swipeInit"
        @swipe-start="calendar.action.swipeStart"
        @swipe-move="calendar.action.swipeMove"
        @swipe-end="calendar.action.swipeEnd"
      />
      <PopupClock
        :temp="clock.temp"
        :state="clock.state"
        @close="clock.action.close"
        @input-time="clock.action.inputTime"
      />
      <PopupDialog
        :temp="dialog.temp"
        :state="dialog.state"
        :state-check-all="dialog.getter.stateCheckAll"
        :error-validation="dialog.getter.errorValidation"
        @click-check-all="dialog.action.clickCheckAll"
      />
      <PopupNotice :temp="notice.temp" :state="notice.state" />
    </Body>
  </Html>
</template>
