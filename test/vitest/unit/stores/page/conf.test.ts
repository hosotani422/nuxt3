import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import i18next from "i18next";
import Api from "@/api/api";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  await fixture.init();
  vi.mock(`vue-router`, () => ({
    useRoute: () => ({
      params: { listId: `list1111111111111`, mainId: `main1111111111111` },
    }),
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe(`action`, () => {
  it(`init`, async () => {
    const readMock = vi.spyOn(Api, `readConf`).mockResolvedValue({
      size: 2,
      speed: 2,
      theme: `light`,
      lang: `ja`,
      vibrate: `on`,
      save: `local`,
    });
    const writeMock = vi.spyOn(Api, `writeConf`).mockReturnValue();
    const langMock = vi.spyOn(conf.action, `setLang`).mockResolvedValue();
    await conf.action.init();
    expect(readMock).toBeCalledTimes(1);
    expect(readMock).toBeCalledWith();
    expect(langMock).toBeCalledTimes(1);
    expect(langMock).toBeCalledWith({ lang: `ja` });
    expect(conf.state.data).toEqual({
      size: 2,
      speed: 2,
      theme: `light`,
      lang: `ja`,
      vibrate: `on`,
      save: `local`,
    });
    conf.state.data.lang = `en`;
    expect(writeMock).toBeCalledTimes(1);
    expect(writeMock).toBeCalledWith({
      size: 2,
      speed: 2,
      theme: `light`,
      lang: `en`,
      vibrate: `on`,
      save: `local`,
    });
    expect(langMock).toBeCalledTimes(3);
    expect(langMock).toBeCalledWith({ lang: `en` });
  });
  it(`setLang`, async () => {
    const langMock = vi.spyOn(i18next, `changeLanguage`).mockReturnThis();
    const updateMock = vi.spyOn(app.action, `forceUpdate`).mockReturnValue();
    await conf.action.setLang({ lang: `en` });
    expect(langMock).toBeCalledTimes(1);
    expect(langMock).toBeCalledWith(`en`);
    expect(updateMock).toBeCalledTimes(1);
    expect(updateMock).toBeCalledWith();
  });
  it(`downloadBackup`, () => {
    const attributeMock = vi.fn();
    const elem = { setAttribute: attributeMock } as unknown as HTMLElement;
    conf.action.downloadBackup({ elem });
    expect(attributeMock).toBeCalledTimes(2);
    expect(attributeMock).toBeCalledWith(`download`, `memosuku.bak`);
    expect(attributeMock).toBeCalledWith(
      `href`,
      `data:text/plain,${encodeURIComponent(
        `${app.getter.listId()}\n` +
          `${JSON.stringify(list.state.data)}\n` +
          `${JSON.stringify(main.state.data)}\n` +
          `${JSON.stringify(sub.state.data)}\n` +
          `${JSON.stringify(conf.state.data)}`,
      )}`,
    );
  });
  it(`uploadBackup`, async () => {
    const readMock = vi.spyOn(FileReader.prototype, `readAsText`);
    const listenerMock = vi.spyOn(FileReader.prototype, `addEventListener`);
    const routerMock = vi.spyOn(app.action, `routerBack`).mockReturnValue();
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    conf.action.uploadBackup({
      files: [
        new File(
          [
            `list0000000000000\n` +
              `{"sort":["list0000000000000"],"data":{"list0000000000000":{"title":"Inbox"}}}\n` +
              `{"list0000000000000":{"sort":[],"data":{}}}\n` +
              `{"list0000000000000":{"data":{}}}\n` +
              `{"size":2,"speed":2,"theme":"dark","lang":"ja","vibrate":"on","save":"local"}`,
          ],
          `memosuku.bak`,
          { type: `text/plain` },
        ),
      ] as unknown as FileList,
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(readMock).toBeCalledTimes(1);
    expect(listenerMock).toBeCalledTimes(1);
    expect(listenerMock.mock.calls[0]![0]).toBe(`load`);
    expect(conf.state.data).toEqual({
      size: 2,
      speed: 2,
      theme: `dark`,
      lang: `ja`,
      vibrate: `on`,
      save: `local`,
    });
    expect(list.state.data).toEqual({
      sort: ["list0000000000000"],
      data: { list0000000000000: { title: "Inbox" } },
    });
    expect(main.state.data).toEqual({ list0000000000000: { sort: [], data: {} } });
    expect(sub.state.data).toEqual({ list0000000000000: { data: {} } });
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith({ listId: `list0000000000000` });
    conf.action.uploadBackup({ files: [new File([``], ``)] as unknown as FileList });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`alert`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`ファイルの形式が違います`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`決定`);
    dialog.temp.callback.cancel!();
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
  });
  it(`resetConf`, () => {
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    conf.action.resetConf();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`本当にリセットしますか`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.temp.callback.ok!();
    expect(conf.state.data).toEqual({
      size: 2,
      speed: 2,
      theme: `light`,
      lang: `ja`,
      vibrate: `on`,
      save: `local`,
    });
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
    dialog.temp.callback.cancel!();
    expect(closeMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledWith();
  });
  it(`resetList`, async () => {
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    const routerMock = vi.spyOn(app.action, `routerBack`).mockReturnValue();
    conf.action.resetList();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`本当にリセットしますか`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.temp.callback.ok!();
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith({ listId: `list0000000000000` });
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
    expect(list.state.data).toEqual({
      sort: [`list0000000000000`, `list9999999999999`],
      data: {
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data).toEqual({
      list0000000000000: {
        sort: [`main0000000000000`],
        data: { main0000000000000: { check: false, title: `サンプル`, date: ``, time: ``, alarm: [], task: true } },
      },
      list9999999999999: { sort: [], data: {} },
    });
    expect(sub.state.data).toEqual({
      list0000000000000: {
        data: {
          main0000000000000: { sort: [`sub0000000000000`], data: { sub0000000000000: { check: false, title: `` } } },
        },
      },
      list9999999999999: { data: {} },
    });
    dialog.temp.callback.cancel!();
    expect(closeMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledWith();
  });
  it(`swipeInit`, () => {
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ getBoundingClientRect: () => ({ top: 0, height: 0 }) } as HTMLElement);
    conf.action.swipeInit({ x: 0, y: 0 });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ConfRoot`);
    expect(conf.temp.swipe.status).toBe(`start`);
    expect(conf.temp.swipe.x).toBe(0);
    expect(conf.temp.swipe.y).toBe(0);
    expect(conf.temp.swipe.top).toBe(0);
  });
  it(`swipeStart`, () => {
    conf.action.swipeStart({ x: 20, y: 0 });
    expect(conf.temp.swipe).toEqual({});
    conf.temp.swipe = { status: `start`, x: 0, y: 0, top: 0 };
    conf.action.swipeStart({ x: 0, y: 20 });
    expect(conf.temp.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    conf.temp.swipe.elem = { style: {} } as HTMLElement;
    conf.action.swipeMove({ y: 100 });
    expect(conf.temp.swipe.elem!.style.transform).toBe(`translateY(100px)`);
    conf.action.swipeMove({ y: -100 });
    expect(conf.temp.swipe.elem!.style.transform).toBe(`translateY(0px)`);
  });
  it(`swipeEnd`, () => {
    const addListenerMock = vi.fn((_: string, listener: () => void) => listener());
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (conf.temp.swipe.elem as unknown as { [K in string]: object }).animate = animateMock;
    conf.action.swipeEnd({ y: 100 });
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ transform: `translateY(0px)` }, { duration: 250, easing: `ease-in-out` });
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(conf.temp.swipe).toEqual({});
  });
  it(`swipeEnd - extra`, () => {
    conf.temp.swipe = { status: `move`, y: 0, top: 0 };
    const routerMock = vi.spyOn(app.action, `routerBack`).mockReturnValue();
    conf.action.swipeEnd({ y: 200 });
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith();
    expect(conf.temp.swipe).toEqual({});
    conf.temp.swipe = { status: `start` };
    conf.action.swipeEnd({ y: 0 });
    expect(conf.temp.swipe).toEqual({});
  });
});
