import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/popup/dialog";
import dialog from "@/stores/popup/dialog";

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
    expect(wrapper.findByTestId(`DialogCheckAll`).element.parentElement?.textContent).toBe(`全選択`);
    expect(wrapper.findByTestId<HTMLInputElement>(`DialogCheckAll`).element.checked).toBe(false);
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
});

describe(`event`, () => {
  it(`all`, async ({ wrapper }) => {
    vi.spyOn(dialog.state.callback, `cancel`).mockReturnValue();
    vi.spyOn(dialog.state.callback, `ok`).mockReturnValue();
    await (dialog.state.mode = `check`);
    wrapper.findByTestId(`DialogCheckAll`).trigger(`change`);
    expect(wrapper.emitted(`clickCheckAll`)).toHaveLength(1);
    expect(wrapper.emitted(`clickCheckAll`)).toEqual([[{ checked: false }]]);
    wrapper.findByTestId(`DialogCancel`).trigger(`click`);
    expect(dialog.state.callback.cancel).toBeCalledTimes(1);
    wrapper.findByTestId(`DialogOk`).trigger(`click`);
    expect(dialog.state.callback.ok).toBeCalledTimes(1);
  });
});
