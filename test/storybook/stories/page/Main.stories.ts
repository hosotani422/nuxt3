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
        status: main.state.status,
        listId: app.getter.listId,
        classStatus: main.getter.classStatus,
        classLimit: main.getter.classLimit,
        textCount: main.getter.textCount,
        listUnit: list.action.getUnit,
        mainFull: main.action.getFull,
        mainUnit: main.action.getUnit,
        routerList: app.action.routerList,
        routerSub: app.action.routerSub,
        routerConf: app.action.routerConf,
        entryItem: main.action.entryItem,
        copyItem: main.action.copyItem,
        moveItem: main.action.moveItem,
        deleteItem: main.action.deleteItem,
        editItem: main.action.editItem,
        dragInit: main.action.dragInit,
        dragStart: main.action.dragStart,
        dragMove: main.action.dragMove,
        dragEnd: main.action.dragEnd,
      };
    },
    template: `<PageMain
        :status="status"
        :listId="listId"
        :classStatus="classStatus"
        :classLimit="classLimit"
        :textCount="textCount"
        :listUnit="listUnit"
        :mainFull="mainFull"
        :mainUnit="mainUnit"
        @routerList="routerList"
        @routerSub="routerSub"
        @routerConf="routerConf"
        @entryItem="entryItem"
        @copyItem="copyItem"
        @moveItem="moveItem"
        @deleteItem="deleteItem"
        @editItem="editItem"
        @dragInit="dragInit"
        @dragStart="dragStart"
        @dragMove="dragMove"
        @dragEnd="dragEnd"
      />`,
  }),
};

export const Default: StoryObj<typeof PageMain> = {};

export default meta;
