import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputCheck from "@/components/input/check.vue";

describe(`dom`, () => {
  it(`default`, () => {
    const wrapper = mount(InputCheck);
    expect(wrapper.findByTestId<HTMLInputElement>(`InputCheck`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`InputCheckLabel`).text()).toBe(``);
  });
  it(`slot`, () => {
    const wrapper = mount(InputCheck, { slots: { default: `InputCheck` } });
    expect(wrapper.findByTestId<HTMLInputElement>(`InputCheck`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`InputCheckLabel`).text()).toBe(`InputCheck`);
  });
  it(`value`, () => {
    const wrapper = mount(InputCheck, { props: { modelValue: true } });
    expect(wrapper.findByTestId<HTMLInputElement>(`InputCheck`).element.checked).toBe(true);
    expect(wrapper.findByTestId(`InputCheckLabel`).text()).toBe(``);
    wrapper.findByTestId<HTMLInputElement>(`InputCheck`).setValue(false);
    expect(wrapper.findByTestId<HTMLInputElement>(`InputCheck`).element.checked).toBe(false);
  });
});
