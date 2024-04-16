import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/list";

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
    expect(wrapper.findByTestIdAll(`ListPlus`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`ListLeft`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`ListTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ListTitle`).text()).toBe(`Memotea`);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ListItem`)).toHaveLength(3);
    expect(wrapper.findByTestIdAll(`ListItem`)[0]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll(`ListItem`)[1]!.classes()).toContain(`edit`);
    expect(wrapper.findByTestIdAll(`ListItem`)[2]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll(`ListTask`)[0]!.text()).toBe(`list1`);
    expect(wrapper.findByTestIdAll(`ListTask`)[1]!.text()).toBe(`Inbox`);
    expect(wrapper.findByTestIdAll(`ListTask`)[2]!.text()).toBe(`Trash`);
    expect(wrapper.findByTestIdAll(`ListTask`)[0]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListTask`)[1]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListTask`)[2]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListCount`)[0]!.text()).toBe(`textCount`);
    expect(wrapper.findByTestIdAll(`ListCount`)[1]!.text()).toBe(`textCount`);
    expect(wrapper.findByTestIdAll(`ListCount`)[2]!.text()).toBe(`textCount`);
    expect(wrapper.findByTestIdAll(`ListCount`)[0]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListCount`)[1]!.classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListCount`)[2]!.classes()).toContain(`classLimit`);
  });
  it(`option`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ListClone`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ListClone`).classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListTrash`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ListTrash`).classes()).toContain(`classLimit`);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`ListRoot`).trigger(`click`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    wrapper.findByTestId(`ListRoot`).trigger(`mousemove`, { clientX: 0, clientY: 0 });
    wrapper.findByTestId(`ListRoot`).trigger(`touchmove`, { changedTouches: [{ clientX: 0, clientY: 0 }] });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toEqual([[{ clientY: 0 }], [{ clientY: 0 }]]);
    expect(wrapper.emitted(`swipeStart`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeStart`)).toEqual([[{ clientX: 0, clientY: 0 }], [{ clientX: 0, clientY: 0 }]]);
    expect(wrapper.emitted(`swipeMove`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeMove`)).toEqual([[{ clientX: 0 }], [{ clientX: 0 }]]);
    wrapper.findByTestId(`ListRoot`).trigger(`mouseup`, { clientX: 0 });
    wrapper.findByTestId(`ListRoot`).trigger(`touchend`, { changedTouches: [{ clientX: 0 }] });
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toEqual([[{ clientX: 0 }], [{ clientX: 0 }]]);
    wrapper.findByTestId(`ListBack`).trigger(`mousedown`, { clientX: 0, clientY: 0 });
    wrapper.findByTestId(`ListBack`).trigger(`touchstart`, { changedTouches: [{ clientX: 0, clientY: 0 }] });
    expect(wrapper.emitted(`swipeInit`)).toHaveLength(2);
    expect((wrapper.emitted(`swipeInit`)![0]![0] as { [K in string]: number }).clientX).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![0]![0] as { [K in string]: number }).clientY).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![1]![0] as { [K in string]: number }).clientX).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![1]![0] as { [K in string]: number }).clientY).toBe(0);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`ListPlus`).trigger(`click`);
    expect(wrapper.emitted(`insertItem`)).toHaveLength(1);
    wrapper.findByTestId(`ListLeft`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
  });
  it(`contents`, ({ wrapper }) => {
    wrapper.findByTestIdAll(`ListItem`)[0]!.trigger(`longclick`, { detail: { clientY: 0 } });
    wrapper.findByTestIdAll(`ListItem`)[0]!.trigger(`longtouch`, { detail: { changedTouches: [{ clientY: 0 }] } });
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(2);
    expect(wrapper.emitted(`switchEdit`)).toEqual([
      [{ listId: `list1111111111111` }],
      [{ listId: `list1111111111111` }],
    ]);
    expect(wrapper.emitted(`dragInit`)).toHaveLength(2);
    expect(wrapper.emitted(`dragInit`)).toEqual([
      [{ listId: `list1111111111111`, clientY: 0 }],
      [{ listId: `list1111111111111`, clientY: 0 }],
    ]);
    wrapper.findByTestIdAll(`ListItem`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    expect(wrapper.emitted(`routerBack`)).toEqual([[{ listId: `list1111111111111` }]]);
  });
  it(`option`, ({ wrapper }) => {
    wrapper.findByTestId(`ListClone`).trigger(`click`);
    expect(wrapper.emitted(`copyItem`)).toHaveLength(1);
    expect(wrapper.emitted(`copyItem`)).toEqual([[{ listId: `list0000000000000` }]]);
    wrapper.findByTestId(`ListTrash`).trigger(`click`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(1);
    expect(wrapper.emitted(`deleteItem`)).toEqual([[{ listId: `list0000000000000` }]]);
  });
});
