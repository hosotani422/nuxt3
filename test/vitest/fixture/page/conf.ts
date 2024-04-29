import { mount, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";
import PageConf from "@/components/page/conf.vue";

export default class Conf extends Base {
  public static getWrapper(): VueWrapper {
    const wrapper = mount(PageConf, {
      props: {
        constant,
        updateKey: app.state.updateKey,
        state: conf.state.data,
      },
    });
    return wrapper;
  }
}
