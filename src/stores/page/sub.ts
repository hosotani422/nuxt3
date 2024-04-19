import Vue from "vue";
import lodash from "lodash";
import i18next from "i18next";
import * as datefns from "date-fns";
import Api from "@/api/api";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

const refer: {
  home?: Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  wrap?: Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  items?: Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
  titles?: Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
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
  swipe: {
    status?: `start` | `move` | `end`;
    target?: HTMLElement;
    x?: number;
    y?: number;
    right?: number;
    listener?: () => void;
  };
} = {
  drag: {},
  swipe: {},
};

const useStore = defineStore(`sub`, () => {
  const state: {
    data: {
      [K: string]: {
        data: {
          [K: string]: {
            sort: string[];
            data: {
              [K: string]: {
                check: boolean;
                title: string;
              };
            };
          };
        };
      };
    };
    status: { [K: string]: string };
  } = reactive({
    data: constant.init.sub,
    status: {},
  });

  const getter = reactive({
    stateFull: computed(
      () =>
        (listId?: string, mainId?: string): (typeof state)[`data`][string][`data`][string] =>
          state.data[listId || app.getter.listId()]!.data[mainId || app.getter.mainId()]!,
    ),
    stateUnit: computed(
      () =>
        (
          listId?: string,
          mainId?: string,
          subId?: string,
        ): (typeof state)[`data`][string][`data`][string][`data`][string] =>
          state.data[listId || app.getter.listId()]!.data[mainId || app.getter.mainId()]!.data[subId || ``]!,
    ),
    classItem: computed(() => (subId: string): { [K in `check` | `edit` | `drag` | `hide`]: boolean } => ({
      check: getter.stateUnit(``, ``, subId).check,
      edit: state.status[subId] === `edit`,
      drag: state.status[subId] === `drag`,
      hide: state.status[subId] === `hide`,
    })),
    textMemo: computed(() => (): string => {
      const memo: string[] = [];
      for (const subId of getter.stateFull().sort) {
        memo.push(getter.stateUnit(``, ``, subId).title);
      }
      return memo.join(`\n`);
    }),
    classLimit: computed(() => (): { [K in `text-theme-care` | `text-theme-warn`]: boolean } => {
      const unit = main.getter.stateUnit();
      const now = new Date();
      const date = new Date(`${unit.date || `9999/99/99`} ${unit.time || `00:00`}`);
      return {
        "text-theme-care": datefns.isBefore(date, datefns.addDays(now, 2)),
        "text-theme-warn": datefns.isBefore(date, datefns.addDays(now, 1)),
      };
    }),
    textAlarm: computed(() => (): string => {
      const alarm: string[] = [];
      for (const alarmId of main.getter.stateUnit().alarm as (
        | `1`
        | `2`
        | `3`
        | `4`
        | `5`
        | `6`
        | `7`
        | `8`
        | `9`
        | `10`
        | `11`
        | `12`
      )[]) {
        alarm.push(i18next.t(`dialog.alarm.data${alarmId}.label`));
      }
      return alarm.join(`,`);
    }),
  });

  const action = {
    initPage: async (): Promise<void> => {
      await action.loadItem();
    },
    actPage: (): void => {
      watch(
        () => lodash.cloneDeep(state.data),
        () => {
          action.saveItem();
        },
        { deep: true },
      );
    },
    loadItem: async (): Promise<void> => {
      state.data = await Api.readSub();
    },
    saveItem: (): void => {
      Api.writeSub(state.data);
    },
    enterItem: async (payload: { subId: string; selectionStart: number }) => {
      const subId = `sub${new Date().valueOf()}`;
      const caret = payload.selectionStart;
      const title = getter.stateFull().data[payload.subId]!.title;
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.subId) + 1, 0, subId);
      getter.stateFull().data[payload.subId]!.title = title.slice(0, caret!);
      getter.stateFull().data[subId] = { check: false, title: title.slice(caret!) };
      await nextTick();
      // 要素が正しく描画されないので強制描画
      refer.titles!.value[payload.subId]!.$el.value = getter.stateFull().data[payload.subId]!.title;
      refer.titles!.value[subId]?.$el.focus();
    },
    backItem: async (payload: { subId: string }) => {
      const subId = getter.stateFull().sort[getter.stateFull().sort.indexOf(payload.subId) - 1]!;
      const caret = getter.stateUnit(``, ``, subId).title.length;
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.subId), 1);
      getter.stateFull().data[subId]!.title += getter.stateFull().data[payload.subId]!.title;
      delete getter.stateFull().data[payload.subId];
      await nextTick();
      // 要素が正しく描画されないので強制描画
      refer.titles!.value[subId]!.$el.value = getter.stateFull().data[subId]!.title;
      refer.titles!.value[subId]!.$el.focus();
      refer.titles!.value[subId]!.$el.selectionStart = caret;
      refer.titles!.value[subId]!.$el.selectionEnd = caret;
    },
    deleteItem: (payload: { subId: string }) => {
      const backup = lodash.cloneDeep(state.data);
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.subId), 1);
      delete getter.stateFull().data[payload.subId];
      delete state.status[payload.subId];
      constant.sound.play(`warn`);
      notice.action.open({
        message: i18next.t(`notice.message`),
        button: i18next.t(`notice.button`),
        callback: async () => {
          notice.action.close();
          state.data = backup;
        },
      });
    },
    checkItem: (payload: { subId: string; checked: boolean }): void => {
      getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.subId), 1);
      getter.stateFull().sort[payload.checked ? `push` : `unshift`](payload.subId);
      getter.stateUnit(``, ``, payload.subId).check = payload.checked;
      constant.sound.play(payload.checked ? `ok` : `cancel`);
    },
    switchItem: (): void => {
      main.getter.stateUnit().task = !main.getter.stateUnit().task;
    },
    switchEdit: (payload?: { subId: string }): void => {
      for (const subId of getter.stateFull().sort) {
        state.status[subId] = subId === payload?.subId ? `edit` : ``;
      }
    },
    inputMemo: (payload: { value: string }): void => {
      getter.stateFull().sort = [];
      getter.stateFull().data = {};
      for (const [i, title] of payload.value.split(`\n`).entries()) {
        const subId = `sub${new Date().valueOf()}${i}`;
        getter.stateFull().sort.push(subId);
        getter.stateFull().data[subId] = { check: false, title };
      }
    },
    openCalendar: (payload: { date: string }): void => {
      calendar.action.open({
        select: payload.date,
        current: datefns.format(new Date(payload.date || new Date()), `yyyy/MM`),
        cancel: i18next.t(`button.cancel`),
        clear: i18next.t(`button.clear`),
        callback: (date) => {
          calendar.action.close();
          main.getter.stateUnit().date = date || ``;
        },
      });
    },
    openClock: (payload: { time: string }): void => {
      clock.action.open({
        hour: payload.time ? datefns.getHours(new Date(`2000/1/1 ${payload.time}`)) : 0,
        minute: payload.time ? datefns.getMinutes(new Date(`2000/1/1 ${payload.time}`)) : 0,
        cancel: i18next.t(`button.cancel`),
        clear: i18next.t(`button.clear`),
        ok: i18next.t(`button.ok`),
        callback: (hour, minute) => {
          clock.action.close();
          main.getter.stateUnit().time =
            hour != null && minute != null ? datefns.format(new Date(`2000/1/1 ${hour}:${minute}`), `HH:mm`) : ``;
        },
      });
    },
    openAlarm: (): void => {
      const sort: (`1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`)[] = [];
      for (let i = 1; i <= Number(i18next.t(`dialog.alarm.sort`)); i++) {
        sort.push(String(i) as `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`);
      }
      dialog.action.open({
        mode: `check`,
        title: i18next.t(`dialog.alarm.title`),
        message: ``,
        check: {
          all: true,
          sort,
          data: (() => {
            const data: (typeof dialog)[`state`][`check`][`data`] = {};
            for (const id of sort) {
              data[id] = {
                check: main.getter.stateUnit().alarm.includes(id),
                title: i18next.t(`dialog.alarm.data${id}.label`),
              };
            }
            return data;
          })(),
        },
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            dialog.action.close();
            main.getter.stateUnit().alarm = (() => {
              const alarm: (typeof main)[`state`][`data`][string][`data`][string][`alarm`] = [];
              for (const id of dialog.state.check.sort) {
                dialog.state.check.data[id]!.check && alarm.push(id);
              }
              return alarm;
            })();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    dragInit: (payload: { subId: string; clientY: number }): void => {
      const item = refer.items!.value[payload.subId]!.getBoundingClientRect();
      prop.drag.status = `start`;
      prop.drag.id = payload.subId;
      prop.drag.y = payload.clientY;
      prop.drag.top = item.top;
      prop.drag.left = item.left - refer.home!.value!.getBoundingClientRect().left;
      prop.drag.height = item.height;
      prop.drag.width = item.width;
      state.status[payload.subId] = `edit`;
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
        const wrap = refer.wrap!.value!.getBoundingClientRect();
        const prev = refer.items!.value[getter.stateFull().sort[index - 1]!]?.getBoundingClientRect();
        const current = refer.items!.value[getter.stateFull().sort[index]!]!.getBoundingClientRect();
        const next = refer.items!.value[getter.stateFull().sort[index + 1]!]?.getBoundingClientRect();
        if (
          prev &&
          clone.top + clone.height / 2 < (next ? next.top : wrap.top + wrap.height) - (prev.height + current.height) / 2
        ) {
          getter.stateFull().sort.splice(index - 1, 0, ...getter.stateFull().sort.splice(index, 1));
        } else if (
          next &&
          clone.top + clone.height / 2 > (prev ? prev.top + prev.height : wrap.top) + (current.height + next.height) / 2
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
        delete state.status[prop.drag.id];
        prop.drag = {};
      }
    },
    swipeInit: (payload: { target: HTMLElement; clientX: number; clientY: number }): void => {
      if (!prop.swipe.status) {
        prop.swipe.status = `start`;
        prop.swipe.target = payload.target;
        prop.swipe.x = payload.clientX;
        prop.swipe.y = payload.clientY;
        const item = prop.swipe.target.getBoundingClientRect();
        prop.swipe.right = item.left + item.width / 2;
      }
    },
    swipeStart: (payload: { clientX: number; clientY: number }): void => {
      if (prop.swipe.status === `start`) {
        if (Math.abs(payload.clientX - prop.swipe.x!) + Math.abs(payload.clientY - prop.swipe.y!) > 15) {
          Math.abs(payload.clientX - prop.swipe.x!) > Math.abs(payload.clientY - prop.swipe.y!)
            ? (prop.swipe.status = `move`)
            : (prop.swipe = {});
        }
      }
    },
    swipeMove: (payload: { clientX: number }): void => {
      if (prop.swipe.status === `move`) {
        const x = prop.swipe.right! + payload.clientX - prop.swipe.x!;
        prop.swipe.target!.style.transform = `translateX(${x > 0 ? x : 0}px)`;
      }
    },
    swipeEnd: (payload: { clientX: number }): void => {
      if (prop.swipe.status === `move`) {
        prop.swipe.status = `end`;
        if (prop.swipe.right! + payload.clientX - prop.swipe.x! > 100) {
          app.action.routerBack();
          prop.swipe = {};
        } else {
          prop.swipe
            .target!.animate(
              { transform: `translateX(0px)` },
              { duration: constant.base.duration[conf.state.data.speed], easing: `ease-in-out` },
            )
            .addEventListener(`finish`, () => {
              prop.swipe.target!.style.transform = `translateX(0px)`;
              prop.swipe = {};
            });
        }
      } else {
        prop.swipe = {};
      }
    },
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { refer, prop, state: store.state, getter: store.getter, action: store.action };
