import * as datefns from "date-fns";
import lodash from "lodash";
import i18next from "i18next";
import Api from "@/api/api";
import constant from "@/utils/const";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
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
    right?: number;
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
    classStatus: computed(() => (subId: string): { [K in `edit` | `hide`]: boolean } => {
      return {
        edit: state.status[subId] === `edit`,
        hide: state.status[subId] === `hide`,
      };
    }),
    classLimit: computed(() => (): { [K in `text-theme-care` | `text-theme-warn`]: boolean } => {
      const item = main.action.getUnit();
      const now = new Date();
      const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
      return {
        "text-theme-care": datefns.isBefore(date, datefns.addDays(now, 2)),
        "text-theme-warn": datefns.isBefore(date, datefns.addDays(now, 1)),
      };
    }),
    textMemo: computed(() => (): string => {
      const textMemo: string[] = [];
      for (const subId of action.getFull().sort) {
        textMemo.push(action.getUnit({ subId }).title);
      }
      return textMemo.join(`\n`);
    }),
    textAlarm: computed(() => (): string => {
      const textAlarm: string[] = [];
      for (const alarmId of main.action.getUnit().alarm) {
        textAlarm.push(i18next.t(`dialog.alarm.data.${alarmId}.label`));
      }
      return textAlarm.join(`,`);
    }),
  });

  const action = {
    init: async (): Promise<void> => {
      state.data = await Api.readSub();
      watch(
        () => state.data,
        (data) => {
          Api.writeSub(data);
        },
        { deep: true },
      );
    },
    getFull: (arg?: { listId?: string; mainId?: string }): (typeof state)[`data`][string][`data`][string] => {
      return state.data[arg?.listId || app.getter.listId()]!.data[arg?.mainId || app.getter.mainId()]!;
    },
    getUnit: (arg: {
      listId?: string;
      mainId?: string;
      subId: string;
    }): (typeof state)[`data`][string][`data`][string][`data`][string] => {
      return state.data[arg.listId || app.getter.listId()]!.data[arg.mainId || app.getter.mainId()]!.data[arg.subId]!;
    },
    toggleMode: (): void => {
      main.action.getUnit().task = !main.action.getUnit().task;
    },
    convertItem: (arg: { text: string }): void => {
      action.getFull().sort = [];
      action.getFull().data = {};
      const subId = new Date().valueOf();
      for (const [i, title] of arg.text.split(`\n`).entries()) {
        action.getFull().sort.push(`sub${subId + i}`);
        action.getFull().data[`sub${subId + i}`] = { check: false, title };
      }
    },
    divideItem: async (arg: { subId: string; caret: number }): Promise<void> => {
      const subId = `sub${new Date().valueOf()}`;
      const title = action.getUnit({ subId: arg.subId }).title;
      action.getFull().sort.splice(action.getFull().sort.indexOf(arg.subId) + 1, 0, subId);
      action.getUnit({ subId: arg.subId }).title = title.slice(0, arg.caret);
      action.getFull().data[subId] = { check: false, title: title.slice(arg.caret) };
      await nextTick();
      const elem = Util.getById<HTMLInputElement>(`SubTask${subId}`);
      elem.focus();
      elem.selectionStart = 0;
      elem.selectionEnd = 0;
    },
    connectItem: async (arg: { subId: string }): Promise<void> => {
      const subId = action.getFull().sort[action.getFull().sort.indexOf(arg.subId) - 1]!;
      const caret = action.getUnit({ subId }).title.length;
      action.getFull().sort.splice(action.getFull().sort.indexOf(arg.subId), 1);
      action.getUnit({ subId }).title += action.getUnit({ subId: arg.subId }).title;
      delete action.getFull().data[arg.subId];
      delete state.status[arg.subId];
      await nextTick();
      const elem = Util.getById<HTMLInputElement>(`SubTask${subId}`);
      elem.focus();
      elem.selectionStart = caret;
      elem.selectionEnd = caret;
    },
    deleteItem: (arg: { subId: string }): void => {
      const backup = lodash.cloneDeep(state.data);
      action.getFull().sort.splice(action.getFull().sort.indexOf(arg.subId), 1);
      delete action.getFull().data[arg.subId];
      delete state.status[arg.subId];
      notice.action.open({
        message: i18next.t(`notice.message`),
        button: i18next.t(`notice.button`),
        callback: () => {
          state.data = backup;
          notice.action.close();
        },
      });
    },
    openCalendar: (): void => {
      calendar.action.open({
        select: main.action.getUnit().date,
        cancel: i18next.t(`button.cancel`),
        clear: i18next.t(`button.clear`),
        callback: (date) => {
          main.action.getUnit().date = date;
          calendar.action.close();
        },
      });
    },
    openClock: (): void => {
      clock.action.open({
        time: datefns.format(`2000/1/1 ${main.action.getUnit().time || `00:00`}`, `HH:mm`),
        cancel: i18next.t(`button.cancel`),
        clear: i18next.t(`button.clear`),
        ok: i18next.t(`button.ok`),
        callback: (arg) => {
          main.action.getUnit().time = arg ? datefns.format(`2000/1/1 ${arg.hour}:${arg.minute}`, `HH:mm`) : ``;
          clock.action.close();
        },
      });
    },
    openAlarm: (): void => {
      dialog.action.open({
        mode: `check`,
        title: i18next.t(`dialog.title.alarm`),
        message: ``,
        check: {
          all: true,
          sort: i18next.t(`dialog.alarm.sort`, { returnObjects: true }),
          data: (() => {
            const data: (typeof dialog)[`state`][`check`][`data`] = {};
            for (const id of i18next.t(`dialog.alarm.sort`, { returnObjects: true })) {
              data[id] = {
                check: main.action.getUnit().alarm.includes(id),
                title: i18next.t(`dialog.alarm.data.${id}.label`),
              };
            }
            return data;
          })(),
        },
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            main.action.getUnit().alarm = [];
            for (const id of dialog.state.check!.sort) {
              if (dialog.state.check!.data[id]!.check) {
                main.action.getUnit().alarm.push(id);
              }
            }
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    dragInit: (arg: { subId: string; y: number }): void => {
      if (!temp.drag.status) {
        const item = Util.getById(`SubItem${arg.subId}`).getBoundingClientRect();
        temp.drag.status = `start`;
        temp.drag.id = arg.subId;
        temp.drag.y = arg.y;
        temp.drag.top = item.top;
        temp.drag.left = item.left - Util.getById(`SubHome`).getBoundingClientRect().left;
        temp.drag.height = item.height;
        temp.drag.width = item.width;
        state.status[arg.subId] = `edit`;
        conf.state.data.vibrate === `on` && navigator.vibrate(40);
      }
    },
    dragStart: (): void => {
      if (temp.drag.status === `start`) {
        temp.drag.status = `move`;
        temp.drag.clone = Util.getById(`SubItem${temp.drag.id}`).cloneNode(true) as HTMLElement;
        temp.drag.clone.style.position = `absolute`;
        temp.drag.clone.style.zIndex = `1`;
        temp.drag.clone.style.top = `${temp.drag.top}px`;
        temp.drag.clone.style.left = `${temp.drag.left}px`;
        temp.drag.clone.style.height = `${temp.drag.height}px`;
        temp.drag.clone.style.width = `${temp.drag.width}px`;
        Util.getById(`SubBody`).appendChild(temp.drag.clone);
        state.status[temp.drag.id!] = `hide`;
      }
    },
    dragMove: (arg: { y: number }): void => {
      if (temp.drag.status === `move`) {
        temp.drag.clone!.style.top = `${temp.drag.top! + arg.y - temp.drag.y!}px`;
        const index = action.getFull().sort.indexOf(temp.drag.id!);
        const clone = temp.drag.clone!.getBoundingClientRect();
        const wrap = Util.getById(`SubBody`).getBoundingClientRect();
        const prev = Util.getById(`SubItem${action.getFull().sort[index - 1]}`)?.getBoundingClientRect();
        const current = Util.getById(`SubItem${action.getFull().sort[index]}`).getBoundingClientRect();
        const next = Util.getById(`SubItem${action.getFull().sort[index + 1]}`)?.getBoundingClientRect();
        if (prev && clone.top + clone.height / 2 < (next?.top || wrap.bottom) - (prev.height + current.height) / 2) {
          action.getFull().sort.splice(index - 1, 0, ...action.getFull().sort.splice(index, 1));
        }
        if (next && clone.top + clone.height / 2 > (prev?.bottom || wrap.top) + (current.height + next.height) / 2) {
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
            { top: `${Util.getById(`SubItem${temp.drag.id}`).getBoundingClientRect().top}px` },
            { duration: app.action.getDuration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, () => {
            delete state.status[temp.drag.id!];
            temp.drag.clone!.remove();
            temp.drag = {};
          });
      } else {
        delete state.status[temp.drag.id!];
        temp.drag = {};
      }
    },
    swipeInit: (arg: { x: number; y: number }): void => {
      if (!temp.swipe.status) {
        temp.swipe.status = `start`;
        temp.swipe.elem = Util.getById<HTMLElement>(`SubRoot`);
        temp.swipe.x = arg.x;
        temp.swipe.y = arg.y;
        temp.swipe.right =
          temp.swipe.elem.getBoundingClientRect().left + temp.swipe.elem.getBoundingClientRect().width / 2;
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
        temp.swipe.elem!.style.transform = `translateX(${Math.max(temp.swipe.right! + arg.x - temp.swipe.x!, 0)}px)`;
      }
    },
    swipeEnd: (arg: { x: number }): void => {
      if (temp.swipe.status === `move`) {
        temp.swipe.status = `end`;
        if (temp.swipe.right! + arg.x - temp.swipe.x! > 100) {
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
