import i18next from "i18next";
import Api from "@/api/api";
import Util from "@/utils/base/util";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import dialog from "@/stores/popup/dialog";

const temp: {
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    top?: number;
  };
} = {
  swipe: {},
};

const useStore = defineStore(`conf`, () => {
  const state: {
    data: {
      size: 1 | 2 | 3;
      speed: 1 | 2 | 3;
      theme: `light` | `dark`;
      lang: `ja` | `en`;
      vibrate: `on` | `off`;
      save: `local` | `rest` | `gql`;
    };
  } = reactive({
    data: constant.init.conf,
  });

  const action = {
    init: async (): Promise<void> => {
      state.data = await Api.readConf();
      await action.setLang({ lang: state.data.lang });
      watch(
        () => state.data,
        (data) => {
          Api.writeConf(data);
        },
        { deep: true },
      );
      watch(
        () => state.data.lang,
        async (lang) => {
          await action.setLang({ lang });
        },
        { flush: `sync` },
      );
    },
    setLang: async (arg: { lang: string }): Promise<void> => {
      await i18next.changeLanguage(arg.lang);
      app.action.forceUpdate();
    },
    downloadBackup: (arg: { elem: HTMLElement }): void => {
      const fileName = constant.base.app.backup;
      const fileData =
        `${app.getter.listId()}\n` +
        `${JSON.stringify(list.state.data)}\n` +
        `${JSON.stringify(main.state.data)}\n` +
        `${JSON.stringify(sub.state.data)}\n` +
        `${JSON.stringify(state.data)}`;
      arg.elem.setAttribute(`download`, fileName);
      arg.elem.setAttribute(`href`, `data:text/plain,${encodeURIComponent(fileData)}`);
    },
    uploadBackup: (arg: { files: FileList }): void => {
      const reader = new FileReader();
      reader.addEventListener(`load`, (event: ProgressEvent<FileReader>) => {
        const files = typeof event.target?.result === `string` ? event.target.result.split(`\n`) : [];
        if (files.length === 5 && Util.isJson(files[1], files[2], files[3], files[4])) {
          state.data = JSON.parse(files[4]!);
          list.state.data = JSON.parse(files[1]!);
          main.state.data = JSON.parse(files[2]!);
          sub.state.data = JSON.parse(files[3]!);
          app.action.routerBack({ listId: files[0]! });
        } else {
          dialog.action.open({
            mode: `alert`,
            title: i18next.t(`dialog.title.error`),
            message: ``,
            cancel: i18next.t(`button.ok`),
            callback: {
              cancel: () => {
                dialog.action.close();
              },
            },
          });
        }
      });
      reader.readAsText(arg.files[0]!);
    },
    resetConf: (): void => {
      dialog.action.open({
        mode: `confirm`,
        title: i18next.t(`dialog.title.reset`),
        message: ``,
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: () => {
            state.data = constant.init.conf;
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    resetList: (): void => {
      dialog.action.open({
        mode: `confirm`,
        title: i18next.t(`dialog.title.reset`),
        message: ``,
        ok: i18next.t(`button.ok`),
        cancel: i18next.t(`button.cancel`),
        callback: {
          ok: async () => {
            list.state.data = constant.init.list;
            main.state.data = constant.init.main;
            sub.state.data = constant.init.sub;
            app.action.routerBack({ listId: constant.base.id.inbox });
            dialog.action.close();
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    swipeInit: (arg: { x: number; y: number }): void => {
      if (!temp.swipe.status) {
        temp.swipe.status = `start`;
        temp.swipe.elem = Util.getById<HTMLElement>(`ConfRoot`);
        temp.swipe.x = arg.x;
        temp.swipe.y = arg.y;
        temp.swipe.top =
          temp.swipe.elem.getBoundingClientRect().top + temp.swipe.elem.getBoundingClientRect().height / 2;
      }
    },
    swipeStart: (arg: { x: number; y: number }): void => {
      if (temp.swipe.status === `start`) {
        if (Math.abs(arg.x - temp.swipe.x!) + Math.abs(arg.y - temp.swipe.y!) > 15) {
          if (Math.abs(arg.x - temp.swipe.x!) < Math.abs(arg.y - temp.swipe.y!)) {
            temp.swipe.status = `move`;
          } else {
            temp.swipe = {};
          }
        }
      }
    },
    swipeMove: (arg: { y: number }): void => {
      if (temp.swipe.status === `move`) {
        temp.swipe.elem!.style.transform = `translateY(${Math.max(temp.swipe.top! + arg.y - temp.swipe.y!, 0)}px)`;
      }
    },
    swipeEnd: (arg: { y: number }): void => {
      if (temp.swipe.status === `move`) {
        temp.swipe.status = `end`;
        if (temp.swipe.top! + arg.y - temp.swipe.y! > 100) {
          app.action.routerBack();
          temp.swipe = {};
        } else {
          temp.swipe
            .elem!.animate(
              { transform: `translateY(0px)` },
              { duration: app.action.getDuration(), easing: `ease-in-out` },
            )
            .addEventListener(`finish`, () => {
              temp.swipe.elem!.style.transform = `translateY(0px)`;
              temp.swipe = {};
            });
        }
      } else {
        temp.swipe = {};
      }
    },
  };

  return { state, action };
});

const store = useStore(createPinia());

export default { temp, state: store.state, action: store.action };
