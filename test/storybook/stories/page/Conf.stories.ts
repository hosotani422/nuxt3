import type { Meta, StoryObj } from "@storybook/vue3";
import PageConf from "@/components/page/conf.vue";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";
import mock from "../../mock/mock";

const meta: Meta<typeof PageConf> = {
  component: PageConf,
  render: () => ({
    components: { PageConf },
    setup() {
      mock();
      return {
        updateKey: app.state.updateKey,
        constant: constant,
        state: conf.state.data,
        routerBack: app.action.routerBack,
        downloadBackup: conf.action.downloadBackup,
        uploadBackup: conf.action.uploadBackup,
        resetConf: conf.action.resetConf,
        resetList: conf.action.resetList,
        swipeInit: conf.action.swipeInit,
        swipeStart: conf.action.swipeStart,
        swipeMove: conf.action.swipeMove,
        swipeEnd: conf.action.swipeEnd,
      };
    },
    template: `<PageConf
        :updateKey="updateKey"
        :constant="constant"
        :state="state"
        @routerBack="routerBack"
        @downloadBackup="downloadBackup"
        @uploadBackup="uploadBackup"
        @resetConf="resetConf"
        @resetList="resetList"
        @swipeInit="swipeInit"
        @swipeStart="swipeStart"
        @swipeMove="swipeMove"
        @swipeEnd="swipeEnd"
      />`,
  }),
};

export const Default: StoryObj<typeof PageConf> = {};

export default meta;
