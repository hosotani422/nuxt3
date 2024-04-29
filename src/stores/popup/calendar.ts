import * as datefns from "date-fns";
import i18next from "i18next";
import constant from "@/utils/const";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";

const temp: {
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    left?: number;
  };
  callback: (date: string) => void;
} = {
  swipe: {},
  callback: () => ``,
};

const useStore = defineStore(`calendar`, () => {
  const state: {
    open: boolean;
    select: string;
    current: string;
    cancel: string;
    clear: string;
  } = reactive(constant.init.calendar);

  const getter = reactive({
    classStatus: computed(() => (month: string, day: string): { [K in `select` | `today` | `hide`]: boolean } => ({
      select: day === state.select,
      today: day === datefns.format(new Date(), `yyyy/MM/dd`),
      hide: month !== datefns.format(day, `yyyy/MM`),
    })),
  });

  const action = {
    open: (arg: {
      select: typeof state.select;
      cancel: typeof state.cancel;
      clear: typeof state.clear;
      callback: typeof temp.callback;
    }): void => {
      state.open = true;
      state.select = arg.select;
      state.current = datefns.format(arg.select || new Date(), `yyyy/MM`);
      state.cancel = arg.cancel;
      state.clear = arg.clear;
      temp.callback = arg.callback;
    },
    close: (): void => {
      state.open = false;
    },
    getWeek: (): string[] => {
      const week: ReturnType<typeof action.getWeek> = [];
      for (const id of i18next.t(`calendar.sort`, { returnObjects: true })) {
        week.push(i18next.t(`calendar.data.${id}`));
      }
      return week;
    },
    getDay: (): { id: string; day: { id: string; text: string }[] }[] => {
      const month: ReturnType<typeof action.getDay> = [];
      for (
        let curMonth = datefns.subMonths(state.current, 1), limMonth = datefns.addMonths(state.current, 2);
        datefns.isBefore(curMonth, limMonth);
        curMonth = datefns.addMonths(curMonth, 1)
      ) {
        const day: (typeof month)[number][`day`] = [];
        for (
          let curDay = datefns.subDays(datefns.setDate(curMonth, 1), datefns.getDay(datefns.setDate(curMonth, 1))),
            limDay = datefns.setDate(datefns.addMonths(curMonth, 1), 1);
          datefns.isBefore(curDay, limDay);
          curDay = datefns.addDays(curDay, 1)
        ) {
          day.push({ id: datefns.format(curDay, `yyyy/MM/dd`), text: datefns.format(curDay, `d`) });
        }
        month.push({ id: datefns.format(curMonth, `yyyy/MM`), day });
      }
      return month;
    },
    pageMove: (arg: { mode: `prev` | `next` }): void => {
      Util.getById(`CalendarArea`)
        .animate(
          { transform: `translateX(${arg.mode === `prev` ? `0px` : `-66.666%`})` },
          { duration: app.action.getDuration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, () => {
          Util.getById<HTMLElement>(`CalendarArea`).style.transform = `translateX(-33.333%)`;
          state.current = datefns.format(datefns.addMonths(state.current, arg.mode === `prev` ? -1 : 1), `yyyy/MM`);
        });
    },
    swipeInit: (arg: { x: number; y: number }): void => {
      if (!temp.swipe.status) {
        temp.swipe.status = `start`;
        temp.swipe.elem = Util.getById<HTMLElement>(`CalendarArea`);
        temp.swipe.x = arg.x;
        temp.swipe.y = arg.y;
        temp.swipe.left =
          temp.swipe.elem.getBoundingClientRect().left -
          Util.getById(`CalendarRoot`).children[0]!.getBoundingClientRect().left;
      }
    },
    swipeStart: (arg: { x: number; y: number }): void => {
      if (temp.swipe.status === `start`) {
        if (Math.abs(arg.x - temp.swipe.x!) + Math.abs(arg.y - temp.swipe.y!) > 10) {
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
        temp.swipe.elem!.style.transform = `translateX(${temp.swipe.left! + arg.x - temp.swipe.x!}px)`;
      }
    },
    swipeEnd: (arg: { x: number }): void => {
      if (temp.swipe.status === `move`) {
        temp.swipe.status = `end`;
        if (Math.abs(arg.x - temp.swipe.x!) >= 75) {
          action.pageMove({ mode: arg.x - temp.swipe.x! > 0 ? `prev` : `next` });
          temp.swipe = {};
        } else {
          temp.swipe
            .elem!.animate(
              { transform: `translateX(-33.333%)` },
              { duration: app.action.getDuration(), easing: `ease-in-out` },
            )
            .addEventListener(`finish`, () => {
              temp.swipe.elem!.style.transform = `translateX(-33.333%)`;
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
