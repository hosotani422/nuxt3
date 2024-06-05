import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/popup/dialog";
import dialog from "@/stores/popup/dialog";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    await fixture.init();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`alert`, async ({ wrapper }) => {
    await (dialog.state.mode = `alert`);
    expect(wrapper.findByTestIdAll(`DialogTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogTitle`).text()).toBe(`title`);
    expect(wrapper.findByTestIdAll(`DialogMessage`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogMessage`).text()).toBe(`message`);
    expect(wrapper.findByTestIdAll(`DialogText`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheckAll`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheck`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadioNone`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadio`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCancel`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogCancel`).text()).toBe(`cancel`);
    expect(wrapper.findByTestIdAll(`DialogOk`)).toHaveLength(0);
  });
  it(`confirm`, async ({ wrapper }) => {
    await (dialog.state.mode = `confirm`);
    expect(wrapper.findByTestIdAll(`DialogTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogTitle`).text()).toBe(`title`);
    expect(wrapper.findByTestIdAll(`DialogMessage`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogMessage`).text()).toBe(`message`);
    expect(wrapper.findByTestIdAll(`DialogText`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheckAll`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheck`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadioNone`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadio`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCancel`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogCancel`).text()).toBe(`cancel`);
    expect(wrapper.findByTestIdAll(`DialogOk`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogOk`).text()).toBe(`ok`);
  });
  it(`text`, async ({ wrapper }) => {
    await (dialog.state.mode = `text`);
    expect(wrapper.findByTestIdAll(`DialogTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogTitle`).text()).toBe(`title`);
    expect(wrapper.findByTestIdAll(`DialogMessage`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogMessage`).text()).toBe(`message`);
    expect(wrapper.findByTestIdAll(`DialogText`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`DialogText`).element.value).toBe(`text`);
    expect(wrapper.findByTestId(`DialogText`).attributes(`placeholder`)).toBe(`placeholder`);
    expect(wrapper.findByTestIdAll(`DialogCheckAll`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheck`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadioNone`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadio`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCancel`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogCancel`).text()).toBe(`cancel`);
    expect(wrapper.findByTestIdAll(`DialogOk`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogOk`).text()).toBe(`ok`);
  });
  it(`check`, async ({ wrapper }) => {
    await (dialog.state.mode = `check`);
    expect(wrapper.findByTestIdAll(`DialogTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogTitle`).text()).toBe(`title`);
    expect(wrapper.findByTestIdAll(`DialogMessage`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogMessage`).text()).toBe(`message`);
    expect(wrapper.findByTestIdAll(`DialogText`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheckAll`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`DialogCheckAll`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`DialogCheckAll`).element.parentElement?.textContent).toBe(`全選択`);
    expect(wrapper.findByTestIdAll(`DialogCheck`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`DialogCheck`)[0]!.element.checked).toBe(true);
    expect(wrapper.findByTestIdAll(`DialogCheck`)[0]!.element.parentElement?.textContent).toBe(`check1`);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`DialogCheck`)[1]!.element.checked).toBe(false);
    expect(wrapper.findByTestIdAll(`DialogCheck`)[1]!.element.parentElement?.textContent).toBe(`check2`);
    expect(wrapper.findByTestIdAll(`DialogRadioNone`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadio`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCancel`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogCancel`).text()).toBe(`cancel`);
    expect(wrapper.findByTestIdAll(`DialogOk`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogOk`).text()).toBe(`ok`);
  });
  it(`radio`, async ({ wrapper }) => {
    await (dialog.state.mode = `radio`);
    expect(wrapper.findByTestIdAll(`DialogTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogTitle`).text()).toBe(`title`);
    expect(wrapper.findByTestIdAll(`DialogMessage`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogMessage`).text()).toBe(`message`);
    expect(wrapper.findByTestIdAll(`DialogText`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheckAll`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogCheck`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`DialogRadioNone`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`DialogRadioNone`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`DialogRadioNone`).element.parentElement?.textContent).toBe(`未選択`);
    expect(wrapper.findByTestIdAll(`DialogRadio`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`DialogRadio`)[0]!.element.checked).toBe(true);
    expect(wrapper.findByTestIdAll(`DialogRadio`)[0]!.element.parentElement?.textContent).toBe(`radio1`);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`DialogRadio`)[1]!.element.checked).toBe(false);
    expect(wrapper.findByTestIdAll(`DialogRadio`)[1]!.element.parentElement?.textContent).toBe(`radio2`);
    expect(wrapper.findByTestIdAll(`DialogCancel`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogCancel`).text()).toBe(`cancel`);
    expect(wrapper.findByTestIdAll(`DialogOk`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogOk`).text()).toBe(`ok`);
  });
  it(`error`, async ({ wrapper }) => {
    await (dialog.state.mode = `text`);
    await (dialog.state.init = false);
    await (dialog.state.text.value = ``);
    expect(wrapper.findByTestIdAll(`DialogError`)).toHaveLength(1);
    expect(wrapper.findByTestId(`DialogError`).text()).toBe(`空白以外の文字を１つ以上入力してください。`);
  });
});

describe(`event`, () => {
  it(`text`, async ({ wrapper }) => {
    await (dialog.state.mode = `text`);
    wrapper.findByTestId(`DialogText`).trigger(`input`);
    expect(dialog.state.init).toBe(false);
  });
  it(`check`, async ({ wrapper }) => {
    await (dialog.state.mode = `check`);
    wrapper.findByTestId(`DialogCheckAll`).trigger(`change`);
    expect(wrapper.emitted(`clickCheckAll`)).toHaveLength(1);
    expect(wrapper.emitted(`clickCheckAll`)).toEqual([[{ check: false }]]);
  });
  it(`footer`, async ({ wrapper }) => {
    await (dialog.state.mode = `confirm`);
    const cancelMock = vi.spyOn(dialog.temp.callback, `cancel`).mockReturnValue();
    const okMock = vi.spyOn(dialog.temp.callback, `ok`).mockReturnValue();
    wrapper.findByTestId(`DialogCancel`).trigger(`click`);
    expect(cancelMock).toBeCalledTimes(1);
    expect(cancelMock).toBeCalledWith();
    wrapper.findByTestId(`DialogOk`).trigger(`click`);
    expect(okMock).toBeCalledTimes(1);
    expect(okMock).toBeCalledWith();
  });
});
