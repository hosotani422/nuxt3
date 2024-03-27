import { mount, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import constant from "@/utils/const";
import conf from "@/stores/page/conf";
import PageConf from "@/components/page/conf.vue";

export default class Conf extends Base {
  public static getWrapper(): VueWrapper {
    const wrapper = mount(PageConf, {
      props: {
        title: `${constant.base.title} ${constant.base.version}`,
        state: conf.state.data,
      },
      global: {
        mocks: Base.mockI18n(),
      },
    });
    return wrapper;
  }
}
