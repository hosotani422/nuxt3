import type { Meta, StoryObj } from "@storybook/vue3";
import PageMain from "@/components/page/main.vue";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import mock from "../../mock/mock";

const meta: Meta<typeof PageMain> = {
  component: PageMain,
  render: () => ({
    components: { PageMain },
    setup() {
      mock();
      return {
        refer: main.refer,
        status: main.state.status,
        listId: app.getter.listId,
        listUnit: list.getter.stateUnit,
        stateFull: main.getter.stateFull,
        stateUnit: main.getter.stateUnit,
        classItem: main.getter.classItem,
        classLimit: main.getter.classLimit,
        textCount: main.getter.textCount,
        routerList: app.action.routerList,
        routerSub: app.action.routerSub,
        routerConf: app.action.routerConf,
        insertItem: main.action.insertItem,
        copyItem: main.action.copyItem,
        moveItem: main.action.moveItem,
        deleteItem: main.action.deleteItem,
        checkItem: main.action.checkItem,
        switchEdit: main.action.switchEdit,
        dragInit: main.action.dragInit,
        dragStart: main.action.dragStart,
        dragMove: main.action.dragMove,
        dragEnd: main.action.dragEnd,
      };
    },
    template: `<PageMain
        :refer="refer"
        :status="status"
        :listId="listId"
        :listUnit="listUnit"
        :stateFull="stateFull"
        :stateUnit="stateUnit"
        :classItem="classItem"
        :classLimit="classLimit"
        :textCount="textCount"
        @routerList="routerList"
        @routerSub="routerSub"
        @routerConf="routerConf"
        @insertItem="insertItem"
        @copyItem="copyItem"
        @moveItem="moveItem"
        @deleteItem="deleteItem"
        @checkItem="checkItem"
        @switchEdit="switchEdit"
        @dragInit="dragInit"
        @dragStart="dragStart"
        @dragMove="dragMove"
        @dragEnd="dragEnd"
      />`,
  }),
};

export const Default: StoryObj<typeof PageMain> = {};

export default meta;
