import { vi, describe, it, expect } from "vitest";
import Util from "@/utils/base/util";

describe(`util`, () => {
  it(`getById`, () => {
    const queryMock = vi.spyOn(document, `querySelector`).mockReturnValue(`element` as unknown as Element);
    const element = Util.getById(`id`);
    expect(queryMock).toBeCalledTimes(1);
    expect(queryMock).toBeCalledWith(`[data-id='id']`);
    expect(element).toBe(`element`);
  });
  it(`getByIdAll`, () => {
    const queryMock = vi
      .spyOn(document, `querySelectorAll`)
      .mockReturnValue(`element` as unknown as NodeListOf<Element>);
    const element = Util.getByIdAll(`id`);
    expect(queryMock).toBeCalledTimes(1);
    expect(queryMock).toBeCalledWith(`[data-id='id']`);
    expect(element).toBe(`element`);
  });
  it(`isJson`, () => {
    expect(Util.isJson(`{}`)).toBe(true);
    expect(Util.isJson(``)).toBe(false);
    expect(Util.isJson(false)).toBe(false);
  });
});
