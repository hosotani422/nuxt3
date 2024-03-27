import { vi, beforeEach, afterEach, describe, it, expect, MockInstance } from "vitest";
import * as Vue from "vue";
import * as Api from "@/api/api";
import constant from "@/utils/const";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
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
  check: false,
  title: `main1`,
  date: `2000/01/01`,
  time: `00:00`,
  alarm: [`2`, `6`],
  task: true,
};

const main2Data = {
  check: true,
  title: `main2`,
  date: ``,
  time: ``,
  alarm: [],
  task: true,
};

const main3Data = {
  check: false,
  title: ``,
  date: ``,
  time: ``,
  alarm: [],
  task: true,
};

describe(`getter`, () => {
  it(`stateFull`, () => {
    const list1Data = {
      sort: [`main1111111111111`, `main2222222222222`],
      data: {
        main1111111111111: main1Data,
        main2222222222222: main2Data,
      },
    };
    expect(main.getter.stateFull()).toEqual(list1Data);
    expect(main.getter.stateFull(`list1111111111111`)).toEqual(list1Data);
    expect(main.getter.stateFull(`list0000000000000`)).toEqual({ sort: [], data: {} });
    expect(main.getter.stateFull(`list9999999999999`)).toEqual({ sort: [], data: {} });
  });
  it(`stateUnit`, () => {
    expect(main.getter.stateUnit()).toEqual(main1Data);
    expect(main.getter.stateUnit(`list1111111111111`)).toEqual(main1Data);
    expect(main.getter.stateUnit(undefined, `main2222222222222`)).toEqual(main2Data);
    expect(main.getter.stateUnit(`list1111111111111`, `main2222222222222`)).toEqual(main2Data);
  });
  it(`classItem`, () => {
    expect(main.getter.classItem(`main1111111111111`)).toEqual({
      select: true,
      check: false,
      edit: false,
      drag: false,
      hide: false,
    });
    expect(main.getter.classItem(`main2222222222222`)).toEqual({
      select: false,
      check: true,
      edit: false,
      drag: false,
      hide: false,
    });
  });
  it(`classLimit`, () => {
    vi.setSystemTime(new Date(1999, 11, 30, 0, 0, 0, 0));
    expect(main.getter.classLimit(`main1111111111111`)).toEqual({ "text-theme-care": false, "text-theme-warn": false });
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    expect(main.getter.classLimit(`main1111111111111`)).toEqual({ "text-theme-care": true, "text-theme-warn": false });
    vi.setSystemTime(new Date(2000, 1, 1, 0, 0, 0, 0));
    expect(main.getter.classLimit(`main1111111111111`)).toEqual({ "text-theme-care": true, "text-theme-warn": true });
  });
  it(`textCount`, () => {
    expect(main.getter.textCount(`main1111111111111`)).toBe(`1/2`);
    expect(main.getter.textCount(`main2222222222222`)).toBe(`1/1`);
  });
});

describe(`action`, () => {
  it(`initPage`, async () => {
    vi.spyOn(main.action, `loadItem`).mockResolvedValue();
    await main.action.initPage();
    expect(main.action.loadItem).toBeCalledTimes(1);
  });
  it(`actPage`, async () => {
    vi.spyOn(main.action, `saveItem`).mockReturnValue();
    vi.spyOn(conf.action, `reactAlarm`).mockReturnValue();
    main.action.actPage();
    main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task = false;
    expect(await main.action.saveItem).toBeCalledTimes(1);
    expect(await conf.action.reactAlarm).toBeCalledTimes(1);
  });
  it(`loadItem`, async () => {
    vi.spyOn(Api, `readMain`).mockResolvedValue({ list700: { sort: [], data: {} } });
    await main.action.loadItem();
    expect(Api.readMain).toBeCalledTimes(1);
    expect(main.state.data).toEqual({ list700: { sort: [], data: {} } });
  });
  it(`saveItem`, () => {
    vi.spyOn(Api, `writeMain`).mockReturnValue();
    main.action.saveItem();
    expect(Api.writeMain).toBeCalledTimes(1);
    expect(Api.writeMain).toBeCalledWith({
      list0000000000000: { sort: [], data: {} },
      list9999999999999: { sort: [], data: {} },
      list1111111111111: {
        sort: ["main1111111111111", "main2222222222222"],
        data: {
          main1111111111111: main1Data,
          main2222222222222: main2Data,
        },
      },
    });
  });
  it(`insertItem`, () => {
    vi.setSystemTime(new Date(946566000000));
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    main.action.insertItem();
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`text`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`新規登録`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.text!.value).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.text!.placeholder).toBe(`タスク`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.callback.ok!();
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main946566000000`, `main1111111111111`, `main2222222222222`],
      data: {
        main946566000000: main3Data,
        main1111111111111: main1Data,
        main2222222222222: main2Data,
      },
    });
    expect(sub.state.data[`list1111111111111`]!.data[`main946566000000`]).toEqual({
      sort: [`sub946566000000`],
      data: { sub946566000000: { check: false, title: `` } },
    });
    expect(dialog.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`copyItem`, () => {
    vi.setSystemTime(new Date(946566000000));
    main.action.copyItem({ mainId: `main2222222222222` });
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main1111111111111`, `main2222222222222`, `main946566000000`],
      data: {
        main1111111111111: main1Data,
        main2222222222222: main2Data,
        main946566000000: main2Data,
      },
    });
    expect(sub.state.data[`list1111111111111`]!.data[`main946566000000`]).toEqual(
      sub.state.data[`list1111111111111`]!.data[`main2222222222222`],
    );
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
  });
  it(`moveItem`, () => {
    vi.spyOn(dialog.action, `open`);
    vi.spyOn(dialog.action, `close`).mockReturnValue();
    main.action.moveItem({ mainId: `main2222222222222` });
    expect(dialog.action.open).toBeCalledTimes(1);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.mode).toBe(`radio`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.title).toBe(`移動先の選択`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(``);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.radio!.none).toBe(false);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.radio!.select).toBe(`list1111111111111`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.radio!.sort).toBe(list.state.data.sort);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.radio!.data).toBe(list.state.data.data);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.ok).toBe(`決定`);
    expect((dialog.action.open as unknown as MockInstance).mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.radio.select = `list0000000000000`;
    dialog.state.callback.ok!();
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main1111111111111`],
      data: { main1111111111111: main1Data },
    });
    expect(main.state.data[`list0000000000000`]).toEqual({
      sort: [`main2222222222222`],
      data: { main2222222222222: main2Data },
    });
    expect(sub.state.data[`list1111111111111`]!.data[`main2222222222222`]).toBeUndefined();
    expect(sub.state.data[`list0000000000000`]!.data[`main2222222222222`]).toEqual({
      sort: [`sub121`],
      data: { sub121: { check: false, title: `` } },
    });
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
    expect(dialog.action.close).toBeCalledTimes(1);
    dialog.state.callback.cancel!();
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
    expect(dialog.action.close).toBeCalledTimes(2);
  });
  it(`deleteItem`, () => {
    vi.spyOn(constant.sound, `play`).mockReturnValue();
    vi.spyOn(notice.action, `open`);
    vi.spyOn(notice.action, `close`).mockReturnValue();
    main.action.deleteItem({ mainId: `main2222222222222` });
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main1111111111111`],
      data: { main1111111111111: main1Data },
    });
    expect(main.state.data[`list9999999999999`]).toEqual({
      sort: [`main2222222222222`],
      data: { main2222222222222: main2Data },
    });
    expect(sub.state.data[`list1111111111111`]!.data[`main2222222222222`]).toBeUndefined();
    expect(sub.state.data[`list9999999999999`]!.data[`main2222222222222`]).toEqual({
      sort: [`sub121`],
      data: { sub121: { check: false, title: `` } },
    });
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
    expect(constant.sound.play).toBeCalledTimes(1);
    expect(constant.sound.play).toHaveBeenCalledWith(`warn`);
    expect(notice.action.open).toBeCalledTimes(1);
    expect((notice.action.open as unknown as MockInstance).mock.calls[0]![0]!.message).toBe(`削除が完了しました`);
    expect((notice.action.open as unknown as MockInstance).mock.calls[0]![0]!.button).toBe(`元に戻す`);
    notice.state.callback();
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main1111111111111`, `main2222222222222`],
      data: { main1111111111111: main1Data, main2222222222222: main2Data },
    });
    expect(main.state.data[`list9999999999999`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list1111111111111`]!.data[`main2222222222222`]).toEqual({
      sort: [`sub121`],
      data: { sub121: { check: false, title: `` } },
    });
    expect(sub.state.data[`list9999999999999`]!.data[`main2222222222222`]).toBeUndefined();
    expect(notice.action.close).toBeCalledTimes(1);
  });
  it(`checkItem`, () => {
    vi.spyOn(constant.sound, `play`).mockReturnValue();
    main.action.checkItem({ mainId: `main1111111111111`, checked: true });
    expect(main.state.data[`list1111111111111`]!.sort).toEqual(["main2222222222222", "main1111111111111"]);
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]?.check).toBe(true);
    expect(constant.sound.play).toBeCalledTimes(1);
    expect(constant.sound.play).toHaveBeenCalledWith(`ok`);
    main.action.checkItem({ mainId: `main1111111111111`, checked: false });
    expect(main.state.data[`list1111111111111`]!.sort).toEqual(["main1111111111111", "main2222222222222"]);
    expect(main.state.data[`list1111111111111`]!.data[`main1111111111111`]?.check).toBe(false);
    expect(constant.sound.play).toBeCalledTimes(2);
    expect(constant.sound.play).toHaveBeenCalledWith(`cancel`);
  });
  it(`switchEdit`, () => {
    main.action.switchEdit({ mainId: `main2222222222222` });
    expect(main.state.status).toEqual({ main1111111111111: ``, main2222222222222: `edit` });
    main.action.switchEdit();
    expect(main.state.status).toEqual({ main1111111111111: ``, main2222222222222: `` });
  });
  it(`dragInit`, () => {
    main.refer.items = {
      value: {
        main1111111111111: { getBoundingClientRect: () => ({ top: 40, left: 60, height: 40, width: 120 }) },
      },
    } as unknown as Vue.Ref<{ [K: string]: Vue.ComponentPublicInstance<HTMLElement> }>;
    vi.stubGlobal(`navigator`, { vibrate: vi.fn() });
    main.action.dragInit({ mainId: `main1111111111111`, clientY: 0 });
    expect(main.prop.drag).toEqual({
      status: `start`,
      id: `main1111111111111`,
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
    main.refer.items!.value[`main1111111111111`]!.cloneNode = () => ({ style: {} }) as unknown as Node;
    main.refer.wrap = { value: { appendChild: vi.fn() } } as unknown as Vue.Ref<
      Vue.ComponentPublicInstance<HTMLElement> | undefined
    >;
    main.action.dragStart();
    expect(main.prop.drag.status).toBe(`move`);
    expect(main.refer.wrap.value!.appendChild).toBeCalledTimes(1);
    expect(main.refer.wrap.value!.appendChild).toBeCalledWith({
      style: {
        position: `absolute`,
        zIndex: `1`,
        top: `40px`,
        left: `60px`,
        height: `40px`,
        width: `120px`,
      },
    });
    expect(main.state.status[`main1111111111111`]).toBe(`hide`);
  });
  it(`dragMove`, () => {
    main.refer.items!.value[`main1111111111111`]!.getBoundingClientRect = () =>
      ({ top: 40, left: 60, height: 40, width: 120 }) as DOMRect;
    main.refer.items!.value[`main2222222222222`] = {
      getBoundingClientRect: () => ({ top: 80, left: 60, height: 40, width: 120 }),
    } as Vue.ComponentPublicInstance<HTMLElement>;
    main.prop.drag.clone!.getBoundingClientRect = () => ({ top: 40, height: 40 }) as DOMRect;
    main.action.dragMove({ clientY: 0 });
    expect(main.state.data[`list1111111111111`]!.sort).toEqual([`main1111111111111`, `main2222222222222`]);
    main.prop.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    main.action.dragMove({ clientY: 0 });
    expect(main.state.data[`list1111111111111`]!.sort).toEqual([`main2222222222222`, `main1111111111111`]);
    main.prop.drag.clone!.getBoundingClientRect = () => ({ top: 0, height: 40 }) as DOMRect;
    main.action.dragMove({ clientY: 0 });
    expect(main.state.data[`list1111111111111`]!.sort).toEqual([`main1111111111111`, `main2222222222222`]);
  });
  it(`dragEnd`, () => {
    const removeClassMock = (() => {
      const mock = vi.fn();
      (main.prop.drag.clone!.classList as object) = { remove: mock };
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
      main.prop.drag.clone!.animate = mock;
      return mock;
    })();
    const removeCloneMock = (() => {
      const mock = vi.fn();
      main.prop.drag.clone!.remove = mock;
      return mock;
    })();
    main.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: [`0px`, `40px`] }, 150);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(main.state.status[`main1111111111111`]).toBe(``);
    expect(main.prop.drag).toEqual({});
  });
  it(`dragEnd - extra`, () => {
    main.prop.drag = { status: `end`, id: `main1111111111111` };
    main.action.dragEnd();
    expect(main.prop.drag).toEqual({});
  });
});
