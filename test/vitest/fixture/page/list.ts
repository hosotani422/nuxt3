import { mount, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import PageList from "@/components/page/list.vue";

export default class List extends Base {
  public static getWrapper(): VueWrapper {
    const wrapper = mount(PageList, {
      props: {
        constant,
        status: list.state.status,
        selectId: app.getter.listId,
        classStatus: (listId: string) => ({
          select: listId === `list1111111111111`,
          edit: listId === `list0000000000000`,
          hide: listId === `list0000000000000`,
        }),
        classLimit: (listId: string) => ({
          "text-theme-care": listId === `list0000000000000`,
          "text-theme-warn": listId === `list1111111111111`,
        }),
        typeIcon: list.getter.typeIcon,
        textCount: (listId: string) => {
          if (listId === `list1111111111111`) {
            return `1/1`;
          } else if (listId === `list0000000000000`) {
            return `0/0`;
          }
          return `9/9`;
        },
        listFull: list.action.getFull,
        listUnit: list.action.getUnit,
      },
    });
    return wrapper;
  }
}
