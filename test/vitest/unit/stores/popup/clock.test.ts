import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import Vue from "vue";
import clock from "@/stores/popup/clock";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  fixture.loadLang();
  fixture.loadData();
  fixture.setRouter();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe(`action`, () => {
  it(`open`, async () => {
    const option = { hour: 23, minute: 59, cancel: `cancel`, clear: `clear`, ok: `ok`, callback: () => `` };
    clock.refer.hour = { value: 23 } as unknown as Vue.Ref<Vue.ComponentPublicInstance<HTMLCanvasElement> | undefined>;
    clock.refer.minute = { value: 59 } as unknown as Vue.Ref<
      Vue.ComponentPublicInstance<HTMLCanvasElement> | undefined
    >;
    vi.spyOn(clock.action, `drawHour`).mockReturnValue();
    vi.spyOn(clock.action, `drawMinute`).mockReturnValue();
    await clock.action.open(option);
    expect(clock.state).toEqual({ open: true, ...option });
    expect(clock.action.drawHour).toBeCalledTimes(1);
    expect(clock.action.drawHour).toBeCalledWith({ target: 23 });
    expect(clock.action.drawMinute).toBeCalledTimes(1);
    expect(clock.action.drawMinute).toBeCalledWith({ target: 59 });
  });
  it(`close`, () => {
    clock.action.close();
    expect(clock.state.open).toBe(false);
  });
  it(`inputHour`, () => {
    const target = { getBoundingClientRect: () => ({ top: 80, left: 80, height: 240 }) } as HTMLElement;
    vi.spyOn(clock.action, `drawHour`).mockReturnValue();
    clock.action.inputHour({ target, pageX: 240, pageY: 120 });
    expect(clock.state.hour).toBe(1);
    expect(clock.action.drawHour).toBeCalledTimes(1);
    expect(clock.action.drawHour).toBeCalledWith({ target });
  });
  it(`inputMinute`, () => {
    const target = { getBoundingClientRect: () => ({ top: 330, left: 77, height: 233 }) } as HTMLElement;
    vi.spyOn(clock.action, `drawMinute`).mockReturnValue();
    clock.action.inputMinute({ target, pageX: 240, pageY: 360 });
    expect(clock.state.minute).toBe(5);
    expect(clock.action.drawMinute).toBeCalledTimes(1);
    expect(clock.action.drawMinute).toBeCalledWith({ target });
  });
  it(`drawHour`, () => {
    const contextCanvas = vi.fn();
    const contextTranslate = vi.fn();
    const contextRotate = vi.fn();
    const target = {
      getContext: () => ({
        canvas: { setAttribute: contextCanvas },
        translate: contextTranslate,
        rotate: contextRotate,
      }),
      getBoundingClientRect: () => ({ height: 100 }),
    } as unknown as HTMLCanvasElement;
    vi.spyOn(clock.action, `drawCircle`).mockReturnValue();
    vi.spyOn(clock.action, `drawLine`).mockReturnValue();
    vi.spyOn(clock.action, `drawChar`).mockReturnValue();
    clock.action.drawHour({ target });
    expect(contextCanvas).toBeCalledTimes(2);
    expect(contextCanvas).toBeCalledWith(`width`, `100px`);
    expect(contextCanvas).toBeCalledWith(`height`, `100px`);
    expect(contextTranslate).toBeCalledTimes(1);
    expect(contextTranslate).toBeCalledWith(50, 50);
    expect(clock.action.drawCircle).toBeCalledTimes(3);
    expect(clock.action.drawCircle).toBeCalledWith({
      ctx: target.getContext(`2d`),
      x: 0,
      y: 0,
      half: 50,
      color: `#000000`,
    });
    expect(clock.action.drawCircle).toBeCalledWith({
      ctx: target.getContext(`2d`),
      x: 0,
      y: 0,
      half: 3,
      color: `#1188dd`,
    });
    expect(clock.action.drawCircle).toBeCalledWith({
      ctx: target.getContext(`2d`),
      x: 0,
      y: -41,
      half: 8,
      color: `#1188dd`,
    });
    expect(contextRotate).toBeCalledTimes(2);
    expect(contextRotate).toBeCalledWith(0.5235987755982988);
    expect(contextRotate).toBeCalledWith(-0.5235987755982988);
    expect(clock.action.drawLine).toBeCalledTimes(1);
    expect(clock.action.drawLine).toBeCalledWith({
      ctx: target.getContext(`2d`),
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: -41,
      width: 1,
      color: `#1188dd`,
    });
    expect(clock.action.drawChar).toBeCalledTimes(2);
    expect(clock.action.drawChar).toBeCalledWith({
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ctx: target.getContext(`2d`),
      select: 1,
      size: `1rem`,
      range: 41,
      color: `#ffffff`,
    });
    expect(clock.action.drawChar).toBeCalledWith({
      list: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      ctx: target.getContext(`2d`),
      select: 1,
      size: `0.8rem`,
      range: 26,
      color: `#ffffff`,
    });
  });
  it(`drawMinute`, () => {
    const contextCanvas = vi.fn();
    const contextTranslate = vi.fn();
    const contextRotate = vi.fn();
    const target = {
      getContext: () => ({
        canvas: { setAttribute: contextCanvas },
        translate: contextTranslate,
        rotate: contextRotate,
      }),
      getBoundingClientRect: () => ({ height: 100 }),
    } as unknown as HTMLCanvasElement;
    vi.spyOn(clock.action, `drawCircle`).mockReturnValue();
    vi.spyOn(clock.action, `drawLine`).mockReturnValue();
    vi.spyOn(clock.action, `drawChar`).mockReturnValue();
    clock.action.drawMinute({ target });
    expect(contextCanvas).toBeCalledTimes(2);
    expect(contextCanvas).toBeCalledWith(`width`, `100px`);
    expect(contextCanvas).toBeCalledWith(`height`, `100px`);
    expect(contextTranslate).toBeCalledTimes(1);
    expect(contextTranslate).toBeCalledWith(50, 50);
    expect(clock.action.drawCircle).toBeCalledTimes(3);
    expect(clock.action.drawCircle).toBeCalledWith({
      ctx: target.getContext(`2d`),
      x: 0,
      y: 0,
      half: 50,
      color: `#000000`,
    });
    expect(clock.action.drawCircle).toBeCalledWith({
      ctx: target.getContext(`2d`),
      x: 0,
      y: 0,
      half: 3,
      color: `#1188dd`,
    });
    expect(clock.action.drawCircle).toBeCalledWith({
      ctx: target.getContext(`2d`),
      x: 0,
      y: -41,
      half: 8,
      color: `#1188dd`,
    });
    expect(contextRotate).toBeCalledTimes(2);
    expect(contextRotate).toBeCalledWith(0.5235987755982988);
    expect(contextRotate).toBeCalledWith(-0.5235987755982988);
    expect(clock.action.drawLine).toBeCalledTimes(1);
    expect(clock.action.drawLine).toBeCalledWith({
      ctx: target.getContext(`2d`),
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: -41,
      width: 1,
      color: `#1188dd`,
    });
    expect(clock.action.drawChar).toBeCalledTimes(1);
    expect(clock.action.drawChar).toBeCalledWith({
      list: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0],
      ctx: target.getContext(`2d`),
      select: 5,
      size: `1rem`,
      range: 41,
      color: `#ffffff`,
    });
  });
  it(`drawCircle`, () => {
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: ``,
    } as unknown as CanvasRenderingContext2D;
    clock.action.drawCircle({ ctx, x: 0, y: 0, half: 100, color: `#1188dd` });
    expect(ctx.beginPath).toBeCalledTimes(1);
    expect(ctx.arc).toBeCalledTimes(1);
    expect(ctx.arc).toBeCalledWith(0, 0, 100, 0, 6.283185307179586, false);
    expect(ctx.fill).toBeCalledTimes(1);
    expect(ctx.fillStyle).toBe(`#1188dd`);
  });
  it(`drawLine`, () => {
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      lineWidth: 0,
      strokeStyle: ``,
    } as unknown as CanvasRenderingContext2D;
    clock.action.drawLine({ ctx, fromX: 0, fromY: 0, toX: 100, toY: 100, width: 200, color: `#1188dd` });
    expect(ctx.beginPath).toBeCalledTimes(1);
    expect(ctx.moveTo).toBeCalledTimes(1);
    expect(ctx.moveTo).toBeCalledWith(0, 0);
    expect(ctx.lineTo).toBeCalledTimes(1);
    expect(ctx.lineTo).toBeCalledWith(100, 100);
    expect(ctx.stroke).toBeCalledTimes(1);
    expect(ctx.lineWidth).toBe(200);
    expect(ctx.strokeStyle).toBe(`#1188dd`);
  });
  it(`drawChar`, () => {
    const ctx = {
      fillText: vi.fn(),
      font: ``,
      textAlign: ``,
      textBaseline: ``,
      fillStyle: ``,
    } as unknown as CanvasRenderingContext2D;
    clock.action.drawChar({ ctx, list: [1], select: 1, size: `base`, range: 0, color: `#1188dd` });
    expect(ctx.font).toBe(`normal base sans-serif`);
    expect(ctx.textAlign).toBe(`center`);
    expect(ctx.textBaseline).toBe(`middle`);
    expect(ctx.fillStyle).toBe(`#ffffff`);
    expect(ctx.fillText).toBeCalledTimes(1);
    expect(ctx.fillText).toBeCalledWith(`1`, 0, -0);
  });
});
