import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/popup/notice";
import notice from "@/stores/popup/notice";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`all`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`NoticeMessage`)).toHaveLength(1);
    expect(wrapper.findByTestId(`NoticeMessage`).text()).toBe(`message`);
    expect(wrapper.findByTestIdAll(`NoticeBack`)).toHaveLength(1);
    expect(wrapper.findByTestId(`NoticeBack`).text()).toBe(`button`);
  });
});

describe(`event`, () => {
  it(`all`, ({ wrapper }) => {
    const callbackMock = vi.spyOn(notice.temp, `callback`).mockReturnValue();
    wrapper.findByTestId(`NoticeBack`).trigger(`click`);
    expect(callbackMock).toBeCalledTimes(1);
    expect(callbackMock).toBeCalledWith();
  });
});
