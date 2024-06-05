import * as datefns from "date-fns";
import lodash from "lodash";
import i18next from "i18next";
import Api from "@/api/api";
import constant from "@/utils/const";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
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
} = {
  drag: {},
};

const useStore = defineStore(`main`, () => {
  const state: {
    data: {
      [K: string]: {
        sort: string[];
        data: {
          [K: string]: {
            check: boolean;
            title: string;
            date: string;
            time: string;
            alarm: string[];
            task: boolean;
          };
        };
      };
    };
    status: { [K: string]: string };
  } = reactive({
    data: constant.init.main,
    status: {},
  });

  const getter = reactive({
    classStatus: computed(() => (mainId: string): { [K in `select` | `edit` | `hide`]: boolean } => {
      return {
        select: app.getter.mainId() === mainId,
        edit: state.status[mainId] === `edit`,
        hide: state.status[mainId] === `hide`,
      };
    }),
    classLimit: computed(() => (mainId: string): { [K in `text-theme-care` | `text-theme-warn`]: boolean } => {
      const item = action.getUnit({ mainId });
      const now = new Date();
      const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
      return {
        "text-theme-care": datefns.isBefore(date, datefns.addDays(now, 2)),
        "text-theme-warn": datefns.isBefore(date, datefns.addDays(now, 1)),
      };
    }),
    textCount: computed(() => (mainId: string): string => {
      const itemList = Object.values(sub.action.getFull({ mainId }).data);
      return `${itemList.filter((item) => !item.check).length}/${itemList.length}`;
    }),
  });

  const action = {
    init: async (): Promise<void> => {
      state.data = await Api.readMain();
      watch(
        () => state.data,
        (data) => {
          Api.writeMain(data);
        },
        { deep: true },
      );
    },
    getFull: (arg?: { listId: string }): (typeof state)[`data`][string] => {
      if (arg && state.data[arg.listId]) {
        return state.data[arg.listId]!;
      } else if (state.data[app.getter.listId()]) {
        return state.data[app.getter.listId()]!;
      }
      return { sort: [], data: {} };
    },
    getUnit: (arg?: { listId?: string; mainId?: string }): (typeof state)[`data`][string][`data`][string] => {
      return state.data[arg?.listId || app.getter.listId()]!.data[arg?.mainId || app.getter.mainId()]!;
    },
    entryItem: (): void => {
      dialog.action.open({
        mode: `text`,
        title: i18next.t(`dialog.title.entry`),
        message: ``,
        text: {
          value: ``,
          placeholder: i18next.t(`placeholder.main`),
          error: ``,
        },
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            const id = new Date().valueOf();
            action.getFull().sort.unshift(`main${id}`);
            action.getFull().data[`main${id}`] = {
              check: false,
              title: dialog.state.text!.value,
              date: ``,
              time: ``,
              alarm: [],
              task: true,
            };
            sub.state.data[app.getter.listId()]!.data[`main${id}`] = {
              sort: [`sub${id}`],
              data: { [`sub${id}`]: { check: false, title: `` } },
            };
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    copyItem: (arg: { mainId: string }): void => {
      const mainId = `main${new Date().valueOf()}`;
      action.getFull().sort.splice(action.getFull().sort.indexOf(arg.mainId) + 1, 0, mainId);
      action.getFull().data[mainId] = lodash.cloneDeep(action.getUnit({ mainId: arg.mainId }));
      sub.state.data[app.getter.listId()]!.data[mainId] = lodash.cloneDeep(sub.action.getFull({ mainId: arg.mainId }));
      delete state.status[arg.mainId];
    },
    moveItem: (arg: { mainId: string }): void => {
      dialog.action.open({
        mode: `radio`,
        title: i18next.t(`dialog.title.move`),
        message: ``,
        radio: {
          none: false,
          select: ``,
          sort: list.state.data.sort.filter((listId) => listId !== app.getter.listId()),
          data: list.state.data.data,
        },
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            const listId = dialog.state.radio!.select;
            if (listId !== app.getter.listId()) {
              action.getFull({ listId }).sort.unshift(arg.mainId);
              action.getFull({ listId }).data[arg.mainId] = action.getUnit({ mainId: arg.mainId });
              sub.state.data[listId]!.data[arg.mainId] = sub.action.getFull({ mainId: arg.mainId });
              action.getFull().sort.splice(action.getFull().sort.indexOf(arg.mainId), 1);
              delete action.getFull().data[arg.mainId];
              delete sub.state.data[app.getter.listId()]!.data[arg.mainId];
            }
            delete state.status[arg.mainId];
            dialog.action.close();
          },
          cancel: () => {
            delete state.status[arg.mainId];
            dialog.action.close();
          },
        },
      });
    },
    deleteItem: (arg: { mainId: string }): void => {
      const backup = { main: lodash.cloneDeep(state.data), sub: lodash.cloneDeep(sub.state.data) };
      const listId = constant.base.id.trash;
      if (listId !== app.getter.listId()) {
        action.getFull({ listId }).sort.unshift(arg.mainId);
        action.getFull({ listId }).data[arg.mainId] = action.getUnit({ mainId: arg.mainId });
        sub.state.data[listId]!.data[arg.mainId] = sub.action.getFull({ mainId: arg.mainId });
      }
      action.getFull().sort.splice(action.getFull().sort.indexOf(arg.mainId), 1);
      delete action.getFull().data[arg.mainId];
      delete sub.state.data[app.getter.listId()]!.data[arg.mainId];
      delete state.status[arg.mainId];
      notice.action.open({
        message: i18next.t(`notice.message`),
        button: i18next.t(`notice.button`),
        callback: () => {
          state.data = backup.main;
          sub.state.data = backup.sub;
          notice.action.close();
        },
      });
    },
    editItem: (arg?: { mainId: string }): void => {
      for (const mainId of action.getFull().sort) {
        if (mainId === arg?.mainId) {
          state.status[mainId] = `edit`;
        } else {
          delete state.status[mainId];
        }
      }
    },
    dragInit: (arg: { mainId: string; y: number }): void => {
      if (!temp.drag.status) {
        const item = Util.getById(`MainItem${arg.mainId}`).getBoundingClientRect();
        temp.drag.status = `start`;
        temp.drag.id = arg.mainId;
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
        temp.drag.clone = Util.getById(`MainItem${temp.drag.id}`).cloneNode(true) as HTMLElement;
        temp.drag.clone.style.position = `absolute`;
        temp.drag.clone.style.zIndex = `1`;
        temp.drag.clone.style.top = `${temp.drag.top}px`;
        temp.drag.clone.style.left = `${temp.drag.left}px`;
        temp.drag.clone.style.height = `${temp.drag.height}px`;
        temp.drag.clone.style.width = `${temp.drag.width}px`;
        Util.getById(`MainBody`).appendChild(temp.drag.clone);
        state.status[temp.drag.id!] = `hide`;
      }
    },
    dragMove: (arg: { y: number }): void => {
      if (temp.drag.status === `move`) {
        temp.drag.clone!.style.top = `${temp.drag.top! + arg.y - temp.drag.y!}px`;
        const index = action.getFull().sort.indexOf(temp.drag.id!);
        const clone = temp.drag.clone!.getBoundingClientRect();
        const prev = Util.getById(`MainItem${action.getFull().sort[index - 1]}`)?.getBoundingClientRect();
        const current = Util.getById(`MainItem${action.getFull().sort[index]}`).getBoundingClientRect();
        const next = Util.getById(`MainItem${action.getFull().sort[index + 1]}`)?.getBoundingClientRect();
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
            { top: `${Util.getById(`MainItem${temp.drag.id}`).getBoundingClientRect().top}px` },
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
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { temp, state: store.state, getter: store.getter, action: store.action };
