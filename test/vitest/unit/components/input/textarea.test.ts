import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputTextArea from "@/components/input/textarea.vue";

describe(`dom`, () => {
  it(`default`, () => {
    const wrapper = mount(InputTextArea);
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextarea`);
    expect((element.element.style as unknown as { [K in string]: string })[`field-sizing`]).toBe(`fixed`);
    expect(element.element.value).toBe(``);
  });
  it(`sizing:fixed`, () => {
    const wrapper = mount(InputTextArea, { props: { sizing: `fixed` } });
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextarea`);
    expect((element.element.style as unknown as { [K in string]: string })[`field-sizing`]).toBe(`fixed`);
    expect(element.element.value).toBe(``);
  });
  it(`sizing:content`, () => {
    const wrapper = mount(InputTextArea, { props: { sizing: `content` } });
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextarea`);
    expect((element.element.style as unknown as { [K in string]: string })[`field-sizing`]).toBe(`content`);
    expect(element.element.value).toBe(``);
  });
  it(`value`, () => {
    const wrapper = mount(InputTextArea, { props: { modelValue: `value1` } });
    const element = wrapper.findByTestId<HTMLInputElement>(`InputTextarea`);
    expect((element.element.style as unknown as { [K in string]: string })[`field-sizing`]).toBe(`fixed`);
    expect(element.element.value).toBe(`value1`);
    element.setValue(`value2`);
    expect(element.element.value).toBe(`value2`);
  });
});
