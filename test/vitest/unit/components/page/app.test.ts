import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/app";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setRouter();
    await fixture.init();
    await fixture.loadData();
    await use(await fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`root`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`AppRoot`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppRoot`).classes()).toContain(`dark`);
    expect(wrapper.findByTestId(`AppRoot`).classes()).toContain(`just`);
    expect(wrapper.findByTestId(`AppRoot`).classes()).toContain(`text-base`);
  });
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`AppTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppTitle`).text()).toBe(`Memosuku`);
    expect(wrapper.findByTestIdAll(`AppCharset`)).toHaveLength(1);
    expect(wrapper.findByTestId(`AppCharset`).attributes(`charset`)).toBe(`utf-8`);
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
});
