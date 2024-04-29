import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputTextbox from "@/components/input/textbox.vue";

describe(`dom`, () => {
  it(`default`, () => {
    const wrapper = mount(InputTextbox);
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextbox`);
    expect(element.attributes(`type`)).toBe(`text`);
    expect(element.element.value).toBe(``);
  });
  it(`type:text`, () => {
    const wrapper = mount(InputTextbox, { props: { type: `text` } });
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextbox`);
    expect(element.attributes(`type`)).toBe(`text`);
    expect(element.element.value).toBe(``);
  });
  it(`type:password`, () => {
    const wrapper = mount(InputTextbox, { props: { type: `password` } });
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextbox`);
    expect(element.attributes(`type`)).toBe(`password`);
    expect(element.element.value).toBe(``);
  });
  it(`value`, () => {
    const wrapper = mount(InputTextbox, { props: { modelValue: `value1` } });
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextbox`);
    expect(element.attributes(`type`)).toBe(`text`);
    expect(element.element.value).toBe(`value1`);
    element.setValue(`value2`);
    expect(element.element.value).toBe(`value2`);
  });
});
