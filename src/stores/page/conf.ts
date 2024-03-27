import * as Util from "@/utils/base/util";
import constant from "@/utils/const";
import * as Api from "@/api/api";
import * as Cordova from "@/utils/cordova/cordova";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import dialog from "@/stores/popup/dialog";

const prop: {
  swipe: {
    status?: `start` | `move` | `end`;
    target?: HTMLElement;
    x?: number;
    y?: number;
    top?: number;
    listener?: () => void;
  };
} = {
  swipe: {},
};

const useStore = defineStore(`conf`, () => {
  const state: {
    data: {
      size: 1 | 2 | 3;
      speed: 1 | 2 | 3;
      volume: 0 | 1 | 2 | 3;
      vibrate: `on` | `off`;
      theme: `light` | `dark`;
      lang: `ja` | `en`;
      save: `local` | `rest` | `gql`;
    };
  } = reactive({
    data: constant.init.conf,
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
        },
        { deep: true },
      );
      watch(
        () => app.lib.lodash.cloneDeep(state.data.volume),
        () => {
          action.reactSound();
        },
      );
      watch(
        () => app.lib.lodash.cloneDeep(state.data.lang),
        () => {
          action.reactLang();
        },
      );
    },
    loadItem: async (): Promise<void> => {
      state.data = await Api.readConf();
    },
    saveItem: (): void => {
      Api.writeConf(state.data);
    },
    reactSound: (): void => {
      constant.sound.volume(state.data.volume / 3);
    },
    reactLang: (): void => {
      useNuxtApp().$i18n.setLocale(state.data.lang);
    },
    reactAlarm: (): void => {
      if (process.client) {
        Cordova.Notice.removeAll();
        for (const listId of list.getter.stateFull().sort) {
          for (const mainId of main.getter.stateFull(listId).sort) {
            const mainUnit = main.getter.stateUnit(listId, mainId);
            if (mainUnit.date) {
              for (const alarmId of mainUnit.alarm) {
                Cordova.Notice.insert({
                  title: useNuxtApp().$i18n.t(`dialog.title.alarm`),
                  message: `${list.getter.stateUnit(listId).title} ⇒ ${mainUnit.title}`,
                  date: app.lib
                    .dayjs(`${mainUnit.date} ${mainUnit.time || `00:00`}`)
                    .minute(
                      app.lib.dayjs(`${mainUnit.date} ${mainUnit.time || `00:00`}`).minute() -
                        Number(useNuxtApp().$i18n.t(`dialog.alarm.data${alarmId}.value`)),
                    )
                    .toDate(),
                });
              }
            }
          }
        }
      }
    },
    downloadBackup: (payload: { event: Event }): void => {
      const data =
        `${app.getter.listId()}\n` +
        `${JSON.stringify(list.state.data)}\n` +
        `${JSON.stringify(main.state.data)}\n` +
        `${JSON.stringify(sub.state.data)}\n` +
        `${JSON.stringify(state.data)}`;
      if (!app.getter.isApp()) {
        const target = payload.event.currentTarget as HTMLElement;
        target.setAttribute(`download`, constant.base.backup);
        target.setAttribute(`href`, `data:text/plain,${encodeURIComponent(data)}`);
      } else {
        Cordova.File.write(
          constant.base.backup,
          data,
          (filePath) => {
            dialog.action.open({
              mode: `alert`,
              title: useNuxtApp().$i18n.t(`dialog.title.backup`),
              message: filePath,
              cancel: useNuxtApp().$i18n.t(`button.ok`),
              callback: {
                cancel: () => {
                  dialog.action.close();
                },
              },
            });
          },
          (errorCode) => {
            dialog.action.open({
              mode: `alert`,
              title: useNuxtApp().$i18n.t(`dialog.title.backupError`),
              message: String(errorCode),
              cancel: useNuxtApp().$i18n.t(`button.ok`),
              callback: {
                cancel: () => {
                  dialog.action.close();
                },
              },
            });
          },
        );
      }
    },
    uploadBackup: (payload: { event: Event }): void => {
      const reader = new FileReader();
      reader.onload = (_event: ProgressEvent<FileReader>) => {
        const fileList = (() => {
          if (typeof _event.target?.result === `string`) {
            return _event.target.result.split(`\n`);
          }
          return [];
        })();
        if (
          fileList.length === 5 &&
          Util.isJson(fileList[1]) &&
          Util.isJson(fileList[2]) &&
          Util.isJson(fileList[3]) &&
          Util.isJson(fileList[4])
        ) {
          state.data = JSON.parse(fileList[4]!);
          list.state.data = JSON.parse(fileList[1]!);
          main.state.data = JSON.parse(fileList[2]!);
          sub.state.data = JSON.parse(fileList[3]!);
          app.action.routerBack({ listId: fileList[0]! });
        } else {
          dialog.action.open({
            mode: `alert`,
            title: useNuxtApp().$i18n.t(`dialog.title.fileError`),
            message: ``,
            cancel: useNuxtApp().$i18n.t(`button.ok`),
            callback: {
              cancel: () => {
                dialog.action.close();
              },
            },
          });
        }
      };
      reader.readAsText((payload.event.target as HTMLInputElement).files![0]!);
    },
    resetConf: (): void => {
      dialog.action.open({
        mode: `confirm`,
        title: useNuxtApp().$i18n.t(`dialog.title.reset`),
        message: ``,
        ok: useNuxtApp().$i18n.t(`button.ok`),
        cancel: useNuxtApp().$i18n.t(`button.cancel`),
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
        title: useNuxtApp().$i18n.t(`dialog.title.reset`),
        message: ``,
        ok: useNuxtApp().$i18n.t(`button.ok`),
        cancel: useNuxtApp().$i18n.t(`button.cancel`),
        callback: {
          ok: async () => {
            app.action.routerBack({ listId: constant.init.listId });
            dialog.action.close();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            list.state.data = constant.init.list;
            main.state.data = constant.init.main;
            sub.state.data = constant.init.sub;
          },
          cancel: () => {
            dialog.action.close();
          },
        },
      });
    },
    swipeInit: (payload: { target: HTMLElement; clientX: number; clientY: number }): void => {
      prop.swipe.status = prop.swipe.status === `end` ? `move` : `start`;
      prop.swipe.target = payload.target;
      prop.swipe.x = payload.clientX;
      prop.swipe.y = payload.clientY;
      const item = prop.swipe.target.getBoundingClientRect();
      prop.swipe.top = item.top + item.height / 2;
      // スワイプ終了前に再開時
      if (prop.swipe.status === `move`) {
        prop.swipe.target.removeEventListener(`transitionend`, prop.swipe.listener!);
        prop.swipe.target.classList.remove(`v-enter-active`);
        prop.swipe.target.style.transform = `translateY(${prop.swipe.top}px)`;
      }
    },
    swipeStart: (payload: { clientX: number; clientY: number }): void => {
      if (prop.swipe.status === `start`) {
        if (Math.abs(payload.clientX - prop.swipe.x!) + Math.abs(payload.clientY - prop.swipe.y!) > 15) {
          Math.abs(payload.clientX - prop.swipe.x!) < Math.abs(payload.clientY - prop.swipe.y!)
            ? (prop.swipe.status = `move`)
            : (prop.swipe = {});
        }
      }
    },
    swipeMove: (payload: { clientY: number }): void => {
      if (prop.swipe.status === `move`) {
        const y = prop.swipe.top! + payload.clientY - prop.swipe.y!;
        prop.swipe.target!.style.transform = `translateY(${y > 0 ? y : 0}px)`;
      }
    },
    swipeEnd: (payload: { clientY: number }): void => {
      if (prop.swipe.status === `move`) {
        prop.swipe.status = `end`;
        if (prop.swipe.top! + payload.clientY - prop.swipe.y! > 100) {
          app.action.routerBack();
          prop.swipe = {};
        } else {
          prop.swipe.target!.style.transform = ``;
          prop.swipe.target!.classList.add(`v-enter-active`);
          prop.swipe.target!.addEventListener(
            `transitionend`,
            (prop.swipe.listener = () => {
              prop.swipe.target!.removeEventListener(`transitionend`, prop.swipe.listener!);
              prop.swipe.target!.classList.remove(`v-enter-active`);
              prop.swipe = {};
            }),
          );
        }
      } else {
        prop.swipe = {};
      }
    },
  };

  return { state, action };
});

const store = useStore(createPinia());

export default { prop, state: store.state, action: store.action };
