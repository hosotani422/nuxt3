import { vi, beforeEach, afterEach, describe, it, expect, MockInstance } from "vitest";
import Vue from "vue";
import lodash from "lodash";
import Api from "@/api/api";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  vi.useFakeTimers();
  fixture.loadLang();
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

describe(`getter`, () => {
  it(`stateFull`, () => {
    expect(list.getter.stateFull()).toEqual({
      sort: [`list1111111111111`, `list0000000000000`, `list9999999999999`],
      data: {
        list1111111111111: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
  });
  it(`stateUnit`, () => {
    expect(list.getter.stateUnit()).toEqual({ title: `list1` });
    expect(list.getter.stateUnit(`list1111111111111`)).toEqual({ title: `list1` });
    expect(list.getter.stateUnit(`list0000000000000`)).toEqual({ title: `Inbox` });
    expect(list.getter.stateUnit(`list9999999999999`)).toEqual({ title: `Trash` });
  });
  it(`classItem`, () => {
    expect(list.getter.classItem(`list1111111111111`)).toEqual({ select: true, edit: false, hide: false });
    expect(list.getter.classItem(`list0000000000000`)).toEqual({ select: false, edit: false, hide: false });
    expect(list.getter.classItem(`list9999999999999`)).toEqual({ select: false, edit: false, hide: false });
  });
  it(`iconType`, () => {
    expect(list.getter.iconType(`list1111111111111`)).toBe(`IconList`);
    expect(list.getter.iconType(`list0000000000000`)).toBe(`IconInbox`);
    expect(list.getter.iconType(`list9999999999999`)).toBe(`IconTrash`);
  });
  it(`classLimit`, () => {
    vi.setSystemTime(new Date(1999, 11, 30, 0, 0, 0, 0));
    expect(list.getter.classLimit(`list1111111111111`)).toEqual({ "text-theme-care": false, "text-theme-warn": false });
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    expect(list.getter.classLimit(`list1111111111111`)).toEqual({ "text-theme-care": true, "text-theme-warn": false });
    vi.setSystemTime(new Date(2000, 1, 1, 0, 0, 0, 0));
    expect(list.getter.classLimit(`list1111111111111`)).toEqual({ "text-theme-care": true, "text-theme-warn": true });
  });
  it(`textCount`, () => {
    expect(list.getter.textCount(`list1111111111111`)).toBe(`1/2`);
    expect(list.getter.textCount(`list0000000000000`)).toBe(`0/0`);
    expect(list.getter.textCount(`list9999999999999`)).toBe(`0/0`);
  });
});

describe(`action`, () => {
  it(`initPage`, async () => {
    vi.spyOn(list.action, `loadItem`).mockResolvedValue();
    await list.action.initPage();
    expect(list.action.loadItem).toBeCalledTimes(1);
  });
  it(`actPage`, async () => {
    vi.spyOn(list.action, `saveItem`).mockReturnValue();
    list.action.actPage();
    list.state.data.data[`list1111111111111`]!.title = `list0`;
    expect(await list.action.saveItem).toBeCalledTimes(1);
  });
  it(`loadItem`, async () => {
    vi.spyOn(Api, `readList`).mockResolvedValue({ sort: [], data: {} });
    await list.action.loadItem();
    expect(Api.readList).toBeCalledTimes(1);
    expect(list.state.data).toEqual({ sort: [], data: {} });
  });
  it(`saveItem`, () => {
    vi.spyOn(Api, `writeList`).mockReturnValue();
    list.action.saveItem();
    expect(Api.writeList).toBeCalledTimes(1);
    expect(Api.writeList).toBeCalledWith({
      sort: [`list1111111111111`, `list0000000000000`, `list9999999999999`],
      data: {
        list1111111111111: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
  });
  it(`insertItem`, () => {
    vi.setSystemTime(new Date(946566000000));
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    list.action.insertItem();
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`text`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`新規登録`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.text!.value).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.text!.placeholder).toBe(`リスト`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.callback.ok!();
    expect(list.state.data).toEqual({
      sort: [`list946566000000`, `list1111111111111`, `list0000000000000`, `list9999999999999`],
      data: {
        list946566000000: { title: `` },
        list1111111111111: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data[`list946566000000`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list946566000000`]).toEqual({ data: {} });
    expect(dialog.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`copyItem`, () => {
    vi.setSystemTime(new Date(946566000000));
    list.action.copyItem({ listId: `list1111111111111` });
    expect(list.state.data).toEqual({
      sort: [`list1111111111111`, `list946566000000`, `list0000000000000`, `list9999999999999`],
      data: {
        list1111111111111: { title: `list1` },
        list946566000000: { title: `list1` },
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data[`list946566000000`]).toEqual(main.state.data[`list1111111111111`]);
    expect(sub.state.data[`list946566000000`]).toEqual(sub.state.data[`list1111111111111`]);
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
  });
  it(`deleteItem`, () => {
    const listData = lodash.cloneDeep(list.state.data);
    const mainData = lodash.cloneDeep(main.state.data[`list1111111111111`]);
    const subData = lodash.cloneDeep(sub.state.data[`list1111111111111`]);
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    vi.spyOn(constant.sound, `play`).mockReturnValue();
    vi.spyOn(notice.action, `open`);
    vi.spyOn(notice.action, `close`).mockReturnValue();
    list.action.deleteItem({ listId: `list1111111111111` });
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`本当に削除しますか`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.callback.ok!();
    expect(list.state.data).toEqual({
      sort: [`list0000000000000`, `list9999999999999`],
      data: {
        list0000000000000: { title: `Inbox` },
        list9999999999999: { title: `Trash` },
      },
    });
    expect(main.state.data[`list1111111111111`]).toBeUndefined();
    expect(main.state.data[`list9999999999999`]).toEqual(mainData);
    expect(sub.state.data[`list1111111111111`]).toBeUndefined();
    expect(sub.state.data[`list9999999999999`]).toEqual(subData);
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
    expect(dialog.action.close).toBeCalledTimes(1);
    expect(constant.sound.play).toBeCalledTimes(1);
    expect(constant.sound.play).toHaveBeenCalledWith(`warn`);
    expect(notice.action.open).toBeCalledTimes(1);
    expect((notice.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(`削除が完了しました`);
    expect((notice.action.open as unknown as MockInstance).mock.calls[0]![0]!.button).toBe(`元に戻す`);
    notice.state.callback();
    expect(list.state.data).toEqual(listData);
    expect(main.state.data[`list1111111111111`]).toEqual(mainData);
    expect(main.state.data[`list9999999999999`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list1111111111111`]).toEqual(subData);
    expect(sub.state.data[`list9999999999999`]).toEqual({ data: {} });
    expect(notice.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`switchEdit`, () => {
    list.action.switchEdit({ listId: `list1111111111111` });
    expect(list.state.status).toEqual({ list1111111111111: `edit`, list0000000000000: ``, list9999999999999: `` });
    list.action.switchEdit();
    expect(list.state.status).toEqual({ list1111111111111: ``, list0000000000000: ``, list9999999999999: `` });
  });
  it(`dragInit`, () => {
    list.refer.items = {
      value: {
        list1111111111111: { getBoundingClientRect: () => ({ top: 40, left: 60, height: 40, width: 120 }) },
      },
    } as unknown as Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
    vi.stubGlobal(`navigator`, { vibrate: vi.fn() });
    list.action.dragInit({ listId: `list1111111111111`, clientY: 0 });
    expect(list.prop.drag).toEqual({
      status: `start`,
      id: `list1111111111111`,
      y: 0,
      top: 40,
      left: 60,
      height: 40,
      width: 120,
    });
    expect(navigator.vibrate).toBeCalledTimes(1);
    expect(navigator.vibrate).toBeCalledWith(40);
  });
  it(`dragStart`, () => {
    list.refer.items!.value[`list1111111111111`]!.cloneNode = () => ({ style: {} }) as unknown as Node;
    list.refer.wrap = { value: { appendChild: vi.fn() } } as unknown as Vue.Ref<
      Vue.ComponentPublicInstance<HTMLElement> | undefined
    >;
    list.action.dragStart();
    expect(list.prop.drag.status).toBe(`move`);
    expect(list.refer.wrap.value!.appendChild).toBeCalledTimes(1);
    expect(list.refer.wrap.value!.appendChild).toBeCalledWith({
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
    list.refer.items!.value[`list1111111111111`]!.getBoundingClientRect = () =>
      ({ top: 40, left: 60, height: 40, width: 120 }) as DOMRect;
    list.refer.items!.value[`list0000000000000`] = {
      getBoundingClientRect: () => ({ top: 80, left: 60, height: 40, width: 120 }),
    } as Vue.ComponentPublicInstance<HTMLElement>;
    list.refer.items!.value[`list9999999999999`] = {
      getBoundingClientRect: () => ({ top: 120, left: 60, height: 40, width: 120 }),
    } as Vue.ComponentPublicInstance<HTMLElement>;
    list.prop.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    list.action.dragMove({ clientY: 0 });
    expect(list.state.data.sort).toEqual([`list1111111111111`, `list0000000000000`, `list9999999999999`]);
    list.prop.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    list.action.dragMove({ clientY: 0 });
    expect(list.state.data.sort).toEqual([`list0000000000000`, `list1111111111111`, `list9999999999999`]);
    list.prop.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    list.action.dragMove({ clientY: 0 });
    expect(list.state.data.sort).toEqual([`list1111111111111`, `list0000000000000`, `list9999999999999`]);
  });
  it(`dragEnd`, () => {
    const removeClassMock = (() => {
      const mock = vi.fn();
      (list.prop.drag.clone!.classList as object) = { remove: mock };
      return mock;
    })();
    const addListenerMock = vi.fn((_mode: string, listener: () => void) => {
      listener();
    });
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (list.prop.drag.clone as unknown as { [K in string]: object }).animate = animateMock;
    const removeCloneMock = (() => {
      const mock = vi.fn();
      list.prop.drag.clone!.remove = mock;
      return mock;
    })();
    list.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: `40px` }, { duration: 150, easing: `ease-in-out` });
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(list.state.status[`list1111111111111`]).toBe(``);
    expect(list.prop.drag).toEqual({});
  });
  it(`dragEnd - extra`, () => {
    list.prop.drag = { status: `end`, id: `list1111111111111` };
    list.action.dragEnd();
    expect(list.prop.drag).toEqual({});
  });
  it(`swipeInit`, () => {
    const target = { style: {}, getBoundingClientRect: () => ({ left: 60 }) } as unknown as HTMLElement;
    list.action.swipeInit({ target, clientX: 0, clientY: 0 });
    expect(list.prop.swipe).toEqual({ status: `start`, target, x: 0, y: 0, left: 60 });
  });
  it(`swipeStart`, () => {
    list.action.swipeStart({ clientX: 20, clientY: 0 });
    expect(list.prop.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    list.action.swipeMove({ clientX: -100 });
    expect(list.prop.swipe.target!.style.transform).toBe(`translateX(-40px)`);
    list.action.swipeMove({ clientX: 100 });
    expect(list.prop.swipe.target!.style.transform).toBe(`translateX(0px)`);
  });
  it(`swipeEnd`, () => {
    const addListenerMock = vi.fn((_mode: string, listener: () => void) => {
      listener();
    });
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (list.prop.swipe.target as unknown as { [K in string]: object }).animate = animateMock;
    list.action.swipeEnd({ clientX: 0 });
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ transform: `translateX(0px)` }, { duration: 150, easing: `ease-in-out` });
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(list.prop.swipe).toEqual({});
  });
  it(`swipeStart - extra`, () => {
    list.prop.swipe = { status: `start`, x: 0, y: 0 };
    list.action.swipeStart({ clientX: 0, clientY: 20 });
    expect(list.prop.swipe).toEqual({});
  });
  it(`swipeEnd - extra`, () => {
    list.prop.swipe = { status: `move`, left: 60, x: 0 };
    vi.spyOn(app.action, `routerBack`).mockReturnValue();
    list.action.swipeEnd({ clientX: -200 });
    expect(app.action.routerBack).toBeCalledTimes(1);
    expect(list.prop.swipe).toEqual({});
    list.prop.swipe = { status: `end` };
    list.action.swipeEnd({ clientX: -200 });
    expect(list.prop.swipe).toEqual({});
  });
});
