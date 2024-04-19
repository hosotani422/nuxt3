import lodash from "lodash";
import i18next from "i18next";
import * as datefns from "date-fns";
import Api from "@/api/api";
import Util from "@/utils/base/util";
import Cordova from "@/utils/cordova/cordova";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
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
        () => lodash.cloneDeep(state.data),
        () => {
          action.saveItem();
        },
        { deep: true },
      );
      watch(
        () => lodash.cloneDeep(state.data.volume),
        () => {
          action.reactSound();
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
    reactLang: (payload: { value: string }): void => {
      i18next.changeLanguage(payload.value);
    },
    reactAlarm: (): void => {
      if (process.client) {
        Cordova.Notice.removeAll();
        for (const listId of list.getter.stateFull().sort) {
          for (const mainId of main.getter.stateFull(listId).sort) {
            const mainUnit = main.getter.stateUnit(listId, mainId);
            if (mainUnit.date) {
              for (const alarmId of mainUnit.alarm as (
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
                Cordova.Notice.insert({
                  title: i18next.t(`dialog.title.alarm`),
                  message: `${list.getter.stateUnit(listId).title} ⇒ ${mainUnit.title}`,
                  date: datefns.subMinutes(
                    new Date(`${mainUnit.date} ${mainUnit.time || `00:00`}`),
                    Number(i18next.t(`dialog.alarm.data${alarmId}.value`)),
                  ),
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
              title: i18next.t(`dialog.title.backup`),
              message: filePath,
              cancel: i18next.t(`button.ok`),
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
              title: i18next.t(`dialog.title.backupError`),
              message: String(errorCode),
              cancel: i18next.t(`button.ok`),
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
            title: i18next.t(`dialog.title.fileError`),
            message: ``,
            cancel: i18next.t(`button.ok`),
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
      if (!prop.swipe.status) {
        prop.swipe.status = `start`;
        prop.swipe.target = payload.target;
        prop.swipe.x = payload.clientX;
        prop.swipe.y = payload.clientY;
        const item = prop.swipe.target.getBoundingClientRect();
        prop.swipe.top = item.top + item.height / 2;
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
          prop.swipe
            .target!.animate(
              { transform: `translateY(0px)` },
              { duration: constant.base.duration[conf.state.data.speed], easing: `ease-in-out` },
            )
            .addEventListener(`finish`, () => {
              prop.swipe.target!.style.transform = `translateY(0px)`;
              prop.swipe = {};
            });
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
