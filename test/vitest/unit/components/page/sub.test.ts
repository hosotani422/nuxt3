import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/sub";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    fixture.setI18n();
    fixture.setRouter();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`SubRight`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`SubMode`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`SubTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubTitle`).element.value).toBe(`main1`);
    expect(wrapper.findByTestId(`SubTitle`).attributes(`placeholder`)).toBe(`タスク`);
  });
  it(`contents`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`SubMemo`)).toHaveLength(0);
    expect(wrapper.findByTestIdAll(`SubItem`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`SubItem`)[0]!.classes()).toContain(`edit`);
    expect(wrapper.findByTestIdAll(`SubItem`)[1]!.classes()).not.toContain(`edit`);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubCheck`)[0]!.element.checked).toBe(false);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubCheck`)[1]!.element.checked).toBe(true);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[0]!.element.value).toBe(`sub1`);
    expect(wrapper.findByTestIdAll<HTMLInputElement>(`SubTask`)[1]!.element.value).toBe(`sub2`);
    expect(wrapper.findByTestIdAll(`SubTask`)[0]!.attributes(`placeholder`)).toBe(`サブタスク`);
    expect(wrapper.findByTestIdAll(`SubTask`)[1]!.attributes(`placeholder`)).toBe(`サブタスク`);
  });
  it(`option`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`SubDrag`)).toHaveLength(2);
    expect(wrapper.findByTestIdAll(`SubTrash`)).toHaveLength(1);
  });
  it(`footer`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`SubCalendar`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubCalendar`).element.value).toBe(`2000/01/01`);
    expect(wrapper.findByTestId(`SubCalendar`).attributes(`placeholder`)).toBe(`日付`);
    expect(wrapper.findByTestId(`SubCalendar`).classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`SubClock`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubClock`).element.value).toBe(`00:00`);
    expect(wrapper.findByTestId(`SubClock`).attributes(`placeholder`)).toBe(`時刻`);
    expect(wrapper.findByTestId(`SubClock`).classes()).toContain(`classLimit`);
    expect(wrapper.findByTestIdAll(`SubDialog`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubDialog`).element.value).toEqual(`5分前,1時間前`);
    expect(wrapper.findByTestId(`SubDialog`).attributes(`placeholder`)).toBe(`アラーム`);
    expect(wrapper.findByTestId(`SubDialog`).classes()).toContain(`classLimit`);
  });
  it(`memo`, async ({ wrapper }) => {
    await (main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task = false);
    expect(wrapper.findByTestIdAll(`SubMemo`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`SubItem`)).toHaveLength(0);
    expect(wrapper.findByTestId<HTMLInputElement>(`SubMemo`).element.value).toEqual(`sub1\nsub2`);
    expect(wrapper.findByTestId(`SubMemo`).attributes(`placeholder`)).toBe(`メモ`);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`SubRoot`).trigger(`touchstart`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    wrapper.findByTestId(`SubRoot`).trigger(`mousemove`, { clientX: 0, clientY: 0 });
    wrapper.findByTestId(`SubRoot`).trigger(`touchmove`, { changedTouches: [{ clientX: 0, clientY: 0 }] });
    expect(wrapper.emitted(`dragStart`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toHaveLength(2);
    expect(wrapper.emitted(`dragMove`)).toEqual([[{ clientY: 0 }], [{ clientY: 0 }]]);
    expect(wrapper.emitted(`swipeStart`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeStart`)).toEqual([[{ clientX: 0, clientY: 0 }], [{ clientX: 0, clientY: 0 }]]);
    expect(wrapper.emitted(`swipeMove`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeMove`)).toEqual([[{ clientX: 0 }], [{ clientX: 0 }]]);
    wrapper.findByTestId(`SubRoot`).trigger(`mouseup`, { clientX: 0 });
    wrapper.findByTestId(`SubRoot`).trigger(`touchend`, { changedTouches: [{ clientX: 0 }] });
    expect(wrapper.emitted(`dragEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toEqual([[{ clientX: 0 }], [{ clientX: 0 }]]);
    wrapper.findByTestId(`SubBack`).trigger(`mousedown`, { clientX: 0, clientY: 0 });
    wrapper.findByTestId(`SubBack`).trigger(`touchstart`, { changedTouches: [{ clientX: 0, clientY: 0 }] });
    expect(wrapper.emitted(`swipeInit`)).toHaveLength(2);
    expect((wrapper.emitted(`swipeInit`)![0]![0]! as { [K in string]: number }).clientX).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![0]![0]! as { [K in string]: number }).clientY).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![1]![0]! as { [K in string]: number }).clientX).toBe(0);
    expect((wrapper.emitted(`swipeInit`)![1]![0]! as { [K in string]: number }).clientY).toBe(0);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`SubRight`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    wrapper.findByTestId(`SubMode`).trigger(`click`);
    expect(wrapper.emitted(`switchItem`)).toHaveLength(1);
  });
  it(`contents`, async ({ wrapper }) => {
    wrapper.findByTestIdAll(`SubCheck`)[0]!.trigger(`change`);
    expect(wrapper.emitted(`checkItem`)).toHaveLength(1);
    expect(wrapper.emitted(`checkItem`)).toEqual([[{ subId: `sub1111111111111`, checked: false }]]);
    wrapper.findByTestId(`SubTask`).trigger(`click`);
    expect(wrapper.emitted(`switchEdit`)).toHaveLength(1);
    expect(wrapper.emitted(`switchEdit`)).toEqual([[{ subId: `sub1111111111111` }]]);
    wrapper.findByTestId(`SubTask`).trigger(`input`);
    expect(wrapper.emitted(`inputItem`)).toHaveLength(1);
    expect(wrapper.emitted(`inputItem`)).toEqual([[{ subId: `sub1111111111111` }]]);
    wrapper.findByTestId(`SubTask`).trigger(`keydown.enter`);
    expect(wrapper.emitted(`enterItem`)).toHaveLength(1);
    expect(wrapper.emitted(`enterItem`)).toEqual([[{ subId: `sub1111111111111`, selectionStart: 4 }]]);
    await (sub.state.data[`list1111111111111`]!.data[`main1111111111111`]!.data[`sub2222222222222`]!.title = ``);
    wrapper.findByTestIdAll(`SubTask`)[1]!.trigger(`keydown.backspace`);
    expect(wrapper.emitted(`backItem`)).toHaveLength(1);
    expect(wrapper.emitted(`backItem`)).toEqual([[{ subId: `sub2222222222222` }]]);
  });
  it(`option`, async ({ wrapper }) => {
    wrapper.findByTestIdAll(`SubDrag`)[0]!.trigger(`mousedown`, { clientY: 0 });
    wrapper.findByTestIdAll(`SubDrag`)[0]!.trigger(`touchstart`, { changedTouches: [{ clientY: 0 }] });
    expect(wrapper.emitted(`dragInit`)).toHaveLength(2);
    expect(wrapper.emitted(`dragInit`)).toEqual([
      [{ subId: `sub1111111111111`, clientY: 0 }],
      [{ subId: `sub1111111111111`, clientY: 0 }],
    ]);
    wrapper.findByTestIdAll(`SubTrash`)[0]!.trigger(`mousedown`);
    wrapper.findByTestIdAll(`SubTrash`)[0]!.trigger(`touchstart`);
    expect(wrapper.emitted(`deleteItem`)).toHaveLength(2);
    expect(wrapper.emitted(`deleteItem`)).toEqual([[{ subId: `sub1111111111111` }], [{ subId: `sub1111111111111` }]]);
  });
  it(`footer`, ({ wrapper }) => {
    wrapper.findByTestId(`SubCalendar`).trigger(`focus`);
    expect(wrapper.emitted(`openCalendar`)).toHaveLength(1);
    expect(wrapper.emitted(`openCalendar`)).toEqual([[{ date: `2000/01/01` }]]);
    wrapper.findByTestId(`SubClock`).trigger(`focus`);
    expect(wrapper.emitted(`openClock`)).toHaveLength(1);
    expect(wrapper.emitted(`openClock`)).toEqual([[{ time: `00:00` }]]);
    wrapper.findByTestId(`SubDialog`).trigger(`focus`);
    expect(wrapper.emitted(`openAlarm`)).toHaveLength(1);
  });
  it(`memo`, async ({ wrapper }) => {
    await (main.state.data[`list1111111111111`]!.data[`main1111111111111`]!.task = false);
    wrapper.findByTestId(`SubMemo`).trigger(`input`);
    expect(wrapper.emitted(`inputMemo`)).toHaveLength(1);
    expect(wrapper.emitted(`inputMemo`)).toEqual([[{ value: `sub1\nsub2` }]]);
  });
});
