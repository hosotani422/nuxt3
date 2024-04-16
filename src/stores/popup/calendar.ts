import Vue from "vue";
import i18next from "i18next";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";

const refer: {
  body?: Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  area?: Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
} = {};

const prop: {
  swipe: {
    status?: `start` | `move` | `end`;
    target?: HTMLElement;
    x?: number;
    y?: number;
    left?: number;
    listener?: () => void;
  };
} = {
  swipe: {},
};

const useStore = defineStore(`calendar`, () => {
  const state: {
    open: boolean;
    select: string;
    current: string;
    cancel: string;
    clear: string;
    callback: (date?: string) => void;
  } = reactive(constant.init.calendar);

  const getter = reactive({
    textWeek: computed(() => (): string[] => {
      const week = [];
      for (let i = 1; i <= Number(i18next.t(`calendar.sort`)); i++) {
        week.push(i18next.t(`calendar.week${i as unknown as `1` | `2` | `3` | `4` | `5` | `6` | `7`}`));
      }
      return week;
    }),
    textDay: computed(() => (): { id: string; day: { month: string; day: string; text: string }[] }[] => {
      const month: ReturnType<typeof getter.textDay> = [];
      for (
        let curMonth = app.lib.dayjs(state.current).subtract(1, `month`),
          limMonth = app.lib.dayjs(state.current).add(2, `month`);
        curMonth.isBefore(limMonth);
        curMonth = curMonth.add(1, `month`)
      ) {
        const day: (typeof month)[number][`day`] = [];
        for (
          let curDay = curMonth.date(1).subtract(curMonth.date(1).day(), `day`),
            limDay = curMonth.add(1, `month`).date(1);
          curDay.isBefore(limDay);
          curDay = curDay.add(1, `day`)
        ) {
          day.push({
            month: curMonth.format(`YYYY/MM`),
            day: curDay.format(`YYYY/MM/DD`),
            text: curDay.format(`D`),
          });
        }
        month.push({ id: curMonth.format(`YYYY/MM`), day });
      }
      return month;
    }),
    classDay: computed(() => (month: string, day: string): { [K in `select` | `today` | `hide`]: boolean } => ({
      select: day === state.select,
      today: day === app.lib.dayjs().format(`YYYY/MM/DD`),
      hide: month !== app.lib.dayjs(day).format(`YYYY/MM`),
    })),
  });

  const action = {
    open: (payload: {
      select: typeof state.select;
      current: typeof state.current;
      cancel: typeof state.cancel;
      clear: typeof state.clear;
      callback: typeof state.callback;
    }): void => {
      state.open = true;
      state.select = payload.select;
      state.current = payload.current;
      state.cancel = payload.cancel;
      state.clear = payload.clear;
      state.callback = payload.callback;
    },
    close: (): void => {
      state.open = false;
    },
    pageMove: (payload: { prev: boolean }): void => {
      refer
        .area!.value!.animate(
          { transform: `translateX(${payload.prev ? `0px` : `-66.666%`})` },
          { duration: constant.base.duration[conf.state.data.speed], easing: `ease-in-out` },
        )
        .addEventListener(`finish`, () => {
          refer.area!.value!.style.transform = `translateX(-33.333%)`;
          state.current = app.lib
            .dayjs(state.current)
            .add(payload.prev ? -1 : 1, `month`)
            .format(`YYYY/MM`);
        });
    },
    swipeInit: (payload: { target: HTMLElement; clientX: number; clientY: number }): void => {
      prop.swipe.status = `start`;
      prop.swipe.target = payload.target;
      prop.swipe.x = payload.clientX;
      prop.swipe.y = payload.clientY;
      prop.swipe.left =
        prop.swipe.target.getBoundingClientRect().left - refer.body!.value!.parentElement!.getBoundingClientRect().left;
    },
    swipeStart: (payload: { clientX: number; clientY: number }): void => {
      if (prop.swipe.status === `start`) {
        if (Math.abs(payload.clientX - prop.swipe.x!) + Math.abs(payload.clientY - prop.swipe.y!) > 10) {
          Math.abs(payload.clientX - prop.swipe.x!) > Math.abs(payload.clientY - prop.swipe.y!)
            ? (prop.swipe.status = `move`)
            : (prop.swipe = {});
        }
      }
    },
    swipeMove: (payload: { clientX: number }): void => {
      if (prop.swipe.status === `move`) {
        prop.swipe.target!.style.transform = `translateX(${prop.swipe.left! + payload.clientX - prop.swipe.x!}px)`;
      }
    },
    swipeEnd: (payload: { clientX: number }): void => {
      if (prop.swipe.status === `move`) {
        prop.swipe.status = `end`;
        if (payload.clientX - prop.swipe.x! >= 75) {
          action.pageMove({ prev: true });
          prop.swipe = {};
        } else if (payload.clientX - prop.swipe.x! <= -75) {
          action.pageMove({ prev: false });
          prop.swipe = {};
        } else {
          prop.swipe
            .target!.animate(
              { transform: `translateX(-33.333%)` },
              { duration: constant.base.duration[conf.state.data.speed], easing: `ease-in-out` },
            )
            .addEventListener(`finish`, () => {
              prop.swipe.target!.style.transform = `translateX(-33.333%)`;
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
