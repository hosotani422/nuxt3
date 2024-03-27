import { mount, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import PageMain from "@/components/page/main.vue";

export default class Main extends Base {
  public static getWrapper(): VueWrapper {
    const wrapper = mount(PageMain, {
      props: {
        refer: main.refer,
        status: main.state.status,
        listId: app.getter.listId,
        listUnit: list.getter.stateUnit,
        stateFull: main.getter.stateFull,
        stateUnit: main.getter.stateUnit,
        classItem: ((mainId: string) => ({
          edit: mainId === `main1111111111111`,
        })) as unknown as typeof main.getter.classItem,
        classLimit: (() => ({ classLimit: true })) as unknown as typeof main.getter.classLimit,
        textCount: (() => `textCount`) as typeof main.getter.textCount,
      },
      global: {
        stubs: {
          ClientOnly: { template: `<div><slot /></div>` },
          RouterView: true,
        },
        mocks: Base.mockI18n(),
      },
    });
    return wrapper;
  }
}
