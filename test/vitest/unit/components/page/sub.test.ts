import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/sub";
import main from "@/stores/page/main";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setRouter();
    await fixture.init();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`SubRight`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`SubTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubTitle`).element.value).toBe(`main1`);
    expect(wrapper.findByTestId(`SubTitle`).attributes(`placeholder`)).toBe(`タスク`);
    expect(wrapper.findByTestIdAll(`SubMode`)).toHaveLength(1);
  });
  it(`contents - memo`, async ({ wrapper }) => {
    await (main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task = false);
    expect(wrapper.findByTestIdAll(`SubItem`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`SubMemo`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubMemo`).element.value).toEqual(`sub1\nsub2`);
    expect(wrapper.findByTestId(`SubMemo`).attributes(`placeholder`)).toBe(`メモ`);
  });
  it(`contents - task`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`SubMemo`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`SubItem`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`SubItem`)[0]!.classes()).toContain(`edit`);
    expect(wrapper.findByTestIdAll(`SubItem`)[0]!.classes()).toContain(`hide`);
    expect(wrapper.findByTestIdAll(`SubItem`)[1]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll(`SubItem`)[1]!.classes()).not.toContain(`hide`);
    expect(wrapper.findByTestIdAll(`SubCheck`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubCheck`)[0]!.element.checked).toBe(false);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubCheck`)[1]!.element.checked).toBe(true);
    expect(wrapper.findByTestIdAll(`SubTask`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[0]!.element.value).toBe(`sub1`);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[1]!.element.value).toBe(`sub2`);
    expect(wrapper.findByTestIdAll(`SubTask`)[0]!.attributes(`placeholder`)).toBe(`サブタスク`);
    expect(wrapper.findByTestIdAll(`SubTask`)[1]!.attributes(`placeholder`)).toBe(`サブタスク`);
    expect(wrapper.findByTestIdAll(`SubDrag`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`SubTrash`)).toHaveLength(2);
  });
  it(`footer`, ({ wrapper }) => {
    expect(wrapper.findByTestId(`SubFoot`).classes()).toContain(`text-theme-care`);
    expect(wrapper.findByTestId(`SubFoot`).classes()).not.toContain(`text-theme-warn`);
    expect(wrapper.findByTestIdAll(`SubCalendar`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubCalendar`).element.value).toBe(`2000/01/01`);
    expect(wrapper.findByTestId(`SubCalendar`).attributes(`placeholder`)).toBe(`日付`);
    expect(wrapper.findByTestIdAll(`SubClock`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubClock`).element.value).toBe(`00:00`);
    expect(wrapper.findByTestId(`SubClock`).attributes(`placeholder`)).toBe(`時刻`);
    expect(wrapper.findByTestIdAll(`SubDialog`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubDialog`).element.value).toEqual(`5分前,1時間前`);
    expect(wrapper.findByTestId(`SubDialog`).attributes(`placeholder`)).toBe(`アラーム`);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`SubRoot`).trigger(`touchmove`, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    wrapper.findByTestId(`SubRoot`).trigger(`mousemove`, { clientX: 2, clientY: 2 });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(2);
    expect(wrapper.emitted(`dragStart`)).toEqual([[], []]);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toEqual([[{ y: 1 }], [{ y: 2 }]]);
    expect(wrapper.emitted(`swipeStart`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeStart`)).toEqual([[{ x: 1, y: 1 }], [{ x: 2, y: 2 }]]);
    expect(wrapper.emitted(`swipeMove`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeMove`)).toEqual([[{ x: 1 }], [{ x: 2 }]]);
    wrapper.findByTestId(`SubRoot`).trigger(`touchend`, { changedTouches: [{ clientX: 1 }] });
    wrapper.findByTestId(`SubRoot`).trigger(`mouseup`, { clientX: 2 });
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`dragEnd`)).toEqual([[], []]);
    expect(wrapper.emitted(`swipeEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toEqual([[{ x: 1 }], [{ x: 2 }]]);
    wrapper.findByTestId(`SubBack`).trigger(`touchstart`, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    wrapper.findByTestId(`SubBack`).trigger(`mousedown`, { clientX: 2, clientY: 2 });
    expect(wrapper.emitted(`swipeInit`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeInit`)).toEqual([[{ x: 1, y: 1 }], [{ x: 2, y: 2 }]]);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`SubRight`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    expect(wrapper.emitted(`routerBack`)).toEqual([[]]);
    wrapper.findByTestId(`SubMode`).trigger(`click`);
    expect(wrapper.emitted(`toggleMode`)).toHaveLength(1);
    expect(wrapper.emitted(`toggleMode`)).toEqual([[]]);
  });
  it(`contents - memo`, async ({ wrapper }) => {
    await (main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task = false);
    wrapper.findByTestId(`SubMemo`).trigger(`input`);
    expect(wrapper.emitted(`convertItem`)).toHaveLength(1);
    expect(wrapper.emitted(`convertItem`)).toEqual([[{ text: `sub1\nsub2` }]]);
  });
  it(`contents - task`, async ({ wrapper }) => {
    wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[0]!.element.selectionStart = 3;
    wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[0]!.element.selectionEnd = 3;
    wrapper.findByTestIdAll(`SubTask`)[0]!.trigger(`keydown.enter.prevent`);
    expect(wrapper.emitted(`divideItem`)).toHaveLength(1);
    expect(wrapper.emitted(`divideItem`)).toEqual([[{ subId: `sub1111111111111`, caret: 3 }]]);
    wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[1]!.element.selectionStart = 0;
    wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[1]!.element.selectionEnd = 0;
    wrapper.findByTestIdAll(`SubTask`)[1]!.trigger(`keydown.backspace`);
    expect(wrapper.emitted(`connectItem`)).toHaveLength(1);
    expect(wrapper.emitted(`connectItem`)).toEqual([[{ subId: `sub2222222222222` }]]);
    wrapper.findByTestIdAll(`SubDrag`)[0]!.trigger(`touchstart`, { changedTouches: [{ clientY: 1 }] });
    wrapper.findByTestIdAll(`SubDrag`)[0]!.trigger(`mousedown`, { clientY: 2 });
    expect(wrapper.emitted(`dragInit`)).toHaveLength(2);
    expect(wrapper.emitted(`dragInit`)).toEqual([
      [{ subId: `sub1111111111111`, y: 1 }],
      [{ subId: `sub1111111111111`, y: 2 }],
    ]);
    wrapper.findByTestIdAll(`SubTrash`)[0]!.trigger(`click`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(1);
    expect(wrapper.emitted(`deleteItem`)).toEqual([[{ subId: `sub1111111111111` }]]);
  });
  it(`footer`, ({ wrapper }) => {
    wrapper.findByTestId(`SubCalendar`).trigger(`click`);
    expect(wrapper.emitted(`openCalendar`)).toHaveLength(1);
    expect(wrapper.emitted(`openCalendar`)).toEqual([[]]);
    wrapper.findByTestId(`SubClock`).trigger(`click`);
    expect(wrapper.emitted(`openClock`)).toHaveLength(1);
    expect(wrapper.emitted(`openClock`)).toEqual([[]]);
    wrapper.findByTestId(`SubDialog`).trigger(`click`);
    expect(wrapper.emitted(`openAlarm`)).toHaveLength(1);
    expect(wrapper.emitted(`openAlarm`)).toEqual([[]]);
  });
});
