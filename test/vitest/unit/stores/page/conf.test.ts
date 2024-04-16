import { vi, beforeEach, afterEach, describe, it, expect, MockInstance } from "vitest";
import i18next from "i18next";
import * as Api from "@/api/api";
import * as Cordova from "@/utils/cordova/cordova";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  process.client = true;
  fixture.loadLang();
  fixture.loadData();
  fixture.setRouter();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe(`action`, () => {
  it(`initPage`, async () => {
    vi.spyOn(conf.action, `loadItem`).mockResolvedValue();
    await conf.action.initPage();
    expect(conf.action.loadItem).toBeCalledTimes(1);
  });
  it(`actPage`, async () => {
    vi.spyOn(conf.action, `saveItem`).mockReturnValue();
    vi.spyOn(conf.action, `reactSound`).mockReturnValue();
    conf.action.actPage();
    conf.state.data.volume = 3;
    expect(await conf.action.saveItem).toBeCalledTimes(1);
    expect(await conf.action.reactSound).toBeCalledTimes(1);
    conf.state.data.speed = 3;
    expect(await conf.action.saveItem).toBeCalledTimes(2);
    expect(await conf.action.reactSound).toBeCalledTimes(1);
  });
  it(`loadItem`, async () => {
    const readConfData: typeof conf.state.data = {
      size: 2,
      speed: 2,
      volume: 1,
      vibrate: `on`,
      theme: `dark`,
      lang: `ja`,
      save: `local`,
    };
    vi.spyOn(Api, `readConf`).mockResolvedValue(readConfData);
    await conf.action.loadItem();
    expect(Api.readConf).toBeCalledTimes(1);
    expect(conf.state.data).toEqual(readConfData);
  });
  it(`saveItem`, () => {
    vi.spyOn(Api, `writeConf`).mockReturnValue();
    conf.action.saveItem();
    expect(Api.writeConf).toBeCalledTimes(1);
    expect(Api.writeConf).toBeCalledWith({
      size: 2,
      speed: 2,
      volume: 1,
      vibrate: `on`,
      theme: `dark`,
      lang: `ja`,
      save: `local`,
    });
  });
  it(`reactSound`, () => {
    vi.spyOn(constant.sound, `volume`).mockReturnValue();
    conf.action.reactSound();
    expect(constant.sound.volume).toBeCalledTimes(1);
    expect(constant.sound.volume).toBeCalledWith(1 / 3);
  });
  it(`reactLang`, () => {
    vi.spyOn(i18next, `changeLanguage`).mockReturnThis();
    conf.action.reactLang({ value: `reactLang` });
    expect(i18next.changeLanguage).toBeCalledTimes(1);
    expect(i18next.changeLanguage).toBeCalledWith(`reactLang`);
  });
  it(`reactAlarm`, () => {
    vi.spyOn(Cordova.Notice, `removeAll`).mockReturnValue();
    vi.spyOn(Cordova.Notice, `insert`).mockReturnValue();
    conf.action.reactAlarm();
    expect(Cordova.Notice.removeAll).toBeCalledTimes(1);
    expect(Cordova.Notice.insert).toBeCalledTimes(2);
    expect(Cordova.Notice.insert).toBeCalledWith({
      title: `Memotea アラーム`,
      message: `list1 ⇒ main1`,
      date: new Date(`1999/12/31 23:55`),
    });
    expect(Cordova.Notice.insert).toBeCalledWith({
      title: `Memotea アラーム`,
      message: `list1 ⇒ main1`,
      date: new Date(`1999/12/31 23:00`),
    });
  });
  it(`downloadBackup`, () => {
    const event = { currentTarget: { setAttribute: vi.fn() } } as unknown as Event;
    conf.action.downloadBackup({ event });
    expect((event.currentTarget as HTMLElement).setAttribute).toBeCalledTimes(2);
    expect((event.currentTarget as HTMLElement).setAttribute).toBeCalledWith(`download`, `memotea.bak`);
    expect((event.currentTarget as HTMLElement).setAttribute).toBeCalledWith(
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
  it(`uploadBackup`, () => {
    vi.spyOn(FileReader.prototype, `readAsText`).mockReturnValue();
    conf.action.uploadBackup({ event: { target: { files: [`uploadFile`] } } as unknown as Event });
    expect(FileReader.prototype.readAsText).toBeCalledTimes(1);
    expect(FileReader.prototype.readAsText).toBeCalledWith(`uploadFile`);
  });
  it(`resetConf`, () => {
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    conf.action.resetConf();
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`本当にリセットしますか`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.callback.ok!();
    expect(conf.state.data).toEqual({
      size: 2,
      speed: 2,
      volume: 1,
      vibrate: `on`,
      theme: `light`,
      lang: `ja`,
      save: `local`,
    });
    expect(dialog.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`resetList`, async () => {
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    vi.spyOn(app.action, `routerBack`).mockReturnValue();
    conf.action.resetList();
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`本当にリセットしますか`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.callback.ok!();
    expect(app.action.routerBack).toBeCalledTimes(1);
    expect(app.action.routerBack).toBeCalledWith({ listId: `list0000000000000` });
    expect(dialog.action.close).toBeCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    dialog.state.callback.cancel!();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`swipeInit`, () => {
    const target = { style: {}, getBoundingClientRect: () => ({ top: 40, height: 40 }) } as unknown as HTMLElement;
    conf.action.swipeInit({ target, clientX: 0, clientY: 0 });
    expect(conf.prop.swipe).toEqual({ status: `start`, target, x: 0, y: 0, top: 60 });
  });
  it(`swipeStart`, () => {
    conf.action.swipeStart({ clientX: 0, clientY: 20 });
    expect(conf.prop.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    conf.action.swipeMove({ clientY: 20 });
    expect(conf.prop.swipe.target!.style.transform).toBe(`translateY(80px)`);
    conf.action.swipeMove({ clientY: -200 });
    expect(conf.prop.swipe.target!.style.transform).toBe(`translateY(0px)`);
  });
  it(`swipeEnd`, () => {
    const addListenerMock = vi.fn((_mode: string, listener: () => void) => {
      listener();
    });
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (conf.prop.swipe.target as unknown as { [K in string]: object }).animate = animateMock;
    conf.action.swipeEnd({ clientY: 20 });
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ transform: `translateY(0px)` }, { duration: 150, easing: `ease-in-out` });
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(conf.prop.swipe).toEqual({});
  });
  it(`swipeStart - extra`, () => {
    conf.prop.swipe = { status: `start`, x: 0, y: 0 };
    conf.action.swipeStart({ clientX: 20, clientY: 0 });
    expect(conf.prop.swipe).toEqual({});
  });
  it(`swipeEnd - extra`, () => {
    conf.prop.swipe = { status: `move`, top: 60, y: 0 };
    vi.spyOn(app.action, `routerBack`).mockReturnValue();
    conf.action.swipeEnd({ clientY: 100 });
    expect(app.action.routerBack).toBeCalledTimes(1);
    expect(conf.prop.swipe).toEqual({});
    conf.prop.swipe = { status: `end` };
    conf.action.swipeEnd({ clientY: 100 });
    expect(conf.prop.swipe).toEqual({});
  });
});
