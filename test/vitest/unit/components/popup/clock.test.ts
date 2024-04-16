import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/popup/clock";
import clock from "@/stores/popup/clock";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setAction();
    fixture.setRouter();
    await fixture.loadLang();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ClockHour`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`ClockMinute`)).toHaveLength(1);
  });
  it(`footer`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ClockCancel`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ClockCancel`).text()).toBe(`cancel`);
    expect(wrapper.findByTestIdAll(`ClockClear`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ClockClear`).text()).toBe(`clear`);
    expect(wrapper.findByTestIdAll(`ClockOk`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ClockOk`).text()).toBe(`ok`);
  });
});

describe(`event`, () => {
  it(`contents`, ({ wrapper }) => {
    wrapper.findByTestId(`ClockHour`).trigger(`mousedown`, { touches: [{ pageX: 0, pageY: 0 }] });
    wrapper.findByTestId(`ClockHour`).trigger(`mousemove`, { touches: [{ pageX: 0, pageY: 0 }] });
    wrapper.findByTestId(`ClockHour`).trigger(`touchstart`, { touches: [{ pageX: 0, pageY: 0 }] });
    wrapper.findByTestId(`ClockHour`).trigger(`touchmove`, { touches: [{ pageX: 0, pageY: 0 }] });
    expect(wrapper.emitted(`inputHour`)).toHaveLength(4);
    expect((wrapper.emitted(`inputHour`)![0]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputHour`)![0]![0] as { [K in string]: number }).pageY).toBe(0);
    expect((wrapper.emitted(`inputHour`)![1]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputHour`)![1]![0] as { [K in string]: number }).pageY).toBe(0);
    expect((wrapper.emitted(`inputHour`)![2]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputHour`)![2]![0] as { [K in string]: number }).pageY).toBe(0);
    expect((wrapper.emitted(`inputHour`)![3]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputHour`)![3]![0] as { [K in string]: number }).pageY).toBe(0);
    wrapper.findByTestId(`ClockMinute`).trigger(`mousedown`, { touches: [{ pageX: 0, pageY: 0 }] });
    wrapper.findByTestId(`ClockMinute`).trigger(`mousemove`, { touches: [{ pageX: 0, pageY: 0 }] });
    wrapper.findByTestId(`ClockMinute`).trigger(`touchstart`, { touches: [{ pageX: 0, pageY: 0 }] });
    wrapper.findByTestId(`ClockMinute`).trigger(`touchmove`, { touches: [{ pageX: 0, pageY: 0 }] });
    expect(wrapper.emitted(`inputMinute`)).toHaveLength(4);
    expect((wrapper.emitted(`inputMinute`)![0]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![0]![0] as { [K in string]: number }).pageY).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![1]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![1]![0] as { [K in string]: number }).pageY).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![2]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![2]![0] as { [K in string]: number }).pageY).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![3]![0] as { [K in string]: number }).pageX).toBe(0);
    expect((wrapper.emitted(`inputMinute`)![3]![0] as { [K in string]: number }).pageY).toBe(0);
  });
  it(`footer`, ({ wrapper }) => {
    wrapper.findByTestId(`ClockCancel`).trigger(`click`);
    expect(wrapper.emitted(`close`)).toHaveLength(1);
    wrapper.findByTestId(`ClockClear`).trigger(`click`);
    expect(clock.state.callback).toBeCalledTimes(1);
    expect(clock.state.callback).toBeCalledWith();
    wrapper.findByTestId(`ClockOk`).trigger(`click`);
    expect(clock.state.callback).toBeCalledTimes(2);
    expect(clock.state.callback).toBeCalledWith(0, 0);
  });
});
