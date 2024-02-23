import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/list";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setRouter();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ListPlus`).length).toBe(1);
    expect(wrapper.findByTestIdAll(`ListLeft`).length).toBe(1);
    expect(wrapper.findByTestIdAll(`ListTitle`).length).toBe(1);
    expect(wrapper.findByTestId(`ListTitle`).text()).toBe(`Memotea`);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ListItem`).length).toBe(3);
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
    expect(wrapper.findByTestIdAll(`ListClone`).length).toBe(1);
    expect(wrapper.findByTestId(`ListClone`).classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`ListTrash`).length).toBe(1);
    expect(wrapper.findByTestId(`ListTrash`).classes()).toContain(`classLimit`);
  });
});

describe(`event`, () => {
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`ListRoot`).trigger(`click`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    wrapper.findByTestId(`ListRoot`).trigger(`touchstart`);
    expect(wrapper.emitted(`swipeInit`)).toHaveLength(1);
    expect((wrapper.emitted(`swipeInit`)![0]![0]! as { [K in string]: number }).clientX).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![0]![0]! as { [K in string]: number }).clientY).toBe(0);
    wrapper.findByTestId(`ListRoot`).trigger(`touchmove`);
    expect(wrapper.emitted(`dragStart`)).toHaveLength(1);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(1);
    expect(wrapper.emitted(`dragMove`)![0]).toEqual([{ clientY: 0 }]);
    expect(wrapper.emitted(`swipeStart`)).toHaveLength(1);
    expect(wrapper.emitted(`swipeStart`)![0]).toEqual([{ clientX: 0, clientY: 0 }]);
    expect(wrapper.emitted(`swipeMove`)).toHaveLength(1);
    expect(wrapper.emitted(`swipeMove`)![0]).toEqual([{ clientX: 0 }]);
    wrapper.findByTestId(`ListRoot`).trigger(`touchend`);
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(1);
    expect(wrapper.emitted(`swipeEnd`)).toHaveLength(1);
    expect(wrapper.emitted(`swipeEnd`)![0]).toEqual([{ clientX: 0 }]);
    wrapper.findByTestId(`ListPlus`).trigger(`click`);
    expect(wrapper.emitted(`insertItem`)).toHaveLength(1);
    wrapper.findByTestId(`ListLeft`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
  });
  it(`contents`, ({ wrapper }) => {
    wrapper.findByTestId(`ListItem`).trigger(`longtouch`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    expect(wrapper.emitted(`switchEdit`)![0]).toEqual([{ listId: `list1111111111111` }]);
    expect(wrapper.emitted(`dragInit`)).toHaveLength(1);
    expect(wrapper.emitted(`dragInit`)![0]).toEqual([{ listId: `list1111111111111`, clientY: 0 }]);
    wrapper.findByTestId(`ListItem`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    expect(wrapper.emitted(`routerBack`)![0]).toEqual([{ listId: `list1111111111111` }]);
    wrapper.findByTestId(`ListClone`).trigger(`click`);
    expect(wrapper.emitted(`copyItem`)).toHaveLength(1);
    expect(wrapper.emitted(`copyItem`)![0]).toEqual([{ listId: `list0000000000000` }]);
    wrapper.findByTestId(`ListTrash`).trigger(`click`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(1);
    expect(wrapper.emitted(`deleteItem`)![0]).toEqual([{ listId: `list0000000000000` }]);
  });
});
