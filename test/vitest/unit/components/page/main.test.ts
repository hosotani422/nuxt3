import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/main";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    await fixture.init();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainList`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`MainTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`MainTitle`).element.value).toBe(`list1`);
    expect(wrapper.findByTestId(`MainTitle`).attributes(`placeholder`)).toBe(`リスト`);
    expect(wrapper.findByTestIdAll(`MainConf`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`MainPlus`)).toHaveLength(1);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainItem`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`MainItem`)[0]!.classes()).toContain(`select`);
    expect(wrapper.findByTestIdAll(`MainItem`)[0]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll(`MainItem`)[0]!.classes()).not.toContain(`hide`);
    expect(wrapper.findByTestIdAll(`MainItem`)[1]!.classes()).not.toContain(`select`);
    expect(wrapper.findByTestIdAll(`MainItem`)[1]!.classes()).toContain(`edit`);
    expect(wrapper.findByTestIdAll(`MainItem`)[1]!.classes()).toContain(`hide`);
    expect(wrapper.findByTestIdAll(`MainCheck`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`MainCheck`)[0]!.element.checked).toBe(false);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`MainCheck`)[1]!.element.checked).toBe(true);
    expect(wrapper.findByTestIdAll(`MainTask`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`MainTask`)[0]!.text()).toBe(`main1`);
    expect(wrapper.findByTestIdAll(`MainTask`)[1]!.text()).toBe(`main2`);
    expect(wrapper.findByTestIdAll(`MainCount`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`MainCount`)[0]!.text()).toBe(`1/1`);
    expect(wrapper.findByTestIdAll(`MainCount`)[1]!.text()).toBe(`1/2`);
    expect(wrapper.findByTestIdAll(`MainClone`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`MainMove`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`MainTrash`)).toHaveLength(2);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`MainRoot`).trigger(`touchmove`, { changedTouches: [{ clientY: 1 }] });
    wrapper.findByTestId(`MainRoot`).trigger(`mousemove`, { clientY: 2 });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(2);
    expect(wrapper.emitted(`dragStart`)).toEqual([[], []]);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toEqual([[{ y: 1 }], [{ y: 2 }]]);
    wrapper.findByTestId(`MainRoot`).trigger(`touchend`);
    wrapper.findByTestId(`MainRoot`).trigger(`mouseup`);
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`dragEnd`)).toEqual([[], []]);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`MainList`).trigger(`click`);
    expect(wrapper.emitted(`routerList`)).toHaveLength(1);
    expect(wrapper.emitted(`routerList`)).toEqual([[]]);
    wrapper.findByTestId(`MainConf`).trigger(`click`);
    expect(wrapper.emitted(`routerConf`)).toHaveLength(1);
    expect(wrapper.emitted(`routerConf`)).toEqual([[]]);
    wrapper.findByTestId(`MainPlus`).trigger(`click`);
    expect(wrapper.emitted(`entryItem`)).toHaveLength(1);
    expect(wrapper.emitted(`entryItem`)).toEqual([[]]);
  });
  it(`contents`, ({ wrapper }) => {
    wrapper.findByTestId(`MainRoot`).trigger(`click`);
    wrapper.findByTestIdAll(`MainItem`)[0]!.trigger(`longtouch`, { detail: { changedTouches: [{ clientY: 1 }] } });
    wrapper.findByTestIdAll(`MainItem`)[1]!.trigger(`longclick`, { detail: { clientY: 2 } });
    expect(wrapper.emitted(`editItem`)).toHaveLength(3);
    expect(wrapper.emitted(`editItem`)).toEqual([
      [],
      [{ mainId: `main1111111111111` }],
      [{ mainId: `main2222222222222` }],
    ]);
    expect(wrapper.emitted(`dragInit`)).toHaveLength(2);
    expect(wrapper.emitted(`dragInit`)).toEqual([
      [{ mainId: `main1111111111111`, y: 1 }],
      [{ mainId: `main2222222222222`, y: 2 }],
    ]);
    wrapper.findByTestIdAll(`MainItem`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`routerSub`)).toHaveLength(1);
    expect(wrapper.emitted(`routerSub`)).toEqual([[{ mainId: `main1111111111111` }]]);
    wrapper.findByTestId(`MainClone`).trigger(`click`);
    expect(wrapper.emitted(`copyItem`)).toHaveLength(1);
    expect(wrapper.emitted(`copyItem`)).toEqual([[{ mainId: `main1111111111111` }]]);
    wrapper.findByTestId(`MainMove`).trigger(`click`);
    expect(wrapper.emitted(`moveItem`)).toHaveLength(1);
    expect(wrapper.emitted(`moveItem`)).toEqual([[{ mainId: `main1111111111111` }]]);
    wrapper.findByTestId(`MainTrash`).trigger(`click`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(1);
    expect(wrapper.emitted(`deleteItem`)).toEqual([[{ mainId: `main1111111111111` }]]);
  });
});
