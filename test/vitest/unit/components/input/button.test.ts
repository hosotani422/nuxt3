import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputButton from "@/components/input/button.vue";

describe(`dom`, () => {
  it(`default`, () => {
    const wrapper = mount(InputButton);
    expect(wrapper.findByTestId(`InputButton`).attributes(`type`)).toBe(`button`);
    expect(wrapper.findByTestId(`InputButton`).attributes(`disabled`)).toBeUndefined();
    expect(wrapper.findByTestId(`InputButton`).text()).toBe(`button`);
  });
  it(`type:button`, () => {
    const wrapper = mount(InputButton, { props: { type: `button` } });
    expect(wrapper.findByTestId(`InputButton`).attributes(`type`)).toBe(`button`);
    expect(wrapper.findByTestId(`InputButton`).attributes(`disabled`)).toBeUndefined();
    expect(wrapper.findByTestId(`InputButton`).text()).toBe(`button`);
  });
  it(`type:reset`, () => {
    const wrapper = mount(InputButton, { props: { type: `reset` } });
    expect(wrapper.findByTestId(`InputButton`).attributes(`type`)).toBe(`reset`);
    expect(wrapper.findByTestId(`InputButton`).attributes(`disabled`)).toBeUndefined();
    expect(wrapper.findByTestId(`InputButton`).text()).toBe(`button`);
  });
  it(`type:submit`, () => {
    const wrapper = mount(InputButton, { props: { type: `submit` } });
    expect(wrapper.findByTestId(`InputButton`).attributes(`type`)).toBe(`submit`);
    expect(wrapper.findByTestId(`InputButton`).attributes(`disabled`)).toBeUndefined();
    expect(wrapper.findByTestId(`InputButton`).text()).toBe(`button`);
  });
  it(`disabled`, () => {
    const wrapper = mount(InputButton, { props: { type: `button`, disabled: true } });
    expect(wrapper.findByTestId(`InputButton`).attributes(`type`)).toBe(`button`);
    expect(wrapper.findByTestId(`InputButton`).attributes(`disabled`)).toBe(``);
    expect(wrapper.findByTestId(`InputButton`).text()).toBe(`button`);
  });
  it(`slot`, () => {
    const wrapper = mount(InputButton, { slots: { default: `InputButton` } });
    expect(wrapper.findByTestId(`InputButton`).attributes(`type`)).toBe(`button`);
    expect(wrapper.findByTestId(`InputButton`).attributes(`disabled`)).toBeUndefined();
    expect(wrapper.findByTestId(`InputButton`).text()).toBe(`InputButton`);
  });
});
