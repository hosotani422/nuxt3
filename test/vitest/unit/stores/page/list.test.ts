import { vi, beforeEach, afterEach, describe, it, expect, SpyInstance } from "vitest";
import * as Vue from "vue";
import fs from "fs";
import * as Api from "@/api/api";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

beforeEach(async () => {
  vi.useFakeTimers();
  const backup = fs.readFileSync(`./test/memotea.bak`, `utf-8`).split(`\n`);
  app.state.backId = backup[0]!;
  list.state.data = JSON.parse(backup[1]!);
  main.state.data = JSON.parse(backup[2]!);
  sub.state.data = JSON.parse(backup[3]!);
  conf.state.data = JSON.parse(backup[4]!);
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
    expect(list.getter.stateFull().sort).toEqual([`list1111111111111`, `list0000000000000`, `list9999999999999`]);
  });
  it(`stateUnit`, () => {
    expect(list.getter.stateUnit()).toEqual({ title: `list1` });
    expect(list.getter.stateUnit(`list0000000000000`)).toEqual({ title: `Inbox` });
  });
  it(`classItem`, () => {
    expect(list.getter.classItem(`list1111111111111`)).toEqual({ select: true, edit: false, hide: false });
    expect(list.getter.classItem(`list0000000000000`)).toEqual({ select: false, edit: false, hide: false });
  });
  it(`iconType`, () => {
    expect(list.getter.iconType(`list1111111111111`)).toBe(`IconList`);
    expect(list.getter.iconType(`list0000000000000`)).toBe(`IconInbox`);
    expect(list.getter.iconType(`list9999999999999`)).toBe(`IconTrash`);
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
  it(`textCount`, () => {
    expect(list.getter.textCount(`list1111111111111`)).toBe(`1/2`);
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
    const readListData = { sort: [], data: {} };
    vi.spyOn(Api, `readList`).mockResolvedValue(readListData);
    await list.action.loadItem();
    expect(Api.readList).toBeCalledTimes(1);
    expect(list.state.data).toEqual(readListData);
  });
  it(`saveItem`, () => {
    const writeListData = { sort: [], data: {} };
    vi.spyOn(Api, `writeList`).mockReturnValue();
    list.state.data = writeListData;
    list.action.saveItem();
    expect(Api.writeList).toBeCalledTimes(1);
    expect(Api.writeList).toBeCalledWith(writeListData);
  });
  it(`insertItem`, () => {
    vi.setSystemTime(new Date(946566000000));
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    list.action.insertItem();
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.mode).toBe(`text`);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.title).toBe(
      app.getter.lang().dialog.title.insert,
    );
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.text!.value).toBe(``);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.text!.placeholder).toBe(
      app.getter.lang().placeholder.list,
    );
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.ok).toBe(app.getter.lang().button.ok);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.cancel).toBe(
      app.getter.lang().button.cancel,
    );
    dialog.state.callback.ok!();
    expect(list.state.data.sort).toEqual([
      `list946566000000`,
      `list1111111111111`,
      `list0000000000000`,
      `list9999999999999`,
    ]);
    expect(list.state.data.data[`list946566000000`]!.title).toBe(``);
    expect(main.state.data[`list946566000000`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list946566000000`]).toEqual({ data: {} });
    expect(dialog.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`copyItem`, () => {
    vi.setSystemTime(new Date(946566000000));
    list.action.copyItem({ listId: `list1111111111111` });
    expect(list.state.data.sort).toEqual([
      `list1111111111111`,
      `list946566000000`,
      `list0000000000000`,
      `list9999999999999`,
    ]);
    expect(list.state.data.data[`list946566000000`]).toEqual(list.state.data.data[`list1111111111111`]);
    expect(main.state.data[`list946566000000`]).toEqual(main.state.data[`list1111111111111`]);
    expect(sub.state.data[`list946566000000`]).toEqual(sub.state.data[`list1111111111111`]);
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
  });
  it(`deleteItem`, () => {
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    vi.spyOn(constant.sound, `play`).mockReturnValue();
    vi.spyOn(notice.action, `open`);
    vi.spyOn(notice.action, `close`).mockReturnValue();
    list.action.deleteItem({ listId: `list1111111111111` });
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.mode).toBe(`confirm`);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.title).toBe(
      app.getter.lang().dialog.title.delete,
    );
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.ok).toBe(app.getter.lang().button.ok);
    expect((dialog.action.open as unknown as SpyInstance).mock.calls[0]![0]!.cancel).toBe(
      app.getter.lang().button.cancel,
    );
    dialog.state.callback.ok!();
    expect(list.state.data.sort).toEqual([`list0000000000000`, `list9999999999999`]);
    expect(list.state.data.data[`list1111111111111`]).toBeUndefined();
    expect(main.state.data[`list1111111111111`]).toBeUndefined();
    expect(sub.state.data[`list1111111111111`]).toBeUndefined();
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
    expect(main.state.data[`list9999999999999`]).toEqual({
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
        main2222222222222: {
          check: true,
          title: `main2`,
          date: ``,
          time: ``,
          alarm: [],
          task: true,
        },
      },
    });
    expect(sub.state.data[`list9999999999999`]!.data).toEqual({
      main1111111111111: {
        sort: [`sub1111111111111`, `sub2222222222222`],
        data: {
          sub1111111111111: { check: false, title: `sub1` },
          sub2222222222222: { check: true, title: `sub2` },
        },
      },
      main2222222222222: {
        sort: [`sub121`],
        data: {
          sub121: { check: false, title: `` },
        },
      },
    });
    expect(dialog.action.close).toBeCalledTimes(1);
    expect(constant.sound.play).toBeCalledTimes(1);
    expect(constant.sound.play).toHaveBeenCalledWith(`warn`);
    expect(notice.action.open).toBeCalledTimes(1);
    expect((notice.action.open as unknown as SpyInstance).mock.calls[0]![0]!.message).toBe(
      app.getter.lang().notice.message,
    );
    expect((notice.action.open as unknown as SpyInstance).mock.calls[0]![0]!.button).toBe(
      app.getter.lang().notice.button,
    );
    notice.state.callback();
    expect(list.state.data.sort).toEqual([`list1111111111111`, `list0000000000000`, `list9999999999999`]);
    expect(list.state.data.data[`list1111111111111`]).toEqual({ title: `list1` });
    expect(main.state.data[`list1111111111111`]).toEqual({
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
        main2222222222222: {
          check: true,
          title: `main2`,
          date: ``,
          time: ``,
          alarm: [],
          task: true,
        },
      },
    });
    expect(sub.state.data[`list1111111111111`]!.data).toEqual({
      main1111111111111: {
        sort: [`sub1111111111111`, `sub2222222222222`],
        data: {
          sub1111111111111: { check: false, title: `sub1` },
          sub2222222222222: { check: true, title: `sub2` },
        },
      },
      main2222222222222: {
        sort: [`sub121`],
        data: {
          sub121: { check: false, title: `` },
        },
      },
    });
    expect(main.state.data[`list9999999999999`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list9999999999999`]).toEqual({ data: {} });
    expect(notice.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(list.state.status[`list1111111111111`]).toBeUndefined();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`switchEdit`, () => {
    list.action.switchEdit({ listId: `list1111111111111` });
    expect(list.state.status).toEqual({ list1111111111111: `edit`, list0000000000000: ``, list9999999999999: `` });
    list.action.switchEdit({ listId: `list9999999999999` });
    expect(list.state.status).toEqual({ list1111111111111: ``, list0000000000000: ``, list9999999999999: `edit` });
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
    list.prop.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    list.refer.items!.value[`list1111111111111`]!.getBoundingClientRect = () =>
      ({ top: 40, left: 60, height: 40, width: 120 }) as DOMRect;
    list.refer.items!.value[`list0000000000000`] = {
      getBoundingClientRect: () => ({ top: 80, left: 60, height: 40, width: 120 }),
    } as Vue.ComponentPublicInstance<HTMLElement>;
    list.action.dragMove({ clientY: 0 });
    expect(list.state.data.sort).toEqual([`list0000000000000`, `list1111111111111`, `list9999999999999`]);
  });
  it(`dragEnd`, () => {
    const removeClassMock = (() => {
      const mock = vi.fn();
      (list.prop.drag.clone!.classList as object) = { remove: mock };
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
      list.prop.drag.clone!.animate = mock;
      return mock;
    })();
    const removeCloneMock = (() => {
      const mock = vi.fn();
      list.prop.drag.clone!.remove = mock;
      return mock;
    })();
    list.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: [`80px`, `40px`] }, 150);
    expect(list.state.status[`list1111111111111`]).toBe(``);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(list.prop.drag).toEqual({});
  });
  it(`swipeInit`, () => {
    const target = {
      style: {},
      getBoundingClientRect: () => ({ left: 60, width: 120 }),
    } as unknown as HTMLElement;
    list.action.swipeInit({ target, clientX: 0, clientY: 0 });
    expect(list.prop.swipe.status).toBe(`start`);
    expect(list.prop.swipe.target).toEqual(target);
    expect(list.prop.swipe.x).toBe(0);
    expect(list.prop.swipe.y).toBe(0);
    expect(list.prop.swipe.left).toBe(60);
  });
  it(`swipeStart`, () => {
    list.action.swipeStart({ clientX: 20, clientY: 0 });
    expect(list.prop.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    list.action.swipeMove({ clientX: -100 });
    expect(list.prop.swipe.target!.style.transform).toBe(`translateX(-40px)`);
  });
  it(`swipeEnd`, () => {
    const addClassMock = vi.fn();
    const removeClassMock = vi.fn();
    const addListenerMock = vi.fn((_mode: string, listener: () => void) => {
      listener();
    });
    const removeListenerMock = vi.fn();
    (list.prop.swipe.target as unknown as { [K in string]: object }).classList = {
      add: addClassMock,
      remove: removeClassMock,
    };
    (list.prop.swipe.target as unknown as { [K in string]: object }).addEventListener = addListenerMock;
    (list.prop.swipe.target as unknown as { [K in string]: object }).removeEventListener = removeListenerMock;
    list.action.swipeEnd({ clientX: 0 });
    expect(addClassMock).toBeCalledTimes(1);
    expect(addClassMock).toBeCalledWith(`v-enter-active`);
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeListenerMock).toBeCalledTimes(1);
    expect(removeListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`v-enter-active`);
    expect(list.prop.swipe).toEqual({});
  });
});
