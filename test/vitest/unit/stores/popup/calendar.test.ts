import { vi, beforeEach, afterEach, describe, it, expect, MockInstance } from "vitest";
import * as Vue from "vue";
import fs from "fs";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";

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
  it(`textWeek`, () => {
    expect(calendar.getter.textWeek()).toEqual([`日`, `月`, `火`, `水`, `木`, `金`, `土`]);
  });
  it(`textDay`, () => {
    calendar.state.current = `1999/12`;
    expect(calendar.getter.textDay()[1]).toEqual({
      id: `1999/12`,
      day: [
        { month: `1999/12`, day: `1999/11/28`, text: `28` },
        { month: `1999/12`, day: `1999/11/29`, text: `29` },
        { month: `1999/12`, day: `1999/11/30`, text: `30` },
        { month: `1999/12`, day: `1999/12/01`, text: `1` },
        { month: `1999/12`, day: `1999/12/02`, text: `2` },
        { month: `1999/12`, day: `1999/12/03`, text: `3` },
        { month: `1999/12`, day: `1999/12/04`, text: `4` },
        { month: `1999/12`, day: `1999/12/05`, text: `5` },
        { month: `1999/12`, day: `1999/12/06`, text: `6` },
        { month: `1999/12`, day: `1999/12/07`, text: `7` },
        { month: `1999/12`, day: `1999/12/08`, text: `8` },
        { month: `1999/12`, day: `1999/12/09`, text: `9` },
        { month: `1999/12`, day: `1999/12/10`, text: `10` },
        { month: `1999/12`, day: `1999/12/11`, text: `11` },
        { month: `1999/12`, day: `1999/12/12`, text: `12` },
        { month: `1999/12`, day: `1999/12/13`, text: `13` },
        { month: `1999/12`, day: `1999/12/14`, text: `14` },
        { month: `1999/12`, day: `1999/12/15`, text: `15` },
        { month: `1999/12`, day: `1999/12/16`, text: `16` },
        { month: `1999/12`, day: `1999/12/17`, text: `17` },
        { month: `1999/12`, day: `1999/12/18`, text: `18` },
        { month: `1999/12`, day: `1999/12/19`, text: `19` },
        { month: `1999/12`, day: `1999/12/20`, text: `20` },
        { month: `1999/12`, day: `1999/12/21`, text: `21` },
        { month: `1999/12`, day: `1999/12/22`, text: `22` },
        { month: `1999/12`, day: `1999/12/23`, text: `23` },
        { month: `1999/12`, day: `1999/12/24`, text: `24` },
        { month: `1999/12`, day: `1999/12/25`, text: `25` },
        { month: `1999/12`, day: `1999/12/26`, text: `26` },
        { month: `1999/12`, day: `1999/12/27`, text: `27` },
        { month: `1999/12`, day: `1999/12/28`, text: `28` },
        { month: `1999/12`, day: `1999/12/29`, text: `29` },
        { month: `1999/12`, day: `1999/12/30`, text: `30` },
        { month: `1999/12`, day: `1999/12/31`, text: `31` },
      ],
    });
  });
  it(`classDay`, () => {
    vi.setSystemTime(new Date(1999, 11, 31, 0, 0, 0, 0));
    calendar.state.select = `1999/12/31`;
    expect(calendar.getter.classDay(`1999/12`, `1999/12/31`)).toEqual({ select: true, today: true, hide: false });
    expect(calendar.getter.classDay(`1999/12`, `1999/11/30`)).toEqual({ select: false, today: false, hide: true });
  });
});

describe(`action`, () => {
  it(`open`, () => {
    const option = {
      select: `1999/12/31`,
      current: `1999/12`,
      cancel: `cancel`,
      clear: `clear`,
      callback: () => ``,
    };
    calendar.action.open(option);
    expect(calendar.state).toEqual({ open: true, ...option });
  });
  it(`close`, () => {
    calendar.action.close();
    expect(calendar.state.open).toBe(false);
  });
  it(`pageMove`, () => {
    calendar.state.current = `1999/12`;
    calendar.refer.area! = {
      value: {
        classList: { add: vi.fn(), remove: vi.fn() },
        addEventListener: vi.fn((_mode: string, listener: () => void) => {
          listener();
        }),
        removeEventListener: vi.fn(),
      },
    } as unknown as Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    calendar.action.pageMove({ prev: true });
    expect(calendar.refer.area.value!.classList.add).toBeCalledTimes(1);
    expect(calendar.refer.area.value!.classList.add).toBeCalledWith(`prev`);
    expect(calendar.refer.area.value!.addEventListener).toBeCalledTimes(1);
    expect((calendar.refer.area.value!.addEventListener as unknown as MockInstance).mock.calls[0]![0]).toBe(
      `transitionend`,
    );
    expect(calendar.refer.area.value!.removeEventListener).toBeCalledTimes(1);
    expect((calendar.refer.area.value!.removeEventListener as unknown as MockInstance).mock.calls[0]![0]).toBe(
      `transitionend`,
    );
    expect(calendar.refer.area.value!.classList.remove).toBeCalledTimes(1);
    expect(calendar.refer.area.value!.classList.remove).toBeCalledWith(`prev`);
    expect(calendar.state.current).toBe(`1999/11`);
    calendar.action.pageMove({ prev: false });
    expect(calendar.refer.area.value!.classList.add).toBeCalledTimes(2);
    expect(calendar.refer.area.value!.classList.add).toBeCalledWith(`next`);
    expect(calendar.refer.area.value!.addEventListener).toBeCalledTimes(2);
    expect((calendar.refer.area.value!.addEventListener as unknown as MockInstance).mock.calls[0]![0]).toBe(
      `transitionend`,
    );
    expect(calendar.refer.area.value!.removeEventListener).toBeCalledTimes(2);
    expect((calendar.refer.area.value!.removeEventListener as unknown as MockInstance).mock.calls[0]![0]).toBe(
      `transitionend`,
    );
    expect(calendar.refer.area.value!.classList.remove).toBeCalledTimes(2);
    expect(calendar.refer.area.value!.classList.remove).toBeCalledWith(`next`);
    expect(calendar.state.current).toBe(`1999/12`);
  });
  it(`swipeInit`, () => {
    calendar.refer.body = {
      value: { parentElement: { getBoundingClientRect: () => ({ left: 40 }) } },
    } as unknown as Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    const target = { style: {}, getBoundingClientRect: () => ({ left: 60 }) } as unknown as HTMLElement;
    calendar.action.swipeInit({ target, clientX: 0, clientY: 0 });
    expect(calendar.prop.swipe).toEqual({ status: `start`, target, x: 0, y: 0, left: 20 });
  });
  it(`swipeStart`, () => {
    calendar.action.swipeStart({ clientX: 20, clientY: 0 });
    expect(calendar.prop.swipe.status).toBe(`move`);
  });
  it(`swipeMove`, () => {
    calendar.action.swipeMove({ clientX: 100 });
    expect(calendar.prop.swipe.target!.style.transform).toBe(`translateX(120px)`);
  });
  it(`swipeEnd`, () => {
    const addClassMock = vi.fn();
    const removeClassMock = vi.fn();
    const addListenerMock = vi.fn((_mode: string, listener: () => void) => {
      listener();
    });
    const removeListenerMock = vi.fn();
    (calendar.prop.swipe.target as unknown as { [K in string]: object }).classList = {
      add: addClassMock,
      remove: removeClassMock,
    };
    (calendar.prop.swipe.target as unknown as { [K in string]: object }).addEventListener = addListenerMock;
    (calendar.prop.swipe.target as unknown as { [K in string]: object }).removeEventListener = removeListenerMock;
    calendar.action.swipeEnd({ clientX: 0 });
    expect(addClassMock).toBeCalledTimes(1);
    expect(addClassMock).toBeCalledWith(`back`);
    expect(addListenerMock).toBeCalledTimes(1);
    expect(addListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeListenerMock).toBeCalledTimes(1);
    expect(removeListenerMock.mock.calls[0]![0]).toBe(`transitionend`);
    expect(removeClassMock).toBeCalledTimes(1);
    expect(removeClassMock).toBeCalledWith(`back`);
    expect(calendar.prop.swipe).toEqual({});
  });
  it(`swipeStart - extra`, () => {
    calendar.prop.swipe = { status: `start`, x: 0, y: 0 };
    calendar.action.swipeStart({ clientX: 0, clientY: 20 });
    expect(calendar.prop.swipe).toEqual({});
  });
  it(`swipeEnd - extra`, () => {
    calendar.prop.swipe = { status: `move`, x: 0, y: 0, target: { style: {} } as unknown as HTMLElement };
    vi.spyOn(calendar.action, `pageMove`).mockReturnValue();
    calendar.action.swipeEnd({ clientX: 100 });
    expect(calendar.action.pageMove).toBeCalledTimes(1);
    expect(calendar.action.pageMove).toBeCalledWith({ prev: true });
    expect(calendar.prop.swipe).toEqual({});
    calendar.prop.swipe = { status: `move`, x: 0, y: 0, target: { style: {} } as unknown as HTMLElement };
    vi.spyOn(calendar.action, `pageMove`).mockReturnValue();
    calendar.action.swipeEnd({ clientX: -100 });
    expect(calendar.action.pageMove).toBeCalledTimes(1);
    expect(calendar.action.pageMove).toBeCalledWith({ prev: false });
    expect(calendar.prop.swipe).toEqual({});
    calendar.prop.swipe = { status: `end` };
    calendar.action.swipeEnd({ clientX: 0 });
    expect(calendar.prop.swipe).toEqual({});
  });
});
