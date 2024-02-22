import lodash from "lodash";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import lang from "@/utils/lang/lang";
import constant from "@/utils/const/index";
import * as Api from "@/api/api";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";

const lib: {
  lodash: typeof lodash;
  dayjs: typeof dayjs;
} = {
  lodash,
  dayjs: (() => {
    dayjs.locale(`ja`);
    return dayjs;
  })(),
};

const useStore = defineStore(`app`, () => {
  const state: {
    initClient: boolean;
    backId: string;
  } = reactive({
    initClient: false,
    backId: ``,
  });

  const getter = reactive({
    isApp: computed(() => (): boolean => false),
    listId: computed(() => (): string => {
      const listId = useRoute()?.params?.listId;
      return listId && !Array.isArray(listId) ? listId : ``;
    }),
    mainId: computed(() => (): string => {
      const mainId = useRoute()?.params?.mainId;
      return mainId && !Array.isArray(mainId) ? mainId : ``;
    }),
    lang: computed(() => (): (typeof lang)[(typeof conf)[`state`][`data`][`lang`]] => lang[conf.state.data.lang]),
    classTop: computed(() => (): string => {
      const classList: string[] = [conf.state.data.theme];
      classList.push(
        (() => {
          if (conf.state.data.speed === 1) {
            return `speed1`;
          } else if (conf.state.data.speed === 3) {
            return `speed3`;
          }
          return `speed2`;
        })(),
      );
      classList.push(
        (() => {
          if (conf.state.data.size === 1) {
            return `text-sm`;
          } else if (conf.state.data.size === 3) {
            return `text-lg`;
          }
          return `text-base`;
        })(),
      );
      return classList.join(` `);
    }),
    classBottom: computed(() => (): string => {
      if (process.client && window.outerHeight <= 400) {
        return `flex-[0_0_32px]`;
      } else if (process.client && window.outerHeight >= 720) {
        return `flex-[0_0_90px]`;
      }
      return `flex-[0_0_50px]`;
    }),
  });

  const action = {
    initPage: async (): Promise<void> => {
      await conf.action.initPage();
      await sub.action.initPage();
      await main.action.initPage();
      await list.action.initPage();
      action.clearTrash();
      list.action.actPage();
      main.action.actPage();
      sub.action.actPage();
      conf.action.actPage();
    },
    saveRoute: (payload: { listId: string }): void => {
      Api.writeRoute(payload.listId);
    },
    routerList: (): void => {
      useRouter().push(`/${getter.listId()}/list`);
    },
    routerMain: (payload: { listId: string }): void => {
      useRouter().push(`/${payload.listId}`);
    },
    routerSub: (payload: { mainId: string }): void => {
      useRouter().push(`/${getter.listId()}/sub/${payload.mainId}`);
    },
    routerConf: (): void => {
      useRouter().push(`/${getter.listId()}/conf`);
    },
    routerBack: (payload?: { listId: string }): void => {
      state.backId = payload?.listId || ``;
      payload?.listId && action.saveRoute({ listId: state.backId });
      useRouter().back();
    },
    clearTrash: (): void => {
      main.state.data[constant.base.id.trash] = { sort: [], data: {} };
      sub.state.data[constant.base.id.trash] = { data: {} };
    },
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { lib, state: store.state, getter: store.getter, action: store.action };
