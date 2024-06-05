import { mount, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import clock from "@/stores/popup/clock";
import PopupClock from "@/components/popup/clock.vue";

export default class Clock extends Base {
  public static getWrapper(): VueWrapper {
    clock.state.open = true;
    clock.state.hour = 0;
    clock.state.minute = 0;
    clock.state.cancel = `cancel`;
    clock.state.clear = `clear`;
    clock.state.ok = `ok`;
    const wrapper = mount(PopupClock, {
      props: {
        temp: clock.temp,
        state: clock.state,
      },
    });
    return wrapper;
  }
}
