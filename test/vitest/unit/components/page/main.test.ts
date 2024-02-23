import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/main";
import main from "@/stores/page/main";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setRouter();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainList`).length).toBe(1);
    expect(wrapper.findByTestIdAll(`MainConf`).length).toBe(1);
    expect(wrapper.findByTestIdAll(`MainPlus`).length).toBe(1);
    expect(wrapper.findByTestIdAll(`MainTitle`).length).toBe(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`MainTitle`).element.value).toBe(`list1`);
    expect(wrapper.findByTestId(`MainTitle`).attributes(`placeholder`)).toBe(`リスト`);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainItem`).length).toBe(2);
    expect(wrapper.findByTestIdAll(`MainItem`)[0]!.classes()).toContain(`classItem`);
    expect(wrapper.findByTestIdAll(`MainItem`)[1]!.classes()).toContain(`classItem`);
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
  it(`hidden`, async ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`MainClone`).length).toBe(0);
    expect(wrapper.findByTestIdAll(`MainMove`).length).toBe(0);
    expect(wrapper.findByTestIdAll(`MainTrash`).length).toBe(0);
    await (main.state.status[`main1111111111111`] = `edit`);
    expect(wrapper.findByTestIdAll(`MainClone`).length).toBe(1);
    expect(wrapper.findByTestId(`MainClone`).classes()).to.toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainMove`).length).toBe(1);
    expect(wrapper.findByTestId(`MainMove`).classes()).to.toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`MainTrash`).length).toBe(1);
    expect(wrapper.findByTestId(`MainTrash`).classes()).to.toContain(`classLimit`);
    await (main.state.status[`main1111111111111`] = ``);
  });
});

describe(`event`, () => {
  it(`default`, ({ wrapper }) => {
    wrapper.findByTestId(`MainRoot`).trigger(`click`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    wrapper.findByTestId(`MainList`).trigger(`click`);
    expect(wrapper.emitted(`routerList`)).toHaveLength(1);
    wrapper.findByTestId(`MainConf`).trigger(`click`);
    expect(wrapper.emitted(`routerConf`)).toHaveLength(1);
    wrapper.findByTestId(`MainPlus`).trigger(`click`);
    expect(wrapper.emitted(`insertItem`)).toHaveLength(1);
    wrapper.findByTestId(`MainItem`).trigger(`click`);
    expect(wrapper.emitted(`routerSub`)).toHaveLength(1);
    expect(wrapper.emitted(`routerSub`)![0]).toEqual([{ mainId: `main1111111111111` }]);
    wrapper.findByTestId(`MainItem`).trigger(`longtouch`, { detail: { changedTouches: [{ clientY: 0 }] } });
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(6);
    expect(wrapper.emitted(`switchEdit`)![5]).toEqual([{ mainId: `main1111111111111` }]);
    wrapper.findByTestId(`MainCheck`).trigger(`change`);
    expect(wrapper.emitted(`checkItem`)).toHaveLength(1);
    expect((wrapper.emitted(`checkItem`)![0]![0]! as { [K in string]: string }).mainId).toBe(`main1111111111111`);
    expect((wrapper.emitted(`checkItem`)![0]![0]! as { [K in string]: number }).checked).toBe(false);
  });
  it(`hidden`, async ({ wrapper }) => {
    await (main.state.status[`main1111111111111`] = `edit`);
    wrapper.findByTestId(`MainClone`).trigger(`click`);
    expect(wrapper.emitted(`copyItem`)).toHaveLength(1);
    expect(wrapper.emitted(`copyItem`)![0]).toEqual([{ mainId: `main1111111111111` }]);
    wrapper.findByTestId(`MainMove`).trigger(`click`);
    expect(wrapper.emitted(`moveItem`)).toHaveLength(1);
    expect(wrapper.emitted(`moveItem`)![0]).toEqual([{ mainId: `main1111111111111` }]);
    wrapper.findByTestId(`MainTrash`).trigger(`click`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(1);
    expect(wrapper.emitted(`deleteItem`)![0]).toEqual([{ mainId: `main1111111111111` }]);
    await (main.state.status[`main1111111111111`] = ``);
  });
  it(`drag`, ({ wrapper }) => {
    wrapper.findByTestId(`MainItem`).trigger(`longtouch`, { detail: { changedTouches: [{ clientY: 0 }] } });
    expect(wrapper.emitted(`dragInit`)).toHaveLength(1);
    expect(wrapper.emitted(`dragInit`)![0]).toEqual([{ mainId: `main1111111111111`, clientY: 0 }]);
    wrapper.findByTestId(`MainRoot`).trigger(`touchmove.prevent`, { changedTouches: [{ clientY: 0 }] });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(1);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(1);
    expect(wrapper.emitted(`dragMove`)![0]).toEqual([{ clientY: 0 }]);
    wrapper.findByTestId(`MainRoot`).trigger(`touchend`);
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(1);
  });
});
