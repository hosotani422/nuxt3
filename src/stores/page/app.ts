import * as Vue from "vue";
import i18next from "i18next";
import constant from "@/utils/const/index";
import Api from "@/api/api";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import { ja } from "@/locales/ja";
import { en } from "@/locales/en";

const temp: {
  routeStart: boolean;
  backId: string;
  route?: typeof useRoute;
  router?: typeof useRouter;
} = {
  routeStart: true,
  backId: ``,
};

const useStore = defineStore(`app`, () => {
  const state: {
    updateKey: string;
  } = reactive({
    updateKey: ``,
  });

  const getter = reactive({
    listId: computed(() => (): string => {
      return temp.route?.params?.listId || ``;
    }),
    mainId: computed(() => (): string => {
      return temp.route?.params?.mainId || ``;
    }),
    attrClass: computed(() => (attrs: Vue.SetupContext[`attrs`]): Vue.SetupContext[`attrs`] => {
      return Object.fromEntries(Object.entries(attrs).filter(([key]) => key === `class`));
    }),
    attrAlmost: computed(() => (attrs: Vue.SetupContext[`attrs`]): Vue.SetupContext[`attrs`] => {
      return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== `class`));
    }),
    classTheme: computed(() => (): string => {
      return conf.state.data.theme;
    }),
    classSize: computed(() => (): string => {
      if (conf.state.data.size === 1) {
        return `text-sm`;
      } else if (conf.state.data.size === 3) {
        return `text-lg`;
      }
      return `text-base`;
    }),
    classSpeed: computed(() => (): string => {
      if (conf.state.data.speed === 1) {
        return `slow`;
      } else if (conf.state.data.speed === 3) {
        return `fast`;
      }
      return `just`;
    }),
  });

  const action = {
    init: async (): Promise<void> => {
      temp.route = useRoute();
      temp.router = useRouter();
      await i18next.init({
        lng: `ja`,
        resources: {
          ja: { translation: ja },
          en: { translation: en },
        },
      });
      await conf.action.init();
      await sub.action.init();
      await main.action.init();
      await list.action.init();
      action.clearTrash();
    },
    getDuration: (): number => {
      if (conf.state.data.speed === 1) {
        return 500;
      } else if (conf.state.data.speed === 3) {
        return 100;
      }
      return 250;
    },
    routerList: (): void => {
      temp.router.push(`/${getter.listId()}/list`);
    },
    routerMain: (arg: { listId: string }): void => {
      temp.router.push(`/${arg.listId}`);
    },
    routerSub: (arg: { mainId: string }): void => {
      temp.router.push(`/${getter.listId()}/sub/${arg.mainId}`);
    },
    routerConf: (): void => {
      temp.router.push(`/${getter.listId()}/conf`);
    },
    routerBack: (arg?: { listId: string }): void => {
      temp.backId = arg?.listId || ``;
      temp.backId && Api.writeRoute(temp.backId);
      temp.router.back();
    },
    clearTrash: (): void => {
      const trashId = constant.base.id.trash;
      main.state.data[trashId] = { sort: [], data: {} };
      sub.state.data[trashId] = { data: {} };
    },
    forceUpdate: (): void => {
      state.updateKey = String(new Date().valueOf());
    },
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { temp, state: store.state, getter: store.getter, action: store.action };
