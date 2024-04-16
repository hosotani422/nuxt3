import Vue from "vue";
import i18next from "i18next";
import * as Api from "@/api/api";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

const refer: {
  wrap?: Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  items?: Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
} = {};

const prop: {
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
            task: boolean;
            date: string;
            time: string;
            alarm: string[];
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
    stateFull: computed(() => (listId?: string): (typeof state)[`data`][string] => {
      return state.data[listId || app.getter.listId()]!;
    }),
    stateUnit: computed(() => (listId?: string, mainId?: string): (typeof state)[`data`][string][`data`][string] => {
      return state.data[listId || app.getter.listId()]!.data[mainId || app.getter.mainId()]!;
    }),
    classItem: computed(() => (mainId: string): { [K in `select` | `check` | `edit` | `drag` | `hide`]: boolean } => {
      return {
        select: app.getter.mainId() === mainId,
        check: getter.stateUnit(``, mainId).check,
        edit: state.status[mainId] === `edit`,
        drag: state.status[mainId] === `drag`,
        hide: state.status[mainId] === `hide`,
      };
    }),
    classLimit: computed(() => (mainId: string): { [K in `text-theme-care` | `text-theme-warn`]: boolean } => {
      const unit = getter.stateUnit(``, mainId);
      const date = `${unit.date || `9999/99/99`} ${unit.time || `00:00`}`;
      return {
        "text-theme-care": app.lib.dayjs(date).isBefore(app.lib.dayjs().add(2, `day`)),
        "text-theme-warn": app.lib.dayjs(date).isBefore(app.lib.dayjs().add(1, `day`)),
      };
    }),
    textCount: computed(() => (mainId: string): string => {
      let count = 0;
      for (const subId of sub.getter.stateFull(``, mainId).sort) {
        !sub.getter.stateUnit(``, mainId, subId).check && ++count;
      }
      return `${count}/${sub.getter.stateFull(``, mainId).sort.length}`;
    }),
  });

  const action = {
    initPage: async (): Promise<void> => {
      await action.loadItem();
    },
    actPage: (): void => {
      watch(
        () => app.lib.lodash.cloneDeep(state.data),
        () => {
          action.saveItem();
          conf.action.reactAlarm();
        },
        { deep: true },
      );
    },
    loadItem: async (): Promise<void> => {
      state.data = await Api.readMain();
    },
    saveItem: (): void => {
      Api.writeMain(state.data);
    },
    insertItem: (): void => {
      dialog.action.open({
        mode: `text`,
        title: i18next.t(`dialog.title.insert`),
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
            const mainId = `main${app.lib.dayjs().valueOf()}`;
            const subId = `sub${app.lib.dayjs().valueOf()}`;
            getter.stateFull().sort.unshift(mainId);
            getter.stateFull().data[mainId] = {
              check: false,
              title: dialog.state.text.value,
              date: ``,
              time: ``,
              alarm: [],
              task: true,
            };
            sub.state.data[app.getter.listId()]!.data[mainId] = {
              sort: [subId],
              data: { [subId]: { check: false, title: `` } },
            };
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    copyItem: (payload: { mainId: string }): void => {
      const mainId = `main${app.lib.dayjs().valueOf()}`;
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.mainId) + 1, 0, mainId);
      getter.stateFull().data[mainId] = app.lib.lodash.cloneDeep(getter.stateUnit(``, payload.mainId));
      sub.state.data[app.getter.listId()]!.data[mainId] = app.lib.lodash.cloneDeep(
        sub.getter.stateFull(``, payload.mainId),
      );
      delete state.status[payload.mainId];
    },
    moveItem: (payload: { mainId: string }): void => {
      dialog.action.open({
        mode: `radio`,
        title: i18next.t(`dialog.title.move`),
        message: ``,
        radio: {
          none: false,
          select: app.getter.listId(),
          sort: list.state.data.sort,
          data: list.state.data.data,
        },
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            if (dialog.state.radio.select !== app.getter.listId()) {
              getter.stateFull(dialog.state.radio.select).sort.unshift(payload.mainId);
              getter.stateFull(dialog.state.radio.select).data[payload.mainId] = getter.stateUnit(``, payload.mainId);
              sub.state.data[dialog.state.radio.select]!.data[payload.mainId] = sub.getter.stateFull(
                ``,
                payload.mainId,
              );
              getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.mainId), 1);
              delete getter.stateFull().data[payload.mainId];
              delete sub.state.data[app.getter.listId()]!.data[payload.mainId];
            }
            delete state.status[payload.mainId];
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
            delete state.status[payload.mainId];
          },
        },
      });
    },
    deleteItem: (payload: { mainId: string }): void => {
      const backup = {
        main: app.lib.lodash.cloneDeep(state.data),
        sub: app.lib.lodash.cloneDeep(sub.state.data),
      };
      if (app.getter.listId() !== constant.base.id.trash) {
        getter.stateFull(constant.base.id.trash).sort.push(payload.mainId);
        getter.stateFull(constant.base.id.trash).data[payload.mainId] = getter.stateUnit(``, payload.mainId);
        sub.state.data[constant.base.id.trash]!.data[payload.mainId] = sub.getter.stateFull(``, payload.mainId);
      }
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.mainId), 1);
      delete getter.stateFull().data[payload.mainId];
      delete sub.state.data[app.getter.listId()]!.data[payload.mainId];
      delete state.status[payload.mainId];
      constant.sound.play(`warn`);
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
    checkItem: (payload: { mainId: string; checked: boolean }): void => {
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.mainId), 1);
      getter.stateFull().sort[payload.checked ? `push` : `unshift`](payload.mainId);
      getter.stateUnit(``, payload.mainId).check = payload.checked;
      constant.sound.play(payload.checked ? `ok` : `cancel`);
    },
    switchEdit: (payload?: { mainId: string }): void => {
      for (const mainId of getter.stateFull().sort) {
        state.status[mainId] = mainId === payload?.mainId ? `edit` : ``;
      }
    },
    dragInit: (payload: { mainId: string; clientY: number }): void => {
      const item = refer.items!.value[payload.mainId]!.getBoundingClientRect();
      prop.drag.status = `start`;
      prop.drag.id = payload.mainId;
      prop.drag.y = payload.clientY;
      prop.drag.top = item.top;
      prop.drag.left = item.left;
      prop.drag.height = item.height;
      prop.drag.width = item.width;
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    },
    dragStart: (): void => {
      if (prop.drag.status === `start`) {
        prop.drag.status = `move`;
        prop.drag.clone = refer.items!.value[prop.drag.id!]!.cloneNode(true) as HTMLElement;
        prop.drag.clone.style.position = `absolute`;
        prop.drag.clone.style.zIndex = `1`;
        prop.drag.clone.style.top = `${prop.drag.top}px`;
        prop.drag.clone.style.left = `${prop.drag.left}px`;
        prop.drag.clone.style.height = `${prop.drag.height}px`;
        prop.drag.clone.style.width = `${prop.drag.width}px`;
        refer.wrap!.value!.appendChild(prop.drag.clone);
        state.status[prop.drag.id!] = `hide`;
      }
    },
    dragMove: (payload: { clientY: number }): void => {
      if (prop.drag.status === `move`) {
        prop.drag.clone!.style.top = `${prop.drag.top! + payload.clientY - prop.drag.y!}px`;
        const index = getter.stateFull().sort.indexOf(prop.drag.id!);
        const clone = prop.drag.clone!.getBoundingClientRect();
        const prev = refer.items!.value[getter.stateFull().sort[index - 1]!]?.getBoundingClientRect();
        const current = refer.items!.value[getter.stateFull().sort[index]!]!.getBoundingClientRect();
        const next = refer.items!.value[getter.stateFull().sort[index + 1]!]?.getBoundingClientRect();
        if (
          prev &&
          clone.top + clone.height / 2 <
            (next ? next.top : current.top + current.height) - (prev.height + current.height) / 2
        ) {
          getter.stateFull().sort.splice(index - 1, 0, ...getter.stateFull().sort.splice(index, 1));
        } else if (
          next &&
          clone.top + clone.height / 2 >
            (prev ? prev.top + prev.height : current.top) + (current.height + next.height) / 2
        ) {
          getter.stateFull().sort.splice(index + 1, 0, ...getter.stateFull().sort.splice(index, 1));
        }
      }
    },
    dragEnd: (): void => {
      if (prop.drag.status === `move`) {
        prop.drag.status = `end`;
        prop.drag.clone!.classList.remove(`edit`);
        prop.drag
          .clone!.animate(
            { top: `${refer.items!.value[prop.drag.id!]!.getBoundingClientRect().top}px` },
            { duration: constant.base.duration[conf.state.data.speed], easing: `ease-in-out` },
          )
          .addEventListener(`finish`, () => {
            state.status[prop.drag.id!] = ``;
            prop.drag.clone!.remove();
            prop.drag = {};
          });
      } else if (prop.drag.id && !prop.drag.clone) {
        prop.drag = {};
      }
    },
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { refer, prop, state: store.state, getter: store.getter, action: store.action };
