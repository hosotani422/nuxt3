import type { Meta, StoryObj } from "@storybook/vue3";
import PageSub from "@/components/page/sub.vue";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import mock from "../../mock/mock";

const meta: Meta<typeof PageSub> = {
  component: PageSub,
  render: () => ({
    components: { PageSub },
    setup() {
      mock();
      return {
        listId: app.getter.listId,
        mainId: app.getter.mainId,
        classStatus: sub.getter.classStatus,
        classLimit: sub.getter.classLimit,
        textMemo: sub.getter.textMemo,
        textAlarm: sub.getter.textAlarm,
        mainUnit: main.action.getUnit,
        subFull: sub.action.getFull,
        subUnit: sub.action.getUnit,
        routerBack: app.action.routerBack,
        toggleMode: sub.action.toggleMode,
        convertItem: sub.action.convertItem,
        divideItem: sub.action.divideItem,
        connectItem: sub.action.connectItem,
        deleteItem: sub.action.deleteItem,
        openCalendar: sub.action.openCalendar,
        openClock: sub.action.openClock,
        openAlarm: sub.action.openAlarm,
        dragInit: sub.action.dragInit,
        dragStart: sub.action.dragStart,
        dragMove: sub.action.dragMove,
        dragEnd: sub.action.dragEnd,
        swipeInit: sub.action.swipeInit,
        swipeStart: sub.action.swipeStart,
        swipeMove: sub.action.swipeMove,
        swipeEnd: sub.action.swipeEnd,
      };
    },
    template: `<PageSub
        :listId="listId"
        :mainId="mainId"
        :classStatus="classStatus"
        :classLimit="classLimit"
        :textMemo="textMemo"
        :textAlarm="textAlarm"
        :mainUnit="mainUnit"
        :subFull="subFull"
        :subUnit="subUnit"
        @routerBack="routerBack"
        @toggleMode="toggleMode"
        @convertItem="convertItem"
        @divideItem="divideItem"
        @connectItem="connectItem"
        @deleteItem="deleteItem"
        @openCalendar="openCalendar"
        @openClock="openClock"
        @openAlarm="openAlarm"
        @dragInit="dragInit"
        @dragStart="dragStart"
        @dragMove="dragMove"
        @dragEnd="dragEnd"
        @swipeInit="swipeInit"
        @swipeStart="swipeStart"
        @swipeMove="swipeMove"
        @swipeEnd="swipeEnd"
      />`,
  }),
};

export const Default: StoryObj<typeof PageSub> = {};

export default meta;
