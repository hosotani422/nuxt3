import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/main";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setRouter();
    await fixture.loadLang();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainList`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`MainConf`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`MainPlus`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`MainTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`MainTitle`).element.value).toBe(`list1`);
    expect(wrapper.findByTestId(`MainTitle`).attributes(`placeholder`)).toBe(`リスト`);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainItem`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`MainItem`)[0]!.classes()).toContain(`edit`);
    expect(wrapper.findByTestIdAll(`MainItem`)[1]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`MainCheck`)[0]!.element.checked).toBe(false);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`MainCheck`)[1]!.element.checked).toBe(true);
    expect(wrapper.findByTestIdAll(`MainTask`)[0]!.text()).toBe(`main1`);
    expect(wrapper.findByTestIdAll(`MainTask`)[1]!.text()).toBe(`main2`);
    expect(wrapper.findByTestIdAll(`MainTask`)[0]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainTask`)[1]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainCount`)[0]!.text()).toBe(`textCount`);
    expect(wrapper.findByTestIdAll(`MainCount`)[1]!.text()).toBe(`textCount`);
    expect(wrapper.findByTestIdAll(`MainCount`)[0]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainCount`)[1]!.classes()).toContain(`classLimit`);
  });
  it(`option`, async ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainClone`)).toHaveLength(1);
    expect(wrapper.findByTestId(`MainClone`).classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainMove`)).toHaveLength(1);
    expect(wrapper.findByTestId(`MainMove`).classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainTrash`)).toHaveLength(1);
    expect(wrapper.findByTestId(`MainTrash`).classes()).toContain(`classLimit`);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`MainRoot`).trigger(`click`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    wrapper.findByTestId(`MainRoot`).trigger(`mousemove`, { clientY: 0 });
    wrapper.findByTestId(`MainRoot`).trigger(`touchmove`, { changedTouches: [{ clientY: 0 }] });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toEqual([[{ clientY: 0 }], [{ clientY: 0 }]]);
    wrapper.findByTestId(`MainRoot`).trigger(`mouseup`);
    wrapper.findByTestId(`MainRoot`).trigger(`touchend`);
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(2);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`MainList`).trigger(`click`);
    expect(wrapper.emitted(`routerList`)).toHaveLength(1);
    wrapper.findByTestId(`MainConf`).trigger(`click`);
    expect(wrapper.emitted(`routerConf`)).toHaveLength(1);
    wrapper.findByTestId(`MainPlus`).trigger(`click`);
    expect(wrapper.emitted(`insertItem`)).toHaveLength(1);
  });
  it(`contents`, ({ wrapper }) => {
    wrapper.findByTestIdAll(`MainItem`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`routerSub`)).toHaveLength(1);
    expect(wrapper.emitted(`routerSub`)).toEqual([[{ mainId: `main1111111111111` }]]);
    wrapper.findByTestId(`MainItem`).trigger(`longclick`, { detail: { clientY: 0 } });
    wrapper.findByTestId(`MainItem`).trigger(`longtouch`, { detail: { changedTouches: [{ clientY: 0 }] } });
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(3);
    expect(wrapper.emitted(`switchEdit`)).toEqual([
      [],
      [{ mainId: `main1111111111111` }],
      [{ mainId: `main1111111111111` }],
    ]);
    expect(wrapper.emitted(`dragInit`)).toHaveLength(2);
    expect(wrapper.emitted(`dragInit`)).toEqual([
      [{ mainId: `main1111111111111`, clientY: 0 }],
      [{ mainId: `main1111111111111`, clientY: 0 }],
    ]);
    wrapper.findByTestIdAll(`MainCheck`)[0]!.trigger(`change`);
    expect(wrapper.emitted(`checkItem`)).toHaveLength(1);
    expect((wrapper.emitted(`checkItem`)![0]![0]! as { [K in string]: string }).mainId).toBe(`main1111111111111`);
    expect((wrapper.emitted(`checkItem`)![0]![0]! as { [K in string]: number }).checked).toBe(false);
  });
  it(`option`, async ({ wrapper }) => {
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
