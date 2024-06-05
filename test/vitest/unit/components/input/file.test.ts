import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputFile from "@/components/input/file.vue";

describe(`dom`, () => {
  it(`default`, () => {
    const wrapper = mount(InputFile);
    expect(wrapper.findByTestId(`InputFileButton`).text()).toBe(`file`);
  });
  it(`slot`, () => {
    const wrapper = mount(InputFile, { slots: { default: `ファイル選択` } });
    expect(wrapper.findByTestId(`InputFileButton`).text()).toBe(`ファイル選択`);
  });
});
