import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import Api from "@/api/api";
import Util from "@/utils/base/util";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
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
    const readMock = vi
      .spyOn(Api, `readList`)
      .mockResolvedValue({ sort: [`list1111111111111`], data: { list1111111111111: { title: `list1` } } });
    const writeMock = vi.spyOn(Api, `writeList`).mockReturnValue();
    await list.action.init();
    expect(readMock).toBeCalledTimes(1);
    expect(readMock).toBeCalledWith();
    list.state.data.data[`list1111111111111`]!.title = `list2`;
    expect(writeMock).toBeCalledTimes(1);
    expect(writeMock).toBeCalledWith({ sort: [`list1111111111111`], data: { list1111111111111: { title: `list2` } } });
  });
  it(`getFull`, () => {
    expect(list.action.getFull()).toEqual({
      sort: [`list1111111111111`, `list0000000000000`, `list9999999999999`],
      data: {
        list1111111111111: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
  });
  it(`getUnit`, () => {
    expect(list.action.getUnit()).toEqual({ title: `list1` });
    expect(list.action.getUnit({ listId: `list0000000000000` })).toEqual({ title: `Inbox` });
    list.state.data = { sort: [], data: {} };
    expect(list.action.getUnit()).toEqual({ title: `` });
  });
  it(`entryItem`, () => {
    vi.setSystemTime(new Date(9465660000000));
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    list.action.entryItem();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`text`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`新規登録`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.text!.value).toBe(``);
    expect(openMock.mock.calls[0]![0]!.text!.placeholder).toBe(`リスト`);
    expect(openMock.mock.calls[0]![0]!.text!.error).toBe(``);
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.text!.value = `list2`;
    dialog.temp.callback.ok!();
    expect(list.state.data).toEqual({
      sort: [`list9465660000000`, `list1111111111111`, `list0000000000000`, `list9999999999999`],
      data: {
        list9465660000000: { title: `list2` },
        list1111111111111: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data[`list9465660000000`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list9465660000000`]).toEqual({ data: {} });
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
    dialog.temp.callback.cancel!();
    expect(closeMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledWith();
  });
  it(`copyItem`, () => {
    vi.setSystemTime(new Date(9465660000000));
    list.action.copyItem({ listId: `list1111111111111` });
    expect(list.state.data).toEqual({
      sort: [`list1111111111111`, `list9465660000000`, `list0000000000000`, `list9999999999999`],
      data: {
        list1111111111111: { title: `list1` },
        list9465660000000: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data[`list9465660000000`]).toEqual({
      sort: [`main1111111111111`, `main2222222222222`],
      data: {
        main1111111111111: {
          check: false,
          title: `main1`,
          date: `2000/01/01`,
          time: `00:00`,
          alarm: [`2`, `6`],
          task: true,
        },
        main2222222222222: { check: true, title: `main2`, date: ``, time: ``, alarm: [], task: true },
      },
    });
    expect(sub.state.data[`list9465660000000`]).toEqual({
      data: {
        main1111111111111: {
          sort: [`sub1111111111111`, `sub2222222222222`],
          data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
        },
        main2222222222222: { sort: [], data: {} },
      },
    });
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
  });
  it(`deleteItem`, () => {
    const openDialogMock = vi.spyOn(dialog.action, `open`);
    const closeDialogMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    const openNoticeMock = vi.spyOn(notice.action, `open`);
    const closeNoticeMock = vi.spyOn(notice.action, `close`).mockReturnValue();
    list.action.deleteItem({ listId: `list1111111111111` });
    expect(openDialogMock).toBeCalledTimes(1);
    expect(openDialogMock.mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect(openDialogMock.mock.calls[0]![0]!.title).toBe(`本当に削除しますか`);
    expect(openDialogMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openDialogMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openDialogMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.temp.callback.ok!();
    expect(list.state.data).toEqual({
      sort: [`list0000000000000`, `list9999999999999`],
      data: {
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data).toEqual({
      list0000000000000: { sort: [], data: {} },
      list9999999999999: {
        sort: [`main1111111111111`, `main2222222222222`],
        data: {
          main1111111111111: {
            check: false,
            title: `main1`,
            date: `2000/01/01`,
            time: `00:00`,
            alarm: [`2`, `6`],
            task: true,
          },
          main2222222222222: { check: true, title: `main2`, date: ``, time: ``, alarm: [], task: true },
        },
      },
    });
    expect(sub.state.data).toEqual({
      list0000000000000: { data: {} },
      list9999999999999: {
        data: {
          main1111111111111: {
            sort: [`sub1111111111111`, `sub2222222222222`],
            data: {
              sub1111111111111: { check: false, title: `sub1` },
              sub2222222222222: { check: true, title: `sub2` },
            },
          },
          main2222222222222: { sort: [], data: {} },
        },
      },
    });
    expect(list.state.status).toEqual({});
    expect(closeDialogMock).toBeCalledTimes(1);
    expect(closeDialogMock).toBeCalledWith();
    expect(openNoticeMock).toBeCalledTimes(1);
    expect(openNoticeMock.mock.calls[0]![0]!.message).toBe(`削除が完了しました`);
    expect(openNoticeMock.mock.calls[0]![0]!.button).toBe(`元に戻す`);
    notice.temp.callback();
    expect(list.state.data).toEqual({
      sort: [`list1111111111111`, `list0000000000000`, `list9999999999999`],
      data: {
        list1111111111111: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data).toEqual({
      list1111111111111: {
        sort: [`main1111111111111`, `main2222222222222`],
        data: {
          main1111111111111: {
            check: false,
            title: `main1`,
            date: `2000/01/01`,
            time: `00:00`,
            alarm: [`2`, `6`],
            task: true,
          },
          main2222222222222: { check: true, title: `main2`, date: ``, time: ``, alarm: [], task: true },
        },
      },
      list0000000000000: { sort: [], data: {} },
      list9999999999999: { sort: [], data: {} },
    });
    expect(sub.state.data).toEqual({
      list1111111111111: {
        data: {
          main1111111111111: {
            sort: [`sub1111111111111`, `sub2222222222222`],
            data: {
              sub1111111111111: { check: false, title: `sub1` },
              sub2222222222222: { check: true, title: `sub2` },
            },
          },
          main2222222222222: { sort: [], data: {} },
        },
      },
      list0000000000000: { data: {} },
      list9999999999999: { data: {} },
    });
    expect(closeNoticeMock).toBeCalledTimes(1);
    expect(closeNoticeMock).toBeCalledWith();
    dialog.temp.callback.cancel!();
    expect(list.state.status).toEqual({});
    expect(closeDialogMock).toBeCalledTimes(2);
    expect(closeDialogMock).toBeCalledWith();
  });
  it(`editItem`, () => {
    list.action.editItem({ listId: `list1111111111111` });
    expect(list.state.status).toEqual({ list1111111111111: `edit` });
    list.action.editItem();
    expect(list.state.status).toEqual({});
  });
  it(`dragInit`, () => {
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue({
      getBoundingClientRect: () => ({ top: 40, left: 60, height: 40, width: 120 }),
    } as HTMLElement);
    const vibrateMock = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate: vibrateMock });
    list.action.dragInit({ listId: `list1111111111111`, y: 0 });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ListItemlist1111111111111`);
    expect(list.temp.drag).toEqual({
      status: `start`,
      id: `list1111111111111`,
      y: 0,
      top: 40,
      left: 60,
      height: 40,
      width: 120,
    });
    expect(vibrateMock).toBeCalledTimes(1);
    expect(vibrateMock).toBeCalledWith(40);
  });
  it(`dragStart`, () => {
    const cloneMock = vi.fn(() => ({ style: {} }));
    const appendMock = vi.fn();
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ cloneNode: cloneMock, appendChild: appendMock } as unknown as HTMLElement);
    list.action.dragStart();
    expect(list.temp.drag.status).toBe(`move`);
    expect(getByIdMock).toBeCalledTimes(2);
    expect(getByIdMock).toBeCalledWith(`ListItemlist1111111111111`);
    expect(getByIdMock).toBeCalledWith(`ListBody`);
    expect(cloneMock).toBeCalledTimes(1);
    expect(cloneMock).toBeCalledWith(true);
    expect(appendMock).toBeCalledTimes(1);
    expect(appendMock).toBeCalledWith({
      style: {
        position: `absolute`,
        zIndex: `1`,
        top: `40px`,
        left: `60px`,
        height: `40px`,
        width: `120px`,
      },
    });
    expect(list.state.status[`list1111111111111`]).toBe(`hide`);
  });
  it(`dragMove`, () => {
    const getByIdMock = vi.spyOn(Util, `getById`).mockImplementation(
      (id: string) =>
        ({
          getBoundingClientRect: () => {
            if (id === `ListItemlist1111111111111`) {
              return { top: 40, height: 40, bottom: 80 };
            } else if (id === `ListItemlist0000000000000`) {
              return { top: 80, height: 40, bottom: 120 };
            } else if (id === `ListItemlist9999999999999`) {
              return { top: 120, height: 40, bottom: 160 };
            }
            return undefined;
          },
        }) as unknown as HTMLElement,
    );
    list.temp.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    list.action.dragMove({ y: 0 });
    expect(list.temp.drag.clone!.style.top).toBe(`40px`);
    expect(getByIdMock).toBeCalledTimes(3);
    expect(getByIdMock).toBeCalledWith(`ListItemundefined`);
    expect(getByIdMock).toBeCalledWith(`ListItemlist1111111111111`);
    expect(getByIdMock).toBeCalledWith(`ListItemlist0000000000000`);
    expect(list.state.data.sort).toEqual([`list0000000000000`, `list1111111111111`, `list9999999999999`]);
    list.temp.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    list.action.dragMove({ y: 0 });
    expect(list.state.data.sort).toEqual([`list1111111111111`, `list0000000000000`, `list9999999999999`]);
  });
  it(`dragEnd`, () => {
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ getBoundingClientRect: () => ({ top: 40 }) } as HTMLElement);
    const removeClassMock = vi.fn();
    const removeCloneMock = vi.fn();
    const addListenerMock = vi.fn((_: string, listener: () => void) => listener());
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (list.temp.drag.clone as unknown as { [K in string]: object }) = {
      classList: { remove: removeClassMock },
      animate: animateMock,
      remove: removeCloneMock,
    };
    list.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: `40px` }, { duration: 250, easing: `ease-in-out` });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ListItemlist1111111111111`);
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(removeCloneMock).toBeCalledWith();
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
    expect(list.temp.drag).toEqual({});
  });
  it(`dragEnd - extra`, () => {
    list.temp.drag = { status: `start` };
    list.action.dragEnd();
    expect(list.temp.drag).toEqual({});
  });
  it(`swipeInit`, () => {
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ getBoundingClientRect: () => ({ left: 0 }) } as HTMLElement);
    list.action.swipeInit({ x: 0, y: 0 });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ListRoot`);
    expect(list.temp.swipe.status).toBe(`start`);
    expect(list.temp.swipe.x).toBe(0);
    expect(list.temp.swipe.y).toBe(0);
    expect(list.temp.swipe.left).toBe(0);
  });
  it(`swipeStart`, () => {
    list.action.swipeStart({ x: 0, y: 20 });
    expect(list.temp.swipe).toEqual({});
    list.temp.swipe = { status: `start`, x: 0, y: 0, left: 0 };
    list.action.swipeStart({ x: 20, y: 0 });
    expect(list.temp.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    list.temp.swipe.elem = { style: {} } as HTMLElement;
    list.action.swipeMove({ x: -100 });
    expect(list.temp.swipe.elem!.style.transform).toBe(`translateX(-100px)`);
    list.action.swipeMove({ x: 100 });
    expect(list.temp.swipe.elem!.style.transform).toBe(`translateX(0px)`);
  });
  it(`swipeEnd`, () => {
    const addListenerMock = vi.fn((_: string, listener: () => void) => listener());
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (list.temp.swipe.elem as unknown as { [K in string]: object }).animate = animateMock;
    list.action.swipeEnd({ x: 100 });
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ transform: `translateX(0px)` }, { duration: 250, easing: `ease-in-out` });
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(list.temp.swipe).toEqual({});
  });
  it(`swipeEnd - extra`, () => {
    list.temp.swipe = { status: `move`, x: 0, left: 0 };
    const routerMock = vi.spyOn(app.action, `routerBack`).mockReturnValue();
    list.action.swipeEnd({ x: -200 });
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith();
    expect(list.temp.swipe).toEqual({});
    list.temp.swipe = { status: `start` };
    list.action.swipeEnd({ x: 0 });
    expect(list.temp.swipe).toEqual({});
  });
});

describe(`getter`, () => {
  it(`classStatus`, () => {
    expect(list.getter.classStatus(`list1111111111111`)).toEqual({ select: true, edit: false, hide: false });
    expect(list.getter.classStatus(`list0000000000000`)).toEqual({ select: false, edit: false, hide: false });
  });
  it(`classLimit`, () => {
    vi.setSystemTime(new Date(1999, 11, 30, 0, 0, 0, 0));
    expect(list.getter.classLimit(`list1111111111111`)).toEqual({
      "text-theme-care": false,
      "text-theme-warn": false,
    });
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    expect(list.getter.classLimit(`list1111111111111`)).toEqual({
      "text-theme-care": true,
      "text-theme-warn": false,
    });
    vi.setSystemTime(new Date(2000, 1, 1, 0, 0, 0, 0));
    expect(list.getter.classLimit(`list1111111111111`)).toEqual({
      "text-theme-care": true,
      "text-theme-warn": true,
    });
  });
  it(`typeIcon`, () => {
    expect(list.getter.typeIcon(`list1111111111111`)).toBe(`IconList`);
    expect(list.getter.typeIcon(`list0000000000000`)).toBe(`IconInbox`);
    expect(list.getter.typeIcon(`list9999999999999`)).toBe(`IconTrash`);
  });
  it(`textCount`, () => {
    expect(list.getter.textCount(`list1111111111111`)).toBe(`1/2`);
    expect(list.getter.textCount(`list0000000000000`)).toBe(`0/0`);
    expect(list.getter.textCount(`list9999999999999`)).toBe(`0/0`);
  });
});
