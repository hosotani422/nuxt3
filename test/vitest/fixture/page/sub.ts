import { mount, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import PageSub from "@/components/page/sub.vue";

export default class Sub extends Base {
  public static getWrapper(): VueWrapper {
    const wrapper = mount(PageSub, {
      props: {
        listId: app.getter.listId,
        mainId: app.getter.mainId,
        classStatus: (subId: string) => ({ edit: subId === `sub1111111111111`, hide: subId === `sub1111111111111` }),
        classLimit: () => ({ "text-theme-care": true, "text-theme-warn": false }),
        textMemo: sub.getter.textMemo,
        textAlarm: sub.getter.textAlarm,
        mainUnit: main.action.getUnit,
        subFull: sub.action.getFull,
        subUnit: sub.action.getUnit,
      },
    });
    return wrapper;
  }
}
