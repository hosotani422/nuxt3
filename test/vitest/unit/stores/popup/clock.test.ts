import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import Util from "@/utils/base/util";
import conf from "@/stores/page/conf";
import clock from "@/stores/popup/clock";
import fixture from "../../../fixture/base";

beforeEach(async () => {
  await fixture.loadData();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe(`action`, () => {
  it(`open`, async () => {
    const canvasMock = vi.spyOn(clock.action, `drawCanvas`).mockReturnValue();
    await clock.action.open({ time: `23:59`, cancel: `cancel`, clear: `clear`, ok: `ok`, callback: () => `` });
    expect(clock.state.open).toBe(true);
    expect(clock.state.hour).toBe(23);
    expect(clock.state.minute).toBe(59);
    expect(clock.state.cancel).toBe(`cancel`);
    expect(clock.state.clear).toBe(`clear`);
    expect(clock.state.ok).toBe(`ok`);
    expect(canvasMock).toBeCalledTimes(2);
    expect(canvasMock).toBeCalledWith({ mode: `hour` });
    expect(canvasMock).toBeCalledWith({ mode: `minute` });
  });
  it(`close`, () => {
    clock.action.close();
    expect(clock.state.open).toBe(false);
  });
  it(`inputTime`, () => {
    const getByIdMock = vi.spyOn(Util, `getById`).mockImplementation((id: string) => {
      if (id === `ClockHour`) {
        return { getBoundingClientRect: () => ({ top: 80, left: 80, height: 240 }) } as HTMLElement;
      } else if (id === `ClockMinute`) {
        return { getBoundingClientRect: () => ({ top: 330, left: 77, height: 233 }) } as HTMLElement;
      }
      return undefined as unknown as Element;
    });
    const canvasMock = vi.spyOn(clock.action, `drawCanvas`).mockReturnValue();
    clock.action.inputTime({ mode: `hour`, x: 240, y: 120 });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ClockHour`);
    expect(canvasMock).toBeCalledTimes(1);
    expect(canvasMock).toBeCalledWith({ mode: `hour` });
    expect(clock.state.hour).toBe(1);
    clock.action.inputTime({ mode: `minute`, x: 240, y: 360 });
    expect(getByIdMock).toBeCalledTimes(2);
    expect(getByIdMock).toBeCalledWith(`ClockMinute`);
    expect(canvasMock).toBeCalledTimes(2);
    expect(canvasMock).toBeCalledWith({ mode: `minute` });
    expect(clock.state.minute).toBe(5);
  });
  it(`drawCanvas - hour`, () => {
    const attributeMock = vi.fn();
    const translateMock = vi.fn();
    const rotateMock = vi.fn();
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue({
      setAttribute: attributeMock,
      getBoundingClientRect: () => ({ height: 100 }),
      getContext: () => ({ translate: translateMock, rotate: rotateMock }),
    } as unknown as HTMLCanvasElement);
    const circleMock = vi.spyOn(clock.action, `drawCircle`).mockReturnValue();
    const lineMock = vi.spyOn(clock.action, `drawLine`).mockReturnValue();
    const charMock = vi.spyOn(clock.action, `drawChar`).mockReturnValue();
    clock.action.drawCanvas({ mode: `hour` });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ClockHour`);
    expect(attributeMock).toBeCalledTimes(2);
    expect(attributeMock).toBeCalledWith(`width`, `100px`);
    expect(attributeMock).toBeCalledWith(`height`, `100px`);
    expect(translateMock).toBeCalledTimes(1);
    expect(translateMock).toBeCalledWith(50, 50);
    expect(rotateMock).toBeCalledTimes(2);
    expect(rotateMock).toBeCalledWith(0.5235987755982988);
    expect(rotateMock).toBeCalledWith(-0.5235987755982988);
    expect(circleMock).toBeCalledTimes(3);
    expect(circleMock.mock.calls[0]![0]!.x).toBe(0);
    expect(circleMock.mock.calls[0]![0]!.y).toBe(0);
    expect(circleMock.mock.calls[0]![0]!.radius).toBe(50);
    expect(circleMock.mock.calls[0]![0]!.color).toBe(`#000000`);
    expect(circleMock.mock.calls[1]![0]!.x).toBe(0);
    expect(circleMock.mock.calls[1]![0]!.y).toBe(0);
    expect(circleMock.mock.calls[1]![0]!.radius).toBe(3);
    expect(circleMock.mock.calls[1]![0]!.color).toBe(`#1188dd`);
    expect(circleMock.mock.calls[2]![0]!.x).toBe(0);
    expect(circleMock.mock.calls[2]![0]!.y).toBe(-41);
    expect(circleMock.mock.calls[2]![0]!.radius).toBe(20);
    expect(circleMock.mock.calls[2]![0]!.color).toBe(`#1188dd`);
    expect(lineMock).toBeCalledTimes(1);
    expect(lineMock.mock.calls[0]![0]!.from).toEqual({ x: 0, y: 0 });
    expect(lineMock.mock.calls[0]![0]!.to).toEqual({ x: 0, y: -41 });
    expect(lineMock.mock.calls[0]![0]!.width).toBe(1);
    expect(lineMock.mock.calls[0]![0]!.color).toBe(`#1188dd`);
    expect(charMock).toBeCalledTimes(2);
    expect(charMock.mock.calls[0]![0]!.list).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(charMock.mock.calls[0]![0]!.select).toBe(1);
    expect(charMock.mock.calls[0]![0]!.size).toBe(`1rem`);
    expect(charMock.mock.calls[0]![0]!.radius).toBe(41);
    expect(charMock.mock.calls[0]![0]!.color).toBe(`#ffffff`);
    expect(charMock.mock.calls[1]![0]!.list).toEqual([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
    expect(charMock.mock.calls[1]![0]!.select).toBe(1);
    expect(charMock.mock.calls[1]![0]!.size).toBe(`0.8rem`);
    expect(charMock.mock.calls[1]![0]!.radius).toBe(26);
    expect(charMock.mock.calls[1]![0]!.color).toBe(`#ffffff`);
  });
  it(`drawCanvas - minute`, () => {
    const attributeMock = vi.fn();
    const translateMock = vi.fn();
    const rotateMock = vi.fn();
    const getByIdMock = vi.spyOn(Util, `getById`).mockReturnValue({
      setAttribute: attributeMock,
      getBoundingClientRect: () => ({ height: 100 }),
      getContext: () => ({ translate: translateMock, rotate: rotateMock }),
    } as unknown as HTMLCanvasElement);
    const circleMock = vi.spyOn(clock.action, `drawCircle`).mockReturnValue();
    const lineMock = vi.spyOn(clock.action, `drawLine`).mockReturnValue();
    const charMock = vi.spyOn(clock.action, `drawChar`).mockReturnValue();
    clock.action.drawCanvas({ mode: `minute` });
    expect(getByIdMock).toBeCalledTimes(1);
    expect(getByIdMock).toBeCalledWith(`ClockMinute`);
    expect(attributeMock).toBeCalledTimes(2);
    expect(attributeMock).toBeCalledWith(`width`, `100px`);
    expect(attributeMock).toBeCalledWith(`height`, `100px`);
    expect(translateMock).toBeCalledTimes(1);
    expect(translateMock).toBeCalledWith(50, 50);
    expect(rotateMock).toBeCalledTimes(2);
    expect(rotateMock).toBeCalledWith(0.5235987755982988);
    expect(rotateMock).toBeCalledWith(-0.5235987755982988);
    expect(circleMock).toBeCalledTimes(3);
    expect(circleMock.mock.calls[0]![0]!.x).toBe(0);
    expect(circleMock.mock.calls[0]![0]!.y).toBe(0);
    expect(circleMock.mock.calls[0]![0]!.radius).toBe(50);
    expect(circleMock.mock.calls[0]![0]!.color).toBe(`#000000`);
    expect(circleMock.mock.calls[1]![0]!.x).toBe(0);
    expect(circleMock.mock.calls[1]![0]!.y).toBe(0);
    expect(circleMock.mock.calls[1]![0]!.radius).toBe(3);
    expect(circleMock.mock.calls[1]![0]!.color).toBe(`#1188dd`);
    expect(circleMock.mock.calls[2]![0]!.x).toBe(0);
    expect(circleMock.mock.calls[2]![0]!.y).toBe(-41);
    expect(circleMock.mock.calls[2]![0]!.radius).toBe(20);
    expect(circleMock.mock.calls[2]![0]!.color).toBe(`#1188dd`);
    expect(lineMock).toBeCalledTimes(1);
    expect(lineMock.mock.calls[0]![0]!.from).toEqual({ x: 0, y: 0 });
    expect(lineMock.mock.calls[0]![0]!.to).toEqual({ x: 0, y: -41 });
    expect(lineMock.mock.calls[0]![0]!.width).toBe(1);
    expect(lineMock.mock.calls[0]![0]!.color).toBe(`#1188dd`);
    expect(charMock).toBeCalledTimes(1);
    expect(charMock.mock.calls[0]![0]!.list).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    expect(charMock.mock.calls[0]![0]!.select).toBe(5);
    expect(charMock.mock.calls[0]![0]!.size).toBe(`1rem`);
    expect(charMock.mock.calls[0]![0]!.radius).toBe(41);
    expect(charMock.mock.calls[0]![0]!.color).toBe(`#ffffff`);
    conf.state.data.size = 1;
    clock.action.drawCanvas({ mode: `minute` });
    expect(circleMock.mock.calls[5]![0]!.radius).toBe(18);
    conf.state.data.size = 3;
    clock.action.drawCanvas({ mode: `minute` });
    expect(circleMock.mock.calls[8]![0]!.radius).toBe(22);
  });
  it(`drawCircle`, () => {
    const beginMock = vi.fn();
    const arcMock = vi.fn();
    const fillMock = vi.fn();
    const ctx = {
      beginPath: beginMock,
      arc: arcMock,
      fill: fillMock,
      fillStyle: ``,
    } as unknown as CanvasRenderingContext2D;
    clock.action.drawCircle({ ctx, x: 0, y: 0, radius: 100, color: `#1188dd` });
    expect(beginMock).toBeCalledTimes(1);
    expect(beginMock).toBeCalledWith();
    expect(arcMock).toBeCalledTimes(1);
    expect(arcMock).toBeCalledWith(0, 0, 100, 0, 6.283185307179586, false);
    expect(fillMock).toBeCalledTimes(1);
    expect(fillMock).toBeCalledWith();
    expect(ctx.fillStyle).toBe(`#1188dd`);
  });
  it(`drawLine`, () => {
    const beginMock = vi.fn();
    const moveMock = vi.fn();
    const lineMock = vi.fn();
    const strokeMock = vi.fn();
    const ctx = {
      beginPath: beginMock,
      moveTo: moveMock,
      lineTo: lineMock,
      stroke: strokeMock,
      lineWidth: 0,
      strokeStyle: ``,
    } as unknown as CanvasRenderingContext2D;
    clock.action.drawLine({ ctx, from: { x: 0, y: 0 }, to: { x: 100, y: 100 }, width: 200, color: `#1188dd` });
    expect(beginMock).toBeCalledTimes(1);
    expect(beginMock).toBeCalledWith();
    expect(moveMock).toBeCalledTimes(1);
    expect(moveMock).toBeCalledWith(0, 0);
    expect(lineMock).toBeCalledTimes(1);
    expect(lineMock).toBeCalledWith(100, 100);
    expect(strokeMock).toBeCalledTimes(1);
    expect(strokeMock).toBeCalledWith();
    expect(ctx.lineWidth).toBe(200);
    expect(ctx.strokeStyle).toBe(`#1188dd`);
  });
  it(`drawChar`, () => {
    const fillMock = vi.fn();
    const ctx = {
      fillText: fillMock,
      font: ``,
      textAlign: ``,
      textBaseline: ``,
      fillStyle: ``,
    } as unknown as CanvasRenderingContext2D;
    clock.action.drawChar({ ctx, list: [1], select: 1, size: `base`, radius: 0, color: `#1188dd` });
    expect(ctx.font).toBe(`normal base sans-serif`);
    expect(ctx.textAlign).toBe(`center`);
    expect(ctx.textBaseline).toBe(`middle`);
    expect(ctx.fillStyle).toBe(`#ffffff`);
    expect(fillMock).toBeCalledTimes(1);
    expect(fillMock).toBeCalledWith(`1`, -0, -0);
    clock.action.drawChar({ ctx, list: [1], select: 2, size: `base`, radius: 0, color: `#1188dd` });
    expect(ctx.fillStyle).toBe(`#1188dd`);
  });
});
