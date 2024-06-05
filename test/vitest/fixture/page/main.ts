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
        status: main.state.status,
        listId: app.getter.listId,
        classStatus: (mainId: string) => ({
          select: mainId === `main1111111111111`,
          edit: mainId === `main2222222222222`,
          hide: mainId === `main2222222222222`,
        }),
        classLimit: main.getter.classLimit,
        textCount: (mainId: string) => (mainId === `main1111111111111` ? `1/1` : `1/2`),
        listUnit: list.action.getUnit,
        mainFull: main.action.getFull,
        mainUnit: main.action.getUnit,
      },
      global: {
        stubs: {
          ClientOnly: { template: `<div><slot /></div>` },
          RouterView: true,
        },
      },
    });
    return wrapper;
  }
}
