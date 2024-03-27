import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/app";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setI18n();
    fixture.setRouter();
    await fixture.loadData();
    await use(await fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`root`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`AppRoot`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppRoot`).classes()).toContain(`light`);
    expect(wrapper.findByTestId(`AppRoot`).classes()).toContain(`speed2`);
    expect(wrapper.findByTestId(`AppRoot`).classes()).toContain(`text-base`);
  });
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`AppTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppTitle`).text()).toBe(`Memotea`);
    expect(wrapper.findByTestIdAll(`AppViewport`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppViewport`).attributes(`name`)).toBe(`viewport`);
    expect(wrapper.findByTestId(`AppViewport`).attributes(`content`)).toBe(`width=device-width, initial-scale=1`);
    expect(wrapper.findByTestIdAll(`AppDescription`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppDescription`).attributes(`name`)).toBe(`description`);
    expect(wrapper.findByTestId(`AppDescription`).attributes(`content`)).toBe(`メモ帳、TODOアプリ`);
    expect(wrapper.findByTestIdAll(`AppIcon`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppIcon`).attributes(`rel`)).toBe(`icon`);
    expect(wrapper.findByTestId(`AppIcon`).attributes(`href`)).toBe(`/favicon.png`);
    expect(wrapper.findByTestIdAll(`AppNoScript`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppNoScript`).text()).toBe(`JavaScript is required`);
  });
  it(`footer`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`AppFoot`)).toHaveLength(0);
  });
});
