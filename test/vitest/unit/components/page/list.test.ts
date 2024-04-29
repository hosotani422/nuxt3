import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/list";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    await fixture.init();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ListPlus`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`ListTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ListTitle`).text()).toBe(`Memosuku`);
    expect(wrapper.findByTestIdAll(`ListLeft`)).toHaveLength(1);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ListItem`)).toHaveLength(3);
    expect(wrapper.findByTestIdAll(`ListItem`)[0]!.classes()).toContain(`select`);
    expect(wrapper.findByTestIdAll(`ListItem`)[0]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll(`ListItem`)[0]!.classes()).not.toContain(`hide`);
    expect(wrapper.findByTestIdAll(`ListItem`)[0]!.classes()).not.toContain(`text-theme-care`);
    expect(wrapper.findByTestIdAll(`ListItem`)[0]!.classes()).toContain(`text-theme-warn`);
    expect(wrapper.findByTestIdAll(`ListItem`)[1]!.classes()).not.toContain(`select`);
    expect(wrapper.findByTestIdAll(`ListItem`)[1]!.classes()).toContain(`edit`);
    expect(wrapper.findByTestIdAll(`ListItem`)[1]!.classes()).toContain(`hide`);
    expect(wrapper.findByTestIdAll(`ListItem`)[1]!.classes()).toContain(`text-theme-care`);
    expect(wrapper.findByTestIdAll(`ListItem`)[1]!.classes()).not.toContain(`text-theme-warn`);
    expect(wrapper.findByTestIdAll(`ListItem`)[2]!.classes()).not.toContain(`select`);
    expect(wrapper.findByTestIdAll(`ListItem`)[2]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll(`ListItem`)[2]!.classes()).not.toContain(`hide`);
    expect(wrapper.findByTestIdAll(`ListItem`)[2]!.classes()).not.toContain(`text-theme-care`);
    expect(wrapper.findByTestIdAll(`ListItem`)[2]!.classes()).not.toContain(`text-theme-warn`);
    expect(wrapper.findByTestIdAll(`ListIcon`)).toHaveLength(3);
    expect(wrapper.findByTestIdAll(`ListTask`)).toHaveLength(3);
    expect(wrapper.findByTestIdAll(`ListTask`)[0]!.text()).toBe(`list1`);
    expect(wrapper.findByTestIdAll(`ListTask`)[1]!.text()).toBe(`Inbox`);
    expect(wrapper.findByTestIdAll(`ListTask`)[2]!.text()).toBe(`Trash`);
    expect(wrapper.findByTestIdAll(`ListCount`)).toHaveLength(3);
    expect(wrapper.findByTestIdAll(`ListCount`)[0]!.text()).toBe(`1/1`);
    expect(wrapper.findByTestIdAll(`ListCount`)[1]!.text()).toBe(`0/0`);
    expect(wrapper.findByTestIdAll(`ListCount`)[2]!.text()).toBe(`9/9`);
    expect(wrapper.findByTestIdAll(`ListClone`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`ListTrash`)).toHaveLength(1);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`ListRoot`).trigger(`touchmove`, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    wrapper.findByTestId(`ListRoot`).trigger(`mousemove`, { clientX: 2, clientY: 2 });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(2);
    expect(wrapper.emitted(`dragStart`)).toEqual([[], []]);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toEqual([[{ y: 1 }], [{ y: 2 }]]);
    expect(wrapper.emitted(`swipeStart`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeStart`)).toEqual([[{ x: 1, y: 1 }], [{ x: 2, y: 2 }]]);
    expect(wrapper.emitted(`swipeMove`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeMove`)).toEqual([[{ x: 1 }], [{ x: 2 }]]);
    wrapper.findByTestId(`ListRoot`).trigger(`touchend`, { changedTouches: [{ clientX: 1 }] });
    wrapper.findByTestId(`ListRoot`).trigger(`mouseup`, { clientX: 2 });
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`dragEnd`)).toEqual([[], []]);
    expect(wrapper.emitted(`swipeEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toEqual([[{ x: 1 }], [{ x: 2 }]]);
    wrapper.findByTestId(`ListBack`).trigger(`touchstart`, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    wrapper.findByTestId(`ListBack`).trigger(`mousedown`, { clientX: 2, clientY: 2 });
    expect(wrapper.emitted(`swipeInit`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeInit`)).toEqual([[{ x: 1, y: 1 }], [{ x: 2, y: 2 }]]);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`ListPlus`).trigger(`click`);
    expect(wrapper.emitted(`entryItem`)).toHaveLength(1);
    expect(wrapper.emitted(`entryItem`)).toEqual([[]]);
    wrapper.findByTestId(`ListLeft`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    expect(wrapper.emitted(`routerBack`)).toEqual([[]]);
  });
  it(`contents`, ({ wrapper }) => {
    wrapper.findByTestId(`ListRoot`).trigger(`click`);
    wrapper.findByTestIdAll(`ListItem`)[0]!.trigger(`longtouch`, { detail: { changedTouches: [{ clientY: 1 }] } });
    wrapper.findByTestIdAll(`ListItem`)[1]!.trigger(`longclick`, { detail: { clientY: 2 } });
    expect(wrapper.emitted(`editItem`)).toHaveLength(3);
    expect(wrapper.emitted(`editItem`)).toEqual([
      [],
      [{ listId: `list1111111111111` }],
      [{ listId: `list0000000000000` }],
    ]);
    expect(wrapper.emitted(`dragInit`)).toHaveLength(2);
    expect(wrapper.emitted(`dragInit`)).toEqual([
      [{ listId: `list1111111111111`, y: 1 }],
      [{ listId: `list0000000000000`, y: 2 }],
    ]);
    wrapper.findByTestIdAll(`ListItem`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    expect(wrapper.emitted(`routerBack`)).toEqual([[{ listId: `list1111111111111` }]]);
    wrapper.findByTestIdAll(`ListClone`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`copyItem`)).toHaveLength(1);
    expect(wrapper.emitted(`copyItem`)).toEqual([[{ listId: `list1111111111111` }]]);
    wrapper.findByTestIdAll(`ListTrash`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(1);
    expect(wrapper.emitted(`deleteItem`)).toEqual([[{ listId: `list0000000000000` }]]);
  });
});
