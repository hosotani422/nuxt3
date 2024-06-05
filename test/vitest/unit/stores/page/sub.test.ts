import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import Api from "@/api/api";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  await fixture.init();
  await fixture.loadData();
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
    const readMock = vi.spyOn(Api, `readSub`).mockResolvedValue({
      list1111111111111: {
        data: {
          main1111111111111: {
            sort: [`sub1111111111111`],
            data: { sub1111111111111: { check: false, title: `sub1` } },
          },
        },
      },
    });
    const writeMock = vi.spyOn(Api, `writeSub`).mockReturnValue();
    await sub.action.init();
    expect(readMock).toBeCalledTimes(1);
    expect(readMock).toBeCalledWith();
    sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.data[`sub1111111111111`]!.title = `sub3`;
    expect(writeMock).toBeCalledTimes(1);
    expect(writeMock).toBeCalledWith({
      list1111111111111: {
        data: {
          main1111111111111: {
            sort: [`sub1111111111111`],
            data: { sub1111111111111: { check: false, title: `sub3` } },
          },
        },
      },
    });
  });
  it(`getFull`, () => {
    expect(sub.action.getFull()).toEqual({
      sort: [`sub1111111111111`, `sub2222222222222`],
      data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
    });
    expect(sub.action.getFull({ listId: `list1111111111111` })).toEqual({
      sort: [`sub1111111111111`, `sub2222222222222`],
      data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
    });
    expect(sub.action.getFull({ mainId: `main2222222222222` })).toEqual({ sort: [], data: {} });
    expect(sub.action.getFull({ listId: `list1111111111111`, mainId: `main2222222222222` })).toEqual({
      sort: [],
      data: {},
    });
  });
  it(`getUnit`, () => {
    expect(sub.action.getUnit({ subId: `sub1111111111111` })).toEqual({ check: false, title: `sub1` });
    expect(sub.action.getUnit({ mainId: `main1111111111111`, subId: `sub1111111111111` })).toEqual({
      check: false,
      title: `sub1`,
    });
    expect(sub.action.getUnit({ listId: `list1111111111111`, subId: `sub1111111111111` })).toEqual({
      check: false,
      title: `sub1`,
    });
    expect(
      sub.action.getUnit({ listId: `list1111111111111`, mainId: `main1111111111111`, subId: `sub2222222222222` }),
    ).toEqual({
      check: true,
      title: `sub2`,
    });
  });
  it(`toggleMode`, () => {
    sub.action.toggleMode();
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task).toBe(false);
    sub.action.toggleMode();
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task).toBe(true);
  });
  it(`convertItem`, () => {
    vi.setSystemTime(new Date(9465660000000));
    sub.action.convertItem({ text: `memo1\nmemo2` });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub9465660000000`, `sub9465660000001`],
      data: { sub9465660000000: { check: false, title: `memo1` }, sub9465660000001: { check: false, title: `memo2` } },
    });
  });
  it(`divideItem`, async () => {
    vi.setSystemTime(new Date(9465660000000));
    const focusMock = vi.fn();
    const elementMock = { focus: focusMock, selectionStart: 1, selectionEnd: 1 } as unknown as HTMLInputElement;
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue(elementMock);
    await sub.action.divideItem({ subId: `sub1111111111111`, caret: 3 });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`, `sub9465660000000`, `sub2222222222222`],
      data: {
        sub1111111111111: { check: false, title: `sub` },
        sub9465660000000: { check: false, title: `1` },
        sub2222222222222: { check: true, title: `sub2` },
      },
    });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`SubTasksub9465660000000`);
    expect(focusMock).toBeCalledTimes(1);
    expect(focusMock).toBeCalledWith();
    expect(elementMock.selectionStart).toBe(0);
    expect(elementMock.selectionEnd).toBe(0);
  });
  it(`connectItem`, async () => {
    sub.state.status[`sub2222222222222`] = `edit`;
    const focusMock = vi.fn();
    const elementMock = { focus: focusMock, selectionStart: 1, selectionEnd: 1 } as unknown as HTMLInputElement;
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue(elementMock);
    await sub.action.connectItem({ subId: `sub2222222222222` });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`],
      data: { sub1111111111111: { check: false, title: `sub1sub2` } },
    });
    expect(sub.state.status[`sub2222222222222`]).toBeUndefined();
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`SubTasksub1111111111111`);
    expect(focusMock).toBeCalledTimes(1);
    expect(focusMock).toBeCalledWith();
    expect(elementMock.selectionStart).toBe(4);
    expect(elementMock.selectionEnd).toBe(4);
  });
  it(`deleteItem`, () => {
    sub.state.status[`sub2222222222222`] = `edit`;
    const openMock = vi.spyOn(notice.action, `open`);
    const closeMock = vi.spyOn(notice.action, `close`).mockReturnValue();
    sub.action.deleteItem({ subId: `sub2222222222222` });
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`],
      data: { sub1111111111111: { check: false, title: `sub1` } },
    });
    expect(sub.state.status[`sub2222222222222`]).toBeUndefined();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.message).toBe(`削除が完了しました`);
    expect(openMock.mock.calls[0]![0]!.button).toBe(`元に戻す`);
    notice.temp.callback();
    expect(sub.state.data[`list1111111111111`]!.data[`main1111111111111`]).toEqual({
      sort: [`sub1111111111111`, `sub2222222222222`],
      data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
    });
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
  });
  it(`openCalendar`, () => {
    main.action.getUnit().date = `1999/12/31`;
    const openMock = vi.spyOn(calendar.action, `open`);
    const closeMock = vi.spyOn(calendar.action, `close`).mockReturnValue();
    sub.action.openCalendar();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.select).toBe(`1999/12/31`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    expect(openMock.mock.calls[0]![0]!.clear).toBe(`クリア`);
    calendar.temp.callback(`2000/01/01`);
    expect(main.action.getUnit().date).toBe(`2000/01/01`);
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
  });
  it(`openClock`, () => {
    main.action.getUnit().time = `12:45`;
    const openMock = vi.spyOn(clock.action, `open`);
    const closeMock = vi.spyOn(clock.action, `close`).mockReturnValue();
    vi.spyOn(clock.action, `drawCanvas`).mockReturnValue();
    sub.action.openClock();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.time).toBe(`12:45`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    expect(openMock.mock.calls[0]![0]!.clear).toBe(`クリア`);
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    clock.temp.callback({ hour: 23, minute: 59 });
    expect(main.action.getUnit().time).toBe(`23:59`);
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
  });
  it(`openAlarm`, () => {
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    sub.action.openAlarm();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`check`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`通知タイミングの選択`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.check).toEqual({
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
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.check.data[`1`]!.check = true;
    dialog.temp.callback.cancel!();
    expect(main.action.getUnit().alarm).toEqual([`2`, `6`]);
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
    dialog.state.check.data[`1`]!.check = true;
    dialog.temp.callback.ok!();
    expect(main.action.getUnit().alarm).toEqual([`1`, `2`, `6`]);
    expect(closeMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledWith();
  });
  it(`dragInit`, () => {
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue({
      getBoundingClientRect: () => ({ top: 40, left: 60, height: 40, width: 120 }),
    } as HTMLElement);
    const vibrateMock = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate: vibrateMock });
    sub.action.dragInit({ subId: `sub1111111111111`, y: 0 });
    expect(getByIdMock).toBeCalledTimes(2);
    expect(getByIdMock).toBeCalledWith(`SubItemsub1111111111111`);
    expect(getByIdMock).toBeCalledWith(`SubHome`);
    expect(sub.temp.drag).toEqual({
      status: `start`,
      id: `sub1111111111111`,
      y: 0,
      top: 40,
      left: 0,
      height: 40,
      width: 120,
    });
    expect(sub.state.status[`sub1111111111111`]).toBe(`edit`);
    expect(vibrateMock).toBeCalledTimes(1);
    expect(vibrateMock).toBeCalledWith(40);
  });
  it(`dragStart`, () => {
    const cloneMock = vi.fn(() => ({ style: {} }));
    const appendMock = vi.fn();
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ cloneNode: cloneMock, appendChild: appendMock } as unknown as HTMLElement);
    sub.action.dragStart();
    expect(sub.temp.drag.status).toBe(`move`);
    expect(getByIdMock).toBeCalledTimes(2);
    expect(getByIdMock).toBeCalledWith(`SubItemsub1111111111111`);
    expect(getByIdMock).toBeCalledWith(`SubBody`);
    expect(cloneMock).toBeCalledTimes(1);
    expect(cloneMock).toBeCalledWith(true);
    expect(appendMock).toBeCalledTimes(1);
    expect(appendMock).toBeCalledWith({
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
    const getByIdMock = vi.spyOn(Util, `getById`).mockImplementation(
      (id: string) =>
        ({
          getBoundingClientRect: () => {
            if (id === `SubItemsub1111111111111`) {
              return { height: 40 };
            } else if (id === `SubItemsub2222222222222`) {
              return { top: 80, height: 40 };
            } else if (id === `SubBody`) {
              return { top: 40, bottom: 160 };
            }
            return undefined;
          },
        }) as unknown as HTMLElement,
    );
    sub.temp.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    sub.action.dragMove({ y: 0 });
    expect(sub.temp.drag.clone!.style.top).toBe(`40px`);
    expect(getByIdMock).toBeCalledTimes(4);
    expect(getByIdMock).toBeCalledWith(`SubBody`);
    expect(getByIdMock).toBeCalledWith(`SubItemundefined`);
    expect(getByIdMock).toBeCalledWith(`SubItemsub1111111111111`);
    expect(getByIdMock).toBeCalledWith(`SubItemsub2222222222222`);
    expect(sub.action.getFull().sort).toEqual([`sub2222222222222`, `sub1111111111111`]);
    sub.temp.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    sub.action.dragMove({ y: 0 });
    expect(sub.action.getFull().sort).toEqual([`sub1111111111111`, `sub2222222222222`]);
  });
  it(`dragEnd`, () => {
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ getBoundingClientRect: () => ({ top: 40 }) } as HTMLElement);
    const removeClassMock = vi.fn();
    const removeCloneMock = vi.fn();
    const addListenerMock = vi.fn((_: string, listener: () => void) => listener());
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (sub.temp.drag.clone as unknown as { [K in string]: object }) = {
      classList: { remove: removeClassMock },
      animate: animateMock,
      remove: removeCloneMock,
    };
    sub.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: `40px` }, { duration: 250, easing: `ease-in-out` });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`SubItemsub1111111111111`);
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(removeCloneMock).toBeCalledWith();
    expect(sub.state.status[`sub1111111111111`]).toBeUndefined();
    expect(sub.temp.drag).toEqual({});
  });
  it(`dragEnd - extra`, () => {
    sub.state.status[`sub1111111111111`] = `edit`;
    sub.temp.drag = { status: `start`, id: `sub1111111111111` };
    sub.action.dragEnd();
    expect(sub.state.status[`sub1111111111111`]).toBeUndefined();
    expect(sub.temp.drag).toEqual({});
  });
  it(`swipeInit`, () => {
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ getBoundingClientRect: () => ({ left: 0, width: 0 }) } as HTMLElement);
    sub.action.swipeInit({ x: 0, y: 0 });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`SubRoot`);
    expect(sub.temp.swipe.status).toBe(`start`);
    expect(sub.temp.swipe.x).toBe(0);
    expect(sub.temp.swipe.y).toBe(0);
    expect(sub.temp.swipe.right).toBe(0);
  });
  it(`swipeStart`, () => {
    sub.action.swipeStart({ x: 0, y: 20 });
    expect(sub.temp.swipe).toEqual({});
    sub.temp.swipe = { status: `start`, x: 0, y: 0, right: 0 };
    sub.action.swipeStart({ x: 20, y: 0 });
    expect(sub.temp.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    sub.temp.swipe.elem = { style: {} } as HTMLElement;
    sub.action.swipeMove({ x: 100 });
    expect(sub.temp.swipe.elem.style.transform).toBe(`translateX(100px)`);
    sub.action.swipeMove({ x: -100 });
    expect(sub.temp.swipe.elem.style.transform).toBe(`translateX(0px)`);
  });
  it(`swipeEnd`, () => {
    const addListenerMock = vi.fn((_: string, listener: () => void) => listener());
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (sub.temp.swipe.elem as unknown as { [K in string]: object }).animate = animateMock;
    sub.action.swipeEnd({ x: 100 });
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ transform: `translateX(0px)` }, { duration: 250, easing: `ease-in-out` });
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(sub.temp.swipe).toEqual({});
  });
  it(`swipeEnd - extra`, () => {
    sub.temp.swipe = { status: `move`, x: 0, right: 0 };
    const routerMock = vi.spyOn(app.action, `routerBack`).mockReturnValue();
    sub.action.swipeEnd({ x: 200 });
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith();
    expect(sub.temp.swipe).toEqual({});
    sub.temp.swipe = { status: `start` };
    sub.action.swipeEnd({ x: 0 });
    expect(sub.temp.swipe).toEqual({});
  });
});

describe(`getter`, () => {
  it(`classStatus`, () => {
    expect(sub.getter.classStatus(`sub1111111111111`)).toEqual({ edit: false, hide: false });
  });
  it(`classLimit`, () => {
    vi.setSystemTime(new Date(1999, 11, 30, 0, 0, 0, 0));
    expect(sub.getter.classLimit()).toEqual({ "text-theme-care": false, "text-theme-warn": false });
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    expect(sub.getter.classLimit()).toEqual({ "text-theme-care": true, "text-theme-warn": false });
    vi.setSystemTime(new Date(2000, 1, 1, 0, 0, 0, 0));
    expect(sub.getter.classLimit()).toEqual({ "text-theme-care": true, "text-theme-warn": true });
  });
  it(`textMemo`, () => {
    expect(sub.getter.textMemo()).toEqual(`sub1\nsub2`);
  });
  it(`textAlarm`, () => {
    expect(sub.getter.textAlarm()).toEqual(`5分前,1時間前`);
  });
});
