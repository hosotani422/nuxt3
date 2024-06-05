import type { Meta, StoryObj } from "@storybook/vue3";
import PopupCalendar from "@/components/popup/calendar.vue";
import calendar from "@/stores/popup/calendar";
import mock from "../../mock/mock";

const meta: Meta<typeof PopupCalendar> = {
  component: PopupCalendar,
  render: () => ({
    components: { PopupCalendar },
    setup() {
      mock();
      calendar.action.open({
        select: `1999/12/24`,
        cancel: `cancel`,
        clear: `clear`,
        callback: () => ``,
      });
      return {
        temp: calendar.temp,
        state: calendar.state,
        classStatus: calendar.getter.classStatus,
        getWeek: calendar.action.getWeek,
        getDay: calendar.action.getDay,
        close: calendar.action.close,
        pageMove: calendar.action.pageMove,
        swipeInit: calendar.action.swipeInit,
        swipeStart: calendar.action.swipeStart,
        swipeMove: calendar.action.swipeMove,
        swipeEnd: calendar.action.swipeEnd,
      };
    },
    template: `<PopupCalendar
        :temp="temp"
        :state="state"
        :classStatus="classStatus"
        :getWeek="getWeek"
        :getDay="getDay"
        @close="close"
        @pageMove="pageMove"
        @swipeInit="swipeInit"
        @swipeStart="swipeStart"
        @swipeMove="swipeMove"
        @swipeEnd="swipeEnd"
      />`,
  }),
};

export const Default: StoryObj<typeof PopupCalendar> = {};

export default meta;
