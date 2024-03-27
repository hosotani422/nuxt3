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
        refer: sub.refer,
        listId: app.getter.listId,
        mainId: app.getter.mainId,
        mainUnit: main.getter.stateUnit,
        stateFull: sub.getter.stateFull,
        stateUnit: sub.getter.stateUnit,
        classItem: sub.getter.classItem,
        textMemo: sub.getter.textMemo,
        classLimit: sub.getter.classLimit,
        textAlarm: sub.getter.textAlarm,
        routerBack: app.action.routerBack,
        inputItem: sub.action.inputItem,
        enterItem: sub.action.enterItem,
        backItem: sub.action.backItem,
        deleteItem: sub.action.deleteItem,
        checkItem: sub.action.checkItem,
        switchItem: sub.action.switchItem,
        switchEdit: sub.action.switchEdit,
        inputMemo: sub.action.inputMemo,
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
        :refer="refer"
        :listId="listId"
        :mainId="mainId"
        :mainUnit="mainUnit"
        :stateFull="stateFull"
        :stateUnit="stateUnit"
        :classItem="classItem"
        :textMemo="textMemo"
        :classLimit="classLimit"
        :textAlarm="textAlarm"
        @routerBack="routerBack"
        @inputItem="inputItem"
        @enterItem="enterItem"
        @backItem="backItem"
        @deleteItem="deleteItem"
        @checkItem="checkItem"
        @switchItem="switchItem"
        @switchEdit="switchEdit"
        @inputMemo="inputMemo"
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
