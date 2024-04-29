import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputRadio from "@/components/input/radio.vue";

describe(`dom`, () => {
  it(`default`, () => {
    const wrapper = mount(InputRadio);
    expect(wrapper.findByTestId<HTMLInputElement>(`InputRadio`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`InputRadioLabel`).text()).toBe(``);
  });
  it(`slot`, () => {
    const wrapper = mount(InputRadio, { slots: { default: `InputRadio` } });
    expect(wrapper.findByTestId<HTMLInputElement>(`InputRadio`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`InputRadioLabel`).text()).toBe(`InputRadio`);
  });
  it(`value`, () => {
    let wrapper = mount(InputRadio, { props: { value: `on`, modelValue: `on` } });
    expect(wrapper.findByTestId<HTMLInputElement>(`InputRadio`).element.checked).toBe(true);
    expect(wrapper.findByTestId(`InputRadioLabel`).text()).toBe(``);
    wrapper = mount(InputRadio, { props: { value: `on`, modelValue: `off` } });
    expect(wrapper.findByTestId<HTMLInputElement>(`InputRadio`).element.checked).toBe(false);
  });
});
