import type { Meta, StoryObj } from "@storybook/vue3";
import PopupClock from "@/components/popup/clock.vue";
import clock from "@/stores/popup/clock";

const meta: Meta<typeof PopupClock> = {
  component: PopupClock,
  render: () => ({
    components: { PopupClock },
    setup() {
      clock.action.open({
        time: `00:00`,
        cancel: `cancel`,
        clear: `clear`,
        ok: `ok`,
        callback: () => ``,
      });
      return {
        temp: clock.temp,
        state: clock.state,
        close: clock.action.close,
        inputTime: clock.action.inputTime,
      };
    },
    template: `<PopupClock
        :temp="temp"
        :state="state"
        @close="close"
        @inputTime="inputTime"
      />`,
  }),
};

export const Default: StoryObj<typeof PopupClock> = {};

export default meta;
