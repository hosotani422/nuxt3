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
        refer: sub.refer,
        listId: app.getter.listId,
        mainId: app.getter.mainId,
        mainUnit: main.getter.stateUnit,
        stateFull: sub.getter.stateFull,
        stateUnit: sub.getter.stateUnit,
        classItem: ((subId: string) => ({
          edit: subId === `sub1111111111111`,
        })) as unknown as typeof sub.getter.classItem,
        textMemo: sub.getter.textMemo,
        classLimit: (() => ({ classLimit: true })) as unknown as typeof sub.getter.classLimit,
        textAlarm: sub.getter.textAlarm,
      },
    });
    return wrapper;
  }
}
