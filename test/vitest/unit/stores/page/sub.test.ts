import { vi, beforeEach, afterEach, describe, it, expect, MockInstance } from "vitest";
import * as Vue from "vue";
import * as Dom from "@/utils/base/dom";
import * as Api from "@/api/api";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  vi.useFakeTimers();
  fixture.setI18n();
  fixture.loadData();
  vi.mock(`vue-router`, () => ({
    useRoute: () => ({
      params: { listId: `list1111111111111`, mainId: `main1111111111111` },
    }),
  }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const main1Data = {
  sort: [`sub1111111111111`, `sub2222222222222`],
  data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
};

const main2Data = { sort: [`sub121`], data: { sub121: { check: false, title: `` } } };

const sub1Data = { check: false, title: `sub1` };

const sub2Data = { check: true, title: `sub2` };

describe(`getter`, () => {
  it(`stateFull`, () => {
    expect(sub.getter.stateFull()).toEqual(main1Data);
    expect(sub.getter.stateFull(`list1111111111111`)).toEqual(main1Data);
    expect(sub.getter.stateFull(undefined, `main1111111111111`)).toEqual(main1Data);
    expect(sub.getter.stateFull(`list1111111111111`, `main2222222222222`)).toEqual(main2Data);
  });
  it(`stateUnit`, () => {
    expect(sub.getter.stateUnit()).toBeUndefined();
    expect(sub.getter.stateUnit(undefined, undefined, `sub1111111111111`)).toEqual(sub1Data);
    expect(sub.getter.stateUnit(undefined, `main1111111111111`, `sub1111111111111`)).toEqual(sub1Data);
    expect(sub.getter.stateUnit(`list1111111111111`, undefined, `sub1111111111111`)).toEqual(sub1Data);
    expect(sub.getter.stateUnit(`list1111111111111`, `main1111111111111`, `sub2222222222222`)).toEqual(sub2Data);
  });
  it(`classItem`, () => {
    expect(sub.getter.classItem(`sub1111111111111`)).toEqual({ check: false, edit: false, drag: false, hide: false });
    expect(sub.getter.classItem(`sub2222222222222`)).toEqual({ check: true, edit: false, drag: false, hide: false });
  });
  it(`textMemo`, () => {
    expect(sub.getter.textMemo()).toEqual(`sub1\nsub2`);
  });
  it(`classLimit`, () => {
    vi.setSystemTime(new Date(1999, 11, 30, 0, 0, 0, 0));
    expect(sub.getter.classLimit()).toEqual({ "text-theme-care": false, "text-theme-warn": false });
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    expect(sub.getter.classLimit()).toEqual({ "text-theme-care": true, "text-theme-warn": false });
    vi.setSystemTime(new Date(2000, 1, 1, 0, 0, 0, 0));
    expect(sub.getter.classLimit()).toEqual({ "text-theme-care": true, "text-theme-warn": true });
  });
  it(`textAlarm`, () => {
    expect(sub.getter.textAlarm()).toEqual(`5分前,1時間前`);
  });
});

describe(`action`, () => {
  it(`initPage`, async () => {
    vi.spyOn(sub.action, `loadItem`).mockResolvedValue();
    await sub.action.initPage();
    expect(sub.action.loadItem).toBeCalledTimes(1);
  });
  it(`actPage`, async () => {
    vi.spyOn(sub.action, `saveItem`).mockReturnValue();
    sub.action.actPage();
    sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.data[`sub1111111111111`]!.check = true;
    expect(await sub.action.saveItem).toBeCalledTimes(1);
  });
  it(`loadItem`, async () => {
    vi.spyOn(Api, `readSub`).mockResolvedValue({ list9999999999999: { data: {} } });
    await sub.action.loadItem();
    expect(Api.readSub).toBeCalledTimes(1);
    expect(sub.state.data).toEqual({ list9999999999999: { data: {} } });
  });
  it(`saveItem`, () => {
    vi.spyOn(Api, `writeSub`).mockReturnValue();
    sub.action.saveItem();
    expect(Api.writeSub).toBeCalledTimes(1);
    expect(Api.writeSub).toBeCalledWith({
      list0000000000000: { data: {} },
      list9999999999999: { data: {} },
      list1111111111111: {
        data: {
          main1111111111111: {
            sort: [`sub1111111111111`, `sub2222222222222`],
            data: {
              sub1111111111111: { check: false, title: `sub1` },
              sub2222222222222: { check: true, title: `sub2` },
            },
          },
          main2222222222222: { sort: [`sub121`], data: { sub121: { check: false, title: `` } } },
        },
      },
    });
  });
  it(`inputItem`, () => {
    sub.refer.titles = { value: { sub1111111111111: { $el: `inputItem` } } } as unknown as Vue.Ref<{
      [K: string]: Vue.ComponentPublicInstance<HTMLElement>;
    }>;
    vi.spyOn(Dom, `resize`).mockReturnValue(0);
    sub.action.inputItem({ subId: `sub1111111111111` });
    expect(Dom.resize).toBeCalledTimes(1);
    expect(Dom.resize).toBeCalledWith(`inputItem`);
  });
  it(`enterItem`, async () => {
    vi.setSystemTime(new Date(946566000000));
    sub.refer.titles = {
      value: {
        sub1111111111111: { $el: { value: `` } },
        sub946566000000: { $el: { focus: vi.fn() } },
      },
    } as unknown as Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
    sub.refer.items = {
      value: {
        sub1111111111111: {
          style: {},
          addEventListener: vi.fn((_mode: string, listener: () => void) => {
            listener();
          }),
          removeEventListener: vi.fn(),
        },
      },
    } as unknown as Vue.Ref<{
      [K: string]: Vue.ComponentPublicInstance<HTMLElement>;
    }>;
    vi.spyOn(Dom, `resize`).mockReturnValue(0);
    await sub.action.enterItem({ subId: `sub1111111111111`, selectionStart: 3 });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`, `sub946566000000`, `sub2222222222222`],
      data: {
        sub1111111111111: { check: false, title: `sub` },
        sub946566000000: { check: false, title: `1` },
        sub2222222222222: { check: true, title: `sub2` },
      },
    });
    expect(sub.refer.titles.value[`sub946566000000`]!.$el.focus).toBeCalledTimes(1);
    expect(Dom.resize).toBeCalledTimes(1);
    expect(Dom.resize).toBeCalledWith({ value: `sub` });
    expect(sub.refer.items.value[`sub1111111111111`]!.addEventListener).toBeCalledTimes(1);
    expect(
      (sub.refer.items.value[`sub1111111111111`]!.addEventListener as unknown as MockInstance).mock.calls[0]![0]!,
    ).toBe(`transitionend`);
    expect(sub.refer.items.value[`sub1111111111111`]!.removeEventListener).toBeCalledTimes(1);
    expect(
      (sub.refer.items.value[`sub1111111111111`]!.removeEventListener as unknown as MockInstance).mock.calls[0]![0]!,
    ).toBe(`transitionend`);
    expect(sub.refer.items!.value[`sub1111111111111`]!.style.height).toBe(``);
  });
  it(`backItem`, async () => {
    sub.refer.titles = {
      value: { sub1111111111111: { $el: { focus: vi.fn() } } },
    } as unknown as Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
    vi.spyOn(Dom, `resize`).mockReturnValue(0);
    await sub.action.backItem({ subId: `sub2222222222222` });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`],
      data: { sub1111111111111: { check: false, title: `sub1sub2` } },
    });
    expect(Dom.resize).toBeCalledTimes(1);
    expect((Dom.resize as unknown as MockInstance).mock.calls[0]![0]!.value).toBe(`sub1sub2`);
    expect(sub.refer.titles.value[`sub1111111111111`]!.$el.focus).toBeCalledTimes(1);
    expect(sub.refer.titles.value[`sub1111111111111`]!.$el.selectionStart).toBe(4);
    expect(sub.refer.titles.value[`sub1111111111111`]!.$el.selectionEnd).toBe(4);
  });
  it(`deleteItem`, async () => {
    sub.refer.items = {
      value: {
        sub2222222222222: {
          style: {},
          addEventListener: vi.fn((_mode: string, listener: () => void) => {
            listener();
          }),
          removeEventListener: vi.fn(),
        },
      },
    } as unknown as Vue.Ref<{
      [K: string]: Vue.ComponentPublicInstance<HTMLElement>;
    }>;
    vi.spyOn(Dom, `resize`).mockReturnValue(0);
    vi.spyOn(constant.sound, `play`).mockReturnValue();
    vi.spyOn(notice.action, `open`);
    vi.spyOn(notice.action, `close`).mockReturnValue();
    sub.action.deleteItem({ subId: `sub2222222222222` });
    expect(Dom.resize).toBeCalledTimes(1);
    expect(Dom.resize).toHaveBeenCalledWith(sub.refer.items.value[`sub2222222222222`]);
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`],
      data: { sub1111111111111: { check: false, title: `sub1` } },
    });
    expect(sub.state.status[`sub2222222222222`]).toBeUndefined();
    expect(constant.sound.play).toBeCalledTimes(1);
    expect(constant.sound.play).toHaveBeenCalledWith(`warn`);
    expect(notice.action.open).toBeCalledTimes(1);
    expect((notice.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(`削除が完了しました`);
    expect((notice.action.open as unknown as MockInstance).mock.calls[0]![0]!.button).toBe(`元に戻す`);
    await notice.state.callback();
    expect(notice.action.close).toBeCalledTimes(1);
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`, `sub2222222222222`],
      data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
    });
    expect(Dom.resize).toBeCalledTimes(2);
    expect(Dom.resize).toHaveBeenCalledWith(sub.refer.items.value[`sub2222222222222`], 0);
    expect(sub.refer.items.value[`sub2222222222222`]!.addEventListener).toBeCalledTimes(1);
    expect(
      (sub.refer.items.value[`sub2222222222222`]!.addEventListener as unknown as MockInstance).mock.calls[0]![0]!,
    ).toBe(`transitionend`);
    expect(sub.refer.items.value[`sub2222222222222`]!.removeEventListener).toBeCalledTimes(1);
    expect(
      (sub.refer.items.value[`sub2222222222222`]!.removeEventListener as unknown as MockInstance).mock.calls[0]![0]!,
    ).toBe(`transitionend`);
    expect(sub.refer.items!.value[`sub2222222222222`]!.style.height).toBe(``);
  });
  it(`checkItem`, () => {
    vi.spyOn(constant.sound, `play`).mockReturnValue();
    sub.action.checkItem({ subId: `sub1111111111111`, checked: true });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.sort).toEqual([
      "sub2222222222222",
      "sub1111111111111",
    ]);
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.data[`sub1111111111111`]!.check).toBe(true);
    expect(constant.sound.play).toBeCalledTimes(1);
    expect(constant.sound.play).toHaveBeenCalledWith(`ok`);
    sub.action.checkItem({ subId: `sub1111111111111`, checked: false });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.sort).toEqual([
      "sub1111111111111",
      "sub2222222222222",
    ]);
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.data[`sub1111111111111`]!.check).toBe(false);
    expect(constant.sound.play).toBeCalledTimes(2);
    expect(constant.sound.play).toHaveBeenCalledWith(`cancel`);
  });
  it(`switchItem`, () => {
    sub.action.switchItem();
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task).toBe(false);
    sub.action.switchItem();
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task).toBe(true);
  });
  it(`switchEdit`, () => {
    sub.action.switchEdit({ subId: `sub2222222222222` });
    expect(sub.state.status).toEqual({ sub1111111111111: ``, sub2222222222222: `edit` });
    sub.action.switchEdit();
    expect(sub.state.status).toEqual({ sub1111111111111: ``, sub2222222222222: `` });
  });
  it(`inputMemo`, () => {
    vi.setSystemTime(new Date(946566000000));
    sub.action.inputMemo({ value: `memo1\nmemo2` });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub9465660000000`, `sub9465660000001`],
      data: { sub9465660000000: { check: false, title: `memo1` }, sub9465660000001: { check: false, title: `memo2` } },
    });
  });
  it(`openCalendar`, () => {
    vi.spyOn(calendar.action, `open`);
    vi.spyOn(calendar.action, `close`).mockReturnValue();
    sub.action.openCalendar({ date: `1999/12/31` });
    expect(calendar.action.open).toBeCalledTimes(1);
    expect((calendar.action.open as unknown as MockInstance).mock.calls[0]![0]!.select).toBe(`1999/12/31`);
    expect((calendar.action.open as unknown as MockInstance).mock.calls[0]![0]!.current).toBe(`1999/12`);
    expect((calendar.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    expect((calendar.action.open as unknown as MockInstance).mock.calls[0]![0]!.clear).toBe(`クリア`);
    calendar.state.callback(`2000/01/01`);
    expect(calendar.action.close).toBeCalledTimes(1);
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.date).toBe(`2000/01/01`);
  });
  it(`openClock`, () => {
    clock.refer.hour = { value: 0 } as unknown as Vue.Ref<Vue.ComponentPublicInstance<HTMLCanvasElement> | undefined>;
    clock.refer.minute = { value: 0 } as unknown as Vue.Ref<Vue.ComponentPublicInstance<HTMLCanvasElement> | undefined>;
    vi.spyOn(clock.action, `open`);
    vi.spyOn(clock.action, `close`).mockReturnValue();
    vi.spyOn(clock.action, `drawHour`).mockReturnValue();
    vi.spyOn(clock.action, `drawMinute`).mockReturnValue();
    sub.action.openClock({ time: `12:45` });
    expect(clock.action.open).toBeCalledTimes(1);
    expect((clock.action.open as unknown as MockInstance).mock.calls[0]![0]!.hour).toBe(12);
    expect((clock.action.open as unknown as MockInstance).mock.calls[0]![0]!.minute).toBe(45);
    expect((clock.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    expect((clock.action.open as unknown as MockInstance).mock.calls[0]![0]!.clear).toBe(`クリア`);
    expect((clock.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    clock.state.callback(23, 59);
    expect(clock.action.close).toBeCalledTimes(1);
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.time).toBe(`23:59`);
  });
  it(`openAlarm`, () => {
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    sub.action.openAlarm();
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`check`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`通知タイミングの選択`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.check).toEqual({
      all: true,
      sort: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`],
      data: {
        "1": { check: false, title: `時刻通り` },
        "2": { check: true, title: `5分前` },
        "3": { check: false, title: `10分前` },
        "4": { check: false, title: `15分前` },
        "5": { check: false, title: `30分前` },
        "6": { check: true, title: `1時間前` },
        "7": { check: false, title: `2時間前` },
        "8": { check: false, title: `3時間前` },
        "9": { check: false, title: `6時間前` },
        "10": { check: false, title: `12時間前` },
        "11": { check: false, title: `1日前` },
        "12": { check: false, title: `2日前` },
      },
    });
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.check.data[`1`]!.check = true;
    dialog.state.callback.ok!();
    expect(dialog.action.close).toBeCalledTimes(1);
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.alarm).toEqual([`1`, `2`, `6`]);
    dialog.state.callback.cancel!();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`dragInit`, () => {
    sub.refer.home = {
      value: { getBoundingClientRect: () => ({ left: 60 }) },
    } as unknown as Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    sub.refer.items = {
      value: {
        sub1111111111111: { getBoundingClientRect: () => ({ top: 40, left: 60, height: 40, width: 120 }) },
      },
    } as unknown as Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
    vi.stubGlobal(`navigator`, { vibrate: vi.fn() });
    sub.action.dragInit({ subId: `sub1111111111111`, clientY: 0 });
    expect(sub.prop.drag).toEqual({
      status: `start`,
      id: `sub1111111111111`,
      y: 0,
      top: 40,
      left: 0,
      height: 40,
      width: 120,
    });
    expect(sub.state.status[`sub1111111111111`]).toBe(`edit`);
    expect(navigator.vibrate).toBeCalledTimes(1);
    expect(navigator.vibrate).toBeCalledWith(40);
  });
  it(`dragStart`, () => {
    sub.refer.items!.value!.sub1111111111111!.cloneNode = () => ({ style: {} }) as unknown as Node;
    sub.refer.wrap = { value: { appendChild: vi.fn() } } as unknown as Vue.Ref<
      Vue.ComponentPublicInstance<HTMLElement> | undefined
    >;
    sub.action.dragStart();
    expect(sub.prop.drag.status).toBe(`move`);
    expect(sub.refer.wrap.value!.appendChild).toBeCalledTimes(1);
    expect(sub.refer.wrap.value!.appendChild).toBeCalledWith({
      style: {
        position: `absolute`,
        zIndex: `1`,
        top: `40px`,
        left: `0px`,
        height: `40px`,
        width: `120px`,
      },
    });
    expect(sub.state.status[`sub1111111111111`]).toBe(`hide`);
  });
  it(`dragMove`, () => {
    sub.refer.wrap!.value!.getBoundingClientRect = () => ({ top: 40, height: 120 }) as DOMRect;
    sub.refer.items!.value[`sub1111111111111`]!.getBoundingClientRect = () =>
      ({ top: 40, left: 60, height: 40, width: 120 }) as DOMRect;
    sub.refer.items!.value[`sub2222222222222`] = {
      getBoundingClientRect: () => ({ top: 80, left: 60, height: 40, width: 120 }),
    } as Vue.ComponentPublicInstance<HTMLElement>;
    sub.prop.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    sub.action.dragMove({ clientY: 0 });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.sort).toEqual([
      `sub1111111111111`,
      `sub2222222222222`,
    ]);
    sub.prop.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    sub.action.dragMove({ clientY: 0 });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.sort).toEqual([
      `sub2222222222222`,
      `sub1111111111111`,
    ]);
    sub.prop.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    sub.action.dragMove({ clientY: 0 });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.sort).toEqual([
      `sub1111111111111`,
      `sub2222222222222`,
    ]);
  });
  it(`dragEnd`, () => {
    const removeClassMock = (() => {
      const mock = vi.fn();
      (sub.prop.drag.clone!.classList as object) = { remove: mock };
      return mock;
    })();
    const animateMock = (() => {
      const mock = vi.fn(
        () =>
          ({
            addEventListener: (_mode: string, listener: () => void) => {
              listener();
            },
          }) as Animation,
      );
      sub.prop.drag.clone!.animate = mock;
      return mock;
    })();
    const removeCloneMock = (() => {
      const mock = vi.fn();
      sub.prop.drag.clone!.remove = mock;
      return mock;
    })();
    sub.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: [`40px`, `40px`] }, 150);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(sub.state.status[`sub1111111111111`]).toBe(``);
    expect(sub.prop.drag).toEqual({});
  });
  it(`dragEnd - extra`, () => {
    sub.prop.drag = { status: `end`, id: `sub1111111111111` };
    sub.action.dragEnd();
    expect(sub.prop.drag).toEqual({});
  });
  it(`swipeInit`, () => {
    const target = { style: {}, getBoundingClientRect: () => ({ left: 60, width: 120 }) } as unknown as HTMLElement;
    sub.action.swipeInit({ target, clientX: 0, clientY: 0 });
    expect(sub.prop.swipe).toEqual({ status: `start`, target, x: 0, y: 0, right: 120 });
  });
  it(`swipeStart`, () => {
    sub.action.swipeStart({ clientX: 20, clientY: 0 });
    expect(sub.prop.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    sub.action.swipeMove({ clientX: 20 });
    expect(sub.prop.swipe.target!.style.transform).toBe(`translateX(140px)`);
    sub.action.swipeMove({ clientX: -200 });
    expect(sub.prop.swipe.target!.style.transform).toBe(`translateX(0px)`);
  });
  it(`swipeEnd`, () => {
    const addClassMock = vi.fn();
    const removeClassMock = vi.fn();
    const addListenerMock = vi.fn((_mode: string, listener: () => void) => {
      listener();
    });
    const removeListenerMock = vi.fn();
    (sub.prop.swipe.target as unknown as { [K in string]: object }).classList = {
      add: addClassMock,
      remove: removeClassMock,
    };
    (sub.prop.swipe.target as unknown as { [K in string]: object }).addEventListener = addListenerMock;
    (sub.prop.swipe.target as unknown as { [K in string]: object }).removeEventListener = removeListenerMock;
    sub.action.swipeEnd({ clientX: -100 });
    expect(addClassMock).toBeCalledTimes(1);
    expect(addClassMock).toBeCalledWith(`v-enter-active`);
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeListenerMock).toBeCalledTimes(1);
    expect(removeListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`v-enter-active`);
    expect(sub.prop.swipe).toEqual({});
  });
  it(`swipeInit - extra`, () => {
    sub.prop.swipe.status = `end`;
    const removeClassMock = vi.fn();
    const removeListenerMock = vi.fn();
    const target = {
      style: {},
      classList: { remove: removeClassMock },
      getBoundingClientRect: () => ({ left: 60, width: 120 }),
      removeEventListener: removeListenerMock,
    } as unknown as HTMLElement;
    sub.action.swipeInit({ target, clientX: 0, clientY: 0 });
    expect(sub.prop.swipe).toEqual({ status: `move`, target, x: 0, y: 0, right: 120 });
    expect(removeListenerMock).toBeCalledTimes(1);
    expect(removeListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`v-enter-active`);
    expect(sub.prop.swipe.target!.style.transform).toBe(`translateX(120px)`);
  });
  it(`swipeEnd - extra`, () => {
    vi.spyOn(app.action, `routerBack`).mockReturnValue();
    sub.action.swipeEnd({ clientX: 0 });
    expect(app.action.routerBack).toBeCalledTimes(1);
    expect(sub.prop.swipe).toEqual({});
    sub.prop.swipe = { status: `end` };
    sub.action.swipeEnd({ clientX: 0 });
    expect(sub.prop.swipe).toEqual({});
  });
  it(`swipeStart - extra`, () => {
    sub.prop.swipe = { status: `start`, x: 0, y: 0 };
    sub.action.swipeStart({ clientX: 0, clientY: 20 });
    expect(sub.prop.swipe).toEqual({});
  });
});
