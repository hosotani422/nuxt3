import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import Api from "@/api/api";
import Util from "@/utils/base/util";
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
    const readMock = vi.spyOn(Api, `readMain`).mockResolvedValue({
      list1111111111111: {
        sort: [`main1111111111111`],
        data: {
          main1111111111111: {
            check: false,
            title: `main1`,
            date: `2000/01/01`,
            time: `00:00`,
            alarm: [`2`, `6`],
            task: true,
          },
        },
      },
    });
    const writeMock = vi.spyOn(Api, `writeMain`).mockReturnValue();
    await main.action.init();
    expect(readMock).toBeCalledTimes(1);
    expect(readMock).toBeCalledWith();
    main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.title = `main2`;
    expect(writeMock).toBeCalledTimes(1);
    expect(writeMock).toBeCalledWith({
      list1111111111111: {
        sort: [`main1111111111111`],
        data: {
          main1111111111111: {
            check: false,
            title: `main2`,
            date: `2000/01/01`,
            time: `00:00`,
            alarm: [`2`, `6`],
            task: true,
          },
        },
      },
    });
  });
  it(`getFull`, () => {
    expect(main.action.getFull()).toEqual({
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
    expect(main.action.getFull({ listId: `list0000000000000` })).toEqual({ sort: [], data: {} });
    main.state.data = {};
    expect(main.action.getFull()).toEqual({ sort: [], data: {} });
  });
  it(`getUnit`, () => {
    expect(main.action.getUnit()).toEqual({
      check: false,
      title: `main1`,
      date: `2000/01/01`,
      time: `00:00`,
      alarm: [`2`, `6`],
      task: true,
    });
    expect(main.action.getUnit({ listId: `list1111111111111` })).toEqual({
      check: false,
      title: `main1`,
      date: `2000/01/01`,
      time: `00:00`,
      alarm: [`2`, `6`],
      task: true,
    });
    expect(main.action.getUnit({ mainId: `main2222222222222` })).toEqual({
      check: true,
      title: `main2`,
      date: ``,
      time: ``,
      alarm: [],
      task: true,
    });
    expect(main.action.getUnit({ listId: `list1111111111111`, mainId: `main2222222222222` })).toEqual({
      check: true,
      title: `main2`,
      date: ``,
      time: ``,
      alarm: [],
      task: true,
    });
  });
  it(`entryItem`, () => {
    vi.setSystemTime(new Date(9465660000000));
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    main.action.entryItem();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`text`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`新規登録`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.text!.value).toBe(``);
    expect(openMock.mock.calls[0]![0]!.text!.placeholder).toBe(`タスク`);
    expect(openMock.mock.calls[0]![0]!.text!.error).toBe(``);
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.text!.value = `main3`;
    dialog.temp.callback.ok!();
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main9465660000000`, `main1111111111111`, `main2222222222222`],
      data: {
        main9465660000000: { check: false, title: `main3`, date: ``, time: ``, alarm: [], task: true },
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
    expect(sub.state.data[`list1111111111111`]!.data[`main9465660000000`]).toEqual({
      sort: [`sub9465660000000`],
      data: { sub9465660000000: { check: false, title: `` } },
    });
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
    dialog.temp.callback.cancel!();
    expect(closeMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledWith();
  });
  it(`copyItem`, () => {
    vi.setSystemTime(new Date(9465660000000));
    main.action.copyItem({ mainId: `main1111111111111` });
    expect(main.state.data[`list1111111111111`]).toEqual({
      sort: [`main1111111111111`, `main9465660000000`, `main2222222222222`],
      data: {
        main1111111111111: {
          check: false,
          title: `main1`,
          date: `2000/01/01`,
          time: `00:00`,
          alarm: [`2`, `6`],
          task: true,
        },
        main9465660000000: {
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
    expect(sub.state.data[`list1111111111111`]!.data[`main9465660000000`]).toEqual({
      sort: [`sub1111111111111`, `sub2222222222222`],
      data: { sub1111111111111: { check: false, title: `sub1` }, sub2222222222222: { check: true, title: `sub2` } },
    });
    expect(main.state.status[`main1111111111111`]).toBeUndefined();
  });
  it(`moveItem`, () => {
    const openMock = vi.spyOn(dialog.action, `open`);
    const closeMock = vi.spyOn(dialog.action, `close`).mockReturnValue();
    main.action.moveItem({ mainId: `main2222222222222` });
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.mode).toBe(`radio`);
    expect(openMock.mock.calls[0]![0]!.title).toBe(`移動先の選択`);
    expect(openMock.mock.calls[0]![0]!.message).toBe(``);
    expect(openMock.mock.calls[0]![0]!.radio!.none).toBe(false);
    expect(openMock.mock.calls[0]![0]!.radio!.select).toBe(``);
    expect(openMock.mock.calls[0]![0]!.radio!.sort).toEqual([`list0000000000000`, `list9999999999999`]);
    expect(openMock.mock.calls[0]![0]!.radio!.data).toEqual({
      list1111111111111: { title: `list1` },
      list0000000000000: { title: `Inbox` },
      list9999999999999: { title: `Trash` },
    });
    expect(openMock.mock.calls[0]![0]!.ok).toBe(`決定`);
    expect(openMock.mock.calls[0]![0]!.cancel).toBe(`キャンセル`);
    dialog.state.radio.select = `list0000000000000`;
    dialog.temp.callback.ok!();
    expect(main.state.data).toEqual({
      list1111111111111: {
        sort: [`main1111111111111`],
        data: {
          main1111111111111: {
            check: false,
            title: `main1`,
            date: `2000/01/01`,
            time: `00:00`,
            alarm: [`2`, `6`],
            task: true,
          },
        },
      },
      list0000000000000: {
        sort: [`main2222222222222`],
        data: {
          main2222222222222: { check: true, title: `main2`, date: ``, time: ``, alarm: [], task: true },
        },
      },
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
        },
      },
      list0000000000000: { data: { main2222222222222: { sort: [], data: {} } } },
      list9999999999999: { data: {} },
    });
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
    dialog.temp.callback.cancel!();
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
    expect(closeMock).toBeCalledTimes(2);
    expect(closeMock).toBeCalledWith();
  });
  it(`deleteItem`, () => {
    const openMock = vi.spyOn(notice.action, `open`);
    const closeMock = vi.spyOn(notice.action, `close`).mockReturnValue();
    main.action.deleteItem({ mainId: `main2222222222222` });
    expect(main.state.data).toEqual({
      list1111111111111: {
        sort: [`main1111111111111`],
        data: {
          main1111111111111: {
            check: false,
            title: `main1`,
            date: `2000/01/01`,
            time: `00:00`,
            alarm: [`2`, `6`],
            task: true,
          },
        },
      },
      list0000000000000: { sort: [], data: {} },
      list9999999999999: {
        sort: [`main2222222222222`],
        data: {
          main2222222222222: { check: true, title: `main2`, date: ``, time: ``, alarm: [], task: true },
        },
      },
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
        },
      },
      list0000000000000: { data: {} },
      list9999999999999: { data: { main2222222222222: { sort: [], data: {} } } },
    });
    expect(main.state.status[`main2222222222222`]).toBeUndefined();
    expect(openMock).toBeCalledTimes(1);
    expect(openMock.mock.calls[0]![0]!.message).toBe(`削除が完了しました`);
    expect(openMock.mock.calls[0]![0]!.button).toBe(`元に戻す`);
    notice.temp.callback();
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
    expect(closeMock).toBeCalledTimes(1);
    expect(closeMock).toBeCalledWith();
  });
  it(`editItem`, () => {
    main.action.editItem({ mainId: `main2222222222222` });
    expect(main.state.status).toEqual({ main2222222222222: `edit` });
    main.action.editItem();
    expect(main.state.status).toEqual({});
  });
  it(`dragInit`, () => {
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue({
      getBoundingClientRect: () => ({ top: 40, left: 60, height: 40, width: 120 }),
    } as HTMLElement);
    const vibrateMock = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate: vibrateMock });
    main.action.dragInit({ mainId: `main1111111111111`, y: 0 });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`MainItemmain1111111111111`);
    expect(main.temp.drag).toEqual({
      status: `start`,
      id: `main1111111111111`,
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
    main.action.dragStart();
    expect(main.temp.drag.status).toBe(`move`);
    expect(getByIdMock).toBeCalledTimes(2);
    expect(getByIdMock).toBeCalledWith(`MainItemmain1111111111111`);
    expect(getByIdMock).toBeCalledWith(`MainBody`);
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
    expect(main.state.status[`main1111111111111`]).toBe(`hide`);
  });
  it(`dragMove`, () => {
    const getByIdMock = vi.spyOn(Util, `getById`).mockImplementation(
      (id: string) =>
        ({
          getBoundingClientRect: () => {
            if (id === `MainItemmain1111111111111`) {
              return { top: 40, height: 40, bottom: 80 };
            } else if (id === `MainItemmain2222222222222`) {
              return { top: 80, height: 40, bottom: 120 };
            }
            return undefined;
          },
        }) as unknown as HTMLElement,
    );
    main.temp.drag.clone!.getBoundingClientRect = () => ({ top: 80, height: 40 }) as DOMRect;
    main.action.dragMove({ y: 0 });
    expect(main.temp.drag.clone!.style.top).toBe(`40px`);
    expect(getByIdMock).toBeCalledTimes(3);
    expect(getByIdMock).toBeCalledWith(`MainItemundefined`);
    expect(getByIdMock).toBeCalledWith(`MainItemmain1111111111111`);
    expect(getByIdMock).toBeCalledWith(`MainItemmain2222222222222`);
    expect(main.state.data[`list1111111111111`]!.sort).toEqual([`main2222222222222`, `main1111111111111`]);
    main.temp.drag.clone!.getBoundingClientRect = () => ({ top: 0, height: 40 }) as DOMRect;
    main.action.dragMove({ y: 0 });
    expect(main.state.data[`list1111111111111`]!.sort).toEqual([`main1111111111111`, `main2222222222222`]);
  });
  it(`dragEnd`, () => {
    const getByIdMock = vi
      .spyOn(Util, `getById`)
      .mockReturnValue({ getBoundingClientRect: () => ({ top: 40 }) } as HTMLElement);
    const removeClassMock = vi.fn();
    const removeCloneMock = vi.fn();
    const addListenerMock = vi.fn((_: string, listener: () => void) => listener());
    const animateMock = vi.fn(() => ({ addEventListener: addListenerMock }));
    (main.temp.drag.clone as unknown as { [K in string]: object }) = {
      classList: { remove: removeClassMock },
      animate: animateMock,
      remove: removeCloneMock,
    };
    main.action.dragEnd();
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`edit`);
    expect(animateMock).toBeCalledTimes(1);
    expect(animateMock).toBeCalledWith({ top: `40px` }, { duration: 250, easing: `ease-in-out` });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`MainItemmain1111111111111`);
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`finish`);
    expect(removeCloneMock).toBeCalledTimes(1);
    expect(removeCloneMock).toBeCalledWith();
    expect(main.state.status[`main1111111111111`]).toBeUndefined();
    expect(main.temp.drag).toEqual({});
  });
  it(`dragEnd - extra`, () => {
    main.temp.drag = { status: `start` };
    main.action.dragEnd();
    expect(main.temp.drag).toEqual({});
  });
});

describe(`getter`, () => {
  it(`classStatus`, () => {
    expect(main.getter.classStatus(`main1111111111111`)).toEqual({ select: true, edit: false, hide: false });
    expect(main.getter.classStatus(`main2222222222222`)).toEqual({ select: false, edit: false, hide: false });
  });
  it(`classLimit`, () => {
    vi.setSystemTime(new Date(1999, 11, 30, 0, 0, 0, 0));
    expect(main.getter.classLimit(`main1111111111111`)).toEqual({
      "text-theme-care": false,
      "text-theme-warn": false,
    });
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    expect(main.getter.classLimit(`main1111111111111`)).toEqual({
      "text-theme-care": true,
      "text-theme-warn": false,
    });
    vi.setSystemTime(new Date(2000, 1, 1, 0, 0, 0, 0));
    expect(main.getter.classLimit(`main1111111111111`)).toEqual({
      "text-theme-care": true,
      "text-theme-warn": true,
    });
  });
  it(`textCount`, () => {
    expect(main.getter.textCount(`main1111111111111`)).toBe(`1/2`);
    expect(main.getter.textCount(`main2222222222222`)).toBe(`0/0`);
  });
});
