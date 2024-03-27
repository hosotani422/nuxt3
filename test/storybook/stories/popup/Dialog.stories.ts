import type { Meta, StoryObj } from "@storybook/vue3";
import PopupDialog from "@/components/popup/dialog.vue";
import dialog from "@/stores/popup/dialog";

const meta: Meta<typeof PopupDialog> = {
  component: PopupDialog,
  render: () => ({
    components: { PopupDialog },
    setup() {
      dialog.action.open({
        mode: `text`,
        title: `title`,
        message: `message`,
        text: {
          value: `text`,
          placeholder: `placeholder`,
        },
        check: {
          all: true,
          sort: [`1`, `2`, `3`],
          data: {
            "1": { check: false, title: `1` },
            "2": { check: false, title: `2` },
            "3": { check: false, title: `3` },
          },
        },
        radio: {
          none: false,
          select: `1`,
          sort: [`1`, `2`, `3`],
          data: {
            "1": { title: `1` },
            "2": { title: `2` },
            "3": { title: `3` },
          },
        },
        ok: `ok`,
        cancel: `cancel`,
        callback: {
          ok: () => ``,
          cancel: () => ``,
        },
      });
      return {
        state: dialog.state,
        stateCheckAll: dialog.getter.stateCheckAll,
        clickCheckAll: dialog.action.clickCheckAll,
      };
    },
    template: `<PopupDialog
        :state="state"
        :stateCheckAll="stateCheckAll"
        @clickCheckAll="clickCheckAll"
      />`,
  }),
};

export const Default: StoryObj<typeof PopupDialog> = {};

export default meta;
