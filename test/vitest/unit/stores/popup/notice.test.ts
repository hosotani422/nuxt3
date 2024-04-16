import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import notice from "@/stores/popup/notice";
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
    const option = {
      message: `message`,
      button: `button`,
      callback: () => ``,
    };
    vi.spyOn(notice.action, `close`).mockReturnValue();
    notice.action.open(option);
    expect(notice.state.open).toBe(true);
    expect(notice.state.message).toBe(`message`);
    expect(notice.state.button).toBe(`button`);
    expect(notice.state.callback).toEqual(option.callback);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    expect(notice.action.close).toBeCalledTimes(1);
  });
  it(`close`, () => {
    notice.action.close();
    expect(notice.state.open).toBe(false);
  });
});
