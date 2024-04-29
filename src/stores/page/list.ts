import * as datefns from "date-fns";
import lodash from "lodash";
import i18next from "i18next";
import Api from "@/api/api";
import constant from "@/utils/const";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

const temp: {
  drag: {
    status?: `start` | `move` | `end`;
    id?: string;
    y?: number;
    top?: number;
    left?: number;
    height?: number;
    width?: number;
    clone?: HTMLElement;
  };
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    left?: number;
  };
} = {
  drag: {},
  swipe: {},
};

const useStore = defineStore(`list`, () => {
  const state: {
    data: {
      sort: string[];
      data: {
        [K: string]: {
          title: string;
        };
      };
    };
    status: { [K: string]: string };
  } = reactive({
    data: constant.init.list,
    status: {},
  });

  const getter = reactive({
    classStatus: computed(() => (listId: string): { [K in `select` | `edit` | `hide`]: boolean } => {
      return {
        select: app.getter.listId() === listId,
        edit: state.status[listId] === `edit`,
        hide: state.status[listId] === `hide`,
      };
    }),
    classLimit: computed(() => (listId: string): { [K in `text-theme-care` | `text-theme-warn`]: boolean } => {
      const classLimit: ReturnType<typeof getter.classLimit> = { "text-theme-care": false, "text-theme-warn": false };
      for (const mainId of main.action.getFull({ listId }).sort) {
        const item = main.action.getUnit({ listId, mainId });
        const now = new Date();
        const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
        datefns.isBefore(date, datefns.addDays(now, 2)) && (classLimit[`text-theme-care`] = true);
        datefns.isBefore(date, datefns.addDays(now, 1)) && (classLimit[`text-theme-warn`] = true);
      }
      return classLimit;
    }),
    typeIcon: computed(() => (listId: string): `IconInbox` | `IconTrash` | `IconList` => {
      if (listId === constant.base.id.inbox) {
        return `IconInbox`;
      } else if (listId === constant.base.id.trash) {
        return `IconTrash`;
      }
      return `IconList`;
    }),
    textCount: computed(() => (listId: string): string => {
      const itemList = Object.values(main.action.getFull({ listId }).data);
      return `${itemList.filter((item) => !item.check).length}/${itemList.length}`;
    }),
  });

  const action = {
    init: async (): Promise<void> => {
      state.data = await Api.readList();
      watch(
        () => state.data,
        (data) => {
          Api.writeList(data);
        },
        { deep: true },
      );
    },
    getFull: (): (typeof state)[`data`] => {
      return state.data;
    },
    getUnit: (arg?: { listId: string }): (typeof state)[`data`][`data`][string] => {
      if (arg && state.data.data[arg.listId]) {
        return state.data.data[arg.listId]!;
      } else if (state.data.data[app.getter.listId()]) {
        return state.data.data[app.getter.listId()]!;
      }
      return { title: `` };
    },
    entryItem: (): void => {
      dialog.action.open({
        mode: `text`,
        title: i18next.t(`dialog.title.entry`),
        message: ``,
        text: {
          value: ``,
          placeholder: i18next.t(`placeholder.list`),
          error: ``,
        },
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            const listId = `list${new Date().valueOf()}`;
            action.getFull().sort.unshift(listId);
            action.getFull().data[listId] = { title: dialog.state.text!.value };
            main.state.data[listId] = { sort: [], data: {} };
            sub.state.data[listId] = { data: {} };
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    copyItem: (arg: { listId: string }): void => {
      const listId = `list${new Date().valueOf()}`;
      action.getFull().sort.splice(action.getFull().sort.indexOf(arg.listId) + 1, 0, listId);
      action.getFull().data[listId] = lodash.cloneDeep(action.getUnit({ listId: arg.listId }));
      main.state.data[listId] = lodash.cloneDeep(main.action.getFull({ listId: arg.listId }));
      sub.state.data[listId] = lodash.cloneDeep(sub.state.data[arg.listId]!);
      delete state.status[arg.listId];
    },
    deleteItem: (arg: { listId: string }): void => {
      dialog.action.open({
        mode: `confirm`,
        title: i18next.t(`dialog.title.delete`),
        message: ``,
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            const backup = {
              list: lodash.cloneDeep(state.data),
              main: lodash.cloneDeep(main.state.data),
              sub: lodash.cloneDeep(sub.state.data),
            };
            const listId = constant.base.id.trash;
            for (const mainId of main.action.getFull({ listId: arg.listId }).sort) {
              main.action.getFull({ listId }).sort.push(mainId);
              main.action.getFull({ listId }).data[mainId] = main.action.getUnit({ listId: arg.listId, mainId });
              sub.state.data[listId]!.data[mainId] = sub.action.getFull({ listId: arg.listId, mainId });
            }
            action.getFull().sort.splice(action.getFull().sort.indexOf(arg.listId), 1);
            delete action.getFull().data[arg.listId];
            delete main.state.data[arg.listId];
            delete sub.state.data[arg.listId];
            delete state.status[arg.listId];
            dialog.action.close();
            notice.action.open({
              message: i18next.t(`notice.message`),
              button: i18next.t(`notice.button`),
              callback: () => {
                state.data = backup.list;
                main.state.data = backup.main;
                sub.state.data = backup.sub;
                notice.action.close();
              },
            });
          },
          cancel: () => {
            delete state.status[arg.listId];
            dialog.action.close();
          },
        },
      });
    },
    editItem: (arg?: { listId: string }): void => {
      for (const listId of action.getFull().sort) {
        if (listId === arg?.listId) {
          state.status[listId] = `edit`;
        } else {
          delete state.status[listId];
        }
      }
    },
    dragInit: (arg: { listId: string; y: number }): void => {
      if (!temp.drag.status) {
        const item = Util.getById(`ListItem${arg.listId}`).getBoundingClientRect();
        temp.drag.status = `start`;
        temp.drag.id = arg.listId;
        temp.drag.y = arg.y;
        temp.drag.top = item.top;
        temp.drag.left = item.left;
        temp.drag.height = item.height;
        temp.drag.width = item.width;
        conf.state.data.vibrate === `on` && navigator.vibrate(40);
      }
    },
    dragStart: (): void => {
      if (temp.drag.status === `start`) {
        temp.drag.status = `move`;
        temp.drag.clone = Util.getById(`ListItem${temp.drag.id}`).cloneNode(true) as HTMLElement;
        temp.drag.clone.style.position = `absolute`;
        temp.drag.clone.style.zIndex = `1`;
        temp.drag.clone.style.top = `${temp.drag.top}px`;
        temp.drag.clone.style.left = `${temp.drag.left}px`;
        temp.drag.clone.style.height = `${temp.drag.height}px`;
        temp.drag.clone.style.width = `${temp.drag.width}px`;
        Util.getById(`ListBody`).appendChild(temp.drag.clone);
        state.status[temp.drag.id!] = `hide`;
      }
    },
    dragMove: (arg: { y: number }): void => {
      if (temp.drag.status === `move`) {
        temp.drag.clone!.style.top = `${temp.drag.top! + arg.y - temp.drag.y!}px`;
        const index = action.getFull().sort.indexOf(temp.drag.id!);
        const clone = temp.drag.clone!.getBoundingClientRect();
        const prev = Util.getById(`ListItem${action.getFull().sort[index - 1]}`)?.getBoundingClientRect();
        const current = Util.getById(`ListItem${action.getFull().sort[index]}`).getBoundingClientRect();
        const next = Util.getById(`ListItem${action.getFull().sort[index + 1]}`)?.getBoundingClientRect();
        if (prev && clone.top + clone.height / 2 < (next?.top || current.bottom) - (prev.height + current.height) / 2) {
          action.getFull().sort.splice(index - 1, 0, ...action.getFull().sort.splice(index, 1));
        }
        if (next && clone.top + clone.height / 2 > (prev?.bottom || current.top) + (current.height + next.height) / 2) {
          action.getFull().sort.splice(index + 1, 0, ...action.getFull().sort.splice(index, 1));
        }
      }
    },
    dragEnd: (): void => {
      if (temp.drag.status === `move`) {
        temp.drag.status = `end`;
        temp.drag.clone!.classList.remove(`edit`);
        temp.drag
          .clone!.animate(
            { top: `${Util.getById(`ListItem${temp.drag.id}`).getBoundingClientRect().top}px` },
            { duration: app.action.getDuration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, () => {
            delete state.status[temp.drag.id!];
            temp.drag.clone!.remove();
            temp.drag = {};
          });
      } else {
        temp.drag = {};
      }
    },
    swipeInit: (arg: { x: number; y: number }): void => {
      if (!temp.swipe.status) {
        temp.swipe.status = `start`;
        temp.swipe.elem = Util.getById<HTMLElement>(`ListRoot`);
        temp.swipe.x = arg.x;
        temp.swipe.y = arg.y;
        temp.swipe.left = temp.swipe.elem.getBoundingClientRect().left;
      }
    },
    swipeStart: (arg: { x: number; y: number }): void => {
      if (temp.swipe.status === `start`) {
        if (Math.abs(arg.x - temp.swipe.x!) + Math.abs(arg.y - temp.swipe.y!) > 15) {
          if (Math.abs(arg.x - temp.swipe.x!) > Math.abs(arg.y - temp.swipe.y!)) {
            temp.swipe.status = `move`;
          } else {
            temp.swipe = {};
          }
        }
      }
    },
    swipeMove: (arg: { x: number }): void => {
      if (temp.swipe.status === `move`) {
        temp.swipe.elem!.style.transform = `translateX(${Math.min(temp.swipe.left! + arg.x - temp.swipe.x!, 0)}px)`;
      }
    },
    swipeEnd: (arg: { x: number }): void => {
      if (temp.swipe.status === `move`) {
        temp.swipe.status = `end`;
        if (temp.swipe.left! + arg.x - temp.swipe.x! < -100) {
          app.action.routerBack();
          temp.swipe = {};
        } else {
          temp.swipe
            .elem!.animate(
              { transform: `translateX(0px)` },
              { duration: app.action.getDuration(), easing: `ease-in-out` },
            )
            .addEventListener(`finish`, () => {
              temp.swipe.elem!.style.transform = `translateX(0px)`;
              temp.swipe = {};
            });
        }
      } else {
        temp.swipe = {};
      }
    },
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { temp, state: store.state, getter: store.getter, action: store.action };
